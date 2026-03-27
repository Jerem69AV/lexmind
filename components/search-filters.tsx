"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchFilters } from "@/types";

interface SearchFiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset?: () => void;
  resultCount?: number;
}

// Juridictions disponibles via Judilibre (sources actives)
const JURIDICTIONS_DISPONIBLES = new Set(["Cour de cassation"]);

const JURIDICTIONS = [
  "Cour de cassation",
  "Conseil d'État",
  "Cour d'appel",
  "Tribunal judiciaire",
  "Conseil constitutionnel",
  "Cour administrative d'appel",
  "Conseil de prud'hommes",
];

const CHAMBRES: Record<string, string[]> = {
  "Cour de cassation": [
    "Chambre civile 1",
    "Chambre civile 2",
    "Chambre civile 3",
    "Chambre commerciale",
    "Chambre sociale",
    "Chambre criminelle",
    "Assemblée plénière",
    "Chambre mixte",
  ],
  "Conseil d'État": [
    "Section du contentieux",
    "Section du conseil",
  ],
};

const SOLUTIONS = ["Cassation", "Rejet", "Cassation partielle", "Non-lieu à renvoi", "Annulation", "Irrecevabilité"];
const PUBLICATIONS = ["Bulletin", "Bulletin et Rapport annuel", "Inédit", "Non publié au bulletin", "BICC"];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b" style={{ borderColor: "var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function SearchFiltersPanel({ filters, onChange, onReset, resultCount }: SearchFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(v => v && v !== "");

  const update = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    if (key === "juridiction") {
      newFilters.chambre = undefined;
    }
    onChange(newFilters);
  };

  const availableChambres = filters.juridiction
    ? CHAMBRES[filters.juridiction] ?? []
    : Object.values(CHAMBRES).flat();

  return (
    <aside
      className="w-64 flex-shrink-0 rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Filter size={14} style={{ color: "var(--primary)" }} />
          Filtres
          {resultCount !== undefined && (
            <span className="ml-auto text-xs text-slate-500">{resultCount} résultat{resultCount > 1 ? "s" : ""}</span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            <X size={12} />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Juridiction */}
      <FilterSection title="Juridiction">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="juridiction"
              value=""
              checked={!filters.juridiction}
              onChange={() => update("juridiction", "")}
              className="accent-blue-500"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Toutes</span>
          </label>
          {JURIDICTIONS.map(j => {
            const disponible = JURIDICTIONS_DISPONIBLES.has(j);
            return (
              <label key={j} className={`flex items-center gap-2 group ${disponible ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
                <input
                  type="radio"
                  name="juridiction"
                  value={j}
                  checked={filters.juridiction === j}
                  onChange={() => disponible && update("juridiction", j)}
                  disabled={!disponible}
                  className="accent-blue-500"
                />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-snug">
                  {j}
                  {!disponible && <span className="ml-1 text-slate-600">(bientôt)</span>}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Chambre */}
      {availableChambres.length > 0 && (
        <FilterSection title="Chambre" defaultOpen={!!filters.juridiction}>
          <select
            value={filters.chambre ?? ""}
            onChange={e => update("chambre", e.target.value)}
            className={cn(
              "w-full text-xs rounded-lg px-2.5 py-1.5 transition-colors",
              "focus:outline-none focus:ring-1"
            )}
            style={{
              backgroundColor: "var(--input)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          >
            <option value="">Toutes les chambres</option>
            {availableChambres.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FilterSection>
      )}

      {/* Dates */}
      <FilterSection title="Période">
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Du</label>
            <input
              type="date"
              value={filters.date_from ?? ""}
              onChange={e => update("date_from", e.target.value)}
              className="w-full text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1"
              style={{
                backgroundColor: "var(--input)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Au</label>
            <input
              type="date"
              value={filters.date_to ?? ""}
              onChange={e => update("date_to", e.target.value)}
              className="w-full text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1"
              style={{
                backgroundColor: "var(--input)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              }}
            />
          </div>
        </div>
      </FilterSection>

      {/* Solution */}
      <FilterSection title="Solution" defaultOpen={false}>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="solution"
              value=""
              checked={!filters.solution}
              onChange={() => update("solution", "")}
              className="accent-blue-500"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Toutes</span>
          </label>
          {SOLUTIONS.map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="solution"
                value={s}
                checked={filters.solution === s}
                onChange={() => update("solution", s)}
                className="accent-blue-500"
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{s}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Publication */}
      <FilterSection title="Publication" defaultOpen={false}>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="publication"
              value=""
              checked={!filters.publication}
              onChange={() => update("publication", "")}
              className="accent-blue-500"
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Toutes</span>
          </label>
          {PUBLICATIONS.map(p => (
            <label key={p} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="publication"
                value={p}
                checked={filters.publication === p}
                onChange={() => update("publication", p)}
                className="accent-blue-500"
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{p}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
