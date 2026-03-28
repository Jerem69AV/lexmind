import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { unifiedSearch } from "@/lib/search";
import type { RAGResponse, UsedDocument, Citation } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, mode = "strict" } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: "La question est requise" }, { status: 400 });
    }

    const start = Date.now();

    // ── 1. Recherche Judilibre ─────────────────────────────────────────────────
    const searchResult = await unifiedSearch(question, {}, 1, 8, ["judilibre"]);
    const docs = searchResult.documents.slice(0, 5);

    // ── 2. Construire le contexte pour Claude ──────────────────────────────────
    const docsContext = docs.length > 0
      ? docs.map((doc, i) => {
          return `[${i + 1}] ${doc.title}
Juridiction : ${doc.juridiction} | Chambre : ${doc.chambre ?? "N/A"} | Date : ${doc.date} | Solution : ${doc.solution ?? "N/A"}
ECLI : ${doc.ecli ?? "N/A"}
Résumé : ${doc.sommaire.substring(0, 600)}`;
        }).join("\n\n")
      : "Aucune décision trouvée dans la base Judilibre pour cette question.";

    const systemPrompt = mode === "strict"
      ? `Tu es un assistant juridique expert en droit français. Tu analyses la jurisprudence de la Cour de cassation et des juridictions françaises.
Réponds UNIQUEMENT en te basant sur les décisions fournies. Si les décisions ne couvrent pas la question, dis-le clairement.
Ne jamais inventer de références jurisprudentielles. Chaque affirmation doit être sourcée avec [N] correspondant au numéro de la décision.
Ta réponse est purement informative et ne constitue pas un conseil juridique.`
      : `Tu es un assistant juridique expert en droit français. Tu analyses la jurisprudence et peux enrichir avec des principes généraux du droit.
Appuie-toi principalement sur les décisions fournies, mais tu peux mentionner des tendances doctrinales générales.
Chaque référence à une décision fournie doit être sourcée avec [N]. Ne jamais inventer d'ECLI ou de numéro d'arrêt.
Ta réponse est purement informative et ne constitue pas un conseil juridique.`;

    const userPrompt = `Question juridique : "${question}"

Décisions jurisprudentielles disponibles :
${docsContext}

Réponds en JSON strictement valide avec cette structure exacte :
{
  "synthese": "Paragraphe d'introduction synthétisant la réponse (2-3 phrases, utilise [N] pour citer)",
  "sections": [
    {
      "title": "Titre de la section",
      "content": "Développement avec citations [N]",
      "citations": [1, 2]
    }
  ],
  "confidence": 0.85
}

Génère 2 à 4 sections thématiques. La confidence doit refléter honnêtement la pertinence des décisions trouvées (entre 0.3 et 0.95).`;

    // ── 3. Appel Claude ────────────────────────────────────────────────────────
    const claudeResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const rawText = claudeResponse.content[0].type === "text"
      ? claudeResponse.content[0].text
      : "";

    // Extraire le JSON de la réponse
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Réponse Claude invalide");

    const parsed = JSON.parse(jsonMatch[0]);

    // ── 4. Construire la réponse structurée ────────────────────────────────────
    const usedDocuments: UsedDocument[] = docs.map((doc, index) => ({
      index: index + 1,
      id: doc.id,
      ecli: doc.ecli ?? "",
      title: doc.title,
      juridiction: doc.juridiction,
      chambre: doc.chambre ?? "",
      date: doc.date,
      solution: doc.solution ?? "",
      excerpt: doc.sommaire.substring(0, 250) + (doc.sommaire.length > 250 ? "..." : ""),
      relevance_score: Math.round(((doc.score ?? 0.7) - index * 0.05) * 100) / 100,
    }));

    const citations: Citation[] = usedDocuments.map(doc => ({
      index: doc.index,
      document_id: doc.id,
      ecli: doc.ecli,
      title: doc.title,
      juridiction: doc.juridiction,
      date: doc.date,
      excerpt: doc.excerpt,
      relevance: doc.relevance_score,
    }));

    const sections = (parsed.sections ?? []).map((s: { title: string; content: string; citations?: number[] }) => ({
      title: s.title,
      content: s.content,
      citations: (s.citations ?? []).filter((c: number) => c >= 1 && c <= usedDocuments.length),
    }));

    const response: RAGResponse = {
      question,
      mode,
      synthese: parsed.synthese ?? "",
      sections,
      used_documents: usedDocuments,
      citations,
      confidence: Math.min(0.95, Math.max(0.3, parsed.confidence ?? 0.7)),
      disclaimer: "Cette réponse est générée automatiquement à partir de décisions jurisprudentielles officielles (Judilibre) et ne constitue pas un avis juridique. Consultez un avocat pour toute situation particulière.",
      response_time_ms: Date.now() - start,
    };

    return NextResponse.json(response);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("RAG error:", msg);
    return NextResponse.json(
      { error: `Erreur: ${msg}` },
      { status: 500 }
    );
  }
}
