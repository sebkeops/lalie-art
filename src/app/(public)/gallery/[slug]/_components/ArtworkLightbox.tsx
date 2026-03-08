"use client";

import { useState } from "react";
import Image from "next/image";

export function ArtworkImageWithLightbox({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={900}
        className="artworkDetailImg"
        style={{ height: "auto" }}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
        onClick={() => {
          if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
            setIsOpen(true);
          }
        }}
      />

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="artworkLightbox">
          <Image
            src={src}
            alt={alt}
            width={1400}
            height={1400}
            className="artworkLightboxImg"
            style={{ width: "auto", height: "auto" }}
            sizes="100vw"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={() => setIsOpen(false)} className="artworkLightboxClose">
            Fermer
          </button>
        </div>
      )}
    </>
  );
}
