"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Building2, ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react";
import { formatDateShort, solutionColor, cn } from "@/lib/utils";
import type { UsedDocument } from "@/types";

interface CitationPanelProps {
  documents: UsedDocument[];
  activeIndex?: number;
  onCitationClick?: (index: number) => void;
  className?: string;
}

function RelevanceDots({ score }: { score: number }) {
  const filled = Math.round(score * 5);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors"
          style={{ backgroundColor: i < filled ? "var(--primary)" : "var(--border)" }}
        />
      ))}
    </div>
  );
}

function CitationItem({
  doc,
  isActive,
  onClick,
}: {
  doc: UsedDocument;
  isActive: boolean;
  onClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-200 overflow-hidden",
        isActive ? "ring-1" : ""
      )}
      style={{
        backgroundColor: isActive ? "rgba(59,130,246,0.08)" : "rgba(30,41,59,0.6)",
        borderColor: isActive ? "var(--primary)" : "var(--border)",
        boxShadow: isActive ? "0 0 0 1px var(--primary)" : "none",
      }}
    >
      {/* Citation header */}
      <button
        className="w-full text-left p-3 flex items-start gap-2.5"
        onClick={onClick}
      >
        {/* Citation number badge */}
        <span
          className="flex-shrink-0 w-5 h-5 rounded text-xs font-bold flex items-center justify-center mt-0.5"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          {doc.index}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 leading-snug line-clamp-2 mb-1">
            {doc.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Building2 size={9} />
              {doc.juridiction.replace("Cour de cassation", "Cass.").replace("Conseil d'État", "CE")}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar size={9} />
              {formatDateShort(doc.date)}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-1.5 ml-1">
          <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", solutionColor(doc.solution))}>
            {doc.solution.length > 10 ? doc.solution.substring(0, 8) + "…" : doc.solution}
          </span>
          <RelevanceDots score={doc.relevance_score} />
        </div>
      </button>

      {/* Expand toggle */}
      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span className="flex items-center gap-1">
            <BookOpen size={10} />
            {expanded ? "Masquer l'extrait" : "Voir l'extrait"}
          </span>
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {expanded && (
          <div className="px-3 pb-3">
            <blockquote
              className="text-xs text-slate-400 leading-relaxed border-l-2 pl-3 italic"
              style={{ borderColor: "var(--primary)" }}
            >
              &ldquo;{doc.excerpt}&rdquo;
            </blockquote>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-mono truncate max-w-[140px]">{doc.ecli}</span>
              <Link
                href={`/research/${doc.id}`}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Décision complète
                <ExternalLink size={9} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CitationPanel({ documents, activeIndex, onCitationClick, className }: CitationPanelProps) {
  if (!documents || documents.length === 0) return null;

  const avgRelevance = documents.reduce((sum, d) => sum + d.relevance_score, 0) / documents.length;

  return (
    <aside
      className={cn("flex flex-col gap-3", className)}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Star size={14} style={{ color: "var(--primary)" }} />
          Sources ({documents.length})
        </h3>
        <span className="text-xs text-slate-500">
          Pertinence moy. {Math.round(avgRelevance * 100)}%
        </span>
      </div>

      {/* Citations list */}
      <div className="space-y-2">
        {documents.map(doc => (
          <CitationItem
            key={doc.index}
            doc={doc}
            isActive={activeIndex === doc.index}
            onClick={() => onCitationClick?.(doc.index)}
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-slate-600 text-center pt-1">
        Toutes les sources sont issues de la base Judilibre
      </p>
    </aside>
  );
}
