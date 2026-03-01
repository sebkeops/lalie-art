"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function HashScroll() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const el = document.querySelector(hash);
    if (!el) return;

    // Laisse le temps au layout de s’afficher
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [pathname, searchParams]);

  return null;
}