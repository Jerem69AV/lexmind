"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Search, MessageSquare, LayoutDashboard, LogIn, UserPlus, Menu, X, Moon, Sun, Code2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/research", label: "Recherche", icon: Search },
  { href: "/assistant", label: "Assistant IA", icon: MessageSquare },
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/embed", label: "Widget", icon: Code2 },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Masquer la navigation sur les pages widget et embed intégré
  if (pathname.startsWith("/widget")) return null;

  // Pas de navigation sur le widget intégrable
  if (pathname.startsWith("/widget")) return null;
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header
      style={{ backgroundColor: "var(--sidebar)", borderBottom: "1px solid var(--border)" }}
      className="sticky top-0 z-50 w-full backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              style={{ backgroundColor: "var(--primary)" }}
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform"
            >
              <Scale size={18} style={{ color: "var(--primary-foreground)" }} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">AVCA</span>
              <span style={{ color: "var(--primary)" }}> Legal</span>
            </span>
            <span
              style={{ backgroundColor: "rgba(201,162,39,0.15)", color: "var(--primary)", border: "1px solid rgba(201,162,39,0.3)" }}
              className="hidden sm:inline text-xs px-1.5 py-0.5 rounded font-medium"
            >
              Agent IA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                  style={active ? { backgroundColor: "rgba(201,162,39,0.15)", color: "#e8c96a" } : {}}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
              aria-label="Changer le thème"
            >
              {mounted ? (resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />) : <Moon size={16} />}
            </button>

            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <LogIn size={14} />
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition-all hover:brightness-110"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <UserPlus size={14} />
                S&apos;inscrire
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{ backgroundColor: "var(--sidebar)", borderTop: "1px solid var(--border)" }}
          className="md:hidden px-4 py-3 space-y-1"
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active ? "text-amber-300" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
                style={active ? { backgroundColor: "rgba(201,162,39,0.12)" } : {}}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-2 border-t" style={{ borderColor: "var(--border)" }}>
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5"
            >
              <LogIn size={15} /> Connexion
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <UserPlus size={15} /> S&apos;inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
