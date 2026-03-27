"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, Building2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    if (email && password) {
      router.push("/dashboard");
    } else {
      setError("Veuillez renseigner votre email et mot de passe.");
    }
    setLoading(false);
  };

  const handleSSO = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push("/dashboard");
  };

  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-16"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 60%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Scale size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-white">Lex</span>
              <span style={{ color: "var(--primary)" }}>Mind</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Connexion</h1>
          <p className="text-slate-400 text-sm">Accédez à votre espace de recherche juridique</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* SSO button */}
          <button
            onClick={handleSSO}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-all mb-6 disabled:opacity-60"
            style={{ borderColor: "var(--border)", backgroundColor: "rgba(30,41,59,0.5)" }}
          >
            <Building2 size={17} />
            Connexion SSO (SAML/OIDC)
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
            <span className="text-xs text-slate-500">ou par email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--border)" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-400 border border-red-900/50"
                style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="email">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="avocat@cabinet.fr"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "var(--input)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: "var(--input)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="accent-blue-500 rounded" />
                Se souvenir de moi
              </label>
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-60 mt-2"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Connexion en cours...</>
                : <><ArrowRight size={16} /> Se connecter</>
              }
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
