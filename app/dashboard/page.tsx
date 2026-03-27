"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, MessageSquare, Bookmark, Download, TrendingUp,
  Building2, Users, BarChart3, Clock, ArrowRight, Star,
  FileText, Database, Settings, Bell, ChevronRight
} from "lucide-react";
import { formatDateShort, solutionColor, cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

// Mock data for the dashboard
const MOCK_USER = {
  prenom: "Marie",
  nom: "Dupont",
  email: "m.dupont@cabinet-dupont.fr",
  role: "admin" as const,
};

const MOCK_ORG = {
  nom: "Cabinet Dupont & Associés",
  type: "cabinet" as const,
  subscription: "pro" as const,
  members_count: 8,
  max_members: 15,
  quota_searches_monthly: 1000,
  quota_rag_monthly: 200,
  used_searches: 342,
  used_rag: 47,
};

const MOCK_STATS: DashboardStats = {
  searches_this_month: 342,
  rag_queries_this_month: 47,
  saved_decisions_count: 23,
  documents_exported: 12,
};

const MOCK_RECENT_SEARCHES = [
  { id: "s1", query: "responsabilité bancaire devoir de mise en garde", result_count: 18, searched_at: "2024-03-15T10:30:00Z" },
  { id: "s2", query: "harcèlement moral obligation sécurité employeur", result_count: 11, searched_at: "2024-03-14T16:45:00Z" },
  { id: "s3", query: "clause pénale réduction judiciaire", result_count: 7, searched_at: "2024-03-13T09:15:00Z" },
  { id: "s4", query: "cession de créance opposabilité réforme 2016", result_count: 5, searched_at: "2024-03-12T14:20:00Z" },
];

const MOCK_SAVED = [
  { id: "d1", title: "Cass. com., 15 janv. 2024 — Responsabilité bancaire", date: "2024-01-15", solution: "Cassation", saved_at: "2024-03-10" },
  { id: "d2", title: "Cass. soc., 5 oct. 2022 — Harcèlement moral", date: "2022-10-05", solution: "Cassation", saved_at: "2024-03-08" },
  { id: "d3", title: "Cass. com., 29 mars 2023 — Clause pénale", date: "2023-03-29", solution: "Rejet", saved_at: "2024-03-05" },
];

const MOCK_RAG_SESSIONS = [
  { id: "r1", title: "Analyse du devoir de mise en garde bancaire", messages: 6, created_at: "2024-03-15T11:00:00Z" },
  { id: "r2", title: "Questions sur le harcèlement moral en entreprise", messages: 4, created_at: "2024-03-13T15:30:00Z" },
  { id: "r3", title: "Jurisprudence sur la rupture de relations commerciales", messages: 8, created_at: "2024-03-10T10:15:00Z" },
];

function QuotaBar({ used, max, label, color = "var(--primary)" }: { used: number; max: number; label: string; color?: string }) {
  const pct = Math.min((used / max) * 100, 100);
  const isHigh = pct > 80;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className={isHigh ? "text-amber-400" : "text-slate-400"}>
          {used} / {max}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--secondary)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: isHigh ? "#f59e0b" : color }}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, sublabel, color }: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size: number }>;
  sublabel?: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={17} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {sublabel && <div className="text-xs text-slate-600 mt-0.5">{sublabel}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "searches" | "saved" | "rag">("overview");

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Bonjour, {MOCK_USER.prenom} 👋
          </h1>
          <p className="text-sm text-slate-500">
            {MOCK_ORG.nom} · Plan{" "}
            <span
              className="px-1.5 py-0.5 rounded text-xs font-semibold capitalize"
              style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#93c5fd" }}
            >
              {MOCK_ORG.subscription}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors relative">
            <Bell size={18} />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
          </button>
          <Link
            href="/settings"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Recherches ce mois" value={MOCK_STATS.searches_this_month} icon={Search} sublabel="sur 1 000 inclus" color="#3b82f6" />
        <StatCard label="Requêtes IA" value={MOCK_STATS.rag_queries_this_month} icon={MessageSquare} sublabel="sur 200 inclus" color="#8b5cf6" />
        <StatCard label="Décisions sauvées" value={MOCK_STATS.saved_decisions_count} icon={Bookmark} color="#10b981" />
        <StatCard label="Documents exportés" value={MOCK_STATS.documents_exported} icon={Download} color="#f59e0b" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick actions */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/research"
              className="flex items-center gap-4 p-4 rounded-xl border hover:border-blue-700 transition-all group"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                <Search size={18} style={{ color: "#60a5fa" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-blue-300 transition-colors">
                  Nouvelle recherche
                </p>
                <p className="text-xs text-slate-500">500k+ décisions</p>
              </div>
              <ArrowRight size={15} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
            </Link>
            <Link
              href="/assistant"
              className="flex items-center gap-4 p-4 rounded-xl border hover:border-purple-700 transition-all group"
              style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(139,92,246,0.15)" }}>
                <MessageSquare size={18} style={{ color: "#a78bfa" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                  Assistant IA
                </p>
                <p className="text-xs text-slate-500">RAG avec citations</p>
              </div>
              <ArrowRight size={15} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
              {[
                { id: "searches" as const, label: "Recherches récentes", icon: Search },
                { id: "saved" as const, label: "Décisions sauvées", icon: Bookmark },
                { id: "rag" as const, label: "Sessions IA", icon: MessageSquare },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "text-blue-300 border-blue-500"
                        : "text-slate-500 hover:text-slate-300 border-transparent"
                    )}
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {activeTab === "searches" && MOCK_RECENT_SEARCHES.map(s => (
                <Link
                  key={s.id}
                  href={`/research?query=${encodeURIComponent(s.query)}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors group"
                >
                  <Search size={13} className="text-slate-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 group-hover:text-blue-300 transition-colors truncate">{s.query}</p>
                    <p className="text-xs text-slate-600">{s.result_count} résultats · {formatDateShort(s.searched_at)}</p>
                  </div>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                </Link>
              ))}

              {activeTab === "saved" && MOCK_SAVED.map(d => (
                <Link
                  key={d.id}
                  href={`/research/${d.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors group"
                >
                  <FileText size={13} className="text-slate-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 group-hover:text-blue-300 transition-colors truncate">{d.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", solutionColor(d.solution))}>{d.solution}</span>
                      <span className="text-xs text-slate-600">{formatDateShort(d.date)}</span>
                      <span className="text-xs text-slate-600">· Sauvé le {formatDateShort(d.saved_at)}</span>
                    </div>
                  </div>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                </Link>
              ))}

              {activeTab === "rag" && MOCK_RAG_SESSIONS.map(r => (
                <Link
                  key={r.id}
                  href="/assistant"
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors group"
                >
                  <MessageSquare size={13} className="text-slate-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 group-hover:text-blue-300 transition-colors truncate">{r.title}</p>
                    <p className="text-xs text-slate-600">{r.messages} messages · {formatDateShort(r.created_at)}</p>
                  </div>
                  <ChevronRight size={13} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Org info */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Building2 size={14} style={{ color: "var(--primary)" }} />
              Organisation
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-base font-bold text-white">{MOCK_ORG.nom}</p>
                <p className="text-xs text-slate-500 capitalize">{MOCK_ORG.type} · Plan {MOCK_ORG.subscription}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Users size={12} />
                  {MOCK_ORG.members_count} membre{MOCK_ORG.members_count > 1 ? "s" : ""}
                </span>
                <span className="text-slate-600">sur {MOCK_ORG.max_members} max</span>
              </div>
              <Link
                href="/settings/team"
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Gérer l&apos;équipe
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Quota */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <BarChart3 size={14} style={{ color: "var(--primary)" }} />
              Consommation du mois
            </h3>
            <div className="space-y-4">
              <QuotaBar
                used={MOCK_ORG.used_searches}
                max={MOCK_ORG.quota_searches_monthly}
                label="Recherches"
              />
              <QuotaBar
                used={MOCK_ORG.used_rag}
                max={MOCK_ORG.quota_rag_monthly}
                label="Requêtes IA (RAG)"
                color="#8b5cf6"
              />
            </div>
            <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock size={11} />
                  Réinitialisation le 1er avril
                </span>
                <Link href="/settings/subscription" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Augmenter
                </Link>
              </div>
            </div>
          </div>

          {/* Activity trend */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp size={14} style={{ color: "var(--primary)" }} />
              Activité (7 jours)
            </h3>
            <div className="flex items-end gap-1.5 h-16">
              {[12, 8, 15, 6, 20, 18, 9].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${(v / 20) * 100}%`,
                      backgroundColor: i === 6 ? "var(--primary)" : "var(--secondary)",
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-xs text-slate-600">
                    {["L", "M", "M", "J", "V", "S", "D"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div
            className="rounded-xl border p-5"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Database size={14} style={{ color: "var(--primary)" }} />
              Sources connectées
            </h3>
            <div className="space-y-2">
              {[
                { name: "Judilibre", status: true, count: "492k décisions" },
                { name: "Légifrance", status: true, count: "12k textes" },
                { name: "Doctrine.fr", status: false, count: "Bientôt disponible" },
              ].map(src => (
                <div key={src.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", src.status ? "bg-green-500" : "bg-slate-600")} />
                    <span className={src.status ? "text-slate-300" : "text-slate-600"}>{src.name}</span>
                  </div>
                  <span className="text-xs text-slate-600">{src.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA (if on free plan) */}
          {MOCK_ORG.subscription === "pro" && (
            <div
              className="rounded-xl p-4 border text-center"
              style={{ backgroundColor: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.2)" }}
            >
              <Star size={20} style={{ color: "var(--primary)" }} className="mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-300 mb-1">Plan Pro actif</p>
              <p className="text-xs text-slate-500 mb-3">
                Passez à Enterprise pour des quotas illimités et un support dédié.
              </p>
              <Link
                href="/settings/subscription"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-1.5 rounded-lg hover:brightness-110 transition-all"
                style={{ backgroundColor: "var(--primary)" }}
              >
                Voir Enterprise
                <ArrowRight size={11} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
