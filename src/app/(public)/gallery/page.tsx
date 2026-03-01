
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { ArtworkCard } from "@/components/ArtworkCard";

type Artwork = {
  id: string;
  title: string;
  slug: string;
  year: number | null;
  status: "available" | "reserved" | "sold";
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


export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Artwork[]>([]);
  const [imgByArtwork, setImgByArtwork] = useState<Record<string, string>>({});

  const hero = useMemo(
    () => ({
      title: "Galerie",
      sub: "Œuvres publiées. Cliquez sur une œuvre pour voir le détail.",
    }),
    []
  );

  useEffect(() => {
    (async () => {
      setLoading(true);

      // œuvres publiées
      const { data: artworks, error: aErr } = await supabase
        .from("artworks")
        .select("id,title,slug,year,status,universe,subject,price_on_request,price_eur")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (aErr) {
        console.error(aErr);
        setItems([]);
        setImgByArtwork({});
        setLoading(false);
        return;
      }

      const list = (artworks ?? []) as Artwork[];
      setItems(list);

      // images principales (position 0 / première image)
      const ids = list.map((a) => a.id);
      if (ids.length) {
        const { data: imgs, error: iErr } = await supabase
          .from("artwork_images")
          .select("artwork_id,path,position")
          .in("artwork_id", ids)
          .order("position", { ascending: true });

        if (!iErr && imgs) {
          const map: Record<string, string> = {};
          for (const im of imgs as Img[]) {
            if (!map[im.artwork_id]) map[im.artwork_id] = getPublicImageUrl(im.path);
          }
          setImgByArtwork(map);
        }
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="card" style={{ padding: 18 }}>
            Chargement…
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "60px 0" }}>
      <section className="container" style={{ display: "grid", gap: 18 }}>
        {/* Header */}
        <div className="card" style={{ padding: 20 }}>
          <h1 className="h1">{hero.title}</h1>
          <p className="muted" style={{ margin: "10px 0 0", maxWidth: 820, lineHeight: 1.7 }}>
            {hero.sub}
          </p>
        </div>

        {/* Empty */}
        {items.length === 0 ? (
          <div className="card" style={{ padding: 18 }}>
            <div className="muted">Aucune œuvre publiée pour le moment.</div>
          </div>
        ) : (
          <div className="galleryGrid">
            {items.map((a) => {
              const imgUrl = imgByArtwork[a.id] ?? null;

              return (
                <ArtworkCard
                  key={a.id}
                  hrefBase="/gallery"
                  artwork={{
                    id: a.id,
                    slug: a.slug,
                    title: a.title,
                    status: a.status,
                    universe: a.universe,
                    subject: a.subject,
                    price_on_request: a.price_on_request,
                    price_eur: a.price_eur,
                    imageUrl: imgUrl,
                  }}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}