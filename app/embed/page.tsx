"use client";

import { useState } from "react";
import { Copy, Check, Code2, ExternalLink } from "lucide-react";

const DEFAULT_KEY = "avca_public_avca_avocats_fr";

export default function EmbedPage() {
  const [apiKey, setApiKey] = useState(DEFAULT_KEY);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [width, setWidth] = useState("400");
  const [height, setHeight] = useState("600");
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app";
  const widgetUrl = `${baseUrl}/widget?key=${apiKey}&theme=${theme}`;

  const iframeCode = `<!-- Widget AVCA Legal — Agent de recherche juridique -->
<iframe
  src="${widgetUrl}"
  width="${width}"
  height="${height}"
  style="border:none; border-radius:12px; box-shadow:0 4px 24px rgba(0,0,0,0.18);"
  title="AVCA Legal — Recherche jurisprudentielle"
  loading="lazy"
  allow="clipboard-read; clipboard-write"
></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Code2 size={20} style={{ color: "var(--primary)" }} />
            <h1 className="text-2xl font-bold text-white">Intégration Widget</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Intégrez l&apos;agent de recherche juridique AVCA Legal sur votre site web (ex : avca-avocats.fr)
            via une simple balise <code className="text-amber-300">&lt;iframe&gt;</code>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Config panel */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <h2 className="text-sm font-semibold text-slate-200 mb-4">Paramètres</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Clé API</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none font-mono"
                  style={{
                    backgroundColor: "var(--input)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                />
                <p className="text-xs text-slate-600 mt-1">
                  La clé par défaut permet un accès public depuis avca-avocats.fr.
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Thème</label>
                <div className="flex gap-2">
                  {(["dark", "light"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                      style={{
                        backgroundColor: theme === t ? "rgba(201,162,39,0.15)" : "var(--card)",
                        borderColor: theme === t ? "rgba(201,162,39,0.4)" : "var(--border)",
                        color: theme === t ? "#e8c96a" : "var(--muted-foreground)",
                      }}
                    >
                      {t === "dark" ? "Sombre" : "Clair"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Largeur (px)</label>
                  <input
                    type="text"
                    value={width}
                    onChange={e => setWidth(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                    style={{
                      backgroundColor: "var(--input)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hauteur (px)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs focus:outline-none"
                    style={{
                      backgroundColor: "var(--input)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>
            </div>

            <a
              href={widgetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-1.5 text-xs"
              style={{ color: "var(--primary)" }}
            >
              <ExternalLink size={12} />
              Aperçu du widget
            </a>
          </div>

          {/* Code panel */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-200">Code à intégrer</h2>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors"
                style={{
                  backgroundColor: copied ? "rgba(201,162,39,0.15)" : "var(--input)",
                  borderColor: copied ? "rgba(201,162,39,0.4)" : "var(--border)",
                  color: copied ? "#e8c96a" : "var(--muted-foreground)",
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>

            <pre
              className="text-xs leading-relaxed overflow-auto rounded-lg p-3 font-mono"
              style={{ backgroundColor: "rgba(0,0,0,0.3)", color: "#c8d6e8", maxHeight: "260px" }}
            >
              {iframeCode}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="mt-6 rounded-xl p-5 border"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Instructions pour avca-avocats.fr (Lovable.dev)</h2>
          <ol className="space-y-2 text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">1.</span>
              Dans l&apos;éditeur Lovable, ouvrez la page ou le composant où vous souhaitez intégrer le widget.
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">2.</span>
              Ajoutez un composant HTML personnalisé et collez le code <code className="text-amber-300">&lt;iframe&gt;</code> ci-dessus.
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">3.</span>
              Ajustez la largeur à <code className="text-amber-300">100%</code> pour une mise en page responsive.
            </li>
            <li className="flex gap-2">
              <span className="text-amber-400 font-bold">4.</span>
              Le widget fonctionnera automatiquement avec la clé API publique fournie.
            </li>
          </ol>
          <div
            className="mt-4 p-3 rounded-lg text-xs"
            style={{ backgroundColor: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)", color: "#e8c96a" }}
          >
            <strong>Exemple responsive pour Lovable :</strong>
            <pre className="mt-1 font-mono text-xs opacity-90">
              {`<div style="width:100%; max-width:480px;">\n  ${iframeCode.split('\n')[1].trim()}\n  width="100%"\n  ...\n</div>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
