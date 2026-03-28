import { NextRequest, NextResponse } from "next/server";
import { getDecision, getRelatedDecisions } from "@/lib/search";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const document = await getDecision(decodeURIComponent(id));

    if (!document) {
      return NextResponse.json(
        { error: "Décision introuvable", id },
        { status: 404 }
      );
    }

    const similar = await getRelatedDecisions(document, 4);

    return NextResponse.json(
      { ...document, similar_decisions: similar },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Data-Source": document.source,
        },
      }
    );
  } catch (error) {
    console.error(`[API /documents/${id}] Erreur:`, error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la décision." },
      { status: 500 }
    );
  }
}
