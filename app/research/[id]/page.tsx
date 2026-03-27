"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Bookmark, Download, Share2, Calendar, Building2,
  BookOpen, FileText, Loader2, ExternalLink, Hash, Scale,
  ChevronRight, AlertTriangle
} from "lucide-react";
import { formatDate, solutionColor, publicationColor, cn } from "@/lib/utils";
import type { LegalDocument } from "@/types";

interface FullDocument extends LegalDocument {
  similar_decisions?: Array<{
    id: string;
    ecli: string;
    title: string;
    juridiction: string;
    chambre: string;
    date: string;
    solution: string;
    sommaire: string;
  }>;
}

function MetaChip({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("flex flex-col gap-0.5 px-3 py-2 rounded-lg", className)}
      style={{ backgroundColor: "var(--muted)", border: "1px solid var(--border)" }}
    >
      <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</span>
      <span className="text-sm font-semibold text-slate-200">{value}</span>
    </div>
  );
}

export default function DecisionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [doc, setDoc] = useState<FullDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<"texte" | "sommaire" | "renvois">("texte");

  useEffect(() => {
    async function loadDoc() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/documents/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error("Document non trouvé");
        const data = await res.json();
        setDoc(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadDoc();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="animate-spin text-blue-500" />
          <p className="text-sm text-slate-500">Chargement de la décision...</p>
        </div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <AlertTriangle size={32} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-200 mb-2">Décision introuvable</h2>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Retour aux résultats
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "texte" as const, label: "Texte intégral", icon: FileText },
    { id: "sommaire" as const, label: "Sommaire", icon: BookOpen },
    { id: "renvois" as const, label: `Renvois (${doc.renvois.length})`, icon: Hash },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/research" className="hover:text-slate-300 transition-colors">Recherche</Link>
        <ChevronRight size={12} />
        <span className="text-slate-400 truncate max-w-xs">{doc.title.substring(0, 60)}…</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* Main content */}
        <div>
          {/* Back button + title */}
          <div className="flex items-start gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="flex-shrink-0 mt-1 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white leading-snug mb-2">{doc.title}</h1>
              <p className="font-mono text-xs text-slate-500">{doc.ecli}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                bookmarked ? "text-blue-300 border-blue-700" : "text-slate-400 hover:text-slate-200"
              )}
              style={{ backgroundColor: bookmarked ? "rgba(59,130,246,0.1)" : "var(--card)", borderColor: bookmarked ? "rgba(59,130,246,0.3)" : "var(--border)" }}
            >
              <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
              {bookmarked ? "Sauvegardé" : "Sauvegarder"}
            </button>

            {(["PDF", "DOCX", "CSV"] as const).map(fmt => (
              <button
                key={fmt}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 border transition-colors"
                style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
              >
                <Download size={13} />
                {fmt}
              </button>
            ))}

            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 border transition-colors ml-auto"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <Share2 size={13} />
              Partager
            </button>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <MetaChip
              label="Solution"
              value={
                <span className={cn("inline-flex px-2 py-0.5 rounded text-xs font-bold", solutionColor(doc.solution))}>
                  {doc.solution}
                </span>
              }
            />
            <MetaChip label="Date" value={
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-500" />
                {formatDate(doc.date)}
              </span>
            } />
            <MetaChip label="Juridiction" value={
              <span className="flex items-center gap-1.5">
                <Building2 size={13} className="text-slate-500" />
                {doc.juridiction}
              </span>
            } />
            <MetaChip label="Chambre" value={doc.chambre} />
            <MetaChip label="Numéro" value={<span className="font-mono">{doc.numero}</span>} />
            <MetaChip label="Publication" value={
              <span className={cn("inline-flex px-1.5 py-0.5 rounded text-xs font-medium", publicationColor(doc.publication))}>
                {doc.publication}
              </span>
            } />
          </div>

          {/* Visa légaux */}
          {doc.visa.length > 0 && (
            <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Scale size={12} /> Visa légaux
              </h3>
              <div className="flex flex-wrap gap-2">
                {doc.visa.map((v, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ backgroundColor: "rgba(59,130,246,0.1)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2",
                      activeTab === tab.id
                        ? "text-blue-300 border-blue-500"
                        : "text-slate-500 hover:text-slate-300 border-transparent"
                    )}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === "texte" && (
                <div className="legal-prose whitespace-pre-wrap text-slate-300 text-sm leading-7">
                  {doc.texte}
                </div>
              )}
              {activeTab === "sommaire" && (
                <div className="legal-prose text-slate-300">
                  <p className="text-sm leading-relaxed">{doc.sommaire}</p>
                </div>
              )}
              {activeTab === "renvois" && (
                <div className="space-y-3">
                  {doc.renvois.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-8">Aucun renvoi</p>
                  ) : (
                    doc.renvois.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                        style={{ backgroundColor: "rgba(30,41,59,0.5)", borderColor: "var(--border)" }}
                      >
                        <span
                          className="flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium capitalize mt-0.5"
                          style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
                        >
                          {r.type}
                        </span>
                        <div className="flex-1">
                          {r.id ? (
                            <Link
                              href={`/research/${r.id}`}
                              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                            >
                              {r.texte}
                              <ExternalLink size={11} />
                            </Link>
                          ) : (
                            <span className="text-sm text-slate-400">{r.texte}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Themes */}
          <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Thèmes</h3>
            <div className="flex flex-wrap gap-1.5">
              {doc.themes.map(theme => (
                <Link
                  key={theme}
                  href={`/research?query=${encodeURIComponent(theme)}`}
                  className="text-xs px-2.5 py-1 rounded-full border text-slate-400 hover:text-slate-200 hover:border-blue-700 transition-colors"
                  style={{ backgroundColor: "rgba(30,41,59,0.5)", borderColor: "var(--border)" }}
                >
                  {theme}
                </Link>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Source</h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                <Database size={12} style={{ color: "var(--primary)" }} />
              </div>
              <span className="text-sm text-slate-300 capitalize">{doc.source}</span>
              <a href="https://www.judilibre.io" target="_blank" rel="noopener noreferrer"
                className="ml-auto text-xs text-slate-500 hover:text-slate-300">
                <ExternalLink size={11} />
              </a>
            </div>
          </div>

          {/* Décisions similaires */}
          {doc.similar_decisions && doc.similar_decisions.length > 0 && (
            <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Décisions similaires
              </h3>
              <div className="space-y-3">
                {doc.similar_decisions.map(sim => (
                  <Link
                    key={sim.id}
                    href={`/research/${sim.id}`}
                    className="block p-3 rounded-lg border transition-all hover:border-blue-700 group"
                    style={{ backgroundColor: "rgba(30,41,59,0.5)", borderColor: "var(--border)" }}
                  >
                    <p className="text-xs font-medium text-slate-300 group-hover:text-blue-300 line-clamp-2 mb-1.5 transition-colors">
                      {sim.title.substring(0, 80)}…
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{formatDate(sim.date, { year: "numeric", month: "short", day: "numeric" })}</span>
                      <span>·</span>
                      <span className={cn("px-1.5 py-0.5 rounded text-xs font-medium", solutionColor(sim.solution))}>
                        {sim.solution}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* RAG CTA */}
          <div
            className="rounded-xl p-4 border"
            style={{ backgroundColor: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.2)" }}
          >
            <p className="text-xs text-slate-400 mb-3">
              Vous avez des questions sur cette décision ?
            </p>
            <Link
              href={`/assistant?context=${encodeURIComponent(doc.id)}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <BookOpen size={14} />
              Analyser avec l&apos;IA
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

// This import needs to be at the top but Database is used in JSX
function Database({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  );
}
