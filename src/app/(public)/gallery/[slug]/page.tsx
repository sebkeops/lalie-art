import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import SmoothAnchor from "@/components/SmoothAnchor";
import { ArtworkImageWithLightbox } from "./_components/ArtworkLightbox";

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

function buildImageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artworks/${path}`;
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: a } = await supabase
    .from("artworks")
    .select(
      "id,title,slug,description,year,width_cm,height_cm,technique,universe,subject,status,price_on_request,price_eur"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!a) notFound();

  const artwork = a as Artwork;

  const { data: imgs } = await supabase
    .from("artwork_images")
    .select("path,position,alt")
    .eq("artwork_id", artwork.id)
    .order("position", { ascending: true });

  const images = (imgs ?? []) as Img[];
  const mainImg = images[0]?.path ? buildImageUrl(images[0].path) : null;

  const statusLabel =
    artwork.status === "available"
      ? "Disponible"
      : artwork.status === "reserved"
        ? "Réservé"
        : "Vendu";

  const statusBadgeClass =
    artwork.status === "available"
      ? "artworkStatusBadge artworkStatusAvailable"
      : artwork.status === "reserved"
        ? "artworkStatusBadge artworkStatusReserved"
        : "artworkStatusBadge artworkStatusSold";

  const isAvailable = artwork.status === "available";
  const ctaLabel = isAvailable ? "Acheter" : "Contacter";
  const showPrice = artwork.price_on_request || artwork.price_eur != null;
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
            <ArtworkImageWithLightbox src={mainImg} alt={`Collage de Lalie — ${artwork.title}`} />
          ) : (
            <div className="artworkDetailNoImage">Aucune image</div>
          )}
        </div>

        <aside className="artworkDetailPanel" aria-label="Informations sur l'œuvre">
          <h1 className="artworkDetailTitle">{artwork.title}</h1>

          <div className="artworkDetailMeta">
            <div className="artworkDetailMetaRow">
              <span className="artworkDetailMetaLabel">Statut</span>
              <span className={statusBadgeClass}>{statusLabel}</span>
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
            <div className={`artworkDetailPriceRow artworkDetailPriceRow--${artwork.status}`}>
              <span className="artworkDetailPriceLabel">Prix</span>
              <span className="artworkDetailPriceValue">{priceLabel}</span>
            </div>
          ) : null}

          <hr className="artworkDetailDivider" />

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

          {artwork.description ? (
            <p className="artworkDetailDescription">{artwork.description}</p>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
