"use client";

import React from "react";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  targetId: string;
  offset?: number; // si header sticky
};

function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;

  let parent = el.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === "auto" || overflowY === "scroll") && parent.scrollHeight > parent.clientHeight;

    if (isScrollable) return parent;
    parent = parent.parentElement;
  }

  return null; // => window
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

        // Élément réellement scrollé (plus fiable que window sur mobile)
        const scroller = document.scrollingElement as HTMLElement | null;
        if (!scroller) return;

        // 1) Tentative via scrollIntoView (gère mieux certains layouts)
        el.scrollIntoView({ behavior: "smooth", block: targetId === "contact" ? "end" : "start" });

        // 2) Recalage (barre d’adresse Android / viewport dynamique)
        window.setTimeout(() => {
          // Recalcule un top précis et force le scroller
          const rect = el.getBoundingClientRect();
          const y = rect.top + scroller.scrollTop - offset;
          scroller.scrollTo({ top: y, behavior: "smooth" });
        }, 250);

        // Hash re-cliquable
        const hash = `#${targetId}`;
        if (window.location.hash === hash) {
          history.replaceState(null, "", window.location.pathname + window.location.search);
          requestAnimationFrame(() => history.replaceState(null, "", hash));
        } else {
          history.pushState(null, "", hash);
        }
      }}
    />
  );
}