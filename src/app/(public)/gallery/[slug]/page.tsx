"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import Link from "next/link";
import SmoothAnchor from "@/components/SmoothAnchor";

type Artwork = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    year: number | null;
    width_cm: number | null;
    height_cm: number | null;
    technique: string | null;
    universe: string | null;
    subject: string | null;
    status: "available" | "reserved" | "sold";
    price_on_request: boolean;
    price_eur: number | null;
};

type Img = { path: string; position: number; alt: string | null };

export default function ArtworkPage() {
    const params = useParams<{ slug: string }>();
    const slug = params?.slug;

    const [loading, setLoading] = useState(true);
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [images, setImages] = useState<Img[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!slug) return;

        (async () => {
            setLoading(true);
            setErrorMsg(null);

            const { data: a, error: aErr } = await supabase
                .from("artworks")
                .select(
                    "id,title,slug,description,year,width_cm,height_cm,technique,universe,subject,status,price_on_request,price_eur"
                )
                .eq("slug", slug)
                .maybeSingle();

            if (aErr) {
                console.error(aErr);
                setErrorMsg(aErr.message);
                setLoading(false);
                return;
            }

            if (!a) {
                setErrorMsg(`Aucune œuvre trouvée pour le slug: ${slug}`);
                setLoading(false);
                return;
            }

            setArtwork(a as Artwork);

            const { data: imgs, error: iErr } = await supabase
                .from("artwork_images")
                .select("path,position,alt")
                .eq("artwork_id", (a as any).id)
                .order("position", { ascending: true });

            if (iErr) console.error(iErr);
            setImages((imgs ?? []) as Img[]);
            setLoading(false);
        })();
    }, [slug]);

    if (loading) return <main className="container artworkDetailPage">Chargement…</main>;

    if (!artwork) {
        return (
            <main className="container artworkDetailPage">
                <p>Œuvre introuvable.</p>
                {errorMsg && <pre style={{ marginTop: 12, opacity: 0.8 }}>{errorMsg}</pre>}
                <p style={{ marginTop: 12 }}>
                    <Link href="/gallery" className="artworkDetailBackBtn">
                        <svg
                            className="artworkDetailBackIcon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Retour galerie</span>
                    </Link>
                </p>
            </main>
        );
    }

    const mainImg = images[0]?.path ? getPublicImageUrl(images[0].path) : null;
    const statusLabel =
        artwork.status === "available"
            ? "Disponible"
            : artwork.status === "reserved"
                ? "Réservé"
                : "Vendu";

    const isAvailable = artwork.status === "available";

    const ctaLabel = isAvailable ? "Acheter" : "Contacter";

    const showPrice = isAvailable && (artwork.price_on_request || artwork.price_eur != null);

    const priceLabel = artwork.price_on_request
        ? "Prix sur demande"
        : artwork.price_eur != null
            ? new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
            }).format(artwork.price_eur)
            : null;

    return (
        <main className="container artworkDetailPage">
            <Link href="/gallery" className="artworkDetailBackBtn">
                        <svg
                            className="artworkDetailBackIcon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                        </svg>
                        <span>Retour galerie</span>
                    </Link>

            <div className="artworkDetailLayout">
                <div className="artworkDetailImageWrap">
                    {mainImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={mainImg}
                            alt={artwork.title}
                            className="artworkDetailImg"
                            onClick={() => {
                                if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
                                    setIsOpen(true);
                                }
                            }}
                        />
                    ) : (
                        <div className="artworkDetailNoImage">Aucune image</div>
                    )}
                </div>

                <aside className="artworkDetailPanel">
                    <h1 className="artworkDetailTitle">{artwork.title}</h1>

                    <div className="artworkDetailMeta">
                        <div className="artworkDetailMetaRow">
                            <span className="artworkDetailMetaLabel">Statut</span>
                            <span className="artworkDetailMetaValue">{statusLabel}</span>
                        </div>

                        {artwork.year ? (
                            <div className="artworkDetailMetaRow">
                                <span className="artworkDetailMetaLabel">Année</span>
                                <span className="artworkDetailMetaValue">{artwork.year}</span>
                            </div>
                        ) : null}

                        {artwork.width_cm && artwork.height_cm ? (
                            <div className="artworkDetailMetaRow">
                                <span className="artworkDetailMetaLabel">Format</span>
                                <span className="artworkDetailMetaValue">
                                    {artwork.width_cm} × {artwork.height_cm} cm
                                </span>
                            </div>
                        ) : null}

                        {artwork.technique ? (
                            <div className="artworkDetailMetaRow">
                                <span className="artworkDetailMetaLabel">Technique</span>
                                <span className="artworkDetailMetaValue">{artwork.technique}</span>
                            </div>
                        ) : null}

                        {artwork.universe ? (
                            <div className="artworkDetailMetaRow">
                                <span className="artworkDetailMetaLabel">Univers</span>
                                <span className="artworkDetailMetaValue">{artwork.universe}</span>
                            </div>
                        ) : null}

                        {artwork.subject ? (
                            <div className="artworkDetailMetaRow">
                                <span className="artworkDetailMetaLabel">Sujet</span>
                                <span className="artworkDetailMetaValue">{artwork.subject}</span>
                            </div>
                        ) : null}
                    </div>

                    {showPrice && priceLabel ? (
                        <div className="artworkDetailPriceRow">
                            <span className="artworkDetailPriceLabel">Prix</span>
                            <span className="artworkDetailPriceValue">{priceLabel}</span>
                        </div>
                    ) : null}

                    <hr className="artworkDetailDivider" />

                    {artwork.description ? (
                        <p className="artworkDetailDescription">{artwork.description}</p>
                    ) : null}

                    <SmoothAnchor
                        targetId="footer-contact"
                        offset={0}
                        className={[
                            "artworkDetailCTA",
                            isAvailable ? "artworkDetailCTA--buy" : "artworkDetailCTA--contact",
                        ].join(" ")}
                    >
                        {ctaLabel}
                    </SmoothAnchor>
                </aside>
            </div>

            {isOpen && mainImg && (
                <div onClick={() => setIsOpen(false)} className="artworkLightbox">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={mainImg}
                        alt={artwork.title}
                        className="artworkLightboxImg"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={() => setIsOpen(false)} className="artworkLightboxClose">
                        Fermer
                    </button>
                </div>
            )}
        </main>
    );
}