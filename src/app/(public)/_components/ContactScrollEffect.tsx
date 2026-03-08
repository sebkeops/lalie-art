"use client";

import { useEffect } from "react";

export function ContactScrollEffect() {
  useEffect(() => {
    const fromLink = sessionStorage.getItem("goToContact") === "1";
    const fromHash = window.location.hash === "#contact";
    if (!fromLink && !fromHash) return;

    if (fromLink) sessionStorage.removeItem("goToContact");
    if (fromHash) history.replaceState(null, "", window.location.pathname);

    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, []);

  return null;
}
