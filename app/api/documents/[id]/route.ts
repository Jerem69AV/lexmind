import { NextRequest, NextResponse } from "next/server";
import { MOCK_DECISIONS } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await new Promise(r => setTimeout(r, 50 + Math.random() * 100));

  const document = MOCK_DECISIONS.find(d => d.id === id);

  if (!document) {
    // Return a 404-style response but with mock data for unknown IDs
    const fallback = MOCK_DECISIONS[0];
    return NextResponse.json({
      ...fallback,
      id,
      ecli: `ECLI:FR:CCASS:2024:XX${id.toUpperCase().substring(0, 5)}`,
      title: `Décision n° ${id} — Document de référence`,
    });
  }

  // Include similar decisions
  const similar = MOCK_DECISIONS
    .filter(d => d.id !== id && d.themes.some(t => document.themes.includes(t)))
    .slice(0, 3)
    .map(d => ({
      id: d.id,
      ecli: d.ecli,
      title: d.title,
      juridiction: d.juridiction,
      chambre: d.chambre,
      date: d.date,
      solution: d.solution,
      sommaire: d.sommaire.substring(0, 180) + "...",
    }));

  return NextResponse.json({
    ...document,
    similar_decisions: similar,
  });
}
