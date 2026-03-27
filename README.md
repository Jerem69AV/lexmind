# AVCA Legal — Agent de recherche juridique

Plateforme de recherche jurisprudentielle IA pour le cabinet **Asta-Vola Cannard & Associés (AVCA Legal)**.

## Fonctionnalités

- **Recherche jurisprudentielle** — Judilibre (Cour de cassation) + Légifrance (bientôt)
- **Assistant IA RAG** — Réponses avec citations traçables
- **Exports** — PDF, DOCX, CSV
- **Widget intégrable** — `<iframe>` pour avca-avocats.fr
- **Clés API** — Accès public contrôlé

## Lancement rapide

```bash
npm install
cp .env.local.example .env.local
# Renseigner PISTE_CLIENT_ID et PISTE_CLIENT_SECRET dans .env.local
npm run dev
```

## Pages

| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/research` | Recherche jurisprudentielle |
| `/assistant` | Assistant IA RAG |
| `/dashboard` | Tableau de bord |
| `/widget` | Widget intégrable (iframe) |
| `/embed` | Générateur de code d'intégration |

## Widget / Intégration

Le widget peut être intégré sur **avca-avocats.fr** via une simple balise `<iframe>` :

```html
<iframe
  src="https://your-app.vercel.app/widget?key=avca_public_avca_avocats_fr&theme=dark"
  width="400"
  height="600"
  style="border:none; border-radius:12px;"
  title="AVCA Legal — Recherche jurisprudentielle"
></iframe>
```

Visitez `/embed` pour générer le code avec vos paramètres.

## Sources de données

- **Judilibre** (Cour de cassation) — API officielle via PISTE, Licence Ouverte 2.0
- **Légifrance** — En attente d'accès DILA (contacter api-legifrance@dila.gouv.fr)

## Variables d'environnement

```env
PISTE_CLIENT_ID=xxx
PISTE_CLIENT_SECRET=xxx
PISTE_ENV=sandbox        # ou production
DATA_MODE=hybrid         # live | mock | hybrid
LEGIFRANCE_ENABLED=false # true une fois l'accès obtenu
AVCA_WIDGET_API_KEY=avca_public_avca_avocats_fr
```
