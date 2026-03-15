"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export function ArtworkImageWithLightbox({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();

      // Piège focus : Tab cycle entre les éléments du dialog
      if (e.key === "Tab") {
        e.preventDefault();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        ref={triggerRef}
        className="artworkDetailImgBtn"
        aria-label={`Agrandir l'image : ${alt}`}
        onClick={() => {
          if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
            setIsOpen(true);
          }
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={900}
          className="artworkDetailImg"
          style={{ height: "auto" }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image agrandie : ${alt}`}
          className="artworkLightbox"
          onClick={close}
        >
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
          <button
            ref={closeButtonRef}
            onClick={close}
            className="artworkLightboxClose"
            aria-label="Fermer l'image agrandie"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
}
