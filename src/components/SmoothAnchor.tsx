"use client";

import React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  targetId: string;
  offset?: number; // hauteur header sticky si besoin
};

function getTargetY(el: HTMLElement, offset: number) {
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  return Math.max(0, y);
}

function scrollToY(y: number, behavior: ScrollBehavior) {
  // 1) window (le plus standard)
  window.scrollTo({ top: y, behavior });

  // 2) compat : certains Chrome Android scrollent plutôt body ou documentElement
  document.documentElement?.scrollTo?.({ top: y, behavior });
  document.body?.scrollTo?.({ top: y, behavior });
}

export default function SmoothAnchor({ targetId, offset = 0, onClick, ...rest }: Props) {
  return (
    <a
      {...rest}
      href={`#${targetId}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;

        e.preventDefault();

        const el = document.getElementById(targetId);
        if (!el) return;

        const hash = `#${targetId}`;

        // Calcul 1 fois => plus de mismatch de scroller
        const y = getTargetY(el, offset);

        // Double rAF : fiable sur Android (laisser le viewport / click se stabiliser)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollToY(y, "smooth");

            // Petite “assurance” non visible : si Android coupe le smooth trop tôt,
            // on termine au bon endroit sans dégrader desktop.
            window.setTimeout(() => {
              const delta = Math.abs(window.scrollY - y);
              if (delta > 2) scrollToY(y, "auto");
            }, 450);
          });
        });

        // Hash : simple, re-cliquable sans bidouille agressive
        if (window.location.hash !== hash) {
          history.pushState(null, "", hash);
        } else {
          history.replaceState(null, "", window.location.pathname + window.location.search + hash);
        }
      }}
    />
  );
}