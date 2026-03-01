"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ContentPage = {
  title: string | null;
  subtitle: string | null;
  body: string | null;
  hero_image_url: string | null;
};

export default function AboutPublicPage() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<ContentPage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("content_pages")
        .select("title,subtitle,body,hero_image_url")
        .eq("slug", "a-propos")
        .maybeSingle();

      if (error) {
        setErrorMsg(error.message);
        setPage(null);
        setLoading(false);
        return;
      }

      setPage((data as ContentPage) ?? null);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "60px 0"}}>
        <div className="container">
          <div className="card" style={{ padding: 18, borderRadius: 18 }}>
            Chargement…
          </div>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="card" style={{ padding: 18, borderRadius: 18 }}>
            <div className="h2">À propos</div>
            <p className="muted" style={{ marginTop: 10 }}>
              Contenu indisponible pour le moment.
            </p>
            {errorMsg && (
              <pre style={{ marginTop: 12, opacity: 0.8, whiteSpace: "pre-wrap" }}>
                {errorMsg}
              </pre>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "60px 0" }}>
      <div className="container" style={{ display: "grid", gap: 18 }}>
        <section className="card" style={{ padding: 22, borderRadius: 18 }}>
          <div className="kicker">Lalie — Artiste collagiste</div>
          <h1 className="h1" style={{ marginTop: 10 }}>
            {page.title ?? "À propos"}
          </h1>
          {page.subtitle ? (
            <p className="muted" style={{ marginTop: 10, maxWidth: 820, lineHeight: 1.7 }}>
              {page.subtitle}
            </p>
          ) : null}
        </section>

        <section className="card" style={{ padding: 22, borderRadius: 18 }}>
          {page.hero_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.hero_image_url}
              alt=""
              style={{
                width: "100%",
                maxHeight: 420,
                objectFit: "cover",
                borderRadius: 14,
                border: "1px solid rgba(255,245,230,.10)",
                marginBottom: 16,
              }}
            />
          ) : null}

          {page.body ? (
            <div style={{ whiteSpace: "pre-line", lineHeight: 1.8, color: "rgba(255,245,230,.88)" }}>
              {page.body}
            </div>
          ) : (
            <p className="muted">Texte à venir.</p>
          )}
        </section>
      </div>
    </main>
  );
}