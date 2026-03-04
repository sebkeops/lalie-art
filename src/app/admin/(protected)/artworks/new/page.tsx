"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { slugify } from "../../../_utils/slugify";
import { Card, Label, Input, Textarea, Select, Button, Notice } from "../../../_components/FormFields";

const MIN_YEAR = 2000;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);

async function getUniqueSlug(baseSlug: string) {
  let candidate = baseSlug;
  let i = 2;

  while (true) {
    const { data, error } = await supabase
      .from("artworks")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (error) throw error;
    if (!data) return candidate;

    candidate = `${baseSlug}-${i}`;
    i++;
  }
}

export default function NewArtworkPage() {
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const autoSlug = useMemo(() => slugify(title || ""), [title]);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [technique, setTechnique] = useState("");
  const [universe, setUniverse] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState<"available" | "reserved" | "sold">(
    "available"
  );
  const [priceOnRequest, setPriceOnRequest] = useState(true);
  const [priceEur, setPriceEur] = useState<number | "">("");
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) { setFilePreview(null); return; }
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) window.location.href = "/admin/login";
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(autoSlug);
    }
  }, [autoSlug, slugTouched]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (!title.trim()) return setMsg("❌ Titre obligatoire.");
    if (!slug.trim()) return setMsg("❌ Slug obligatoire (généré à partir du titre).");

    try {
      setLoading(true);

      const uniqueSlug = await getUniqueSlug(slug.trim());

      // 1) créer l’œuvre
      const { data: artwork, error: insertErr } = await supabase
        .from("artworks")
        .insert({
          title,
          slug: uniqueSlug,
          description,
          year: year === "" ? null : year,
          technique,
          universe,
          subject,
          status,
          price_on_request: priceOnRequest,
          price_eur: priceOnRequest || priceEur === "" ? null : priceEur,
          is_published: isPublished,
          is_featured: isFeatured,
        })
        .select("id")
        .single();

      if (insertErr || !artwork?.id) {
        setLoading(false);
        return setMsg("❌ Erreur création œuvre: " + (insertErr?.message ?? "unknown"));
      }

      const artworkId = artwork.id as string;

      // 2) upload image (optionnel)
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${new Date().getFullYear()}/${uniqueSlug}-${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("artworks")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadErr) {
          setLoading(false);
          return setMsg("❌ Œuvre créée mais upload image a échoué: " + uploadErr.message);
        }

        const { error: imgErr } = await supabase.from("artwork_images").insert({
          artwork_id: artworkId,
          path,
          alt: title,
          position: 0,
        });

        if (imgErr) {
          setLoading(false);
          return setMsg("❌ Image uploadée mais enregistrement en base a échoué: " + imgErr.message);
        }
      }

      setLoading(false);
      setMsg("✅ Œuvre créée !");
      window.location.href = "/admin/artworks";
    } catch (err: any) {
      setLoading(false);
      setMsg("❌ " + (err?.message ?? "Erreur"));
    }
  };

  if (!ready) return <div className="text-white/80">Chargement…</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h1">Nouvelle œuvre</h1>
          <p className="text-white/70 mt-2">
            Crée une œuvre et ajoute une image (optionnel).
          </p>
        </div>

        <Link
          href="/admin/artworks"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 transition"
        >
          ← Retour
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">
        {/* Colonne média / fichier */}
        <Card title="Image (optionnel)">
          <div className="grid gap-3">
            {filePreview ? (
              <div className="overflow-hidden rounded-xl border border-white/20 bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={filePreview} alt="Aperçu" className="h-56 w-full object-cover" />
              </div>
            ) : (
              <div className="rounded-xl border border-white/20 bg-white/5 px-4 py-6 text-sm text-white/60">
                Aucune image sélectionnée.
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white/90 hover:file:bg-white/15"
            />

            <p className="text-xs text-white/60">
              Conseil : image carrée (ex: 1500×1500) pour un rendu homogène.
            </p>
          </div>
        </Card>

        {/* Colonne formulaire */}
        <Card title="Informations">
          <form onSubmit={onCreate} className="grid gap-5">
            <div className="grid gap-2">
              <Label>Titre *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Chemin *</Label>
              <Input
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                required
              />
              <div className="text-xs text-white/60">
                Auto : <span className="font-mono">{autoSlug}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Année</Label>
                <Select
                  value={year === "" ? "" : String(year)}
                  onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
                >
                  <option value="">Non renseignée</option>
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Technique</Label>
                <Input
                  value={technique}
                  onChange={(e) => setTechnique(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Univers</Label>
                <Input
                  value={universe}
                  onChange={(e) => setUniverse(e.target.value)}
                  placeholder="Musique & Icônes"
                />
              </div>

              <div className="grid gap-2">
                <Label>Sujet</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Nirvana"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 items-start">
              <div className="grid gap-2">
                <Label>Statut</Label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="available">Disponible</option>
                  <option value="reserved">Réservé</option>
                  <option value="sold">Vendu</option>
                </Select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 p-4 grid gap-3">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={priceOnRequest}
                    onChange={(e) => setPriceOnRequest(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Prix sur demande</span>
                </label>

                {!priceOnRequest && (
                  <div className="grid gap-2">
                    <Label>Prix (€)</Label>
                    <Input
                      value={priceEur}
                      onChange={(e) =>
                        setPriceEur(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      type="number"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="accent-white"
                />
                <span>Publié</span>
              </label>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-white"
                />
                <span>À la une</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Création…" : "Créer l’œuvre"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => (window.location.href = "/admin/artworks")}
                disabled={loading}
              >
                Annuler
              </Button>
            </div>

            {msg && <Notice msg={msg} />}
          </form>
        </Card>
      </div>
    </div>
  );
}