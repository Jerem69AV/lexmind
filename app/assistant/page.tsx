"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Loader2, MessageSquare, Plus, History, BookOpen,
  AlertTriangle, ChevronDown, Trash2, Zap, ExternalLink, Scale, Globe
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import type { ChatMessage, ChatSession, RAGResponse, RAGMode, UsedDocument, WebSource } from "@/types";

// ── Badges de citation cliquables ──────────────────────────────────────────────

function JurisBadge({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold align-super ml-0.5 transition-all hover:brightness-90"
      style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#2563eb", fontSize: "10px", textDecoration: "none" }}
      title={`Voir la jurisprudence ${label}`}
    >
      {label} <ExternalLink size={8} />
    </a>
  );
}

function WebBadge({ label, url, hostname }: { label: string; url: string; hostname: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-bold align-super ml-0.5 transition-all hover:brightness-90"
      style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#059669", fontSize: "10px", textDecoration: "none" }}
      title={`Source : ${hostname}`}
    >
      {label} <ExternalLink size={8} />
    </a>
  );
}

function renderContent(
  content: string,
  usedDocuments: UsedDocument[],
  webSources: WebSource[]
): React.ReactNode {
  const parts = content.split(/(\[J\d+\]|\[W\d+\])/g);
  return parts.map((part, i) => {
    const jMatch = part.match(/^\[J(\d+)\]$/);
    const wMatch = part.match(/^\[W(\d+)\]$/);
    if (jMatch) {
      const idx = parseInt(jMatch[1]) - 1;
      const doc = usedDocuments[idx];
      const url = doc
        ? `https://www.legifrance.gouv.fr/search/juri?tab_selection=juri&searchField=ALL&query=${encodeURIComponent(doc.ecli || doc.title)}&page=1&pageSize=10`
        : "#";
      return <JurisBadge key={i} label={`J${jMatch[1]}`} url={url} />;
    }
    if (wMatch) {
      const idx = parseInt(wMatch[1]) - 1;
      const src = webSources[idx];
      return src
        ? <WebBadge key={i} label={`W${wMatch[1]}`} url={src.url} hostname={src.hostname} />
        : <span key={i} style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>[W{wMatch[1]}]</span>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ── Message assistant ──────────────────────────────────────────────────────────

function AssistantMessage({ message }: { message: ChatMessage }) {
  const rag = message.rag_response;
  const [expanded, setExpanded] = useState(true);

  if (message.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div
          className="max-w-lg rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white"
          style={{ backgroundColor: "var(--primary)" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  if (!rag) {
    return (
      <div className="flex gap-3 mb-4">
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1"
          style={{ backgroundColor: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
          <Zap size={13} style={{ color: "#818cf8" }} />
        </div>
        <div
          className="flex-1 rounded-2xl rounded-tl-sm px-4 py-3 text-sm"
          style={{ color: "var(--foreground)", backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  const docs = rag.used_documents ?? [];
  const webSrcs = rag.web_sources ?? [];

  return (
    <div className="flex gap-3 mb-6">
      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1"
        style={{ backgroundColor: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
        <Zap size={13} style={{ color: "#818cf8" }} />
      </div>

      <div className="flex-1 min-w-0">
        {/* Synthèse */}
        <div
          className="rounded-2xl rounded-tl-sm px-5 py-4 mb-3"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
              <BookOpen size={11} />
              Synthèse
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: rag.confidence > 0.8 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                  color: rag.confidence > 0.8 ? "#059669" : "#d97706",
                  border: `1px solid ${rag.confidence > 0.8 ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                }}
              >
                Confiance {Math.round(rag.confidence * 100)}%
              </span>
              {webSrcs.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669", border: "1px solid rgba(16,185,129,0.2)" }}>
                  {docs.length} arrêt{docs.length > 1 ? "s" : ""} · {webSrcs.length} source{webSrcs.length > 1 ? "s" : ""} web
                </span>
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {renderContent(rag.synthese, docs, webSrcs)}
          </p>
        </div>

        {/* Sections */}
        {rag.sections.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs mb-2 transition-colors"
              style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              <span>{rag.sections.length} section{rag.sections.length > 1 ? "s" : ""} développées</span>
              <ChevronDown size={13} className={cn("transition-transform", !expanded && "-rotate-90")} />
            </button>

            {expanded && (
              <div className="space-y-3">
                {rag.sections.map((section, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-5 py-4"
                    style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                      <span
                        className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(59,130,246,0.15)", color: "#3b82f6" }}
                      >
                        {i + 1}
                      </span>
                      {section.title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      {renderContent(section.content, docs, webSrcs)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Note de cohérence des sources */}
        {rag.disclaimer && (
          <div
            className="mt-3 flex items-start gap-2 px-4 py-2.5 rounded-lg text-xs"
            style={{ backgroundColor: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", color: "var(--muted-foreground)" }}
          >
            <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
            <span>{rag.disclaimer}</span>
          </div>
        )}

        {/* Disclaimer légal + CTA cabinet */}
        <div
          className="mt-3 rounded-xl overflow-hidden text-xs"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="flex items-start gap-2 px-4 py-3"
            style={{ backgroundColor: "rgba(245,158,11,0.05)", borderBottom: "1px solid rgba(245,158,11,0.12)", color: "var(--muted-foreground)" }}
          >
            <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
            <span>
              Cette réponse est <strong>purement informative</strong> et ne constitue pas un conseil juridique au sens de la loi n° 71-1130 du 31 décembre 1971.
              Les informations fournies ne remplacent pas l'avis d'un avocat et ne peuvent être utilisées comme fondement d'une décision juridique sans vérification préalable.
            </span>
          </div>
          <div
            className="flex items-center justify-between px-4 py-3 gap-4 flex-wrap"
            style={{ backgroundColor: "var(--card)" }}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              <Scale size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <span>Votre question nécessite l&apos;intervention d&apos;un avocat ou vous souhaitez confier votre dossier au cabinet AVCA Legal ?</span>
            </div>
            <a
              href="mailto:contact@avca-avocats.fr?subject=Demande de consultation — AVCA Legal"
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--sidebar)" }}
            >
              Contacter le cabinet →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Session dans la sidebar ────────────────────────────────────────────────────

function SessionItem({ session, active, onSelect, onDelete }: {
  session: ChatSession;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn("group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors", !active && "hover:bg-white/5")}
      style={active ? { backgroundColor: "rgba(201,162,39,0.1)", color: "var(--primary)" } : { color: "var(--muted-foreground)" }}
      onClick={onSelect}
    >
      <MessageSquare size={13} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{session.title}</p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{session.messages.length} message{session.messages.length > 1 ? "s" : ""}</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all hover:text-red-500"
        style={{ color: "var(--muted-foreground)" }}
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

const WELCOME_MESSAGE = `Bienvenue sur l'agent de recherche juridique du cabinet AVCA Legal.

Cet outil interroge en temps réel deux sources officielles :
- La base Judilibre (Cour de cassation) pour les arrêts et décisions
- Les sites juridiques publics français (Légifrance, service-public.fr, Conseil d'État…)

À partir de votre question, l'agent rédige une note structurée, vérifie la cohérence entre les sources et vous indique le niveau de fiabilité de chaque information.

Les renvois [J1], [J2]… pointent vers les arrêts Judilibre. Les renvois [W1], [W2]… pointent vers les sources web consultées. Cliquez dessus pour accéder directement à la source.

Cette réponse est informative. Pour toute question nécessitant l'intervention d'un avocat, le cabinet reste disponible.`;

// ── Page principale ────────────────────────────────────────────────────────────

export default function AssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode] = useState<RAGMode>("strict");
  const [webSearch, setWebSearch] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const startNewSession = useCallback(() => {
    const id = generateId();
    const newSession: ChatSession = {
      id,
      title: "Nouvelle conversation",
      messages: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      mode,
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
    setMessages([]);
  }, [mode]);

  useEffect(() => {
    if (!activeSessionId) startNewSession();
  }, [activeSessionId, startNewSession]);

  const handleSend = async () => {
    const question = inputValue.trim();
    if (!question || loading) return;

    setInputValue("");

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/rag/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode, web_search: webSearch }),
      });

      if (!res.ok) throw new Error("Erreur du serveur");
      const data: RAGResponse = await res.json();

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.synthese,
        timestamp: new Date().toISOString(),
        rag_response: data,
      };

      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        if (activeSessionId) {
          setSessions(s => s.map(sess =>
            sess.id === activeSessionId
              ? { ...sess, title: question.substring(0, 50), messages: updated, updated_at: new Date().toISOString() }
              : sess
          ));
        }
        return updated;
      });
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: "assistant",
        content: "Désolé, une erreur est survenue. Veuillez réessayer.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 130px)" }}>

      {/* Sidebar historique */}
      {showHistory && (
        <aside className="w-56 flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: "var(--sidebar)", borderColor: "var(--border)" }}>
          <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={startNewSession}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white hover:brightness-110 transition-all"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Plus size={14} /> Nouvelle conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <p className="text-xs px-3 py-1.5 uppercase tracking-wide font-medium" style={{ color: "var(--sidebar-foreground)", opacity: 0.4 }}>
              Historique
            </p>
            {sessions.length === 0
              ? <p className="text-xs px-3 py-2" style={{ color: "var(--sidebar-foreground)", opacity: 0.4 }}>Aucune conversation</p>
              : sessions.map(session => (
                <SessionItem
                  key={session.id}
                  session={session}
                  active={session.id === activeSessionId}
                  onSelect={() => { setActiveSessionId(session.id); setMessages(session.messages); }}
                  onDelete={() => { setSessions(prev => prev.filter(s => s.id !== session.id)); if (session.id === activeSessionId) startNewSession(); }}
                />
              ))
            }
          </div>

          <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--sidebar-foreground)", opacity: 0.4 }}>Conforme RGPD</p>
          </div>
        </aside>
      )}

      {/* Zone principale */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg transition-colors hover:bg-black/10"
              style={{ color: "var(--foreground)" }}
            >
              <History size={16} />
            </button>
            <h2 className="text-base font-bold" style={{ color: "var(--sidebar)" }}>
              Assistant Juridique IA AVCA Legal
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <span className="px-2 py-1 rounded-full" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#059669", border: "1px solid rgba(16,185,129,0.2)" }}>
              Judilibre + Web officiel
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 mb-8 text-center" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(99,102,241,0.15)" }}>
                  <Zap size={24} style={{ color: "#6366f1" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>Assistant juridique IA</h3>
                <div className="text-sm text-left space-y-2 mt-4" style={{ color: "var(--foreground)" }}>
                  {WELCOME_MESSAGE.split("\n").filter(Boolean).map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <div className="flex items-center justify-center gap-4 mt-5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  <span className="flex items-center gap-1"><span style={{ color: "#2563eb", fontWeight: 700 }}>[J1]</span> Jurisprudence Judilibre</span>
                  <span className="flex items-center gap-1"><span style={{ color: "#059669", fontWeight: 700 }}>[W1]</span> Source web officielle</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Quelles sont les conditions du trouble anormal de voisinage ?",
                  "Quelles sont les règles applicables en matière de responsabilité bancaire ?",
                  "Comment s'ouvre une procédure de redressement judiciaire ?",
                  "Quel est le régime juridique des cryptoactifs en droit français ?",
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInputValue(q); textareaRef.current?.focus(); }}
                    className="text-left px-4 py-3 rounded-xl text-sm border transition-all hover:border-blue-400"
                    style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            {messages.map(msg => <AssistantMessage key={msg.id} message={msg} />)}

            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
                  <Zap size={13} style={{ color: "#6366f1" }} />
                </div>
                <div className="px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
                  <Loader2 size={15} className="animate-spin text-blue-500" />
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>Recherche Judilibre + sources web en cours...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="flex-shrink-0 px-5 py-4 border-t" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end rounded-xl p-3 transition-all" style={{ backgroundColor: "var(--input)", border: "1px solid var(--border)" }}>
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question juridique... (Entrée pour envoyer)"
                rows={2}
                className="flex-1 bg-transparent text-sm resize-none focus:outline-none leading-relaxed"
                style={{ color: "var(--foreground)", maxHeight: "120px" }}
                disabled={loading}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setWebSearch(v => !v)}
                  title={webSearch ? "Recherche web activée — cliquer pour désactiver" : "Activer la recherche web (sources officielles françaises)"}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all"
                  style={webSearch
                    ? { backgroundColor: "var(--primary)", color: "white" }
                    : { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }
                  }
                >
                  <Globe size={13} />
                  Web
                </button>
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || loading}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#a8841f" }}
                >
                  {loading ? <Loader2 size={16} className="animate-spin text-white" /> : <Send size={16} className="text-white" />}
                </button>
              </div>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: "var(--muted-foreground)" }}>
              Judilibre · {webSearch ? <span style={{ color: "var(--primary)", fontWeight: 600 }}>Recherche web activée</span> : "Recherche web désactivée — cliquer sur Web pour l'activer"} · Ne constitue pas un avis juridique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
