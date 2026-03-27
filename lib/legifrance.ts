/**
 * Client API Légifrance — DILA (Direction de l'information légale et administrative)
 *
 * L'API Légifrance est accessible via PISTE après inscription sur https://piste.gouv.fr
 * Elle expose codes, lois, règlements, jurisprudence (dont jurisprudence administrative).
 * Documentation : https://api.piste.gouv.fr/dila/legifrance/lf-engine-app/
 *
 * L'API est de type REST/GraphQL-like avec des endpoints POST.
 * Licence Ouverte 2.0 — attribution obligatoire (source + date MAJ).
 */

import { getPisteToken, invalidatePisteToken, PISTE_BASE_API } from "./piste-auth";
import type { LegalDocument, LegalDocumentSummary, SearchFilters } from "@/types";

// URL construite dynamiquement selon PISTE_ENV (sandbox ou production)
const LEGIFRANCE_BASE = `${PISTE_BASE_API}/dila/legifrance/lf-engine-app`;

// ─── Types internes Légifrance ────────────────────────────────────────────────

interface LegifranceSearchParams {
  recherche: {
    champs?: Array<{
      typeChamp: string; // "ALL" | "TITLE" | "NUM" | "ABSTRACT" | "TEXT"
      criteres: Array<{
        typeRecherche: string; // "EXACTE" | "UN_DES_MOTS" | "TOUS_LES_MOTS"
        valeur: string;
        operateur?: string; // "ET" | "OU" | "SAUF"
      }>;
      operateur?: string;
    }>;
    pageNumber: number;     // 1-based
    pageSize: number;
    sort?: string;          // "PERTINENCE" | "DATE_PUBLI" | "DATE_MAJ"
    typePagination?: string;
    filtres?: Array<{
      facette: string;      // "DATE_SIGNATURE" | "NATURE" | "JURIDICTION" | etc.
      valeur?: string;
      valeurs?: string[];
      debut?: string;       // YYYY-MM-DD
      fin?: string;
    }>;
  };
  fond: string; // "JURI" (jurisprudence) | "LEGI" | "CNIL" | "KALI" | etc.
}

interface LegifranceTextItem {
  id: string;
  title?: string;
  titreOfficiel?: string;
  nature?: string;
  dateTexte?: string;
  dateSignature?: string;
  datePublication?: string;
  juridiction?: string;
  formation?: string;
  solution?: string;
  numero?: string;
  numDecision?: string;
  ecli?: string;
  abstract?: string;
  texteHtml?: string;
  texte?: string;
  urlTechId?: string;
  score?: number;
}

interface LegifranceSearchResponse {
  totalResultNumber: number;
  results: Array<{
    titles: LegifranceTextItem[];
  }>;
  executionTime?: number;
  facets?: Array<{
    name: string;
    buckets: Array<{ key: string; doc_count: number }>;
  }>;
}

