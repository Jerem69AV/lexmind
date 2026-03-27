/**
 * Système de clés API pour l'accès public au widget AVCA Legal.
 * Les clés sont stockées dans WIDGET_API_KEYS (env var JSON).
 * Format : avca_XXXXXXXXXXXXXXXXXXXXX
 */

export interface ApiKeyInfo {
  key: string;
  name: string;
  origin?: string; // domaine autorisé, ex: "avca-avocats.fr"
  rateLimit?: number; // requêtes/heure (défaut 100)
}

function loadApiKeys(): ApiKeyInfo[] {
  // Clé par défaut pour avca-avocats.fr
  const defaults: ApiKeyInfo[] = [
    {
      key: process.env.AVCA_WIDGET_API_KEY ?? "avca_public_avca_avocats_fr",
      name: "AVCA Legal Site Public",
      origin: "*",
      rateLimit: 200,
    },
  ];

  const raw = process.env.WIDGET_API_KEYS;
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as ApiKeyInfo[];
    return [...defaults, ...parsed];
  } catch {
    return defaults;
  }
}

export function validateApiKey(key: string | null): ApiKeyInfo | null {
  if (!key) return null;
  const keys = loadApiKeys();
  return keys.find(k => k.key === key) ?? null;
}

export function isValidApiKey(key: string | null): boolean {
  return validateApiKey(key) !== null;
}
