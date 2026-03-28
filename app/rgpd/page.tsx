import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conformité RGPD",
  description: "Politique de protection des données personnelles — AVCA Legal",
};

export default function RgpdPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        Conformité RGPD
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>
        Politique de protection des données personnelles — Version en vigueur au 1er janvier 2025
      </p>

      <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>1. Responsable du traitement</h2>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p><strong>Cabinet Asta-Vola Cannard &amp; Associés (AVCA Legal)</strong></p>
            <p>Cabinet d'avocats au Barreau de Thonon-les-Bains</p>
            <p>Thonon-les-Bains (74200), France</p>
            <p className="mt-2">Responsable de traitement : <strong>Maître Jérémy ASTA-VOLA</strong></p>
            <p>Contact : <a href="mailto:contact@avca-avocats.fr" className="underline" style={{ color: "var(--primary)" }}>contact@avca-avocats.fr</a></p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>2. Données collectées</h2>
          <p>Le Service « AVCA Legal — Agent de recherche juridique » collecte les données suivantes :</p>

          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <p className="font-semibold mb-2">Requêtes de recherche</p>
              <ul className="space-y-1 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
                <li>Termes de recherche saisis (transmis à l'API Judilibre, non stockés par AVCA Legal)</li>
                <li>Filtres appliqués (juridiction, chambre, période) — transmis à l'API, non conservés</li>
              </ul>
              <p className="mt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <strong style={{ color: "var(--foreground)" }}>Base légale :</strong> Exécution du service demandé — Article 6(1)(b) RGPD
              </p>
            </div>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
              <p className="font-semibold mb-2">Préférences d'affichage</p>
              <ul className="space-y-1 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
                <li>Thème clair/sombre (stocké uniquement dans le navigateur de l'utilisateur via cookie technique local)</li>
              </ul>
              <p className="mt-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
                <strong style={{ color: "var(--foreground)" }}>Base légale :</strong> Cookie strictement nécessaire — exemption de consentement (article 82 loi Informatique et Libertés)
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg border-l-4 font-medium" style={{ borderColor: "var(--primary)", backgroundColor: "rgba(201,162,39,0.06)" }}>
            AVCA Legal <strong>ne collecte ni ne stocke directement</strong> aucune adresse IP ni aucun log de navigation. Aucun traçage ou profilage de l'utilisateur n'est effectué par AVCA Legal.
            En revanche, l'hébergeur Vercel Inc. collecte automatiquement les adresses IP dans ses logs serveur à des fins techniques et de sécurité, dans le cadre de l'exploitation de son infrastructure. Ce traitement relève de la responsabilité propre de Vercel et est encadré par ses propres conditions générales et sa politique de confidentialité, accessibles sur <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>vercel.com/legal/privacy-policy</a>.
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>3. Durée de conservation</h2>
          <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--muted)" }}>
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Catégorie de donnée</th>
                  <th className="text-left px-4 py-2 font-semibold">Durée de conservation</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "var(--card)" }}>
                {[
                  ["Requêtes de recherche", "Non stockées par AVCA Legal — transmises à l'API Judilibre en temps réel"],
                  ["Logs serveur Vercel (IP)", "30 jours max (sous-traitant Vercel, hors contrôle direct d'AVCA Legal)"],
                  ["Cookies de préférences (thème)", "12 mois dans le navigateur (ou suppression par l'utilisateur)"],
                ].map(([cat, dur], i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-2">{cat}</td>
                    <td className="px-4 py-2" style={{ color: "var(--muted-foreground)" }}>{dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>4. Destinataires des données</h2>
          <p>Les données collectées sont accessibles uniquement à :</p>
          <ul className="mt-3 space-y-2 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li>
              <strong style={{ color: "var(--foreground)" }}>AVCA Legal</strong> — responsable de traitement, administration du Service ;
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Vercel Inc.</strong> — hébergeur, collecte les logs serveur (dont IP) dans le cadre de son infrastructure. Certifié SOC 2 Type II. Transferts UE → États-Unis encadrés par les Clauses Contractuelles Types (CCT) de la Commission européenne et le Data Privacy Framework. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>Politique de confidentialité Vercel</a> ;
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Cour de cassation / DILA</strong> — fournisseurs de données publiques (Judilibre, Légifrance), aucune donnée utilisateur transmise au-delà des requêtes de recherche anonymes ;
            </li>
            <li>
              <strong style={{ color: "var(--foreground)" }}>Anthropic</strong> — sous-traitant IA pour l'assistant juridique, requêtes transmises sans identifiant personnel. Encadré par DPA Anthropic.
            </li>
          </ul>
          <p className="mt-3">
            Aucune donnée n'est vendue, louée ou cédée à des tiers à des fins commerciales.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>5. Transferts hors UE</h2>
          <p>
            Certains prestataires (Vercel, Anthropic) sont établis aux États-Unis. Ces transferts sont encadrés par les <strong>Clauses Contractuelles Types (CCT)</strong> adoptées par la Commission européenne, conformément à l'article 46 du RGPD, et/ou par le cadre de l'adéquation UE-États-Unis (Data Privacy Framework).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>6. Vos droits</h2>
          <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {[
              { droit: "Droit d'accès", desc: "Obtenir la confirmation que des données vous concernant sont traitées et en recevoir une copie." },
              { droit: "Droit de rectification", desc: "Faire corriger des données inexactes ou incomplètes vous concernant." },
              { droit: "Droit à l'effacement", desc: "Demander la suppression de vos données dans les cas prévus par le RGPD." },
              { droit: "Droit à la limitation", desc: "Demander la suspension temporaire du traitement de vos données." },
              { droit: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré et lisible par machine." },
              { droit: "Droit d'opposition", desc: "Vous opposer au traitement de vos données fondé sur l'intérêt légitime." },
            ].map(({ droit, desc }, i) => (
              <div key={i} className="p-3 rounded-lg border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
                <p className="font-semibold text-xs mb-1" style={{ color: "var(--primary)" }}>{droit}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4">
            Pour exercer vos droits, adressez votre demande à : <a href="mailto:contact@avca-avocats.fr" className="underline" style={{ color: "var(--primary)" }}>contact@avca-avocats.fr</a>.
          </p>
          <p className="mt-2">
            En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong> : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>www.cnil.fr</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>7. Cookies</h2>
          <p>Le Service utilise exclusivement des cookies techniques strictement nécessaires :</p>
          <div className="mt-3 overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--muted)" }}>
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Cookie</th>
                  <th className="text-left px-4 py-2 font-semibold">Finalité</th>
                  <th className="text-left px-4 py-2 font-semibold">Durée</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "var(--card)" }}>
                {[
                  ["theme", "Mémorisation du thème clair/sombre", "12 mois"],
                  ["__vercel_live_token", "Vérification technique Vercel", "Session"],
                ].map(([name, fin, dur], i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                    <td className="px-4 py-2 font-mono text-xs">{name}</td>
                    <td className="px-4 py-2" style={{ color: "var(--muted-foreground)" }}>{fin}</td>
                    <td className="px-4 py-2" style={{ color: "var(--muted-foreground)" }}>{dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3" style={{ color: "var(--muted-foreground)" }}>
            Aucun cookie publicitaire, de profilage ou de traçage tiers n'est utilisé. Aucun bandeau de consentement cookies n'est requis pour ces cookies techniques (article 82 de la loi Informatique et Libertés).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>8. Sécurité</h2>
          <p>
            AVCA Legal met en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données contre la perte, l'accès non autorisé, la divulgation ou l'altération, conformément à l'article 32 du RGPD :
          </p>
          <ul className="mt-3 space-y-1 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li>Chiffrement des communications (HTTPS / TLS 1.3) ;</li>
            <li>Aucun stockage de données personnelles côté serveur ;</li>
            <li>Hébergement sur infrastructure sécurisée (Vercel, certifié SOC 2 Type II).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>9. Mise à jour de la politique</h2>
          <p>
            La présente politique peut être modifiée à tout moment pour refléter les évolutions légales ou techniques. La date de mise à jour est indiquée en en-tête. L'utilisation continue du Service après modification vaut acceptation de la nouvelle politique.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>10. Contact</h2>
          <p>
            Pour toute question relative à la protection de vos données :<br />
            📧 <a href="mailto:contact@avca-avocats.fr" className="underline" style={{ color: "var(--primary)" }}>contact@avca-avocats.fr</a><br />
            🌐 <a href="https://avca-avocats.fr" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>avca-avocats.fr</a>
          </p>
        </section>

      </div>
    </div>
  );
}
