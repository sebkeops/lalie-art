"use client";

import Link from "next/link";
import Image from "next/image";
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
            <Image src="/logo.svg" alt="Lalie — Crea Lalie Art" width={162} height={65} className="logo logoPublic" priority />
          </Link>

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
