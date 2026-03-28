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
    "Cassation": "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
    "Cassation partielle": "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
    "Rejet": "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
    "Non-lieu à renvoi": "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    "Annulation": "bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
    "Irrecevabilité": "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700/60 dark:text-gray-300 dark:border-gray-600",
    "Désistement": "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700/60 dark:text-gray-300 dark:border-gray-600",
  };
  return map[solution] ?? "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700/60 dark:text-gray-300 dark:border-gray-600";
}

export function publicationColor(publication: string): string {
  const map: Record<string, string> = {
    "Bulletin": "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
    "Bulletin et Rapport annuel": "bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800",
    "Inédit": "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700/60 dark:text-gray-400 dark:border-gray-600",
    "Non publié au bulletin": "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700/60 dark:text-gray-400 dark:border-gray-600",
    "BICC": "bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
  };
  return map[publication] ?? "bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-700/60 dark:text-gray-400 dark:border-gray-600";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
