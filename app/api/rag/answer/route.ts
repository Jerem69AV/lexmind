import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { unifiedSearch } from "@/lib/search";
import type { RAGResponse, UsedDocument, Citation, WebSource } from "@/types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  return (data.results ?? []).filter((r: TavilyResult) => r.score > 0.4);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, mode = "strict" } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: "La question est requise" }, { status: 400 });
    }

    const start = Date.now();

    // ── 1. Recherches parallèles : Judilibre + Web ─────────────────────────────
    const [searchResult, webResults] = await Promise.all([
      unifiedSearch(question, {}, 1, 8, ["judilibre"]),
      searchWeb(question),
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

    // ── 3. Contexte Web ────────────────────────────────────────────────────────
    const webContext = webResults.length > 0
      ? webResults.map((r, i) =>
          `[W${i + 1}] ${r.title}
Source : ${r.url} | Fiabilité : ${Math.round(r.score * 100)}%
Extrait : ${r.content.substring(0, 400)}`
        ).join("\n\n")
      : "Aucune source web trouvée.";

    // ── 4. Prompts Claude ──────────────────────────────────────────────────────
    const systemPrompt = `Tu es un assistant juridique expert en droit français. Tu rédiges des notes juridiques fiables en croisant deux types de sources :
1. La jurisprudence officielle (Judilibre) — cite avec [J1], [J2], etc.
2. Des sources web officielles françaises — cite avec [W1], [W2], etc.

Règles absolues :
- Cite systématiquement tes sources avec [J1]...[J5] ou [W1]...[W6] après chaque affirmation
- Évalue la cohérence entre sources ; signale les contradictions
- Ne jamais inventer de référence
- ${mode === "strict" ? "Reste strictement factuel, pas d'extrapolation." : "Tu peux enrichir avec des principes généraux du droit."}
- La réponse est purement informative, elle ne constitue pas un conseil juridique.`;

    const userPrompt = `Question juridique : "${question}"

=== JURISPRUDENCES (Judilibre) ===
${docsContext}

=== SOURCES WEB OFFICIELLES ===
${webContext}

Réponds en JSON strictement valide :
{
  "synthese": "Introduction (2-3 phrases, citer [J1]/[W1] etc.)",
  "sections": [
    {
      "title": "Titre de la section",
      "content": "Développement avec citations [J1], [W2], etc.",
      "citations": ["J1", "W2"]
    }
  ],
  "coherence_note": "Si les sources se contredisent, l'indiquer ici. Sinon laisser vide.",
  "confidence": 0.85
}

Génère 2 à 4 sections thématiques. La confidence reflète la qualité des sources (0.3 à 0.95).`;

    // ── 5. Appel Claude ────────────────────────────────────────────────────────
    const claudeResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const rawText = claudeResponse.content[0].type === "text"
      ? claudeResponse.content[0].text : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Réponse Claude invalide");
    const parsed = JSON.parse(jsonMatch[0]);

    // ── 6. Documents Judilibre ─────────────────────────────────────────────────
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

    // ── 7. Sources web ─────────────────────────────────────────────────────────
    const webSources: WebSource[] = webResults.map((r, i) => ({
      index: i + 1,
      url: r.url,
      title: r.title,
      hostname: (() => { try { return new URL(r.url).hostname; } catch { return r.url; } })(),
      score: r.score,
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

    const sections = (parsed.sections ?? []).map((s: { title: string; content: string; citations?: (string | number)[] }) => ({
      title: s.title,
      content: s.content,
      citations: [],
    }));

    const coherenceNote = parsed.coherence_note
      ? `⚠️ ${parsed.coherence_note}` : "";

    const response: RAGResponse = {
      question,
      mode,
      synthese: parsed.synthese ?? "",
      sections,
      used_documents: usedDocuments,
      web_sources: webSources,
      citations,
      confidence: Math.min(0.95, Math.max(0.3, parsed.confidence ?? 0.7)),
      disclaimer: coherenceNote,
      response_time_ms: Date.now() - start,
    };

    return NextResponse.json(response);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("RAG error:", msg);
    return NextResponse.json({ error: `Erreur: ${msg}` }, { status: 500 });
  }
}
