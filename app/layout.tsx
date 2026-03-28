import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { ConditionalFooter } from "@/components/conditional-footer";
import { CguBanner } from "@/components/cgu-banner";
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
    default: "AVCA Legal — Agent de recherche juridique",
    template: "%s | AVCA Legal",
  },
  description:
    "Agent de recherche juridique IA du cabinet AVCA Legal. Accédez à 500 000+ décisions, utilisez l'assistant RAG avec citations traçables et exportez en PDF/DOCX/CSV.",
  keywords: ["jurisprudence", "recherche juridique", "IA", "Judilibre", "Cour de cassation", "droit français", "AVCA Legal"],
  authors: [{ name: "AVCA Legal" }],
  creator: "AVCA Legal",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "AVCA Legal — Agent de recherche juridique",
    description: "Agent de recherche juridique IA — Cabinet AVCA Legal",
    siteName: "AVCA Legal",
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
        <Providers>
          <CguBanner />
          <Navigation />
          <main className="flex-1 flex flex-col">{children}</main>
          <ConditionalFooter>
            <footer
              className="border-t py-6 mt-auto"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--sidebar)" }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                <p>
                  © {new Date().getFullYear()} AVCA Legal. Données issues de{" "}
                  <a
                    href="https://www.judilibre.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline" style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    Judilibre
                  </a>{" "}
                  et Légifrance.
                </p>
                <div className="flex items-center gap-4">
                  <Link href="/rgpd" className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                    Conformité RGPD
                  </Link>
                  <Link href="/mentions-legales" className="text-white/60 hover:text-white transition-colors">Mentions légales</Link>
                  <Link href="/cgu" className="text-white/60 hover:text-white transition-colors">CGU</Link>
                </div>
              </div>
            </footer>
          </ConditionalFooter>
        </Providers>
      </body>
    </html>
  );
}
