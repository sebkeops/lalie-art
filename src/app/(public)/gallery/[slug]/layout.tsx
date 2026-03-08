import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await createClient();

    const { data: artwork } = await supabase
      .from("artworks")
      .select("title, description, universe, subject")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (!artwork) {
      return { title: "Œuvre introuvable" };
    }

    const meta = [artwork.universe, artwork.subject].filter(Boolean).join(" · ");
    const description = artwork.description
      ? artwork.description.slice(0, 155)
      : meta
      ? `${artwork.title} — ${meta}. Collage original de Lalie Art.`
      : `${artwork.title} — Collage original, pièce unique de Lalie Art.`;

    return {
      title: artwork.title,
      description,
      openGraph: {
        title: `${artwork.title} | Lalie Art`,
        description,
        type: "website",
      },
    };
  } catch {
    return { title: slug };
  }
}

export default function ArtworkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
