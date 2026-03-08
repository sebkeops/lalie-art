import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Découvrez les œuvres originales de Lalie — collages uniques autour de la musique, des visages et des histoires. Toutes les pièces sont faites main.",
  openGraph: {
    title: "Galerie — Lalie Art",
    description:
      "Découvrez les œuvres originales de Lalie — collages uniques autour de la musique, des visages et des histoires.",
    type: "website",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
