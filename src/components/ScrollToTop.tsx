"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

function forceScrollTop() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export default function ScrollToTop() {
  const pathname = usePathname();

  // Avant le premier paint — évite tout flash de position incorrecte
  useLayoutEffect(() => {
    forceScrollTop();
  }, [pathname]);

  // Après le paint — override toute restauration post-rendu de Next.js
  useEffect(() => {
    forceScrollTop();
  }, [pathname]);

  return null;
}
