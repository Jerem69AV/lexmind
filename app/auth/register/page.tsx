"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Eye, EyeOff, Mail, Lock, User, Building2, Loader2, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const PASSWORD_RULES = [
  { label: "Au moins 8 caractères", test: (p: string) => p.length >= 8 },
  { label: "Une lettre majuscule", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un chiffre", test: (p: string) => /\d/.test(p) },
  { label: "Un caractère spécial", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

const ORG_TYPES = [
  { value: "cabinet", label: "Cabinet d'avocats" },
  { value: "entreprise", label: "Direction juridique" },
  { value: "institution", label: "Institution publique" },
  { value: "universite", label: "Université / Recherche" },
  { value: "individuel", label: "Particulier / Indépendant" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgName: "",
    orgType: "",
    acceptTerms: false,
    acceptRGPD: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: keyof typeof formData, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis";
    if (!formData.nom.trim()) newErrors.nom = "Nom requis";
    if (!formData.email.includes("@")) newErrors.email = "Email invalide";
    if (formData.password.length < 8) newErrors.password = "Mot de passe trop court";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms || !formData.acceptRGPD) {
      setErrors({ terms: "Vous devez accepter les CGU et la politique RGPD." });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    router.push("/dashboard");
  };

  const inputClass = "w-full px-10 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all";
  const inputStyle = { backgroundColor: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)" };

  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-12"
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
          <h1 className="text-2xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-slate-400 text-sm">Commencez à rechercher gratuitement</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6 px-2">
          {[1, 2].map(s => (
            <div key={s} className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  )}
                  style={{
                    backgroundColor: step >= s ? "var(--primary)" : "var(--muted)",
                    color: step >= s ? "white" : "var(--muted-foreground)",
                  }}
                >
                  {step > s ? <Check size={13} /> : s}
                </div>
                <span className={cn("text-xs font-medium", step >= s ? "text-slate-300" : "text-slate-600")}>
                  {s === 1 ? "Compte" : "Organisation"}
                </span>
              </div>
              {s === 1 && (
                <div
                  className="h-0.5 rounded-full"
                  style={{ backgroundColor: step >= 2 ? "var(--primary)" : "var(--border)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
        >
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Prénom</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={e => update("prenom", e.target.value)}
                      placeholder="Marie"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  {errors.prenom && <p className="text-xs text-red-400 mt-1">{errors.prenom}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Nom</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={e => update("nom", e.target.value)}
                      placeholder="Dupont"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  {errors.nom && <p className="text-xs text-red-400 mt-1">{errors.nom}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Adresse email professionnelle</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => update("email", e.target.value)}
                    placeholder="m.dupont@cabinet.fr"
                    className={inputClass}
                    style={inputStyle}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={e => update("password", e.target.value)}
                    placeholder="••••••••••••"
                    className={cn(inputClass, "pr-11")}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {/* Password strength */}
                {formData.password && (
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    {PASSWORD_RULES.map(rule => (
                      <div key={rule.label} className="flex items-center gap-1.5 text-xs">
                        <div className={cn("w-1.5 h-1.5 rounded-full", rule.test(formData.password) ? "bg-green-500" : "bg-slate-600")} />
                        <span className={rule.test(formData.password) ? "text-slate-400" : "text-slate-600"}>{rule.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => update("confirmPassword", e.target.value)}
                    placeholder="••••••••••••"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white mt-2 hover:brightness-110 transition-all"
                style={{ backgroundColor: "var(--primary)" }}
              >
                Continuer
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Nom de votre organisation <span className="text-slate-600">(optionnel)</span>
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={formData.orgName}
                    onChange={e => update("orgName", e.target.value)}
                    placeholder="Cabinet Dupont & Associés"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Type d&apos;organisation</label>
                <select
                  value={formData.orgType}
                  onChange={e => update("orgType", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                  style={inputStyle}
                >
                  <option value="">Sélectionnez...</option>
                  {ORG_TYPES.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {errors.terms && (
                <div className="text-xs text-red-400 px-3 py-2 rounded-lg border border-red-900/50"
                  style={{ backgroundColor: "rgba(239,68,68,0.08)" }}>
                  {errors.terms}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={e => update("acceptTerms", e.target.checked)}
                    className="accent-blue-500 mt-0.5"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    J&apos;accepte les{" "}
                    <a href="#" className="text-blue-400 hover:underline">conditions générales d&apos;utilisation</a>
                    {" "}et la{" "}
                    <a href="#" className="text-blue-400 hover:underline">politique de confidentialité</a>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.acceptRGPD}
                    onChange={e => update("acceptRGPD", e.target.checked)}
                    className="accent-blue-500 mt-0.5"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    Je confirme avoir lu la{" "}
                    <a href="#" className="text-blue-400 hover:underline">notice RGPD</a>
                    {" "}et consens au traitement de mes données personnelles à des fins de recherche juridique.
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 border transition-colors"
                  style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white hover:brightness-110 transition-all disabled:opacity-60"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Création...</>
                    : <><Check size={15} /> Créer le compte</>
                  }
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
