import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BASE_URL = "https://lalie-art.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Lalie — Collagiste | Crea Lalie Art",
    template: "%s | Lalie Art",
  },
  description:
    "Galerie d'œuvres originales de collage par Lalie — artiste collagiste. Musique, visages, histoires en pièces uniques faites main.",
  openGraph: {
    siteName: "Lalie Art",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="publicSite">
      <Header />
      {children}
      <Footer />
    </div>
  );
}