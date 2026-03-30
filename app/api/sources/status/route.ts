/**
 * Endpoint de statut des sources de données.
 * Permet à l'UI d'afficher l'état de connexion de chaque source.
 */
import { NextResponse } from "next/server";
import { isPisteConfigured, getDataMode, getPisteToken, getPisteBaseApi } from "@/lib/piste-auth";

async function testLegifrance(): Promise<{ ok: boolean; status?: number; error?: string; sample?: unknown }> {
  try {
    const token = await getPisteToken();
    const base = `${getPisteBaseApi()}/dila/legifrance/lf-engine-app`;
    const res = await fetch(`${base}/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "KeyId": process.env.PISTE_CLIENT_ID ?? "",
      },
      body: JSON.stringify({
        fond: "JURI",
        recherche: { pageNumber: 1, pageSize: 2, sort: "PERTINENCE", typePagination: "DEFAUT" },
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, status: res.status, error: text.slice(0, 300) };
    }
    const data = await res.json();
    return { ok: true, status: res.status, sample: { total: data.totalResultNumber, results_count: data.results?.length } };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET() {
  const mode = getDataMode();
  const pisteConfigured = isPisteConfigured();
  const legifranceEnabled = process.env.LEGIFRANCE_ENABLED === "true";

  let pisteAuth: "ok" | "error" | "unconfigured" = "unconfigured";
  let legifranceTest: Awaited<ReturnType<typeof testLegifrance>> | null = null;

  if (pisteConfigured) {
    try {
      await getPisteToken();
      pisteAuth = "ok";
    } catch {
      pisteAuth = "error";
    }

    if (legifranceEnabled && pisteAuth === "ok") {
      legifranceTest = await testLegifrance();
    }
  }

  return NextResponse.json({
    mode,
    legifrance_enabled: legifranceEnabled,
    piste_env: process.env.PISTE_ENV ?? "sandbox",
    sources: {
      judilibre: {
        name: "Judilibre (Cour de cassation)",
        configured: pisteConfigured,
        auth_status: pisteAuth,
        available: pisteAuth === "ok" || mode === "hybrid",
      },
      legifrance: {
        name: "Légifrance (DILA)",
        configured: pisteConfigured && legifranceEnabled,
        auth_status: pisteAuth,
        available: legifranceEnabled && (pisteAuth === "ok" || mode === "hybrid"),
        test: legifranceTest,
      },
      mock: {
        name: "Données de démonstration",
        configured: true,
        available: mode === "mock" || mode === "hybrid",
      },
    },
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
