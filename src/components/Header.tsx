"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SmoothAnchor from "@/components/SmoothAnchor";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={["navLinkPublic", active ? "navLinkPublicActive" : ""].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

function HomeIconLink() {
  const pathname = usePathname();
  const active = pathname === "/";

  return (
    <Link
      href="/"
      className={["homeIconLink", active ? "homeIconLinkActive" : ""].join(" ")}
      aria-label="Retour à l’accueil"
      aria-current={active ? "page" : undefined}
      title="Accueil"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1v-10.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="siteHeader">
      <div className="siteHeaderInner siteHeaderInnerPublic">
        <Link href="/" className="brand" aria-label="Accueil">
          <img src="/logo.svg" alt="Lalie — Crea Lalie Art" className="logo logoPublic" />
        </Link>

        {/* Picto mobile positionné indépendamment */}
        <HomeIconLink />

        <nav className="publicNav" aria-label="Navigation">
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/gallery">Galerie</NavLink>
          <NavLink href="/a-propos">À propos</NavLink>
          <SmoothAnchor className="navLinkPublic" targetId="contact" offset={0}>
            Contact
          </SmoothAnchor>
        </nav>
      </div>
    </header>
  );
}