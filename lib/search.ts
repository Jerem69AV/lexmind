/**
 * Moteur de recherche unifié — agrège Judilibre + Légifrance + mock.
 *
 * Stratégie selon DATA_MODE :
 *  - "live"   → APIs réelles uniquement, erreur en cas d'échec
 *  - "mock"   → données de démonstration uniquement
 *  - "hybrid" → APIs réelles avec fallback automatique sur mock (défaut)
 */

import { getDataMode } from "./piste-auth";
import { searchJudilibre, getJudilibreDecision, getSimilarDecisions } from "./judilibre";
import { searchLegifrance, getLegifranceDecision, searchLegislation } from "./legifrance";
import { searchDecisions, MOCK_DECISIONS } from "./mock-data";
import type { LegalDocument, LegalDocumentSummary, SearchFilters, SearchSource } from "@/types";


export interface UnifiedSearchResult {
  documents: LegalDocumentSummary[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  query_time_ms: number;
  sources_used: SearchSource[];
  fallback?: boolean; // true si on a utilisé le fallback mock
}

// ─── Recherche unifiée ─────────────────────────────────────────────────────────

export async function unifiedSearch(
  query: string,
  filters: SearchFilters = {},
  page = 1,
  perPage = 10,
  sources: SearchSource[] = ["all"]
): Promise<UnifiedSearchResult> {
  const mode = getDataMode();
  const start = Date.now();

  const useAll = sources.includes("all");
  const useJudilibre = useAll || sources.includes("judilibre");
  const useLegifrance = useAll || sources.includes("legifrance");

  // ── Mode mock ──────────────────────────────────────────────────────────────
  if (mode === "mock") {
    const result = searchDecisions(query, filters as Record<string, string>, page, perPage);
    return {
      ...result,
      documents: result.documents,
      sources_used: ["mock"],
    };
  }

  // ── Mode live ou hybrid ────────────────────────────────────────────────────
  const promises: Promise<{ documents: LegalDocumentSummary[]; total: number; source: string }>[] = [];

  if (useJudilibre) {
    promises.push(
      searchJudilibre(query, filters, page, perPage)
        .then(r => ({ documents: r.documents, total: r.total, source: "judilibre" }))
        .catch(err => {
          console.error("[Judilibre] Erreur recherche:", err.message);
          return { documents: [], total: 0, source: "judilibre_error" };
        })
    );
  }

  if (useLegifrance) {
    promises.push(
      searchLegifrance(query, filters, page, perPage)
        .then(r => ({ documents: r.documents, total: r.total, source: "legifrance" }))
        .catch(err => {
          console.error("[Légifrance] Erreur recherche:", err.message);
          return { documents: [], total: 0, source: "legifrance_error" };
        })
    );
  }

  const results = await Promise.all(promises);

  const sourcesUsed: SearchSource[] = results
    .filter(r => r.documents.length > 0)
    .map(r => r.source as SearchSource);

  // Fusionner et dédupliquer par ECLI
  const seen = new Set<string>();
  const merged: LegalDocumentSummary[] = [];
  for (const result of results) {
    for (const doc of result.documents) {
      const key = doc.ecli || doc.id;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(doc);
      }
    }
  }

  // Trier par score décroissant
  merged.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const total = results.reduce((sum, r) => sum + r.total, 0);
  const paginated = merged.slice(0, perPage);

  // Fallback mock si aucun résultat réel
  if (paginated.length === 0 && mode === "hybrid") {
    console.warn("[Search] Aucun résultat API — fallback mock");
    const mockResult = searchDecisions(query, filters as Record<string, string>, page, perPage);
    return {
      ...mockResult,
      documents: mockResult.documents,
      sources_used: ["mock"],
      fallback: true,
    };
  }

  return {
    documents: paginated,
    total: total || paginated.length,
    page,
    per_page: perPage,
    total_pages: Math.max(1, Math.ceil((total || paginated.length) / perPage)),
    query_time_ms: Date.now() - start,
    sources_used: sourcesUsed.length ? sourcesUsed : ["mock"],
    fallback: sourcesUsed.length === 0,
  };
}

// ─── Récupération d'une décision ───────────────────────────────────────────────

export async function getDecision(id: string): Promise<LegalDocument | null> {
  const mode = getDataMode();

  // Détecter la source depuis le préfixe de l'ID
  const isLegifrance = id.startsWith("LEGIFRANCE:");
  const isMock = id.startsWith("MOCK:") || (!id.includes(":") && mode === "mock");

  // Mode mock ou ID mock
  if (mode === "mock" || isMock) {
    return MOCK_DECISIONS.find(d => d.id === id) ?? MOCK_DECISIONS[0];
  }

  if (isLegifrance) {
    try {
      return await getLegifranceDecision(id);
    } catch (err) {
      console.error("[Légifrance] Erreur fetch décision:", err);
      if (mode === "hybrid") return MOCK_DECISIONS[0];
      return null;
    }
  }

  // Par défaut : Judilibre
  try {
    return await getJudilibreDecision(id);
  } catch (err) {
    console.error("[Judilibre] Erreur fetch décision:", err);
    if (mode === "hybrid") {
      const mock = MOCK_DECISIONS.find(d => d.id === id);
      return mock ?? MOCK_DECISIONS[0];
    }
    return null;
  }
}

// ─── Décisions similaires ──────────────────────────────────────────────────────

export async function getRelatedDecisions(
  doc: LegalDocument,
  limit = 4
): Promise<LegalDocumentSummary[]> {
  const mode = getDataMode();

  if (mode === "mock") {
    return MOCK_DECISIONS
      .filter(d => d.id !== doc.id && d.themes.some(t => doc.themes.includes(t)))
      .slice(0, limit)
      .map(d => ({ ...d, snippet: d.sommaire.slice(0, 200) }));
  }

  try {
    if (!doc.id.startsWith("LEGIFRANCE:")) {
      return await getSimilarDecisions(doc.themes, doc.id, limit);
    }
    // Pour Légifrance : recherche par thèmes
    const result = await searchLegifrance(doc.themes.join(" "), {}, 1, limit + 1);
    return result.documents.filter(d => d.id !== doc.id).slice(0, limit);
  } catch (err) {
    console.error("[Related] Erreur:", err);
    if (mode === "hybrid") {
      return MOCK_DECISIONS
        .filter(d => d.id !== doc.id)
        .slice(0, limit)
        .map(d => ({ ...d, snippet: d.sommaire.slice(0, 200) }));
    }
    return [];
  }
}

// ─── Recherche législation ─────────────────────────────────────────────────────

export async function searchLaw(
  query: string,
  page = 1,
  perPage = 10
) {
  const mode = getDataMode();
  if (mode === "mock") {
    return { documents: [], total: 0, page, per_page: perPage, total_pages: 0, query_time_ms: 0, sources_used: ["mock" as SearchSource] };
  }
  try {
    const result = await searchLegislation(query, "LEGI", page, perPage);
    return { ...result, sources_used: ["legifrance" as SearchSource] };
  } catch (err) {
    console.error("[Législation] Erreur:", err);
    return { documents: [], total: 0, page, per_page: perPage, total_pages: 0, query_time_ms: 0, sources_used: ["mock" as SearchSource], fallback: true };
  }
}
