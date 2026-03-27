import { NextRequest, NextResponse } from "next/server";
import { getDataMode } from "@/lib/piste-auth";
import { getSearchSuggestions } from "@/lib/judilibre";

// Suggestions statiques pour le mode mock
const MOCK_SUGGESTIONS = [
  "responsabilité bancaire devoir de mise en garde",
  "licenciement sans cause réelle et sérieuse",
  "vice du consentement dol erreur violence",
  "responsabilité du fait des produits défectueux",
  "clause abusive contrat consommateur",
  "force majeure inexécution contrat",
  "prescription action en responsabilité",
  "dommage et intérêts préjudice moral",
  "bail commercial renouvellement",
  "abus de position dominante concurrence",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const mode = getDataMode();

  if (mode === "mock") {
    const filtered = MOCK_SUGGESTIONS
      .filter(s => s.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5);
    return NextResponse.json({ suggestions: filtered });
  }

  try {
    const suggestions = await getSearchSuggestions(q);
    return NextResponse.json({ suggestions }, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    const filtered = MOCK_SUGGESTIONS
      .filter(s => s.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5);
    return NextResponse.json({ suggestions: filtered });
  }
}
