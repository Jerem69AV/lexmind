import Link from "next/link";
import { Scale, Search, MessageSquare, FileText, Shield, ArrowRight, BookOpen, Zap, Database, Lock } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Recherche multi-sources",
    description: "Interrogez simultanément Judilibre (Cour de cassation, Conseil d'État) et Légifrance avec filtres avancés par juridiction, chambre, date et solution.",
    color: "text-blue-500",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    icon: MessageSquare,
    title: "Assistant RAG juridique",
    description: "Posez vos questions en langage naturel. L'IA synthétise les décisions pertinentes et cite ses sources avec des références vérifiables.",
    color: "text-indigo-500",
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.2)",
  },
  {
    icon: FileText,
    title: "Citations traçables",
    description: "Chaque réponse de l'assistant est accompagnée des décisions sources avec ECLI, chambre, date et extraits pertinents pour vérification immédiate.",
    color: "text-violet-500",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: BookOpen,
    title: "Exports professionnels",
    description: "Exportez vos recherches et synthèses en PDF structuré, DOCX éditable ou CSV pour traitement de données. Idéal pour les mémoires et conclusions.",
    color: "text-emerald-600",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    icon: Lock,
    title: "Authentification & Organisations",
    description: "Créez votre compte, invitez votre équipe, gérez les accès par rôle. Conformité RGPD garantie, aucune donnée client partagée.",
    color: "text-amber-600",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: Shield,
    title: "Conformité RGPD",
    description: "Hébergement en France, données chiffrées, logs d'audit, export et suppression des données sur demande. Adapté aux cabinets d'avocats et directions juridiques.",
    color: "text-teal-600",
    bg: "rgba(20,184,166,0.08)",
    border: "rgba(20,184,166,0.2)",
  },
];

const stats = [
  { value: "117k+", label: "Décisions indexées", sublabel: "Cour de cassation" },
  { value: "3", label: "Sources primaires", sublabel: "Judilibre, Légifrance, ECLI" },
  { value: "< 100ms", label: "Temps de recherche", sublabel: "Requêtes optimisées" },
  { value: "RGPD", label: "Conforme", sublabel: "Hébergement France" },
];

const recentDecisions = [
  {
    title: "Responsabilité bancaire — Devoir de mise en garde",
    date: "15 jan. 2024",
    juridiction: "Cass. com.",
    query: "responsabilité bancaire devoir mise en garde",
  },
  {
    title: "Redressement judiciaire — Procédure collective",
    date: "22 mars 2023",
    juridiction: "Cass. com.",
    query: "redressement judiciaire procédure collective",
  },
  {
    title: "Cryptoactifs — Qualification et régime juridique",
    date: "8 nov. 2023",
    juridiction: "Cass. com.",
    query: "cryptoactifs bitcoin qualification juridique",
  },
];

export default function HomePage() {
  return (
    <div className="flex-1" style={{ backgroundColor: "var(--background)" }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,162,39,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(201,162,39,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border"
            style={{ backgroundColor: "rgba(201,162,39,0.1)", borderColor: "rgba(201,162,39,0.35)", color: "#b8881f" }}>
            <Zap size={14} />
            Cabinet d&apos;avocats Asta-Vola Cannard &amp; Associés
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight" style={{ color: "var(--foreground)" }}>
            AVCA Legal
            <br />
            <span className="gradient-text">Agent de recherche juridique</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Interrogez 117 000+ décisions de jurisprudence française en langage naturel.
            L&apos;assistant IA cite ses sources, vous pouvez vérifier chaque référence.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/research"
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold text-white shadow-lg hover:brightness-110 transition-all"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Search size={18} />
              Rechercher la jurisprudence
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/assistant"
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold border transition-colors"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
            >
              <MessageSquare size={18} />
              Essayer l&apos;assistant IA
            </Link>
          </div>

          {/* Recent decisions preview */}
          <div
            className="max-w-2xl mx-auto rounded-xl p-4 text-left border"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
              <Database size={11} />
              Décisions récentes indexées
            </p>
            <div className="space-y-2">
              {recentDecisions.map((d, i) => (
                <Link
                  key={i}
                  href={`/research?query=${encodeURIComponent(d.query)}`}
                  className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity"
                >
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-mono font-medium flex-shrink-0"
                    style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "#b8881f" }}
                  >
                    {d.juridiction}
                  </span>
                  <span className="flex-1 truncate" style={{ color: "var(--foreground)" }}>{d.title}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: "var(--muted-foreground)" }}>{d.date}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-12 border-y"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: "var(--primary)" }}>{stat.value}</div>
                <div className="text-sm font-medium mb-0.5" style={{ color: "var(--foreground)" }}>{stat.label}</div>
                <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
              Tout ce dont les juristes ont besoin
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
              AVCA Legal Agent combine recherche plein texte haute performance et intelligence artificielle
              pour accélérer votre travail juridique.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl p-6 border card-hover"
                  style={{ backgroundColor: "var(--card)", borderColor: feature.border }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: feature.bg, border: `1px solid ${feature.border}` }}
                  >
                    <Icon size={20} className={feature.color} />
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="py-16 px-4 border-t"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12" style={{ color: "var(--foreground)" }}>Comment ça fonctionne</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Posez votre question",
                desc: "En langage naturel ou avec des termes juridiques précis. Utilisez les filtres pour cibler la juridiction et la période.",
              },
              {
                step: "02",
                title: "L'IA analyse les sources",
                desc: "Notre moteur RAG identifie les décisions les plus pertinentes et synthétise les positions jurisprudentielles.",
              },
              {
                step: "03",
                title: "Vérifiez et exportez",
                desc: "Consultez chaque décision source, vérifiez les citations, et exportez votre recherche en PDF, DOCX ou CSV.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-4xl font-black mb-4"
                  style={{ color: "rgba(201,162,39,0.5)" }}
                >
                  {step.step}
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: "var(--foreground)" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Scale size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--foreground)" }}>
            Prêt à accélérer votre recherche juridique ?
          </h2>
          <p className="mb-8" style={{ color: "var(--muted-foreground)" }}>
            Accédez immédiatement à la base de jurisprudence française.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/research"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white hover:brightness-110 transition-all"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Rechercher la jurisprudence
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/research"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold border transition-colors"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)", color: "var(--foreground)" }}
            >
              Essayer sans compte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
