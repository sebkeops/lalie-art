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

        const scrollParent = getScrollParent(el);

        if (scrollParent) {
          // scroll dans le conteneur
          const parentRect = scrollParent.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const top = (elRect.top - parentRect.top) + scrollParent.scrollTop - offset;

          scrollParent.scrollTo({ top, behavior: "smooth" });
        } else {
          // scroll window classique
          const y = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }

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