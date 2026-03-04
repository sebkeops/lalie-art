import type { Metadata } from "next";
import "./globals.css";
import HashScrollSuspense from "@/components/HashScrollSuspense";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Lalie — Collagiste | Crea Lalie Art",
  description: "Galerie d’œuvres originales de collage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/hry1sbn.css" />
      </head>
      <body>
        {children}
        <ScrollToTop />
        <HashScrollSuspense />
      </body>
    </html>
  );
}