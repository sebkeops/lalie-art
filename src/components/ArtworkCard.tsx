"use client";

import Link from "next/link";

export type ArtworkCardData = {
    id: string;
    slug: string;
    title: string;
    status: "available" | "reserved" | "sold";
    price_on_request: boolean;
    price_eur: number | null;
    universe: string | null;
    subject: string | null;
    imageUrl?: string | null;
};

function formatPrice(a: ArtworkCardData) {
    if (a.price_on_request) return "Prix sur demande";
    if (typeof a.price_eur === "number") return `${a.price_eur} €`;
    return "—";
}

function statusLabel(status: ArtworkCardData["status"]) {
    if (status === "available") return "Disponible";
    if (status === "reserved") return "Réservé";
    return "Vendu";
}

function statusClasses(status: ArtworkCardData["status"]) {
    const base =
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border backdrop-blur shrink-0";
    if (status === "available")
        return `${base} border-emerald-300/30 bg-emerald-500/10 text-emerald-100`;
    if (status === "reserved")
        return `${base} border-amber-300/30 bg-amber-500/10 text-amber-100`;
    return `${base} border-white/20 bg-white/10 text-white/80`;
}

export function ArtworkCard({
    artwork,
    hrefBase = "/gallery",
}: {
    artwork: ArtworkCardData;
    hrefBase?: string;
}) {
    const meta = [artwork.universe, artwork.subject].filter(Boolean).join(" · ");
    const href = `${hrefBase}/${artwork.slug}`;

    return (
        <Link href={href} className="block h-full">
            <article className="group artworkCardShell">
                <div className="relative overflow-hidden bg-black">
                    <div className="artworkMediaInner">
                        {artwork.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={artwork.imageUrl}
                                alt={artwork.title}
                                className="artworkCardImg"
                                loading="lazy"
                                draggable={false}
                            />
                        ) : (
                            <div className="artworkCardImg artworkCardPlaceholder" />
                        )}
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                </div>

                {/* Body */}
                <div className="artworkCardBody">
                    <div className="grid gap-2 min-w-0">
                        <h3 className="text-base font-semibold text-white/95 leading-snug">
                            {artwork.title}
                        </h3>

                        <div className="flex items-center gap-2 min-w-0">
                            <span className={statusClasses(artwork.status)}>
                                {statusLabel(artwork.status)}
                            </span>

                            {meta ? (
                                <span className="text-sm text-white/65 truncate min-w-0 flex-1">
                                    {meta}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* Footer aligné + séparateur */}
                    <div className="artworkCardFooter">
                        <div className="text-base font-semibold text-white/90 truncate min-w-0">
                            {formatPrice(artwork)}
                        </div>

                        <span className="text-sm text-white/70 inline-flex items-center gap-1 shrink-0">
                            Voir <span aria-hidden>→</span>
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}