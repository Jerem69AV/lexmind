// ─── Core Legal Document Types ───────────────────────────────────────────────

export type Juridiction =
  | "Cour de cassation"
  | "Conseil d'État"
  | "Cour d'appel"
  | "Tribunal judiciaire"
  | "Conseil constitutionnel"
  | "Cour administrative d'appel"
  | "Conseil de prud'hommes";

export type Chambre =
  | "Chambre civile 1"
  | "Chambre civile 2"
  | "Chambre civile 3"
  | "Chambre commerciale"
  | "Chambre sociale"
  | "Chambre criminelle"
  | "Assemblée plénière"
  | "Chambre mixte"
  | "Section du contentieux"
  | "Section du conseil"
  | string;

export type Solution =
  | "Cassation"
  | "Rejet"
  | "Cassation partielle"
  | "Non-lieu à renvoi"
  | "Annulation"
  | "Irrecevabilité"
  | "Désistement";

export type Publication =
  | "Bulletin"
  | "Bulletin et Rapport annuel"
  | "Inédit"
  | "Non publié au bulletin"
  | "BICC";

export interface LegalDocument {
  id: string;
  ecli: string;
  title: string;
  juridiction: Juridiction;
  chambre: Chambre;
  numero: string;
  date: string; // ISO date string
  solution: Solution;
  publication: Publication;
  sommaire: string;
  texte: string;
  visa: string[];
  renvois: Renvoi[];
  themes: string[];
  source: "judilibre" | "legifrance" | "doctrine";
  score?: number; // relevance score for search results
}

export interface Renvoi {
  type: "cassation" | "appel" | "citation";
  texte: string;
  id?: string;
}

// ─── Search Types ─────────────────────────────────────────────────────────────

export type SearchSource = "judilibre" | "legifrance" | "mock" | "all";

export interface SearchFilters {
  juridiction?: Juridiction | "";
  chambre?: string;
  date_from?: string;
  date_to?: string;
  solution?: Solution | "";
  publication?: Publication | "";
  themes?: string[];
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
  per_page?: number;
  sort?: "pertinence" | "date_desc" | "date_asc";
}

export interface SearchResult {
  documents: LegalDocumentSummary[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  query_time_ms: number;
}

export interface LegalDocumentSummary {
  id: string;
  ecli: string;
  title: string;
  juridiction: Juridiction;
  chambre: Chambre;
  numero: string;
  date: string;
  solution: Solution;
  publication: Publication;
  sommaire: string;
  snippet: string;
  highlight?: SnippetHighlight[];
  themes: string[];
  score?: number;
}

export interface SnippetHighlight {
  text: string;
  highlighted: boolean;
}

// ─── RAG Types ────────────────────────────────────────────────────────────────

export type RAGMode = "strict" | "exploratoire";

export interface RAGRequest {
  question: string;
  mode?: RAGMode;
  history?: ChatMessage[];
  filters?: SearchFilters;
}

export interface RAGResponse {
  question: string;
  mode: RAGMode;
  synthese: string;
  sections: RAGSection[];
  used_documents: UsedDocument[];
  citations: Citation[];
  confidence: number; // 0-1
  disclaimer: string;
  response_time_ms: number;
}

export interface RAGSection {
  title: string;
  content: string; // may contain [1], [2] citation markers
  citations: number[]; // indices into used_documents
}

export interface Citation {
  index: number;
  document_id: string;
  ecli: string;
  title: string;
  juridiction: Juridiction;
  date: string;
  excerpt: string;
  relevance: number;
}

export interface UsedDocument {
  index: number;
  id: string;
  ecli: string;
  title: string;
  juridiction: Juridiction;
  chambre: Chambre;
  date: string;
  solution: Solution;
  excerpt: string;
  relevance_score: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  rag_response?: RAGResponse;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  mode: RAGMode;
}

// ─── Auth & User Types ────────────────────────────────────────────────────────

export type UserRole = "admin" | "member" | "viewer";
export type SubscriptionTier = "free" | "pro" | "enterprise";

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  organization_id?: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  language: "fr" | "en";
  default_juridiction?: Juridiction;
  notifications_email: boolean;
}

export interface Organization {
  id: string;
  nom: string;
  type: "cabinet" | "entreprise" | "institution" | "universite";
  subscription: SubscriptionTier;
  members_count: number;
  max_members: number;
  quota_searches_monthly: number;
  quota_rag_monthly: number;
  used_searches: number;
  used_rag: number;
  created_at: string;
}

// ─── Saved Items ──────────────────────────────────────────────────────────────

export interface SavedDecision {
  id: string;
  user_id: string;
  document_id: string;
  document: LegalDocumentSummary;
  note?: string;
  tags: string[];
  saved_at: string;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  filters?: SearchFilters;
  result_count: number;
  searched_at: string;
}

// ─── Export Types ─────────────────────────────────────────────────────────────

export type ExportFormat = "pdf" | "docx" | "csv";

export interface ExportRequest {
  document_ids: string[];
  format: ExportFormat;
  include_full_text: boolean;
  include_metadata: boolean;
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────

export interface DashboardData {
  user: User;
  organization?: Organization;
  recent_searches: SearchHistory[];
  saved_decisions: SavedDecision[];
  recent_rag_sessions: ChatSession[];
  stats: DashboardStats;
}

export interface DashboardStats {
  searches_this_month: number;
  rag_queries_this_month: number;
  saved_decisions_count: number;
  documents_exported: number;
}
