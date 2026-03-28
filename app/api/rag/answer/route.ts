import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { unifiedSearch } from "@/lib/search";
import type { RAGResponse, UsedDocument, Citation } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Sources juridiques françaises de confiance
const LEGAL_DOMAINS = [
  "legifrance.gouv.fr",
  "service-public.fr",
  "courdecassation.fr",
  "conseil-etat.fr",
  "conseil-constitutionnel.fr",
  "bofip.impots.gouv.fr",
  "senat.fr",
  "assemblee-nationale.fr",
  "europa.eu",
  "cnil.fr",
];

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

async function searchWeb(query: string): Promise<TavilyResult[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query: `${query} droit français`,
      search_depth: "advanced",
      max_results: 6,
      include_domains: LEGAL_DOMAINS,
      include_answer: false,
    }),
  });
  if (!res.ok) throw new Error(`Tavily error: ${res.status}`);
  const data = await res.json();
  // Filtrer les résultats avec un score de pertinence > 0.4
  return (data.results ?? []).filter((r: TavilyResult) => r.score > 0.4);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, mode = "strict", web_search = false } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: "La question est requise" }, { status: 400 });
    }

    const start = Date.now();

    // ── 1. Recherches parallèles : Judilibre + Web (si activé) ────────────────
    const [searchResult, webResults] = await Promise.all([
      unifiedSearch(question, {}, 1, 8, ["judilibre"]),
      web_search ? searchWeb(question) : Promise.resolve([]),
    ]);

    const docs = searchResult.documents.slice(0, 5);

    // ── 2. Contexte Judilibre ──────────────────────────────────────────────────
    const docsContext = docs.length > 0
      ? docs.map((doc, i) =>
          `[J${i + 1}] ${doc.title}
Juridiction : ${doc.juridiction} | Chambre : ${doc.chambre ?? "N/A"} | Date : ${doc.date} | Solution : ${doc.solution ?? "N/A"}
ECLI : ${doc.ecli ?? "N/A"}
Résumé : ${doc.sommaire.substring(0, 500)}`
        ).join("\n\n")
      : "Aucune décision trouvée dans Judilibre pour cette question.";

    // ── 3. Contexte Web (si activé) ────────────────────────────────────────────
    const webContext = webResults.length > 0
      ? webResults.map((r, i) =>
          `[W${i + 1}] ${r.title}
Source : ${r.url} | Score fiabilité : ${Math.round(r.score * 100)}%${r.published_date ? ` | Date : ${r.published_date}` : ""}
Extrait : ${r.content.substring(0, 400)}`
        ).join("\n\n")
      : "";

    // ── 4. Prompt Claude ───────────────────────────────────────────────────────
    const systemPrompt = web_search
      ? `Tu es un assistant juridique expert en droit français. Tu rédiges des notes juridiques fiables en croisant deux types de sources :
1. La jurisprudence officielle (Judilibre — Cour de cassation, Conseil d'État)
2. Des sources web officielles françaises (Légifrance, service-public.fr, etc.)

Règles absolues :
- Cite [J1], [J2]... pour les décisions jurisprudentielles
- Cite [W1], [W2]... pour les sources web
- Évalue la cohérence entre les sources : signale les contradictions éventuelles
- Ne jamais inventer de référence : si une source ne confirme pas une affirmation, dis-le
- Signale si une source web est moins fiable qu'une autre
- La réponse est purement informative et ne constitue pas un conseil juridique.`
      : mode === "strict"
      ? `Tu es un assistant juridique expert en droit français. Tu analyses la jurisprudence de la Cour de cassation et des juridictions françaises.
Réponds UNIQUEMENT en te basant sur les décisions fournies. Si les décisions ne couvrent pas la question, dis-le clairement.
Ne jamais inventer de références. Chaque affirmation doit être sourcée avec [J1], [J2]... correspondant aux décisions.
Ta réponse est purement informative et ne constitue pas un conseil juridique.`
      : `Tu es un assistant juridique expert en droit français. Appuie-toi sur les décisions fournies et enrichis avec des principes généraux du droit.
Cite les décisions avec [J1], [J2]... Ne jamais inventer d'ECLI ou de numéro d'arrêt.
Ta réponse est purement informative et ne constitue pas un conseil juridique.`;

    const webSection = web_search && webContext
      ? `\n\nSources web officielles disponibles :\n${webContext}`
      : "";

    const citationFormat = web_search
      ? `Utilise [J1]...[J5] pour les jurisprudences et [W1]...[W6] pour les sources web.`
      : `Utilise [J1]...[J5] pour citer les décisions.`;

    const userPrompt = `Question juridique : "${question}"

Décisions jurisprudentielles (Judilibre) :
${docsContext}${webSection}

${citationFormat}

Réponds en JSON strictement valide :
{
  "synthese": "Introduction synthétique (2-3 phrases avec citations)",
  "sections": [
    {
      "title": "Titre de la section",
      "content": "Développement avec citations",
      "citations": ["J1", "W2"]
    }
  ],
  "coherence_note": "${web_search ? "Note sur la cohérence entre les sources (optionnel si tout est cohérent)" : ""}",
  "confidence": 0.85
}

Génère 2 à 4 sections. La confidence reflète la qualité et cohérence des sources (0.3 à 0.95).`;

    // ── 5. Appel Claude ────────────────────────────────────────────────────────
    const claudeResponse = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2500,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const rawText = claudeResponse.content[0].type === "text"
      ? claudeResponse.content[0].text : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Réponse Claude invalide");
    const parsed = JSON.parse(jsonMatch[0]);

    // ── 6. Documents utilisés ──────────────────────────────────────────────────
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

    // Convertir les citations mixtes [J1]/[W1] en numéros pour la compatibilité
    const sections = (parsed.sections ?? []).map((s: { title: string; content: string; citations?: (string | number)[] }) => ({
      title: s.title,
      content: s.content,
      citations: (s.citations ?? [])
        .filter((c: string | number) => typeof c === "string" && c.startsWith("J"))
        .map((c: string | number) => parseInt(String(c).replace("J", "")))
        .filter((n: number) => n >= 1 && n <= usedDocuments.length),
    }));

    // Sources web dans le disclaimer si activé
    const webSourcesList = webResults.length > 0
      ? `\n\nSources web consultées (${webResults.length}) : ${webResults.map(r => new URL(r.url).hostname).join(", ")}.`
      : "";

    const coherenceNote = parsed.coherence_note
      ? `\n\n⚠️ Note de cohérence : ${parsed.coherence_note}` : "";

    const response: RAGResponse = {
      question,
      mode,
      synthese: parsed.synthese ?? "",
      sections,
      used_documents: usedDocuments,
      citations,
      confidence: Math.min(0.95, Math.max(0.3, parsed.confidence ?? 0.7)),
      disclaimer: `Sources : Judilibre (Cour de cassation)${web_search ? ` + sources web officielles (${webResults.map(r => new URL(r.url).hostname).filter((v, i, a) => a.indexOf(v) === i).join(", ")})` : ""}.${coherenceNote}`,
      response_time_ms: Date.now() - start,
    };

    return NextResponse.json(response);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("RAG error:", msg);
    return NextResponse.json({ error: `Erreur: ${msg}` }, { status: 500 });
  }
}
