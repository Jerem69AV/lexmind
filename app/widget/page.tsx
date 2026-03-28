"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Loader2, ChevronLeft, ChevronRight, Scale, ExternalLink, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { LegalDocumentSummary } from "@/types";

const SOLUTIONS = ["Cassation", "Rejet", "Cassation partielle", "Annulation", "Irrecevabilité"];
const CHAMBRES = [
  "Chambre civile 1", "Chambre civile 2", "Chambre civile 3",
  "Chambre commerciale", "Chambre sociale", "Chambre criminelle",
  "Assemblée plénière", "Chambre mixte",
];

function WidgetContent() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("key");
  const theme = searchParams.get("theme") ?? "dark";

  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LegalDocumentSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [solution, setSolution] = useState("");
  const [chambre, setChambre] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const appOrigin = process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://lexmind-tawny.vercel.app");

  const hasFilters = !!(solution || chambre || dateFrom || dateTo);

  const doSearch = useCallback(async (q: string, p: number, filters: { solution: string; chambre: string; dateFrom: string; dateTo: string }) => {
    if (!q.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const params = new URLSearchParams({ query: q, page: String(p), per_page: "5" });
      if (filters.solution) params.set("solution", filters.solution);
      if (filters.chambre) params.set("chambre", filters.chambre);
      if (filters.dateFrom) params.set("date_from", filters.dateFrom);
      if (filters.dateTo) params.set("date_to", filters.dateTo);

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (apiKey) headers["X-API-Key"] = apiKey;

      const res = await fetch(`/api/search?${params.toString()}`, { headers });
      if (!res.ok) throw new Error(res.status === 401 ? "Clé API invalide" : "Erreur serveur");
      const data = await res.json();
      if (data.fallback) {
        setResults([]);
        setTotal(0);
        setTotalPages(0);
        setError("Service temporairement indisponible. Réessayez dans quelques instants.");
        return;
      }
      setResults(data.documents ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.total_pages ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur lors de la recherche");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setQuery(inputValue);
    doSearch(inputValue, 1, { solution, chambre, dateFrom, dateTo });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doSearch(query, newPage, { solution, chambre, dateFrom, dateTo });
  };

  const resetFilters = () => { setSolution(""); setChambre(""); setDateFrom(""); setDateTo(""); };

  const openFull = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    window.open(`${appOrigin}/research${params.toString() ? "?" + params.toString() : ""}`, "_blank", "noopener");
  };

  const isDark = theme !== "light";
  const s = {
    bg: isDark ? "#0d1f3c" : "#ffffff",
    card: isDark ? "#122035" : "#f5f6fa",
    border: isDark ? "#1e3a5f" : "#d4dde8",
    text: isDark ? "#e8edf5" : "#0d1f3c",
    muted: isDark ? "#7a9ab8" : "#5a7090",
    filterBg: isDark ? "#081425" : "#edf1f7",
  };

  const selectStyle: React.CSSProperties = {
    backgroundColor: s.card, border: `1px solid ${s.border}`,
    color: s.text, fontSize: 11, padding: "4px 8px",
    borderRadius: 6, width: "100%", appearance: "none",
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: s.card, border: `1px solid ${s.border}`,
    color: s.text, fontSize: 11, padding: "4px 8px",
    borderRadius: 6, width: "100%",
  };

  return (
    <div className="flex flex-col min-h-screen text-sm font-sans" style={{ backgroundColor: s.bg, color: s.text }}>

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ backgroundColor: isDark ? "#081425" : "#0d1f3c", borderColor: s.border }}>
        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#c9a227" }}>
          <Scale size={13} style={{ color: "#07111f" }} />
        </div>
        <div>
          <span className="font-semibold text-white text-xs tracking-wide">Agent IA</span>
          <span className="text-xs ml-1.5 opacity-50 text-white">· Jurisprudence</span>
        </div>
        <button
          onClick={openFull}
          className="ml-auto flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium transition-all hover:brightness-110"
          style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.3)" }}
        >
          Interface complète <ExternalLink size={10} />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: s.muted }} />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Rechercher une décision, un thème…"
              className="w-full pl-9 pr-8 py-2 rounded-lg text-xs focus:outline-none transition-all"
              style={{ backgroundColor: s.card, border: `1px solid ${s.border}`, color: s.text }}
            />
            {inputValue && (
              <button type="button" onClick={() => { setInputValue(""); setQuery(""); setResults([]); setHasSearched(false); }} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: s.muted }}>
                <X size={12} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-50"
            style={{ backgroundColor: "#c9a227", color: "#07111f" }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
          </button>
        </form>

        {/* Toggle filtres */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1.5 mt-2 text-xs transition-colors"
          style={{ color: hasFilters ? "#c9a227" : s.muted }}
        >
          <SlidersHorizontal size={11} />
          Filtres {hasFilters && <span className="px-1.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: "rgba(201,162,39,0.2)", color: "#c9a227" }}>{[solution, chambre, dateFrom, dateTo].filter(Boolean).length}</span>}
          <ChevronDown size={11} className={showFilters ? "rotate-180" : ""} style={{ transition: "transform 0.2s" }} />
        </button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="px-4 pb-3 pt-1" style={{ backgroundColor: s.filterBg, borderBottom: `1px solid ${s.border}` }}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs mb-1" style={{ color: s.muted }}>Solution</label>
              <div className="relative">
                <select value={solution} onChange={e => setSolution(e.target.value)} style={selectStyle}>
                  <option value="">Toutes</option>
                  {SOLUTIONS.map(sol => <option key={sol} value={sol}>{sol}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: s.muted }} />
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: s.muted }}>Chambre</label>
              <div className="relative">
                <select value={chambre} onChange={e => setChambre(e.target.value)} style={selectStyle}>
                  <option value="">Toutes</option>
                  {CHAMBRES.map(ch => <option key={ch} value={ch}>{ch}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: s.muted }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs mb-1" style={{ color: s.muted }}>Du</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={{ color: s.muted }}>Au</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
            </div>
          </div>
          {hasFilters && (
            <button onClick={resetFilters} className="text-xs" style={{ color: s.muted }}>
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        {error && <div className="text-xs text-red-400 py-3 text-center">{error}</div>}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin" style={{ color: "#c9a227" }} />
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="text-center py-10" style={{ color: s.muted }}>
            <Search size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">Aucune décision trouvée pour « {query} »</p>
            <button onClick={openFull} className="mt-3 text-xs underline" style={{ color: "#c9a227" }}>
              Essayer l&apos;interface complète →
            </button>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3 pt-3">
              <p className="text-xs" style={{ color: s.muted }}>
                <span style={{ color: s.text, fontWeight: 600 }}>{total}</span> décision{total > 1 ? "s" : ""}
              </p>
              <button onClick={openFull} className="text-xs flex items-center gap-1" style={{ color: "#c9a227" }}>
                Voir tout <ExternalLink size={10} />
              </button>
            </div>
            <div className="space-y-2">
              {results.map(doc => (
                <div
                  key={doc.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => window.open(`${appOrigin}/research/${doc.id}`, "_blank", "noopener")}
                  onKeyDown={e => e.key === "Enter" && window.open(`${appOrigin}/research/${doc.id}`, "_blank", "noopener")}
                  className="block rounded-lg p-3 border transition-colors hover:brightness-110 cursor-pointer"
                  style={{ backgroundColor: s.card, borderColor: s.border }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold leading-tight" style={{ color: s.text }}>{doc.chambre || doc.juridiction}</span>
                    <span className="text-xs flex-shrink-0" style={{ color: s.muted }}>{doc.date ? new Date(doc.date).toLocaleDateString("fr-FR") : ""}</span>
                  </div>
                  {doc.numero && <div className="text-xs mb-1" style={{ color: "#c9a227" }}>N° {doc.numero}</div>}
                  {doc.solution && (
                    <span className="inline-block text-xs px-1.5 py-0.5 rounded mb-1 font-medium" style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.3)" }}>
                      {doc.solution}
                    </span>
                  )}
                  {doc.snippet && <p className="text-xs leading-relaxed line-clamp-2 mt-1" style={{ color: s.muted }}>{doc.snippet}</p>}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="p-1.5 rounded border disabled:opacity-40" style={{ borderColor: s.border, backgroundColor: s.card, color: s.muted }}>
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs" style={{ color: s.muted }}>{page} / {totalPages}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="p-1.5 rounded border disabled:opacity-40" style={{ borderColor: s.border, backgroundColor: s.card, color: s.muted }}>
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)" }}>
              <Scale size={22} style={{ color: "#c9a227" }} />
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: s.text }}>Recherche jurisprudentielle IA</p>
            <p className="text-xs mb-1" style={{ color: s.muted }}>117 000+ décisions · Cour de cassation</p>
            <p className="text-xs mb-4" style={{ color: s.muted, opacity: 0.7 }}>Indexées et analysées par intelligence artificielle</p>
            <button
              onClick={openFull}
              className="flex items-center gap-1.5 mx-auto text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:brightness-110"
              style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#c9a227", border: "1px solid rgba(201,162,39,0.3)" }}
            >
              <ExternalLink size={11} /> Interface complète avec filtres avancés
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t text-center" style={{ borderColor: s.border, backgroundColor: isDark ? "#081425" : "#edf1f7" }}>
        <p className="text-xs" style={{ color: s.muted }}>
          Données <a href="https://www.judilibre.io" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a227" }}>Judilibre</a> · Licence Ouverte 2.0
        </p>
      </div>
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense>
      <WidgetContent />
    </Suspense>
  );
}
