import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + "...";
}

export function solutionColor(solution: string): string {
  const map: Record<string, string> = {
    "Cassation": "bg-red-900/40 text-red-300 border border-red-800",
    "Cassation partielle": "bg-orange-900/40 text-orange-300 border border-orange-800",
    "Rejet": "bg-green-900/40 text-green-300 border border-green-800",
    "Non-lieu à renvoi": "bg-blue-900/40 text-blue-300 border border-blue-800",
    "Annulation": "bg-purple-900/40 text-purple-300 border border-purple-800",
    "Irrecevabilité": "bg-gray-700/60 text-gray-300 border border-gray-600",
    "Désistement": "bg-gray-700/60 text-gray-300 border border-gray-600",
  };
  return map[solution] ?? "bg-gray-700/60 text-gray-300 border border-gray-600";
}

export function publicationColor(publication: string): string {
  const map: Record<string, string> = {
    "Bulletin": "bg-blue-900/40 text-blue-300 border border-blue-800",
    "Bulletin et Rapport annuel": "bg-indigo-900/40 text-indigo-300 border border-indigo-800",
    "Inédit": "bg-gray-700/60 text-gray-400 border border-gray-600",
    "Non publié au bulletin": "bg-gray-700/60 text-gray-400 border border-gray-600",
    "BICC": "bg-teal-900/40 text-teal-300 border border-teal-800",
  };
  return map[publication] ?? "bg-gray-700/60 text-gray-400 border border-gray-600";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
