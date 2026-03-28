"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function DecisionError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[/research/[id]] Erreur:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center max-w-md">
        <AlertTriangle size={32} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-slate-200 mb-2">
          Impossible de charger la décision
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          {error.message || "Une erreur inattendue s'est produite."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={unstable_retry}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Réessayer
          </button>
          <Link
            href="/research"
            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200 border"
            style={{ borderColor: "var(--border)" }}
          >
            Retour à la recherche
          </Link>
        </div>
      </div>
    </div>
  );
}
