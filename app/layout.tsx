import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navigation } from "@/components/navigation";
import { ConditionalFooter } from "@/components/conditional-footer";
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
          <Navigation />
          <main className="flex-1 flex flex-col">{children}</main>
          <ConditionalFooter>
            <footer
              className="border-t py-6 mt-auto"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--sidebar)" }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <p>
                  © {new Date().getFullYear()} AVCA Legal. Données issues de{" "}
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
                  <Link href="/rgpd" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Conformité RGPD
                  </Link>
                  <Link href="/mentions-legales" className="hover:text-slate-300 transition-colors">Mentions légales</Link>
                  <Link href="/cgu" className="hover:text-slate-300 transition-colors">CGU</Link>
                </div>
              </div>
            </footer>
          </ConditionalFooter>
        </Providers>
      </body>
    </html>
  );
}
