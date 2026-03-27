/**
 * Client API Judilibre — Cour de cassation
 *
 * Judilibre est l'API officielle de la Cour de cassation publiée sous Licence Ouverte 2.0.
 * Accès via PISTE après inscription sur https://piste.gouv.fr
 * Documentation OpenAPI : https://api.piste.gouv.fr/cassation/judilibre/v1.0/openapi
 *
 * Les données sont pseudonymisées conformément à l'article L. 111-13 COJ
 * et au décret n° 2020-797 du 29 juin 2020.
 */

import { getPisteToken, invalidatePisteToken } from "./piste-auth";
import type { LegalDocument, LegalDocumentSummary, SearchFilters } from "@/types";

const JUDILIBRE_BASE = "https://api.piste.gouv.fr/cassation/judilibre/v1.0";

// ─── Types internes Judilibre ────────────────────────────────────────────────

export interface JudilibreSearchParams {
  query?: string;
  /** Identifiant de juridiction, ex: "cc" (Cour de cassation) */
  jurisdiction?: string;
  /** Code chambre, ex: "comm", "soc", "civ1", "civ2", "civ3", "crim", "pl", "mi" */
  chamber?: string;
  date_start?: string; // YYYY-MM-DD
  date_end?: string;   // YYYY-MM-DD
  /** "A", "B", "P", "I", "R", "L", "C" */
  publication?: string[];
  solution?: string;
  page_size?: number;
  page_index?: number;
  /** "score" | "decision_date" */
  order?: string;
  resolve_references?: boolean;
}

interface JudilibreRawDecision {
  id: string;
  jurisdiction: string;
  chamber: string;
  number: string;
  numbers?: string[];
  ecli?: string;
  formation?: string;
  publication?: string[];
  decision_date: string;
  solution?: string;
  solution_alt?: string;
  summary?: string;
  text?: string;
  themes?: string[];
  visa?: string[];
  rapprochements?: Array<{ title: string; id?: string }>;
  zones?: {
    introduction?: Array<{ start: number; end: number }>;
    moyens?: Array<{ start: number; end: number }>;
    motivations?: Array<{ start: number; end: number }>;
    dispositif?: Array<{ start: number; end: number }>;
  };
  files?: Array<{ type: string; url: string; name?: string }>;
  bulletin?: string;
  update_date?: string;
  score?: number;
}

interface JudilibreSearchResponse {
  total: number;
  results: JudilibreRawDecision[];
  page_size: number;
  page_index: number;
  next_page?: boolean;
  took?: number;
}

// ─── Mapping codes ────────────────────────────────────────────────────────────

const CHAMBER_LABELS: Record<string, string> = {
  comm: "Chambre commerciale",
  soc: "Chambre sociale",
  civ1: "Chambre civile 1",
  civ2: "Chambre civile 2",
  civ3: "Chambre civile 3",
  crim: "Chambre criminelle",
  pl: "Assemblée plénière",
  mi: "Chambre mixte",
  cc: "Cour de cassation",
};

const PUBLICATION_LABELS: Record<string, string> = {
  B: "Bulletin",
  P: "Bulletin et Rapport annuel",
  R: "Rapport annuel",
  I: "Inédit",
  L: "Diffusé",
  C: "Communiqué",
  A: "À paraître",
};

const SOLUTION_LABELS: Record<string, string> = {
  cassation: "Cassation",
  rejet: "Rejet",
  "cassation partielle": "Cassation partielle",
  "non-lieu": "Non-lieu à renvoi",
  annulation: "Annulation",
  irrecevabilite: "Irrecevabilité",
  desistement: "Désistement",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapChamberFilter(chambre: string | undefined): string | undefined {
  if (!chambre) return undefined;
  // Accepte "Chambre commerciale" → "comm", "comm" → "comm", etc.
  const entry = Object.entries(CHAMBER_LABELS).find(
    ([code, label]) => label.toLowerCase() === chambre.toLowerCase() || code === chambre.toLowerCase()
  );
  return entry ? entry[0] : chambre.toLowerCase();
}

function mapPublicationFilter(pub: string | undefined): string[] | undefined {
  if (!pub) return undefined;
  // Accepte "Bulletin" → ["B"], "B" → ["B"]
  const entry = Object.entries(PUBLICATION_LABELS).find(
    ([code, label]) => label.toLowerCase() === pub.toLowerCase() || code === pub
  );
  return entry ? [entry[0]] : [pub];
}

/** Extrait un snippet pertinent depuis le texte brut */
function extractSnippet(text: string, query: string, maxLen = 250): string {
  if (!text) return "";
  const terms = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const lower = text.toLowerCase();
  let bestPos = 0;
  for (const term of terms) {
    const pos = lower.indexOf(term);
    if (pos !== -1) { bestPos = pos; break; }
  }
  const start = Math.max(0, bestPos - 80);
  const end = Math.min(text.length, start + maxLen);
  let snippet = text.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) snippet = "… " + snippet;
  if (end < text.length) snippet += " …";
  return snippet;
}

