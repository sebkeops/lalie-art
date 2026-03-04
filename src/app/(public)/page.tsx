"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { ArtworkCard } from "@/components/ArtworkCard";
import SmoothAnchor from "@/components/SmoothAnchor";


type FeaturedArtwork = {
  id: string;
  title: string;
  slug: string;
  universe: string | null;
  subject: string | null;
  status: "available" | "reserved" | "sold";
  price_on_request: boolean;
  price_eur: number | null;
  img_path: string | null;
};

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FeaturedArtwork[]>([]);

  const heroLines = useMemo(
    () => ({
      title: "Collages vibrants.\nMusique, visages, histoires.",
      sub:
        "Une galerie intense, pensée comme une scène : matières, couleurs et émotion.\nŒuvres originales — pièces uniques.",
    }),
    []
  );

  useEffect(() => {
    // Intercept scroll-to-contact : depuis un lien inter-pages (sessionStorage)
    // ou depuis une URL directe avec #contact (HashScroll scrollerait trop tôt).
    const fromLink = sessionStorage.getItem("goToContact") === "1";
    const fromHash = window.location.hash === "#contact";
    const needsContactScroll = fromLink || fromHash;
    if (fromLink) sessionStorage.removeItem("goToContact");
    if (fromHash) history.replaceState(null, "", window.location.pathname);

    (async () => {
      setLoading(true);

      // 1) oeuvres featured publiées
      const { data: arts, error } = await supabase
        .from("artworks")
        .select("id,title,slug,universe,subject,status,price_on_request,price_eur")
        .eq("is_featured", true)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        console.error(error);
        setItems([]);
        setLoading(false);
        return;
      }

      const rows = (arts ?? []) as Omit<FeaturedArtwork, "img_path">[];

      // 2) image 1 par oeuvre
      const ids = rows.map((r) => r.id);
      if (ids.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: imgs } = await supabase
        .from("artwork_images")
        .select("artwork_id,path")
        .in("artwork_id", ids)
        .order("position", { ascending: true });

      const map = new Map<string, string>();
      (imgs ?? []).forEach((x: any) => {
        if (!map.has(x.artwork_id)) map.set(x.artwork_id, x.path);
      });

      const merged: FeaturedArtwork[] = rows.map((r) => ({
        ...r,
        img_path: map.get(r.id) ?? null,
      }));

      setItems(merged);
      setLoading(false);

      if (needsContactScroll) {
        setTimeout(() => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    })();
  }, []);

  return (
    <main className="homeMain">
      {/* HERO */}
      <section className="hero">
        <div className="container homeHeroInner">
          <motion.h1
            className="h1"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05, ease: "easeOut" }}
            style={{ whiteSpace: "pre-line" }}
          >
            {heroLines.title}
          </motion.h1>

          <motion.p
            className="muted"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
            style={{ maxWidth: 760, lineHeight: 1.7, margin: 0 }}
          >
            {heroLines.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="homeHeroCtas"
          >
            <Link className="btn btn-primary" href="/gallery">
              Explorer la galerie →
            </Link>
            <SmoothAnchor className="btn" targetId="contact" offset={110}>
              Contact
            </SmoothAnchor>
          </motion.div>

          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="homeHeroLight"
          />
        </div>
      </section>

      {/* FLOW WRAP (to avoid background "cut") */}
      <section className="homeFlow">
        <div className="container homeFlowInner">
          {/* ABOUT (excerpt) */}
          <motion.section
            className="card homeAboutCard"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="kicker">Lalie — Artiste collagiste</div>
            <h2 className="h2" style={{ marginTop: 10 }}>
              À propos
            </h2>
            <p className="muted" style={{ marginTop: 10, lineHeight: 1.8, maxWidth: 920 }}>
              J’assemble images, couleurs et émotions pour faire vibrer la musique, les visages et les histoires
              qui m’inspirent. Chaque œuvre est une pièce unique, réalisée à la main.
            </p>

            <div className="homeAboutActions">
              <Link className="btn" href="/a-propos">
                Lire la suite →
              </Link>
              <Link className="btn btn-primary" href="/gallery">
                Voir la galerie
              </Link>
            </div>
          </motion.section>

          {/* FEATURED */}
          <section className="homeFeatured">
            <div className="homeFeaturedHeader">
              <div>
                <h2 className="h2">Œuvres à la une</h2>
                <div className="muted" style={{ maxWidth: 720, marginTop: 8 }}>
                  Une sélection d’œuvres publiées. Cliquez pour voir le détail et contacter.
                </div>
              </div>

              <Link href="/gallery" className="btn">
                Voir tout
              </Link>
            </div>

            {loading ? (
              <div className="card" style={{ padding: 18 }}>
                Chargement…
              </div>
            ) : items.length === 0 ? (
              <div className="card" style={{ padding: 18 }}>
                Aucune œuvre "à la une" pour le moment. (Coche "À la une" + "Publié" dans l’admin)
              </div>
            ) : (
              <div className="homeFeaturedGrid">
                {items.map((a, idx) => {
                  const imgUrl = a.img_path
                    ? supabase.storage.from("artworks").getPublicUrl(a.img_path).data.publicUrl
                    : null;

                  return (
                    <motion.div
                      key={a.id}
                      className="h-full"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(idx * 0.06, 0.24),
                        ease: "easeOut",
                      }}
                    >
                      <ArtworkCard
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
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* CONTACT */}
          <motion.section
            id="contact"
            className="homeContact"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="kicker">Une œuvre vous intéresse ?</div>
            <h2 className="h2">Prenons contact</h2>
            <p className="muted" style={{ maxWidth: 520 }}>
              Pour toute demande d’achat, de renseignement ou de commande sur mesure.
            </p>
            <div className="homeContactLinks">
              <a href="mailto:crea.lalie.art@gmail.com" className="btn btn-primary">
                crea.lalie.art@gmail.com
              </a>
              <a href="tel:+33673883144" className="btn">
                +33 6 73 88 31 44
              </a>
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
}