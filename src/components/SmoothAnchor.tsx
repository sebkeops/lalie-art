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

        e.preventDefault();

        const el = document.getElementById(targetId);
        if (!el) return;

        const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: "smooth" });

        const hash = `#${targetId}`;
        if (window.location.hash === hash) {
          history.replaceState(null, "", window.location.pathname + window.location.search);
          requestAnimationFrame(() => {
            history.replaceState(null, "", hash);
          });
        } else {
          history.pushState(null, "", hash);
        }
      }}
    />
  );
}