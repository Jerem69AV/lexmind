import { NextRequest, NextResponse } from "next/server";
import { MOCK_DECISIONS, MOCK_RAG_TEMPLATES } from "@/lib/mock-data";
import type { RAGResponse, UsedDocument, Citation } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, mode = "strict" } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: "La question est requise" }, { status: 400 });
    }

    // Simulate RAG processing time
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));

    // Find best template match
    const questionLower = question.toLowerCase();
    let template = MOCK_RAG_TEMPLATES.find(t =>
      questionLower.includes(t.keyword) || t.keyword.split(" ").some(k => questionLower.includes(k))
    );

    if (!template) {
      template = MOCK_RAG_TEMPLATES[Math.floor(Math.random() * MOCK_RAG_TEMPLATES.length)];
    }

    // Pick relevant documents
    const relevantDocs = MOCK_DECISIONS
      .filter(doc => {
        const docText = [doc.title, doc.sommaire, ...doc.themes].join(" ").toLowerCase();
        const terms = questionLower.split(/\s+/).filter((w: string) => w.length > 4);
        return terms.some((t: string) => docText.includes(t));
      })
      .slice(0, 5);

    const docsToUse = relevantDocs.length >= 2 ? relevantDocs : MOCK_DECISIONS.slice(0, 5);

    const usedDocuments: UsedDocument[] = docsToUse.slice(0, 4).map((doc, index) => ({
      index: index + 1,
      id: doc.id,
      ecli: doc.ecli,
      title: doc.title,
      juridiction: doc.juridiction,
      chambre: doc.chambre,
      date: doc.date,
      solution: doc.solution,
      excerpt: doc.sommaire.substring(0, 200) + "...",
      relevance_score: Math.round((0.95 - index * 0.07) * 100) / 100,
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

    const sections = template.sections.map((s, i) => ({
      title: s.title,
      content: s.content,
      citations: s.citations.map(c => Math.min(c + 1, usedDocuments.length)),
    }));

    const synthese = mode === "strict"
      ? `Sur la base des décisions de jurisprudence identifiées, voici une synthèse structurée relative à votre question : « ${question} ». Cette réponse s'appuie sur ${usedDocuments.length} décisions jurisprudentielles pertinentes issues de la base Judilibre. Elle ne constitue pas un avis juridique et ne saurait remplacer le conseil d'un professionnel du droit.`
      : `La question relative à « ${question} » soulève plusieurs problématiques juridiques que la jurisprudence a progressivement précisées. En mode exploratoire, cette analyse s'appuie sur ${usedDocuments.length} décisions et intègre également des considérations doctrinales. Notez que certaines positions exposées ici font encore l'objet de débats.`;

    const response: RAGResponse = {
      question,
      mode,
      synthese,
      sections,
      used_documents: usedDocuments,
      citations,
      confidence: mode === "strict" ? 0.87 : 0.72,
      disclaimer: "Cette réponse est générée automatiquement à partir de données jurisprudentielles et ne constitue pas un avis juridique. Consultez un avocat pour toute situation particulière. Conformité RGPD assurée — aucune donnée personnelle n'est traitée.",
      response_time_ms: Math.floor(Math.random() * 800) + 600,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("RAG error:", error);
    return NextResponse.json({ error: "Erreur lors du traitement de la question" }, { status: 500 });
  }
}
