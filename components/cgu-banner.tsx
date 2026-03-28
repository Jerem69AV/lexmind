"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, X } from "lucide-react";

export function CguBanner() {
  const [accepted, setAccepted] = useState(true); // true par défaut pour éviter le flash SSR

  useEffect(() => {
    const stored = localStorage.getItem("cgu_accepted");
    if (!stored) setAccepted(false);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cgu_accepted", "1");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-lg rounded-2xl p-6 shadow-2xl"
        style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--primary)" }}>
            <Scale size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--foreground)" }}>
              AVCA Legal — Agent de recherche juridique
            </h2>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Conditions d&apos;utilisation
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="text-sm mb-5 space-y-3" style={{ color: "var(--muted-foreground)" }}>
          <p>
            Avant d&apos;utiliser cet outil, vous devez accepter nos{" "}
            <Link href="/cgu" target="_blank" className="underline font-medium" style={{ color: "var(--primary)" }}>
              Conditions Générales d&apos;Utilisation
            </Link>.
          </p>
          <div className="p-3 rounded-lg border-l-4 text-xs" style={{ borderColor: "var(--primary)", backgroundColor: "rgba(201,162,39,0.07)", color: "var(--foreground)" }}>
            <strong>Important :</strong> Cet outil fournit des informations juridiques à titre documentaire uniquement.
            Les résultats générés par l&apos;intelligence artificielle <strong>ne constituent pas une consultation juridique</strong> et ne remplacent pas l&apos;avis d&apos;un avocat.
            AVCA Legal décline toute responsabilité quant aux décisions prises sur la base des informations obtenues.
          </div>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            En cliquant sur « J&apos;accepte », vous confirmez avoir lu et accepté les{" "}
            <Link href="/cgu" target="_blank" className="underline" style={{ color: "var(--primary)" }}>CGU</Link>,
            les{" "}
            <Link href="/mentions-legales" target="_blank" className="underline" style={{ color: "var(--primary)" }}>Mentions légales</Link>{" "}
            et la{" "}
            <Link href="/rgpd" target="_blank" className="underline" style={{ color: "var(--primary)" }}>politique RGPD</Link>.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ backgroundColor: "var(--primary)" }}
          >
            J&apos;accepte les CGU
          </button>
          <a
            href="https://avca-avocats.fr"
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center border transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--muted-foreground)", backgroundColor: "var(--background)" }}
          >
            Refuser et quitter
          </a>
        </div>
      </div>
    </div>
  );
}
