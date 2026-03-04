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
      <main className="pageMain">
        <div className="container">
          <div className="card aboutCard">Chargement…</div>
        </div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="pageMain">
        <div className="container">
          <div className="card aboutCard">
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
    <main className="pageMain">
      <div className="container">
        <section className="card aboutCard">
          <div className="aboutLayout">
            {page.hero_image_url ? (
              <div className="aboutImageCol">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.hero_image_url}
                  alt=""
                  className="aboutImage"
                />
              </div>
            ) : null}

            <div className="aboutContentCol">
              <div className="kicker">Lalie — Artiste collagiste</div>
              <h1 className="h1" style={{ marginTop: 10 }}>
                {page.title ?? "À propos"}
              </h1>

              {page.subtitle ? (
                <p className="muted aboutSubtitle">{page.subtitle}</p>
              ) : null}

              {page.body ? (
                <>
                  <hr className="aboutDivider" />
                  <div className="aboutBody">{page.body}</div>
                </>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
