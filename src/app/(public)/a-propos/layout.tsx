import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Lalie est artiste collagiste basée à Nîmes. Elle assemble images, couleurs et émotions pour faire vibrer la musique, les visages et les histoires qui l'inspirent. Chaque œuvre est une pièce unique, réalisée à la main.",
  openGraph: {
    title: "À propos — Lalie Art",
    description:
      "Lalie est artiste collagiste basée à Nîmes. Chaque œuvre est une pièce unique, réalisée à la main.",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
