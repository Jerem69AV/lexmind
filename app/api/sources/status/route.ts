/**
 * Endpoint de statut des sources de données.
 * Permet à l'UI d'afficher l'état de connexion de chaque source.
 */
import { NextResponse } from "next/server";
import { isPisteConfigured, getDataMode, getPisteToken } from "@/lib/piste-auth";

export async function GET() {
  const mode = getDataMode();
  const pisteConfigured = isPisteConfigured();

  let pisteAuth: "ok" | "error" | "unconfigured" = "unconfigured";

  if (pisteConfigured) {
    try {
      await getPisteToken();
      pisteAuth = "ok";
    } catch {
      pisteAuth = "error";
    }
  }

  return NextResponse.json({
    mode,
    sources: {
      judilibre: {
        name: "Judilibre (Cour de cassation)",
        configured: pisteConfigured,
        auth_status: pisteAuth,
        licence: "Licence Ouverte 2.0",
        base_url: "https://api.piste.gouv.fr/cassation/judilibre/v1.0",
        available: pisteAuth === "ok" || mode === "hybrid",
      },
      legifrance: {
        name: "Légifrance (DILA)",
        configured: pisteConfigured,
        auth_status: pisteAuth,
        licence: "Licence Ouverte 2.0",
        base_url: "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
        available: pisteAuth === "ok" || mode === "hybrid",
      },
      mock: {
        name: "Données de démonstration",
        configured: true,
        auth_status: "ok",
        licence: "Interne",
        base_url: null,
        available: mode === "mock" || mode === "hybrid",
      },
    },
    setup_instructions: pisteConfigured
      ? null
      : "Copiez .env.local.example vers .env.local et renseignez PISTE_CLIENT_ID et PISTE_CLIENT_SECRET depuis https://piste.gouv.fr",
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
