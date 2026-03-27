import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AVCA Legal — Agent de recherche juridique",
  robots: { index: false, follow: false },
};

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  // Widget layout sans navigation ni footer global
  return <>{children}</>;
}
