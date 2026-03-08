import { createClient } from "@/lib/supabase/server";
import { ContactScrollEffect } from "./_components/ContactScrollEffect";
import {
  HomeHero,
  HomeAboutCard,
  HomeFeatured,
  HomeContact,
} from "./_components/HomeAnimatedSections";
import type { ArtworkCardData } from "@/components/ArtworkCard";

type FeaturedArtwork = {
  id: string;
  title: string;
  slug: string;
  universe: string | null;
  subject: string | null;
  status: "available" | "reserved" | "sold";
  price_on_request: boolean;
  price_eur: number | null;
};

type Img = { artwork_id: string; path: string };

function buildImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artworks/${path}`;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: arts } = await supabase
    .from("artworks")
    .select("id,title,slug,universe,subject,status,price_on_request,price_eur")
    .eq("is_featured", true)
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const rows = (arts ?? []) as FeaturedArtwork[];
  const ids = rows.map((r) => r.id);

  let imgMap = new Map<string, string>();
  if (ids.length) {
    const { data: imgs } = await supabase
      .from("artwork_images")
      .select("artwork_id,path")
      .in("artwork_id", ids)
      .order("position", { ascending: true });

    for (const x of (imgs ?? []) as Img[]) {
      if (!imgMap.has(x.artwork_id)) imgMap.set(x.artwork_id, buildImageUrl(x.path));
    }
  }

  const artworks: ArtworkCardData[] = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    status: r.status,
    universe: r.universe,
    subject: r.subject,
    price_on_request: r.price_on_request,
    price_eur: r.price_eur,
    imageUrl: imgMap.get(r.id) ?? null,
  }));

  return (
    <main className="homeMain">
      <ContactScrollEffect />
      <HomeHero />

      <section className="homeFlow">
        <div className="container homeFlowInner">
          <HomeAboutCard />
          <HomeFeatured artworks={artworks} />
          <HomeContact />
        </div>
      </section>
    </main>
  );
}
