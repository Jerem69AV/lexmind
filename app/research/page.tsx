"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Loader2, SortAsc } from "lucide-react";
import { SearchFiltersPanel } from "@/components/search-filters";
import { DecisionCard } from "@/components/decision-card";
import { cn } from "@/lib/utils";
import type { SearchFilters, LegalDocumentSummary } from "@/types";

const SORT_OPTIONS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "date_desc", label: "Date (récent)" },
  { value: "date_asc", label: "Date (ancien)" },
];

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState("pertinence");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [phraseExacte, setPhraseExacte] = useState(true); // phrase exacte par défaut
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LegalDocumentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [queryTime, setQueryTime] = useState<number | null>(null);
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [hasSearched, setHasSearched] = useState(false);
  const searchParams = useSearchParams();
  const didInit = useRef(false);

  const doSearch = useCallback(async (q: string, f: SearchFilters, p: number) => {
    setLoading(true);
    setHasSearched(true);
    try {
      // Phrase exacte : entourer de guillemets si plusieurs mots et mode activé
      const queryToSend = phraseExacte && q.trim().includes(" ")
        ? `"${q.trim()}"`
        : q;
      const params = new URLSearchParams({ query: queryToSend, page: String(p), per_page: "10" });
      if (f.juridiction) params.set("juridiction", f.juridiction);
      if (f.chambre) params.set("chambre", f.chambre);
      if (f.date_from) params.set("date_from", f.date_from);
      if (f.date_to) params.set("date_to", f.date_to);
      if (f.solution) params.set("solution", f.solution);
      if (f.publication) params.set("publication", f.publication);

      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();

      setResults(data.documents ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.total_pages ?? 0);
      setQueryTime(data.query_time_ms ?? null);
      setSourcesUsed(data.sources_used ?? []);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [phraseExacte]);

  // Au chargement : lancer la recherche seulement si un ?query= est dans l'URL
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const urlQuery = searchParams.get("query") ?? "";
    if (urlQuery.trim()) {
      setInputValue(urlQuery);
      setQuery(urlQuery);
      doSearch(urlQuery, {}, 1);
    }
  }, [searchParams, doSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(inputValue);
    doSearch(inputValue, filters, 1);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
    doSearch(query, newFilters, 1);
  };

  const handleReset = () => {
    setFilters({});
    setPage(1);
    doSearch(query, {}, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doSearch(query, filters, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--foreground)" }}>Recherche jurisprudentielle</h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Interrogez la base de données de décisions françaises</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Rechercher une décision, un thème, un visa légal... (ex: responsabilité bancaire, mise en garde)"
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => { setInputValue(""); setQuery(""); doSearch("", filters, 1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-colors"
            style={{
              backgroundColor: showFilters ? "rgba(201,162,39,0.1)" : "var(--card)",
              borderColor: showFilters ? "rgba(201,162,39,0.3)" : "var(--border)",
              color: showFilters ? "#c9a227" : "var(--foreground)",
            }}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>

        {/* Advanced toggle */}
        <div className="mt-2 flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <SlidersHorizontal size={11} />
            {showAdvanced ? "Masquer" : "Afficher"} la recherche avancée
          </button>

          {/* Toggle phrase exacte */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <div
              onClick={() => setPhraseExacte(v => !v)}
              className={`relative w-7 h-4 rounded-full transition-colors ${phraseExacte ? "bg-blue-600" : "bg-slate-700"}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${phraseExacte ? "translate-x-3.5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-xs text-slate-500">Expression exacte</span>
          </label>

          {hasSearched && queryTime !== null && (
            <span className="text-xs text-slate-600">{total} résultats en {queryTime}ms</span>
          )}
        </div>

        {/* Advanced search fields */}
        {showAdvanced && (
          <div
            className="mt-3 p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            {["Numéro de décision", "ECLI", "Rapporteur", "Visa légal"].map(placeholder => (
              <input
                key={placeholder}
                type="text"
                placeholder={placeholder}
                className="px-3 py-2 rounded-lg text-xs focus:outline-none"
                style={{ backgroundColor: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            ))}
          </div>
        )}
      </form>

      {/* Main content */}
      <div className="flex gap-6">
        {/* Filters sidebar */}
        {showFilters && (
          <SearchFiltersPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            resultCount={total}
          />
        )}

        {/* Results area */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          {hasSearched && !loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {total > 0
                  ? <><span className="font-medium" style={{ color: "var(--foreground)" }}>{total}</span> décision{total > 1 ? "s" : ""} trouvée{total > 1 ? "s" : ""}{query ? ` pour « ${query} »` : ""}</>
                  : "Aucune décision trouvée"
                }
              </p>
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <SortAsc size={13} />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent rounded px-2 py-1 text-xs focus:outline-none"
                  style={{ color: "var(--foreground)", border: "1px solid var(--border)" }}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 size={32} className="animate-spin text-blue-500" />
              <p className="text-sm text-slate-500">Recherche en cours...</p>
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              {results.map((decision, i) => (
                <div key={decision.id} style={{ animationDelay: `${i * 40}ms` }}>
                  <DecisionCard
                    decision={decision}
                    query={query}
                    onBookmark={toggleBookmark}
                    isBookmarked={bookmarked.has(decision.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && hasSearched && results.length === 0 && (
            <div className="text-center py-20">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "var(--card)" }}
              >
                <Search size={24} className="text-slate-500" />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>Aucune décision trouvée</h3>
              {filters.juridiction && filters.juridiction !== "Cour de cassation" ? (
                <p className="text-sm text-amber-400 max-w-sm mx-auto">
                  La source <strong>Judilibre</strong> ne couvre que la <strong>Cour de cassation</strong>.
                  Les juridictions <em>{filters.juridiction}</em>, Conseil d&apos;État, Cours d&apos;appel, etc.
                  seront disponibles via Légifrance (accès en cours d&apos;ouverture).
                </p>
              ) : (
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Essayez d&apos;élargir votre recherche ou de modifier les filtres appliqués.
                </p>
              )}
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-blue-400 hover:text-blue-300"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
              >
                <ChevronLeft size={15} />
                Précédent
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        p === page ? "text-white" : "text-slate-500 hover:text-slate-300"
                      )}
                      style={p === page ? { backgroundColor: "var(--primary)" } : { backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
              >
                Suivant
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
