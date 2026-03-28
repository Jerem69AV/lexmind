import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation",
  description: "CGU de l'Agent de recherche juridique AVCA Legal",
};

export default function CguPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        Conditions Générales d&apos;Utilisation
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>
        Version en vigueur au 28 mars 2026
      </p>

      <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du service numérique « AVCA Legal — Agent de recherche juridique » (ci-après « le Service »), édité par le cabinet Asta-Vola Cannard &amp; Associés (ci-après « AVCA Legal »).
          </p>
          <p className="mt-3">
            Le Service est un outil d'aide à la recherche jurisprudentielle utilisant des technologies d'intelligence artificielle. Il permet d'interroger des bases de données de décisions de justice françaises issues de sources officielles publiques (Judilibre, Légifrance).
          </p>
          <p className="mt-3 p-3 rounded-lg border-l-4 font-medium" style={{ borderColor: "var(--primary)", backgroundColor: "rgba(201,162,39,0.08)", color: "var(--foreground)" }}>
            ⚠️ Le Service ne constitue pas un service de consultation juridique. Les résultats générés ne remplacent en aucun cas l'avis d'un avocat ou d'un juriste qualifié.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>2. Acceptation des CGU</h2>
          <p>
            L'accès au Service, qu'il soit direct (via le site web) ou intégré (via le widget iframe), implique l'acceptation pleine et entière des présentes CGU par l'utilisateur. Si l'utilisateur n'accepte pas ces conditions, il lui appartient de renoncer à l'utilisation du Service.
          </p>
          <p className="mt-3">
            AVCA Legal se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le Service. L'utilisation continue du Service après modification vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>3. Description du Service</h2>
          <p>Le Service propose les fonctionnalités suivantes :</p>
          <ul className="mt-3 space-y-2 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li><strong style={{ color: "var(--foreground)" }}>Recherche jurisprudentielle</strong> : interrogation de la base de données Judilibre (Cour de cassation) par mots-clés, filtres par chambre, date et solution ;</li>
            <li><strong style={{ color: "var(--foreground)" }}>Assistant IA</strong> : synthèse en langage naturel de décisions pertinentes par un modèle de langage (LLM), avec citation des sources ;</li>
            <li><strong style={{ color: "var(--foreground)" }}>Widget intégrable</strong> : accès simplifié au moteur de recherche depuis des sites tiers ;</li>
            <li><strong style={{ color: "var(--foreground)" }}>Consultation de décisions</strong> : affichage du texte intégral des décisions issues des bases publiques.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>4. Accès au Service</h2>
          <p>
            Le Service est accessible gratuitement à tout utilisateur disposant d'un accès à internet. AVCA Legal ne saurait être tenu responsable de l'impossibilité d'accéder au Service en raison de problèmes techniques, de maintenance ou d'indisponibilité des sources de données tierces.
          </p>
          <p className="mt-3">
            AVCA Legal se réserve le droit de suspendre ou limiter l'accès au Service, notamment en cas d'utilisation abusive, de sollicitations excessives (scraping automatisé) ou d'atteinte aux droits de tiers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>5. Absence de consultation juridique — Limitation essentielle</h2>
          <div className="p-4 rounded-lg border" style={{ backgroundColor: "rgba(201,162,39,0.06)", borderColor: "rgba(201,162,39,0.3)" }}>
            <p className="font-semibold mb-2" style={{ color: "var(--foreground)" }}>Avertissement important :</p>
            <ul className="space-y-2 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
              <li>Les résultats de recherche et les réponses générées par l'intelligence artificielle ont une valeur purement <strong style={{ color: "var(--foreground)" }}>informative et documentaire</strong>.</li>
              <li>Ils ne constituent pas une <strong style={{ color: "var(--foreground)" }}>consultation juridique</strong> au sens de la loi n° 71-1130 du 31 décembre 1971 portant réforme de certaines professions judiciaires et juridiques.</li>
              <li>L'IA peut produire des résultats <strong style={{ color: "var(--foreground)" }}>inexacts, incomplets ou obsolètes</strong>. L'utilisateur doit impérativement vérifier toute information avant de l'utiliser dans un contexte professionnel ou judiciaire.</li>
              <li>AVCA Legal <strong style={{ color: "var(--foreground)" }}>décline toute responsabilité</strong> quant aux décisions prises par l'utilisateur sur la base des informations obtenues via le Service.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>6. Obligations de l'utilisateur</h2>
          <p>L'utilisateur s'engage à :</p>
          <ul className="mt-3 space-y-2 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li>Utiliser le Service conformément aux lois et règlements en vigueur ;</li>
            <li>Ne pas utiliser le Service à des fins illicites, frauduleuses ou contraires à l'ordre public ;</li>
            <li>Ne pas tenter de reproduire, extraire ou aspirer automatiquement les données du Service (scraping) ;</li>
            <li>Ne pas usurper l'identité d'un tiers ou d'un professionnel du droit ;</li>
            <li>Ne pas diffuser les résultats du Service en les présentant comme des consultations juridiques officielles ;</li>
            <li>Signaler tout dysfonctionnement ou contenu inexact à AVCA Legal.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>7. Sources des données</h2>
          <p>
            Les décisions de justice reproduites dans le Service proviennent exclusivement de sources officielles et publiques :
          </p>
          <ul className="mt-3 space-y-2 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li><strong style={{ color: "var(--foreground)" }}>Judilibre</strong> : API officielle de la Cour de cassation, publiée sous Licence Ouverte Etalab 2.0. Données pseudonymisées conformément à l'article L. 111-13 du Code de l'organisation judiciaire et au décret n° 2020-797 du 29 juin 2020 ;</li>
            <li><strong style={{ color: "var(--foreground)" }}>Légifrance</strong> : portail officiel du droit français, données publiques mises à disposition par la DILA.</li>
          </ul>
          <p className="mt-3">
            AVCA Legal ne garantit pas l'exhaustivité ni la mise à jour en temps réel de ces données, dont la responsabilité incombe aux fournisseurs officiels.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>8. Intelligence artificielle — Fonctionnement et limites</h2>
          <p>
            Le Service intègre des modèles de langage (LLM) pour la synthèse et l'analyse documentaire. Ces modèles peuvent générer des « hallucinations » (informations erronées présentées avec assurance). L'utilisateur est informé de ce risque inhérent aux technologies d'IA et s'engage à :
          </p>
          <ul className="mt-3 space-y-2 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li>Vérifier systématiquement les références citées par l'IA avant toute utilisation professionnelle ;</li>
            <li>Consulter les textes sources originaux accessibles via les liens fournis ;</li>
            <li>Ne pas se fier exclusivement aux synthèses générées sans vérification indépendante.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>9. Protection des données personnelles (RGPD)</h2>
          <p>
            Le traitement des données personnelles est effectué conformément au Règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée.
          </p>
          <p className="mt-3">
            <strong>L'acceptation des présentes CGU vaut acceptation des conditions de traitement des données personnelles</strong> telles que détaillées dans notre{" "}
            <a href="/rgpd" className="underline" style={{ color: "var(--primary)" }}>Politique de conformité RGPD</a>.
          </p>
          <p className="mt-3"><strong>Données collectées :</strong></p>
          <ul className="mt-1 space-y-1 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li>Requêtes de recherche saisies (transmises à l'API Judilibre, non stockées par AVCA Legal) ;</li>
            <li>Cookie de préférence d'affichage (thème clair/sombre), stocké localement dans le navigateur de l'utilisateur.</li>
          </ul>
          <p className="mt-3"><strong>Droits :</strong> Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et de portabilité. Exercice des droits : <a href="mailto:contact@avca-avocats.fr" className="underline" style={{ color: "var(--primary)" }}>contact@avca-avocats.fr</a>.</p>
          <p className="mt-3">Vous disposez également du droit d'introduire une réclamation auprès de la <strong>CNIL</strong> : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>www.cnil.fr</a>.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>10. Propriété intellectuelle</h2>
          <p>
            Le Service, son interface, son code source, ses algorithmes et ses contenus éditoriaux (à l'exclusion des données jurisprudentielles publiques) sont la propriété exclusive du cabinet AVCA Legal, protégés par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>11. Responsabilité</h2>
          <p>
            Dans les limites autorisées par la loi, AVCA Legal ne saurait être tenu responsable :
          </p>
          <ul className="mt-3 space-y-2 ml-4 list-disc" style={{ color: "var(--muted-foreground)" }}>
            <li>Des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Service ;</li>
            <li>De l'inexactitude, l'incomplétude ou le caractère obsolète des informations fournies ;</li>
            <li>Des décisions prises par l'utilisateur sur la base des résultats de recherche ou des synthèses de l'IA ;</li>
            <li>De l'interruption temporaire ou définitive du Service pour raisons techniques ou de maintenance.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>12. Droit applicable et juridiction compétente</h2>
          <p>
            Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution relèvera de la compétence exclusive des tribunaux du ressort du Barreau de Thonon-les-Bains, sauf disposition légale contraire.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>13. Contact</h2>
          <p>
            Pour toute question relative aux présentes CGU ou au Service :<br />
            📧 <a href="mailto:contact@avca-avocats.fr" className="underline" style={{ color: "var(--primary)" }}>contact@avca-avocats.fr</a><br />
            🌐 <a href="https://avca-avocats.fr" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>avca-avocats.fr</a>
          </p>
        </section>

      </div>
    </div>
  );
}
