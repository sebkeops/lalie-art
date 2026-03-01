"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRequireAuth } from "../../_hooks/useRequireAuth";
import ImageUploadField from "../../_components/ImageUploadField";
import { extractStoragePathFromPublicUrl } from "@/lib/supabase/storage";

type ContentPage = {
  title: string;
  subtitle: string;
  body: string;
  hero_image_url: string | null;
};

export default function AdminAboutPage() {
  const { ready } = useRequireAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  

  const [form, setForm] = useState<ContentPage>({
    title: "",
    subtitle: "",
    body: "",
    hero_image_url: null,
  });

  const [initialHeroImage, setInitialHeroImage] = useState<string | null>(null);
  const canSave = useMemo(() => isAdmin === true && !saving, [isAdmin, saving]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (!user) {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) setIsAdmin(true);

      const { data: page } = await supabase
        .from("content_pages")
        .select("title, subtitle, body, hero_image_url")
        .eq("slug", "a-propos")
        .single();

      if (!cancelled) {
        setForm({
          title: page?.title ?? "À propos",
          subtitle: page?.subtitle ?? "Découvrir l’univers de Lalie Art",
          body: page?.body ?? "Texte temporaire en attente de validation.",
          hero_image_url: page?.hero_image_url ?? null,
        });
        setInitialHeroImage(page?.hero_image_url ?? null);
        setLoading(false);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  async function removeOldHeroImageIfNeeded(nextUrl: string | null) {
  if (!initialHeroImage) return;

  // si rien n'a changé → on ne fait rien
  if (initialHeroImage === nextUrl) return;

  const path = extractStoragePathFromPublicUrl(initialHeroImage, "artworks");
  if (!path) return;

  await supabase.storage.from("artworks").remove([path]);
}

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);

    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      body: form.body,
      hero_image_url: form.hero_image_url?.trim() ? form.hero_image_url.trim() : null,
    };

    try {
    // 🔥 suppression ancienne image si nécessaire
    await removeOldHeroImageIfNeeded(payload.hero_image_url);

    const { error } = await supabase
      .from("content_pages")
      .update(payload)
      .eq("slug", "a-propos");

    if (error) throw error;

    // mettre à jour la référence initiale après save
    setInitialHeroImage(payload.hero_image_url);

    alert("Enregistré ✅");
  } catch (err: any) {
    alert(`Erreur sauvegarde: ${err.message}`);
  } finally {
    setSaving(false);
  }
  }

  if (loading) {
    return <div className="p-8 text-white">Chargement…</div>;
  }

  if (isAdmin !== true) {
    return (
      <div className="p-8 text-white">
        Accès refusé (admin requis).{" "}
        <Link href="/admin" className="underline">
          Retour admin
        </Link>
      </div>
    );
  }
  if (!ready) return <div className="text-white/80">Chargement…</div>;
  return (
    <main className="min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="h1">À propos</h1>
            <p className="text-white/70 mt-2">
              Contenu public de la page <span className="font-mono">/a-propos</span>
            </p>
          </div>

        </div>

        <form onSubmit={onSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Titre</label>
            <input
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 outline-none focus:border-white/40"
              placeholder="À propos"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Sous-titre</label>
            <input
              value={form.subtitle}
              onChange={(e) => setForm((s) => ({ ...s, subtitle: e.target.value }))}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 outline-none focus:border-white/40"
              placeholder="Découvrir l’univers…"
            />
          </div>

          <ImageUploadField
            label="Image"
            value={form.hero_image_url ?? null}
            onChange={(url) => setForm((s) => ({ ...s, hero_image_url: url }))}
            bucket="artworks"
            folder="pages/about"
            helperText="Téléverse une image (elle sera stockée dans Supabase Storage) et enregistrée sur la page."
          />

          <input
            type="hidden"
            name="hero_image_url"
            value={form.hero_image_url ?? ""}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Texte</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
              className="w-full min-h-[260px] rounded-xl border border-white/20 bg-white/5 px-4 py-3 outline-none focus:border-white/40"
              placeholder="Texte temporaire…"
            />
            <p className="text-xs text-white/60">
              Astuce : saute des lignes pour aérer, on affiche en{" "}
              <span className="font-mono">whitespace-pre-line</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-xl bg-white text-black px-5 py-3 font-medium disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>

            <a
              href="/a-propos"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/25 px-5 py-3 hover:bg-white/10 transition"
            >
              Voir la page publique
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}