import { NextRequest, NextResponse } from "next/server";
import { searchDecisions } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const perPage = parseInt(searchParams.get("per_page") ?? "10", 10);

  const filters = {
    juridiction: searchParams.get("juridiction") ?? undefined,
    chambre: searchParams.get("chambre") ?? undefined,
    date_from: searchParams.get("date_from") ?? undefined,
    date_to: searchParams.get("date_to") ?? undefined,
    solution: searchParams.get("solution") ?? undefined,
    publication: searchParams.get("publication") ?? undefined,
  };

  // Remove undefined keys
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  );

  // Simulate API latency
  await new Promise(r => setTimeout(r, 80 + Math.random() * 120));

  const result = searchDecisions(query, cleanFilters, page, Math.min(perPage, 20));

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "private, max-age=60",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query = "", filters = {}, page = 1, per_page = 10 } = body;

    await new Promise(r => setTimeout(r, 80 + Math.random() * 120));

    const result = searchDecisions(query, filters, page, Math.min(per_page, 20));

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
