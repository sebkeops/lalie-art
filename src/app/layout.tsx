import type { Metadata } from "next";
import "./globals.css";
import { HashScroll } from "@/components/HashScroll";


export const metadata: Metadata = {
  title: "Lalie — Collagiste | Crea Lalie Art",
  description: "Galerie d’œuvres originales de collage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <HashScroll />
      </body>
    </html>
  );
}