"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getPublicImageUrl } from "@/lib/supabase/storage"; // ← ajouter ceci
import { useRequireAuth } from "../../_hooks/useRequireAuth";
import { deleteArtworkCascade } from "../../_utils/deleteArtwork";

type Artwork = {
  id: string;
  title: string;
  status: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  thumb_url?: string; // ← ajouter ceci
};

/* ⬇⬇⬇ ICI (juste avant le composant) ⬇⬇⬇ */

const statusLabel = (status: string) => {
  const s = (status ?? "").toLowerCase().trim();
  const map: Record<string, string> = {
    available: "Disponible",
    sold: "Vendu",
    reserved: "Réservé",
    unavailable: "Indisponible",
  };
  return map[s] ?? status;
};

async function fetchThumbUrl(artworkId: string): Promise<string | null> {
  const { data } = await supabase
    .from("artwork_images")
    .select("path")
    .eq("artwork_id", artworkId)
    .order("position", { ascending: true })
    .limit(1);

  const path = data?.[0]?.path;
  return path ? getPublicImageUrl(path) : null;
}
export default function AdminArtworksPage() {
  const { ready } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<Artwork[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);


  const load = async () => {
    setError(null);
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      window.location.href = "/admin/login";
      return;
    }
    setEmail(userData.user.email ?? "");

    const { data, error } = await supabase
      .from("artworks")
      .select("id,title,status,is_published,is_featured,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      const rows = (data ?? []) as Artwork[];

      const withThumbs = await Promise.all(
        rows.map(async (art) => {
          try {
            const url = await fetchThumbUrl(art.id);
            return { ...art, thumb_url: url ?? undefined };
          } catch {
            return art;
          }
        })
      );

      setItems(withThumbs);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublished = async (a: Artwork) => {
    setBusyId(a.id);
    setError(null);

    const { error } = await supabase
      .from("artworks")
      .update({ is_published: !a.is_published })
      .eq("id", a.id);

    if (error) {
      setError(error.message);
      setBusyId(null);
      return;
    }

    setItems((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, is_published: !a.is_published } : x))
    );
    setBusyId(null);
  };

  const toggleFeatured = async (a: Artwork) => {
    setBusyId(a.id);
    setError(null);

    const { error } = await supabase
      .from("artworks")
      .update({ is_featured: !a.is_featured })
      .eq("id", a.id);

    if (error) {
      setError(error.message);
      setBusyId(null);
      return;
    }

    setItems((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, is_featured: !a.is_featured } : x))
    );
    setBusyId(null);
  };

  const deleteArtwork = async (a: Artwork) => {
    const ok = window.confirm(`Supprimer définitivement "${a.title}" ?`);
    if (!ok) return;

    setBusyId(a.id);
    setError(null);

    try {
      // 1) récupérer les paths
      const { data: imgs, error: imgsErr } = await supabase
        .from("artwork_images")
        .select("path")
        .eq("artwork_id", a.id);

      if (imgsErr) throw imgsErr;

      // 2) supprimer dans storage (best effort)
      const paths = (imgs ?? []).map((i: any) => i.path).filter(Boolean);
      if (paths.length) {
        const { error: rmErr } = await supabase.storage.from("artworks").remove(paths);
        if (rmErr) console.warn("Remove images failed:", rmErr.message);
      }

      // 3) supprimer les rows images
      const { error: delImgsErr } = await supabase
        .from("artwork_images")
        .delete()
        .eq("artwork_id", a.id);

      if (delImgsErr) throw delImgsErr;

      // 4) supprimer l’œuvre
      const { error: delArtworkErr } = await supabase
        .from("artworks")
        .delete()
        .eq("id", a.id);

      if (delArtworkErr) throw delArtworkErr;

      // 5) UI : retirer de la liste
      setItems((prev) => prev.filter((x) => x.id !== a.id));
    } catch (err: any) {
      setError(err?.message ?? "Erreur suppression");
    } finally {
      setBusyId(null);
    }
  };

  if (!ready) return <div className="text-white/80">Chargement…</div>;

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <h1 className="h1" style={{ margin: 0 }}>Œuvres</h1>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a
            href="/admin/artworks/new"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "#7a2423",
              color: "white",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            + Nouvelle œuvre
          </a>
        </div>
      </div>

      <hr style={{ margin: "18px 0", opacity: 0.2 }} />

      {loading && <p>Chargement…</p>}
      {error && <p style={{ color: "crimson" }}>Erreur : {error}</p>}

      {!loading && !error && items.length === 0 && <p>Aucune œuvre pour le moment.</p>}

      {!loading && !error && items.length > 0 && (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((a) => (
            <div
              key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr auto auto auto auto",
                gap: 12,
                alignItems: "center",
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {a.thumb_url ? (
                  <img
                    src={a.thumb_url}
                    alt={a.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div>
                <div style={{ fontWeight: 800 }}>{a.title}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  {statusLabel(a.status)} • {a.is_published ? "Publié" : "Brouillon"} •{" "}
                  {a.is_featured ? "À la une" : "—"}
                </div>
              </div>

              <button
                onClick={() => togglePublished(a)}
                disabled={busyId === a.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #999",
                  background: a.is_published ? "#111" : "#7a2423",
                  color: "white",
                  cursor: "pointer",
                  minWidth: 120,
                }}
              >
                {busyId === a.id ? "..." : a.is_published ? "Dépublier" : "Publier"}
              </button>

              <button
                onClick={() => toggleFeatured(a)}
                disabled={busyId === a.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #999",
                  background: a.is_featured ? "#7a2423" : "transparent",
                  color: a.is_featured ? "white" : "inherit",
                  cursor: "pointer",
                  minWidth: 110,
                }}
              >
                {busyId === a.id ? "..." : a.is_featured ? "Retirer une" : "Mettre une"}
              </button>

              <button
                onClick={() => deleteArtwork(a)}
                disabled={busyId === a.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #999",
                  background: "transparent",
                  color: "crimson",
                  cursor: "pointer",
                  minWidth: 110,
                }}
              >
                {busyId === a.id ? "..." : "Supprimer"}
              </button>

              <a href={`/admin/artworks/${a.id}/edit`} style={{ textDecoration: "underline" }}>
                Modifier
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}