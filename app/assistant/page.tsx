"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Loader2, MessageSquare, Plus, History, BookOpen,
  AlertTriangle, ChevronDown, Trash2, Settings, Zap
} from "lucide-react";
import { CitationPanel } from "@/components/citation-panel";
import { cn, generateId } from "@/lib/utils";
import type { ChatMessage, ChatSession, RAGResponse, RAGMode } from "@/types";

function CitationBadge({ index, onClick, active }: { index: number; onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold align-super ml-0.5 transition-all",
        active ? "text-white scale-110" : "text-blue-300 hover:text-white hover:scale-105"
      )}
      style={{ backgroundColor: active ? "var(--primary)" : "rgba(59,130,246,0.25)", fontSize: "10px" }}
      title={`Source [${index}]`}
    >
      {index}
    </button>
  );
}

function renderContentWithCitations(
  content: string,
  activeCitation: number | null,
  onCitationClick: (i: number) => void
): React.ReactNode {
  const parts = content.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const idx = parseInt(match[1]);
      return (
        <CitationBadge
          key={i}
          index={idx}
          onClick={() => onCitationClick(idx)}
          active={activeCitation === idx}
        />
      );
    }
    return part;
  });
}

function AssistantMessage({
  message,
  onCitationClick,
  activeCitation,
}: {
  message: ChatMessage;
  onCitationClick: (index: number) => void;
  activeCitation: number | null;
}) {
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

  // Simple assistant message (no RAG)
  if (!rag) {
    return (
      <div className="flex gap-3 mb-4">
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1"
          style={{ backgroundColor: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
          <Zap size={13} style={{ color: "#818cf8" }} />
        </div>
        <div
          className="flex-1 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-300"
          style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-6 animate-fade-in">
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
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen size={11} />
              Synthèse
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: rag.confidence > 0.8 ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                  color: rag.confidence > 0.8 ? "#34d399" : "#fbbf24",
                  border: `1px solid ${rag.confidence > 0.8 ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`,
                }}
              >
                Confiance {Math.round(rag.confidence * 100)}%
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full capitalize"
                style={{
                  backgroundColor: "rgba(99,102,241,0.15)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                {rag.mode}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{rag.synthese}</p>
        </div>

        {/* Sections */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 mb-2 transition-colors"
          style={{ backgroundColor: "rgba(30,41,59,0.4)" }}
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
                <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded text-xs font-bold flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "rgba(59,130,246,0.2)", color: "#93c5fd" }}
                  >
                    {i + 1}
                  </span>
                  {section.title}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {renderContentWithCitations(section.content, activeCitation, onCitationClick)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div
          className="mt-3 flex items-start gap-2 px-4 py-2.5 rounded-lg text-xs text-slate-500"
          style={{ backgroundColor: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          <AlertTriangle size={12} className="flex-shrink-0 text-amber-600 mt-0.5" />
          <span>{rag.disclaimer}</span>
        </div>
      </div>
    </div>
  );
}

function SessionItem({ session, active, onSelect, onDelete }: {
  session: ChatSession;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
        active ? "text-blue-300" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
      )}
      style={active ? { backgroundColor: "rgba(59,130,246,0.1)" } : {}}
      onClick={onSelect}
    >
      <MessageSquare size={13} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{session.title}</p>
        <p className="text-xs text-slate-600">{session.messages.length} message{session.messages.length > 1 ? "s" : ""}</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-600 hover:text-red-400 transition-all"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

const WELCOME_MESSAGE = `Bonjour ! Je suis l'assistant juridique IA d'AVCA Legal.

Je peux vous aider à :
- **Analyser la jurisprudence** sur un sujet précis
- **Synthétiser les positions** de la Cour de cassation ou du Conseil d'État
- **Identifier les décisions clés** et les tendances jurisprudentielles
- **Répondre à vos questions** de droit en citant mes sources

Posez votre question et je vous fournirai une réponse structurée avec des citations vérifiables.`;

export default function AssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<RAGMode>("strict");
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const [currentRAG, setCurrentRAG] = useState<RAGResponse | null>(null);
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
    setCurrentRAG(null);
    setActiveCitation(null);
  }, [mode]);

  useEffect(() => {
    if (!activeSessionId) startNewSession();
  }, [activeSessionId, startNewSession]);

  const handleSend = async () => {
    const question = inputValue.trim();
    if (!question || loading) return;

    setInputValue("");
    setActiveCitation(null);

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
        body: JSON.stringify({ question, mode }),
      });

      if (!res.ok) throw new Error("Erreur du serveur");

      const data: RAGResponse = await res.json();
      setCurrentRAG(data);

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.synthese,
        timestamp: new Date().toISOString(),
        rag_response: data,
      };

      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        // Update session title from first question
        if (sessions.length > 0 && activeSessionId) {
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
      const errMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "Désolé, une erreur est survenue lors du traitement de votre question. Veuillez réessayer.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCitationClick = (index: number) => {
    setActiveCitation(prev => prev === index ? null : index);
  };

  const usedDocs = currentRAG?.used_documents ?? [];
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === "assistant" && m.rag_response);

  return (
    <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 130px)" }}>
      {/* History Sidebar */}
      {showHistory && (
        <aside
          className="w-56 flex-shrink-0 flex flex-col border-r"
          style={{ backgroundColor: "var(--sidebar)", borderColor: "var(--border)" }}
        >
          <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={startNewSession}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Plus size={14} />
              Nouvelle conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            <p className="text-xs text-slate-600 px-3 py-1.5 uppercase tracking-wide font-medium">
              Historique
            </p>
            {sessions.length === 0 ? (
              <p className="text-xs text-slate-600 px-3 py-2">Aucune conversation</p>
            ) : (
              sessions.map(session => (
                <SessionItem
                  key={session.id}
                  session={session}
                  active={session.id === activeSessionId}
                  onSelect={() => {
                    setActiveSessionId(session.id);
                    setMessages(session.messages);
                    const lastRag = [...session.messages].reverse().find(m => m.rag_response)?.rag_response;
                    setCurrentRAG(lastRag ?? null);
                  }}
                  onDelete={() => {
                    setSessions(prev => prev.filter(s => s.id !== session.id));
                    if (session.id === activeSessionId) startNewSession();
                  }}
                />
              ))
            )}
          </div>

          <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs text-slate-600">Conforme RGPD</p>
          </div>
        </aside>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
            >
              <History size={16} />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Assistant RAG juridique</h2>
              <p className="text-xs text-slate-500">Réponses sourcées sur la jurisprudence française</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--muted)" }}>
              {(["strict", "exploratoire"] as RAGMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium capitalize transition-all",
                    mode === m ? "text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                  )}
                  style={mode === m ? { backgroundColor: "var(--primary)" } : {}}
                >
                  {m}
                </button>
              ))}
            </div>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors">
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {/* Welcome */}
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <div
                className="rounded-2xl p-6 mb-8 text-center"
                style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "rgba(99,102,241,0.15)" }}
                >
                  <Zap size={24} style={{ color: "#818cf8" }} />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">Assistant juridique IA</h3>
                <div className="text-sm text-slate-400 text-left space-y-2 mt-4">
                  {WELCOME_MESSAGE.split("\n").filter(Boolean).map((line, i) => (
                    <p key={i}>{line.replace(/\*\*([^*]+)\*\*/g, "$1")}</p>
                  ))}
                </div>
              </div>

              {/* Suggested questions */}
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Quelle est la jurisprudence sur le devoir de mise en garde des banques ?",
                  "Comment la Cour de cassation apprécie-t-elle le harcèlement moral ?",
                  "Quelles sont les conditions de la rupture brutale de relations commerciales ?",
                  "Quels sont les critères de la prestation compensatoire après divorce ?",
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInputValue(q); textareaRef.current?.focus(); }}
                    className="text-left px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-slate-200 border transition-all hover:border-blue-700 group"
                    style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
                  >
                    <span className="line-clamp-2">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat messages */}
          <div className="max-w-3xl mx-auto">
            {messages.map(msg => (
              <AssistantMessage
                key={msg.id}
                message={msg}
                onCitationClick={handleCitationClick}
                activeCitation={activeCitation}
              />
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
                  <Zap size={13} style={{ color: "#818cf8" }} />
                </div>
                <div
                  className="px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-3"
                  style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <Loader2 size={15} className="animate-spin text-blue-500" />
                  <span className="text-sm text-slate-400">Analyse de la jurisprudence en cours...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div
          className="flex-shrink-0 px-5 py-4 border-t"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="flex gap-3 items-end rounded-xl p-3 transition-all"
              style={{ backgroundColor: "var(--input)", border: "1px solid var(--border)" }}
            >
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question juridique... (Entrée pour envoyer, Maj+Entrée pour sauter une ligne)"
                rows={2}
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none leading-relaxed"
                disabled={loading}
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || loading}
                className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {loading
                  ? <Loader2 size={16} className="animate-spin text-white" />
                  : <Send size={16} className="text-white" />
                }
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2 text-center">
              Mode <strong className="text-slate-500">{mode}</strong> · Sources citées · Ne constitue pas un avis juridique
            </p>
          </div>
        </div>
      </div>

      {/* Citation panel */}
      {usedDocs.length > 0 && (
        <aside
          className="w-72 flex-shrink-0 border-l overflow-y-auto px-4 py-5"
          style={{ backgroundColor: "var(--sidebar)", borderColor: "var(--border)" }}
        >
          {lastAssistantMsg?.rag_response && (
            <CitationPanel
              documents={usedDocs}
              activeIndex={activeCitation ?? undefined}
              onCitationClick={handleCitationClick}
            />
          )}
        </aside>
      )}
    </div>
  );
}
