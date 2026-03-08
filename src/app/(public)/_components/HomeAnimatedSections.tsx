"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SmoothAnchor from "@/components/SmoothAnchor";
import { ArtworkCard } from "@/components/ArtworkCard";
import type { ArtworkCardData } from "@/components/ArtworkCard";

export function HomeHero() {
  return (
    <section className="hero">
      <div className="container homeHeroInner">
        <motion.h1
          className="h1"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05, ease: "easeOut" }}
          style={{ whiteSpace: "pre-line" }}
        >
          {"Collages vibrants.\nMusique, visages, histoires."}
        </motion.h1>

        <motion.p
          className="muted"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          style={{ maxWidth: 760, lineHeight: 1.7, margin: 0 }}
        >
          {"Une galerie intense, pensée comme une scène : matières, couleurs et émotion.\nŒuvres originales — pièces uniques."}
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
  );
}

export function HomeAboutCard() {
  return (
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
        J'assemble images, couleurs et émotions pour faire vibrer la musique, les visages et les histoires
        qui m'inspirent. Chaque œuvre est une pièce unique, réalisée à la main.
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
  );
}

export function HomeFeatured({ artworks }: { artworks: ArtworkCardData[] }) {
  return (
    <section className="homeFeatured">
      <div className="homeFeaturedHeader">
        <div>
          <h2 className="h2">Œuvres à la une</h2>
          <div className="muted" style={{ maxWidth: 720, marginTop: 8 }}>
            Une sélection d'œuvres publiées. Cliquez pour voir le détail et contacter.
          </div>
        </div>
        <Link href="/gallery" className="btn">
          Voir tout
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="card" style={{ padding: 18 }}>
          Aucune œuvre "à la une" pour le moment.
        </div>
      ) : (
        <div className="homeFeaturedGrid">
          {artworks.map((a, idx) => (
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
              <ArtworkCard hrefBase="/gallery" artwork={a} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export function HomeContact() {
  return (
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
        Pour toute demande d'achat, de renseignement ou de commande sur mesure.
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
  );
}
