import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de l'Agent de recherche juridique AVCA Legal",
};

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
        Mentions légales
      </h1>
      <p className="text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>
        En vigueur au 1er janvier 2025
      </p>

      <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>1. Éditeur du site</h2>
          <p>Le présent service numérique « AVCA Legal — Agent de recherche juridique » (ci-après « le Service ») est édité par :</p>
          <div className="mt-3 p-4 rounded-lg border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p><strong>Cabinet Asta-Vola Cannard &amp; Associés (AVCA Legal)</strong></p>
            <p>Cabinet d'avocats inscrit au Barreau de Thonon-les-Bains</p>
            <p className="mt-2">Siège social : Thonon-les-Bains (74200), France</p>
            <p>Email de contact : <a href="mailto:contact@avca-avocats.fr" className="underline" style={{ color: "var(--primary)" }}>contact@avca-avocats.fr</a></p>
            <p className="mt-2">Directeur de la publication : Maître Asta-Vola Cannard</p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>2. Hébergement</h2>
          <p>Le Service est hébergé par :</p>
          <div className="mt-3 p-4 rounded-lg border" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <p><strong>Vercel Inc.</strong></p>
            <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
            <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>vercel.com</a></p>
          </div>
          <p className="mt-3" style={{ color: "var(--muted-foreground)" }}>
            Les données de jurisprudence sont issues de l'API <strong>Judilibre</strong>, service officiel de la Cour de cassation, publiées sous <strong>Licence Ouverte Etalab 2.0</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments constituant le Service (structure, design, code source, textes, logos, à l'exception des données jurisprudentielles issues de sources publiques) est la propriété exclusive du cabinet AVCA Legal et est protégé par les dispositions du Code de la propriété intellectuelle.
          </p>
          <p className="mt-3">
            Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du Service, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable du cabinet AVCA Legal.
          </p>
          <p className="mt-3">
            Les décisions de justice reproduites sont issues de bases de données publiques (Judilibre / Légifrance) et demeurent dans le domaine public conformément à l'article L. 111-13 du Code de l'organisation judiciaire.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>4. Limitation de responsabilité</h2>
          <p>
            Le cabinet AVCA Legal s'efforce de fournir des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour des informations, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
          </p>
          <p className="mt-3">
            <strong>Les contenus générés par l'intelligence artificielle intégrée au Service constituent des synthèses à titre informatif uniquement et ne constituent en aucun cas des consultations juridiques ou des conseils juridiques au sens de la loi du 31 décembre 1971.</strong> L'utilisateur demeure seul responsable de l'usage qu'il fait des informations obtenues.
          </p>
          <p className="mt-3">
            Le cabinet AVCA Legal ne saurait être tenu responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au Service, ni des dommages résultant de l'utilisation ou de l'interprétation des informations fournies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>5. Données personnelles</h2>
          <p>
            Le Service ne collecte pas de données personnelles identifiables sans consentement explicite. Les requêtes de recherche peuvent être enregistrées à des fins d'amélioration du service et ne sont pas associées à une identité personnelle.
          </p>
          <p className="mt-3">
            Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez : <a href="mailto:contact@avca-avocats.fr" className="underline" style={{ color: "var(--primary)" }}>contact@avca-avocats.fr</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>6. Cookies</h2>
          <p>
            Le Service utilise des cookies techniques strictement nécessaires à son fonctionnement (gestion de la session, préférences d'affichage). Aucun cookie publicitaire ou de traçage tiers n'est déposé. Le consentement de l'utilisateur n'est pas requis pour ces cookies conformément à l'article 82 de la loi Informatique et Libertés.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--primary)" }}>7. Droit applicable</h2>
          <p>
            Le présent Service et ses mentions légales sont régis par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

      </div>
    </div>
  );
}
