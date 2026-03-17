import { createClient } from "@/lib/supabase/server";
import { ArtworkCard } from "@/components/ArtworkCard";

type Artwork = {
  id: string;
  title: string;
  slug: string;
  year: number | null;
  status: "available" | "reserved" | "sold" | "private";
  universe: string | null;
  subject: string | null;
  price_on_request: boolean;
  price_eur: number | null;
};

type Img = {
  artwork_id: string;
  path: string;
  position: number;
};

function buildImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artworks/${path}`;
}

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: artworks } = await supabase
    .from("artworks")
    .select("id,title,slug,year,status,universe,subject,price_on_request,price_eur")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const list = (artworks ?? []) as Artwork[];

  const ids = list.map((a) => a.id);
  let imgByArtwork: Record<string, string> = {};

  if (ids.length) {
    const { data: imgs } = await supabase
      .from("artwork_images")
      .select("artwork_id,path,position")
      .in("artwork_id", ids)
      .order("position", { ascending: true });

    for (const im of (imgs ?? []) as Img[]) {
      if (!imgByArtwork[im.artwork_id]) {
        imgByArtwork[im.artwork_id] = buildImageUrl(im.path);
      }
    }
  }

  return (
    <main className="pageMain">
      <section className="container" aria-label="Galerie d'œuvres" style={{ display: "grid", gap: 18 }}>
        <div className="card" style={{ padding: 20 }}>
          <h1 className="h1">Galerie</h1>
          <p className="muted" style={{ margin: "10px 0 0", maxWidth: 820, lineHeight: 1.7 }}>
            Œuvres publiées. Cliquez sur une œuvre pour voir le détail.
          </p>
        </div>

        {list.length === 0 ? (
          <div className="card" style={{ padding: 18 }}>
            <div className="muted">Aucune œuvre publiée pour le moment.</div>
          </div>
        ) : (
          <>
            <h2 className="sr-only">Liste des œuvres</h2>
            <div className="galleryGrid">
              {list.map((a, idx) => (
                <ArtworkCard
                  key={a.id}
                  hrefBase="/gallery"
                  priority={idx < 3}
                  artwork={{
                    id: a.id,
                    slug: a.slug,
                    title: a.title,
                    status: a.status,
                    universe: a.universe,
                    subject: a.subject,
                    price_on_request: a.price_on_request,
                    price_eur: a.price_eur,
                    imageUrl: imgByArtwork[a.id] ?? null,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
