import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LexMind Research — Recherche Juridique IA",
    template: "%s | LexMind Research",
  },
  description:
    "Plateforme française de recherche juridique augmentée par l'IA. Accédez à 500 000+ décisions, utilisez l'assistant RAG avec citations traçables et exportez en PDF/DOCX/CSV.",
  keywords: ["jurisprudence", "recherche juridique", "IA", "Judilibre", "Cour de cassation", "droit français"],
  authors: [{ name: "LexMind Research" }],
  creator: "LexMind Research",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "LexMind Research — Recherche Juridique IA",
    description: "Plateforme française de recherche juridique augmentée par l'IA",
    siteName: "LexMind Research",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navigation />
          <main className="flex-1 flex flex-col">{children}</main>
          <footer
            className="border-t py-6 mt-auto"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--sidebar)" }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p>
                © {new Date().getFullYear()} LexMind Research. Données issues de{" "}
                <a
                  href="https://www.judilibre.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-200 underline"
                >
                  Judilibre
                </a>{" "}
                et Légifrance.
              </p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Conforme RGPD
                </span>
                <span>Mentions légales</span>
                <span>CGU</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
