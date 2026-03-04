import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
        gap: "24px",
      }}
    >
      <div className="kicker">404</div>

      <h1 className="h1" style={{ maxWidth: 480 }}>
        Cette page n'existe pas.
      </h1>

      <p className="muted" style={{ maxWidth: 400 }}>
        L'œuvre ou la page que vous cherchez a peut-être été déplacée ou supprimée.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
        <Link href="/gallery" className="btn">
          Voir la galerie
        </Link>
      </div>
    </main>
  );
}
