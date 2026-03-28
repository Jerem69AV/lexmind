"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Loader2, ChevronLeft, ChevronRight, Scale, ExternalLink } from "lucide-react";
import type { LegalDocumentSummary } from "@/types";

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

  // URL de base pour les liens vers la décision complète
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://lexmind-tawny.vercel.app");

  const doSearch = useCallback(async (q: string, p: number) => {
    if (!q.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        query: q.includes(" ") ? `"${q}"` : q,
        page: String(p),
        per_page: "5",
      });
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (apiKey) headers["X-API-Key"] = apiKey;

      const res = await fetch(`/api/search?${params.toString()}`, { headers });
      if (!res.ok) throw new Error(res.status === 401 ? "Clé API invalide" : "Erreur serveur");
      const data = await res.json();
      // Si fallback mock actif (erreur API), afficher message d'erreur
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
    doSearch(inputValue, 1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    doSearch(query, newPage);
  };

  const isDark = theme !== "light";

  const styles = {
    bg: isDark ? "#07111f" : "#ffffff",
    card: isDark ? "#0e1f35" : "#f8f9fa",
    border: isDark ? "#1a3a5c" : "#dde3eb",
    text: isDark ? "#e8edf5" : "#0A2540",
    muted: isDark ? "#7a9ab8" : "#6c7a8a",
    primary: "#c9a227",
    primaryText: isDark ? "#07111f" : "#07111f",
  };

  return (
    <div
      className="flex flex-col min-h-screen text-sm font-sans"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ backgroundColor: isDark ? "#040e1a" : "#0A2540", borderColor: styles.border }}
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#c9a227" }}
        >
          <Scale size={13} style={{ color: "#07111f" }} />
        </div>
        <span className="font-semibold text-white text-xs tracking-wide">
          AVCA Legal — Agent de recherche juridique
        </span>
        <a
          href="https://avca-avocats.fr"
          target="_top"
          className="ml-auto text-xs flex items-center gap-1 opacity-60 hover:opacity-100"
          style={{ color: "#c9a227" }}
        >
          avca-avocats.fr <ExternalLink size={11} />
        </a>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-4 pb-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: styles.muted }}
            />
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Rechercher une décision (ex: responsabilité bancaire)"
              className="w-full pl-9 pr-8 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: styles.card,
                border: `1px solid ${styles.border}`,
                color: styles.text,
              }}
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => { setInputValue(""); setQuery(""); setResults([]); setHasSearched(false); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                style={{ color: styles.muted }}
              >
                <X size={12} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-50"
            style={{ backgroundColor: "#c9a227", color: "#07111f" }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
            Rechercher
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        {error && (
          <div className="text-xs text-red-400 py-3 text-center">{error}</div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin" style={{ color: "#c9a227" }} />
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="text-center py-10" style={{ color: styles.muted }}>
            <Search size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">Aucune décision trouvée pour « {query} »</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-xs mb-3" style={{ color: styles.muted }}>
              <span style={{ color: styles.text, fontWeight: 600 }}>{total}</span> décision{total > 1 ? "s" : ""} pour « {query} »
            </p>
            <div className="space-y-2">
              {results.map(doc => (
                <div
                  key={doc.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => window.open(`${appOrigin}/research/${doc.id}`, "_blank", "noopener")}
                  onKeyDown={e => e.key === "Enter" && window.open(`${appOrigin}/research/${doc.id}`, "_blank", "noopener")}
                  className="block rounded-lg p-3 border transition-colors hover:brightness-110 cursor-pointer"
                  style={{ backgroundColor: styles.card, borderColor: styles.border }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold leading-tight" style={{ color: styles.text }}>
                      {doc.chambre || doc.juridiction}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: styles.muted }}>
                      {doc.date ? new Date(doc.date).toLocaleDateString("fr-FR") : ""}
                    </span>
                  </div>
                  {doc.numero && (
                    <div className="text-xs mb-1" style={{ color: "#c9a227" }}>N° {doc.numero}</div>
                  )}
                  {doc.solution && (
                    <span
                      className="inline-block text-xs px-1.5 py-0.5 rounded mb-1 font-medium"
                      style={{
                        backgroundColor: "rgba(201,162,39,0.15)",
                        color: "#c9a227",
                        border: "1px solid rgba(201,162,39,0.3)",
                      }}
                    >
                      {doc.solution}
                    </span>
                  )}
                  {doc.snippet && (
                    <p className="text-xs leading-relaxed line-clamp-2 mt-1" style={{ color: styles.muted }}>
                      {doc.snippet}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-1.5 rounded border disabled:opacity-40 transition-colors hover:brightness-110"
                  style={{ borderColor: styles.border, backgroundColor: styles.card, color: styles.muted }}
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs" style={{ color: styles.muted }}>
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="p-1.5 rounded border disabled:opacity-40 transition-colors hover:brightness-110"
                  style={{ borderColor: styles.border, backgroundColor: styles.card, color: styles.muted }}
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <div className="text-center py-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.25)" }}
            >
              <Scale size={22} style={{ color: "#c9a227" }} />
            </div>
            <p className="text-xs font-medium mb-1" style={{ color: styles.text }}>
              Jurisprudence française
            </p>
            <p className="text-xs" style={{ color: styles.muted }}>
              Cour de cassation · 117 000+ décisions
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 border-t text-center"
        style={{ borderColor: styles.border, backgroundColor: isDark ? "#040e1a" : "#f0f2f5" }}
      >
        <p className="text-xs" style={{ color: styles.muted }}>
          Données{" "}
          <a href="https://www.judilibre.io" target="_blank" rel="noopener noreferrer" style={{ color: "#c9a227" }}>
            Judilibre
          </a>{" "}
          · Licence Ouverte 2.0
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
