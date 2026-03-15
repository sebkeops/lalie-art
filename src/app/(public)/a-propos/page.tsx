import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

type ContentPage = {
  title: string | null;
  subtitle: string | null;
  body: string | null;
  hero_image_url: string | null;
};

export default async function AboutPublicPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_pages")
    .select("title,subtitle,body,hero_image_url")
    .eq("slug", "a-propos")
    .maybeSingle();

  const page = data as ContentPage | null;

  if (!page) {
    return (
      <main className="pageMain">
        <div className="container">
          <div className="card aboutCard">
            <div className="h2">À propos</div>
            <p className="muted" style={{ marginTop: 10 }}>
              Contenu indisponible pour le moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pageMain">
      <div className="container">
        <section className="card aboutCard" aria-label="À propos de Lalie">
          <div className="aboutLayout">
            {page.hero_image_url ? (
              <div className="aboutImageCol">
                <Image
                  src={page.hero_image_url}
                  alt="Portrait de Lalie, artiste collagiste à Nîmes"
                  width={600}
                  height={800}
                  className="aboutImage"
                  style={{ height: "auto" }}
                  sizes="(max-width: 820px) 100vw, 40vw"
                  priority
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
