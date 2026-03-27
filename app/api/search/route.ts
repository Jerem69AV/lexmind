import { NextRequest, NextResponse } from "next/server";
import { unifiedSearch } from "@/lib/search";
import { isValidApiKey } from "@/lib/api-keys";
import type { SearchFilters } from "@/types";

export async function GET(request: NextRequest) {
  // Valider la clé API si fournie (requêtes widget)
  const apiKey = request.headers.get("X-API-Key");
  if (apiKey !== null && !isValidApiKey(apiKey)) {
    return NextResponse.json({ error: "Clé API invalide" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const perPage = Math.min(20, Math.max(1, parseInt(searchParams.get("per_page") ?? "10", 10)));
  const sourcesRaw = searchParams.get("sources") ?? "all";
  const sources = sourcesRaw.split(",") as ("judilibre" | "legifrance" | "mock" | "all")[];

  const filters: SearchFilters = {
    juridiction: (searchParams.get("juridiction") || undefined) as SearchFilters["juridiction"],
    chambre: searchParams.get("chambre") || undefined,
    date_from: searchParams.get("date_from") || undefined,
    date_to: searchParams.get("date_to") || undefined,
    solution: (searchParams.get("solution") || undefined) as SearchFilters["solution"],
    publication: (searchParams.get("publication") || undefined) as SearchFilters["publication"],
  };

  // Nettoyer les filtres vides
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  ) as SearchFilters;

  try {
    const result = await unifiedSearch(query, cleanFilters, page, perPage, sources);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, max-age=60",
        "X-Data-Source": result.sources_used.join(","),
        "X-Fallback": result.fallback ? "true" : "false",
      },
    });
  } catch (error) {
    console.error("[API /search] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recherche. Vérifiez vos clés PISTE dans .env.local." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query = "",
      filters = {},
      page = 1,
      per_page = 10,
      sources = ["all"],
    } = body;

    const result = await unifiedSearch(query, filters, page, Math.min(per_page, 20), sources);

    return NextResponse.json(result, {
      headers: {
        "X-Data-Source": result.sources_used.join(","),
        "X-Fallback": result.fallback ? "true" : "false",
      },
    });
  } catch (error) {
    console.error("[API /search POST] Erreur:", error);
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