/** Convertit une décision brute Judilibre en LegalDocument unifié */
function rawToLegalDocument(raw: JudilibreRawDecision): LegalDocument {
  const chamberLabel = CHAMBER_LABELS[raw.chamber?.toLowerCase()] ?? raw.chamber ?? "";
  const pubLabels = (raw.publication ?? []).map(p => PUBLICATION_LABELS[p] ?? p);
  const solutionLabel = SOLUTION_LABELS[raw.solution?.toLowerCase() ?? ""] ?? raw.solution ?? "";

  return {
    id: raw.id,
    ecli: raw.ecli ?? `ECLI:FR:CCASS:${raw.decision_date?.slice(0, 4)}:${raw.id}`,
    title: `Cour de cassation — ${chamberLabel}`,
    juridiction: "Cour de cassation",
    chambre: chamberLabel as LegalDocument["chambre"],
    numero: (raw.numbers ?? [raw.number]).join("; "),
    date: raw.decision_date,
    solution: (solutionLabel || "Rejet") as LegalDocument["solution"],
    publication: (pubLabels[0] || "Inédit") as LegalDocument["publication"],
    sommaire: raw.summary ?? "",
    texte: raw.text ?? "",
    visa: raw.visa ?? [],
    renvois: (raw.rapprochements ?? []).map(r => ({
      type: "citation" as const,
      texte: r.title,
      id: r.id,
    })),
    themes: raw.themes ?? [],
    source: "judilibre",
    score: raw.score,
  };
}

function rawToSummary(raw: JudilibreRawDecision, query = ""): LegalDocumentSummary {
  const doc = rawToLegalDocument(raw);
  return {
    ...doc,
    snippet: extractSnippet(raw.text ?? raw.summary ?? "", query),
  };
}

// ─── Requête authentifiée ─────────────────────────────────────────────────────

async function judilibreRequest<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | string[] | undefined>
): Promise<T> {
  const token = await getPisteToken();

  // Construire les query params (les arrays deviennent ?param=v1&param=v2)
  const url = new URL(`${JUDILIBRE_BASE}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      value.forEach(v => url.searchParams.append(key, String(v)));
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "KeyId": process.env.PISTE_CLIENT_ID ?? "",
    },
    next: { revalidate: 300 }, // cache 5 min côté Next.js
  });

  // 401 → invalider le token et réessayer une fois
  if (response.status === 401) {
    invalidatePisteToken();
    const token2 = await getPisteToken();
    const response2 = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token2}`,
        Accept: "application/json",
        "KeyId": process.env.PISTE_CLIENT_ID ?? "",
      },
    });
    if (!response2.ok) {
      const text = await response2.text();
      throw new Error(`Judilibre API error (${response2.status}): ${text}`);
    }
    return response2.json() as Promise<T>;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Judilibre API error (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────────

export interface JudilibreSearchResult {
  documents: LegalDocumentSummary[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  query_time_ms: number;
  source: "judilibre";
}

/**
 * Recherche de décisions dans Judilibre.
 */
export async function searchJudilibre(
  query: string,
  filters: SearchFilters = {},
  page = 1,
  perPage = 10
): Promise<JudilibreSearchResult> {
  const start = Date.now();

  const params: Record<string, string | number | boolean | string[] | undefined> = {
    query: query || undefined,
    jurisdiction: "cc", // Cour de cassation
    chamber: mapChamberFilter(filters.chambre),
    date_start: filters.date_from || undefined,
    date_end: filters.date_to || undefined,
    publication: mapPublicationFilter(
      typeof filters.publication === "string" ? filters.publication : undefined
    ),
    solution: filters.solution
      ? Object.entries(SOLUTION_LABELS).find(
          ([, label]) => label === filters.solution
        )?.[0] ?? filters.solution
      : undefined,
    page_size: perPage,
    page_index: page - 1, // Judilibre est 0-based
    order: "score",
    resolve_references: true,
  };

  const data = await judilibreRequest<JudilibreSearchResponse>("/search", params);

  return {
    documents: data.results.map(r => rawToSummary(r, query)),
    total: data.total,
    page,
    per_page: perPage,
    total_pages: Math.ceil(data.total / perPage),
    query_time_ms: Date.now() - start,
    source: "judilibre",
  };
}

/**
 * Récupère une décision complète par son identifiant Judilibre.
 */
export async function getJudilibreDecision(id: string): Promise<LegalDocument> {
  const data = await judilibreRequest<JudilibreRawDecision>("/decision", {
    id,
    resolve_references: true,
  });
  return rawToLegalDocument(data);
}

/**
 * Récupère les décisions similaires (par thèmes) — endpoint /search filtré.
 */
export async function getSimilarDecisions(
  themes: string[],
  excludeId: string,
  limit = 4
): Promise<LegalDocumentSummary[]> {
  if (!themes.length) return [];
  try {
    const data = await judilibreRequest<JudilibreSearchResponse>("/search", {
      query: themes.slice(0, 3).join(" "),
      jurisdiction: "cc",
      page_size: limit + 1,
      page_index: 0,
      order: "score",
    });
    return data.results
      .filter(r => r.id !== excludeId)
      .slice(0, limit)
      .map(r => rawToSummary(r, themes.join(" ")));
  } catch {
    return [];
  }
}

/**
 * Recherche par numéro de pourvoi ou ECLI exact.
 */
export async function searchByIdentifier(
  identifier: string
): Promise<LegalDocumentSummary[]> {
  // Judilibre supporte la recherche par numero dans le champ query
  const data = await judilibreRequest<JudilibreSearchResponse>("/search", {
    query: identifier,
    jurisdiction: "cc",
    page_size: 5,
    page_index: 0,
  });
  return data.results.map(r => rawToSummary(r, identifier));
}

/**
 * Suggestions auto-complétion (utilise /search avec peu de résultats).
 */
export async function getSearchSuggestions(prefix: string): Promise<string[]> {
  if (prefix.length < 3) return [];
  try {
    const data = await judilibreRequest<JudilibreSearchResponse>("/search", {
      query: prefix,
      jurisdiction: "cc",
      page_size: 5,
      page_index: 0,
    });
    return data.results
      .map(r => r.summary?.slice(0, 100) ?? r.number)
      .filter(Boolean)
      .slice(0, 5);
  } catch {
    return [];
  }
}
