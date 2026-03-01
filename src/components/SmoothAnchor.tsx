"use client";

import React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  targetId: string;
  offset?: number; // si header sticky
};

export default function SmoothAnchor({ targetId, offset = 0, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={`#${targetId}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        // Empêche le jump instantané
        e.preventDefault();

        const el = document.getElementById(targetId);
        if (!el) return;

        // Gestion offset (header sticky)
        const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: "smooth" });

        // Met à jour l’URL sans casser l’historique
        history.pushState(null, "", `#${targetId}`);
      }}
    />
  );
}