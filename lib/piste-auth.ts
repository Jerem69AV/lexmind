/**
 * Gestionnaire d'authentification OAuth2 pour l'API PISTE
 * (Plateforme d'Intermédiation des Services Technologiques de l'État)
 *
 * PISTE utilise le flux "client_credentials" (OAuth2).
 * Documentation : https://piste.gouv.fr/
 * Les tokens expirent toutes les heures ; on les met en cache en mémoire.
 */

const PISTE_TOKEN_URL = "https://oauth.piste.gouv.fr/api/oauth/token";

interface TokenCache {
  access_token: string;
  expires_at: number; // timestamp ms
}

// Cache en mémoire (par process Node.js). En production, préférer Redis.
let tokenCache: TokenCache | null = null;

/**
 * Récupère un access token PISTE valide.
 * Renouvelle automatiquement si expiré ou absent.
 */
export async function getPisteToken(): Promise<string> {
  const now = Date.now();
  const margin = 60_000; // renouveler 60s avant expiration

  if (tokenCache && tokenCache.expires_at - margin > now) {
    return tokenCache.access_token;
  }

  const clientId = process.env.PISTE_CLIENT_ID;
  const clientSecret = process.env.PISTE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Variables PISTE_CLIENT_ID et PISTE_CLIENT_SECRET manquantes. " +
      "Copiez .env.local.example vers .env.local et renseignez vos clés PISTE."
    );
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "openid",
  });

  const response = await fetch(PISTE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    // Token endpoint : pas de cache navigateur pertinent ici
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Échec authentification PISTE (${response.status}): ${text}`
    );
  }

  const data = await response.json() as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  tokenCache = {
    access_token: data.access_token,
    expires_at: now + data.expires_in * 1000,
  };

  return tokenCache.access_token;
}

/**
 * Invalide le cache du token (utile après une erreur 401).
 */
export function invalidatePisteToken(): void {
  tokenCache = null;
}

/**
 * Retourne true si les credentials PISTE sont configurés.
 */
export function isPisteConfigured(): boolean {
  return !!(process.env.PISTE_CLIENT_ID && process.env.PISTE_CLIENT_SECRET);
}

/**
 * Retourne le mode de données actif.
 * "live" | "mock" | "hybrid"
 */
export function getDataMode(): "live" | "mock" | "hybrid" {
  const mode = process.env.DATA_MODE as string | undefined;
  if (mode === "live" || mode === "mock" || mode === "hybrid") return mode;
  // Par défaut : hybrid (API réelle + fallback mock)
  return isPisteConfigured() ? "hybrid" : "mock";
}
