"use client";

import Link from "next/link";
import { Calendar, Building2, BookOpen, ExternalLink, Bookmark } from "lucide-react";
import { formatDateShort, solutionColor, publicationColor, cn } from "@/lib/utils";
import type { LegalDocumentSummary } from "@/types";

interface DecisionCardProps {
  decision: LegalDocumentSummary;
  query?: string;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
  className?: string;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(t => t.length > 3);
  if (terms.length === 0) return text;

  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i}>{part}</mark>
    ) : (
      part
    )
  );
}

export function DecisionCard({ decision, query = "", onBookmark, isBookmarked, className }: DecisionCardProps) {
  return (
    <article
      className={cn(
        "group rounded-xl p-5 transition-all duration-200 card-hover animate-fade-in",
        className
      )}
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Top row: badges + bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap gap-2">
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold", solutionColor(decision.solution))}>
            {decision.solution}
          </span>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium", publicationColor(decision.publication))}>
            <BookOpen size={10} className="mr-1" />
            {decision.publication}
          </span>
          {(decision.score ?? 0) > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs border" style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)", borderColor: "var(--border)" }}>
              Score: {Math.round((decision.score ?? 0) * 100)}%
            </span>
          )}
        </div>
        {onBookmark && (
          <button
            onClick={() => onBookmark(decision.id)}
            className={cn(
              "p-1.5 rounded-lg transition-colors flex-shrink-0",
              isBookmarked
                ? "text-blue-400"
                : "text-slate-600 hover:text-slate-400"
            )}
            title={isBookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {/* Title */}
      <Link href={`/research/${decision.id}`} className="block group/title">
        <h3 className="text-sm font-semibold leading-snug mb-2 transition-colors line-clamp-2" style={{ color: "var(--foreground)" }}>
          {decision.title}
        </h3>
      </Link>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
        <span className="flex items-center gap-1">
          <Building2 size={11} />
          {decision.juridiction}
        </span>
        <span>·</span>
        <span>{decision.chambre}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {formatDateShort(decision.date)}
        </span>
        <span>·</span>
        <span className="font-mono">{decision.ecli}</span>
      </div>

      {/* Snippet */}
      <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: "var(--muted-foreground)" }}>
        {query ? highlightText(decision.snippet, query) : decision.snippet}
      </p>

      {/* Themes */}
      {decision.themes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {decision.themes.slice(0, 4).map(theme => (
            <span
              key={theme}
              className="inline-block text-xs px-2 py-0.5 rounded-full border"
              style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", borderColor: "var(--border)" }}
            >
              {theme}
            </span>
          ))}
          {decision.themes.length > 4 && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full" style={{ color: "var(--muted-foreground)" }}>
              +{decision.themes.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-mono" style={{ color: "var(--muted-foreground)" }}>n° {decision.numero}</span>
        <Link
          href={`/research/${decision.id}`}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Voir la décision
          <ExternalLink size={11} />
        </Link>
      </div>
    </article>
  );
}