interface LegifranceFetchResponse {
  text?: {
    id: string;
    title?: string;
    titreOfficiel?: string;
    nature?: string;
    dateTexte?: string;
    dateSignature?: string;
    datePublication?: string;
    juridiction?: string;
    formation?: string;
    solution?: string;
    numero?: string;
    ecli?: string;
    abstract?: string;
    texteHtml?: string;
    visas?: Array<{ id: string; title: string }>;
    liens?: Array<{ id: string; title: string; nature?: string }>;
    themes?: string[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

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

const JURIDICTION_MAP: Record<string, LegalDocument["juridiction"]> = {
  "Cour de cassation": "Cour de cassation",
  "Conseil d'État": "Conseil d'État",
  "Conseil constitutionnel": "Conseil constitutionnel",
  "Cour d'appel": "Cour d'appel",
  "Tribunal judiciaire": "Tribunal judiciaire",
  "Cour administrative d'appel": "Cour administrative d'appel",
  "Conseil de prud'hommes": "Conseil de prud'hommes",
};

function mapJuridiction(raw: string | undefined): LegalDocument["juridiction"] {
  if (!raw) return "Cour de cassation";
  return JURIDICTION_MAP[raw] ?? "Cour de cassation";
}

function mapSolution(raw: string | undefined): LegalDocument["solution"] {
  if (!raw) return "Rejet";
  const normalized = raw.toLowerCase();
  if (normalized.includes("cassation partielle")) return "Cassation partielle";
  if (normalized.includes("cassation")) return "Cassation";
  if (normalized.includes("rejet")) return "Rejet";
  if (normalized.includes("annulation")) return "Annulation";
  if (normalized.includes("irrecevab")) return "Irrecevabilité";
  return raw as LegalDocument["solution"];
}

function rawItemToLegalDocument(item: LegifranceTextItem): LegalDocument {
  const rawText = item.texteHtml ? stripHtml(item.texteHtml) : (item.texte ?? "");
  return {
    id: `LEGIFRANCE:${item.id}`,
    ecli: item.ecli ?? "",
    title: item.titreOfficiel ?? item.title ?? "Décision",
    juridiction: mapJuridiction(item.juridiction),
    chambre: (item.formation ?? item.nature ?? "") as LegalDocument["chambre"],
    numero: item.numDecision ?? item.numero ?? item.id,
    date: item.dateSignature ?? item.dateTexte ?? item.datePublication ?? "",
    solution: mapSolution(item.solution),
    publication: "Inédit",
    sommaire: item.abstract ?? "",
    texte: rawText,
    visa: [],
    renvois: [],
    themes: [],
    source: "legifrance",
    score: item.score,
  };
}

function rawItemToSummary(item: LegifranceTextItem, query = ""): LegalDocumentSummary {
  const doc = rawItemToLegalDocument(item);
  const rawText = item.texteHtml ? stripHtml(item.texteHtml) : (item.texte ?? "");
  return {
    ...doc,
    snippet: extractSnippet(rawText || doc.sommaire, query),
  };
}

// ─── Requête authentifiée ─────────────────────────────────────────────────────

async function legifranceRequest<T>(
  endpoint: string,
  body: unknown,
  retried = false
): Promise<T> {
  const token = await getPisteToken();

  const response = await fetch(`${LEGIFRANCE_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "KeyId": process.env.PISTE_CLIENT_ID ?? "",
    },
    body: JSON.stringify(body),
    next: { revalidate: 300 },
  });

  if (response.status === 401 && !retried) {
    invalidatePisteToken();
    return legifranceRequest<T>(endpoint, body, true);
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Légifrance API error (${response.status}): ${text}`);
  }

  return response.json() as Promise<T>;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────────

export interface LegifranceSearchResult {
  documents: LegalDocumentSummary[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  query_time_ms: number;
  source: "legifrance";
}

/**
 * Recherche de jurisprudence dans Légifrance (fond JURI).
 * Couvre jurisprudence judiciaire + administrative + constitutionnelle.
 */
export async function searchLegifrance(
  query: string,
  filters: SearchFilters = {},
  page = 1,
  perPage = 10
): Promise<LegifranceSearchResult> {
  const start = Date.now();

  const filtres: LegifranceSearchParams["recherche"]["filtres"] = [];

  if (filters.date_from || filters.date_to) {
    filtres.push({
      facette: "DATE_SIGNATURE",
      debut: filters.date_from || "1800-01-01",
      fin: filters.date_to || new Date().toISOString().slice(0, 10),
    });
  }

  if (filters.juridiction) {
    filtres.push({
      facette: "JURIDICTION",
      valeur: filters.juridiction,
    });
  }

  const body: LegifranceSearchParams = {
    fond: "JURI",
    recherche: {
      champs: query
        ? [
            {
              typeChamp: "ALL",
              criteres: [
                {
                  typeRecherche: "TOUS_LES_MOTS",
                  valeur: query,
                },
              ],
              operateur: "ET",
            },
          ]
        : undefined,
      pageNumber: page,
      pageSize: perPage,
      sort: "PERTINENCE",
      typePagination: "DEFAUT",
      filtres: filtres.length ? filtres : undefined,
    },
  };

  const data = await legifranceRequest<LegifranceSearchResponse>("/search", body);

  // Légifrance retourne des results[].titles[]
  const items: LegifranceTextItem[] = [];
  for (const result of data.results ?? []) {
    for (const title of result.titles ?? []) {
      items.push(title);
    }
  }

  return {
    documents: items.map(item => rawItemToSummary(item, query)),
    total: data.totalResultNumber ?? 0,
    page,
    per_page: perPage,
    total_pages: Math.ceil((data.totalResultNumber ?? 0) / perPage),
    query_time_ms: Date.now() - start,
    source: "legifrance",
  };
}

/**
 * Récupère le texte complet d'une décision Légifrance par son ID technique.
 * L'ID est au format "LEGIFRANCE:XXXXXXX" — on extrait la partie après le ":".
 */
export async function getLegifranceDecision(fullId: string): Promise<LegalDocument> {
  const id = fullId.startsWith("LEGIFRANCE:") ? fullId.slice(11) : fullId;

  const data = await legifranceRequest<LegifranceFetchResponse>("/consult/juri", { id });

  if (!data.text) {
    throw new Error(`Décision Légifrance introuvable : ${id}`);
  }

  const t = data.text;
  const rawText = t.texteHtml ? stripHtml(t.texteHtml) : "";

  return {
    id: `LEGIFRANCE:${t.id}`,
    ecli: t.ecli ?? "",
    title: t.titreOfficiel ?? t.title ?? "Décision",
    juridiction: mapJuridiction(t.juridiction),
    chambre: (t.formation ?? t.nature ?? "") as LegalDocument["chambre"],
    numero: t.numero ?? t.id,
    date: t.dateSignature ?? t.dateTexte ?? t.datePublication ?? "",
    solution: mapSolution(t.solution),
    publication: "Inédit",
    sommaire: t.abstract ?? "",
    texte: rawText,
    visa: (t.visas ?? []).map(v => v.title),
    renvois: (t.liens ?? []).map(l => ({
      type: "citation" as const,
      texte: l.title,
      id: `LEGIFRANCE:${l.id}`,
    })),
    themes: t.themes ?? [],
    source: "legifrance",
  };
}

/**
 * Recherche d'articles de codes ou de textes législatifs.
 * Fond : "LEGI" (codes), "JORF" (Journal officiel), etc.
 */
export async function searchLegislation(
  query: string,
  fond: "LEGI" | "JORF" | "KALI" = "LEGI",
  page = 1,
  perPage = 10
): Promise<LegifranceSearchResult> {
  const start = Date.now();

  const body: LegifranceSearchParams = {
    fond,
    recherche: {
      champs: [
        {
          typeChamp: "ALL",
          criteres: [{ typeRecherche: "TOUS_LES_MOTS", valeur: query }],
          operateur: "ET",
        },
      ],
      pageNumber: page,
      pageSize: perPage,
      sort: "PERTINENCE",
      typePagination: "DEFAUT",
    },
  };

  const data = await legifranceRequest<LegifranceSearchResponse>("/search", body);

  const items: LegifranceTextItem[] = [];
  for (const result of data.results ?? []) {
    for (const title of result.titles ?? []) {
      items.push(title);
    }
  }

  return {
    documents: items.map(item => rawItemToSummary(item, query)),
    total: data.totalResultNumber ?? 0,
    page,
    per_page: perPage,
    total_pages: Math.ceil((data.totalResultNumber ?? 0) / perPage),
    query_time_ms: Date.now() - start,
    source: "legifrance",
  };
}
