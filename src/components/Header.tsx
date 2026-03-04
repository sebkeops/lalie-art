"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SmoothAnchor from "@/components/SmoothAnchor";


function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  function handleActiveClick() {
    window.location.reload();
  }

  return (
    <Link
      href={href}
      className={["navLinkPublic", active ? "navLinkPublicActive" : ""].join(" ")}
      aria-current={active ? "page" : undefined}
      onClick={active ? handleActiveClick : undefined}
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
      aria-label="Retour à l'accueil"
      aria-current={active ? "page" : undefined}
      title="Accueil"
      onClick={active ? () => window.location.reload() : undefined}
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
  const pathname = usePathname();
  const onHome = pathname === "/";

  return (
    <>
      <header className="siteHeader">
        <div className="siteHeaderInner siteHeaderInnerPublic">
          <Link
            href="/"
            className="brand"
            aria-label="Accueil"
            onClick={onHome ? () => window.location.reload() : undefined}
          >
            <img src="/logo.svg" alt="Lalie — Crea Lalie Art" className="logo logoPublic" />
          </Link>

          {/* Picto mobile positionné indépendamment */}
          <HomeIconLink />

          <nav className="publicNav" aria-label="Navigation">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/gallery">Galerie</NavLink>
            <NavLink href="/a-propos">À propos</NavLink>
            {onHome ? (
              <SmoothAnchor className="navLinkPublic" targetId="contact" offset={0}>
                Contact
              </SmoothAnchor>
            ) : (
              <a
                className="navLinkPublic"
                href="/"
                onClick={() => sessionStorage.setItem("goToContact", "1")}
              >
                Contact
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Barre de navigation mobile fixe en bas */}
      <nav className="mobileBottomNav" aria-label="Navigation mobile">
        <Link
          href="/"
          className={["mobileBottomNavLink", onHome ? "mobileBottomNavLinkActive" : ""].join(" ")}
          onClick={onHome ? () => window.location.reload() : undefined}
        >
          Accueil
        </Link>
        <Link
          href="/gallery"
          className={["mobileBottomNavLink", pathname === "/gallery" ? "mobileBottomNavLinkActive" : ""].join(" ")}
          onClick={pathname === "/gallery" ? () => window.location.reload() : undefined}
        >
          Galerie
        </Link>
        <Link
          href="/a-propos"
          className={["mobileBottomNavLink", pathname === "/a-propos" ? "mobileBottomNavLinkActive" : ""].join(" ")}
          onClick={pathname === "/a-propos" ? () => window.location.reload() : undefined}
        >
          À propos
        </Link>
        {onHome ? (
          <SmoothAnchor className="mobileBottomNavLink" targetId="contact" offset={0}>
            Contact
          </SmoothAnchor>
        ) : (
          <a
            className="mobileBottomNavLink"
            href="/"
            onClick={() => sessionStorage.setItem("goToContact", "1")}
          >
            Contact
          </a>
        )}
      </nav>
    </>
  );
}
