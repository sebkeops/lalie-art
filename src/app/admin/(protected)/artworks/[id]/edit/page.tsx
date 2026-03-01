"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { deleteArtworkCascade } from "../../../../_utils/deleteArtwork";

const MIN_YEAR = 2000;
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);


function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function getUniqueSlug(baseSlug: string, currentId?: string) {
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

    if (currentId && data.id === currentId) return candidate;

    candidate = `${baseSlug}-${i}`;
    i++;
  }
}

type Artwork = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  year: number | null;
  width_cm: number | null;
  height_cm: number | null;
  technique: string | null;
  universe: string | null;
  subject: string | null;
  status: "available" | "reserved" | "sold";
  price_on_request: boolean;
  price_eur: number | null;
  is_published: boolean;
  is_featured: boolean;
};

function Card({
  title,
  children,
  right,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
      {(title || right) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          {title ? <h2 className="text-lg font-semibold">{title}</h2> : <div />}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-white/90">{children}</span>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none",
        "focus:border-white/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none",
        "focus:border-white/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none",
        "focus:border-white/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function Button({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:opacity-90"
      : variant === "danger"
        ? "border border-red-400/40 text-red-100 hover:bg-red-500/10"
        : "border border-white/15 hover:bg-white/10 text-white";

  return (
    <button
      {...props}
      className={[base, styles, props.className ?? ""].join(" ")}
    />
  );
}

function Notice({ msg }: { msg: string }) {
  const ok = msg.startsWith("✅");
  return (
    <div
      className={[
        "text-sm rounded-xl border px-4 py-3",
        ok
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
          : "border-red-400/30 bg-red-500/10 text-red-100",
      ].join(" ")}
    >
      {msg}
    </div>
  );
}

export default function EditArtworkPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const autoSlug = useMemo(() => slugify(title || ""), [title]);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [widthCm, setWidthCm] = useState<number | "">("");
  const [heightCm, setHeightCm] = useState<number | "">("");
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

  const [imgPath, setImgPath] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgBusy, setImgBusy] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      setMsg(null);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data, error } = await supabase
        .from("artworks")
        .select(
          "id,title,slug,description,year,width_cm,height_cm,technique,universe,subject,status,price_on_request,price_eur,is_published,is_featured"
        )
        .eq("id", id)
        .single();

      if (error || !data) {
        setMsg("❌ Impossible de charger l’œuvre: " + (error?.message ?? "unknown"));
        setLoading(false);
        return;
      }

      const a = data as Artwork;
      setTitle(a.title ?? "");
      setSlug(a.slug ?? "");
      setDescription(a.description ?? "");
      setYear(a.year ?? "");
      setWidthCm(a.width_cm ?? "");
      setHeightCm(a.height_cm ?? "");
      setTechnique(a.technique ?? "");
      setUniverse(a.universe ?? "");
      setSubject(a.subject ?? "");
      setStatus(a.status ?? "available");
      setPriceOnRequest(a.price_on_request ?? true);
      setPriceEur(a.price_eur ?? "");
      setIsPublished(!!a.is_published);
      setIsFeatured(!!a.is_featured);

      const { data: imgRow } = await supabase
        .from("artwork_images")
        .select("path")
        .eq("artwork_id", id)
        .order("position", { ascending: true })
        .limit(1)
        .maybeSingle();

      const p = imgRow?.path ?? null;
      setImgPath(p);
      setImgUrl(p ? supabase.storage.from("artworks").getPublicUrl(p).data.publicUrl : null);

      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(autoSlug);
    }
  }, [autoSlug, slugTouched]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setMsg(null);
    setSaving(true);

    try {
      const base = (slug.trim() || autoSlug).trim();
      const uniqueSlug = await getUniqueSlug(base, id);

      const { error } = await supabase
        .from("artworks")
        .update({
          title: title.trim(),
          slug: uniqueSlug,
          description,
          year: year === "" ? null : year,
          width_cm: widthCm === "" ? null : widthCm,
          height_cm: heightCm === "" ? null : heightCm,
          technique,
          universe,
          subject,
          status,
          price_on_request: priceOnRequest,
          price_eur: priceOnRequest || priceEur === "" ? null : priceEur,
          is_published: isPublished,
          is_featured: isFeatured,
        })
        .eq("id", id);

      if (error) throw error;

      setSlug(uniqueSlug);
      setMsg("✅ Enregistré");
    } catch (err: any) {
      setMsg("❌ " + (err?.message ?? "Erreur"));
    } finally {
      setSaving(false);
    }
  };

  const replaceImage = async () => {
    if (!id || !newImage) return;

    setMsg(null);
    setImgBusy(true);

    const oldPath = imgPath; // ✅ on garde l'ancien path sous la main

    try {
      const ext = newImage.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeSlug = (slug || autoSlug || "artwork").trim();
      const newPath = `${new Date().getFullYear()}/${safeSlug}-${Date.now()}.${ext}`;

      // 1) upload
      const { error: upErr } = await supabase.storage
        .from("artworks")
        .upload(newPath, newImage, {
          cacheControl: "3600",
          upsert: false,
        });
      if (upErr) throw upErr;

      // 2) upsert DB (artwork_images)
      const { data: existing, error: exErr } = await supabase
        .from("artwork_images")
        .select("id")
        .eq("artwork_id", id)
        .limit(1)
        .maybeSingle();

      if (exErr) throw exErr;

      if (existing?.id) {
        const { error } = await supabase
          .from("artwork_images")
          .update({ path: newPath, alt: title, position: 0 })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("artwork_images")
          .insert({ artwork_id: id, path: newPath, alt: title, position: 0 });
        if (error) throw error;
      }

      // 3) seulement maintenant, suppression de l'ancien fichier (best effort)
      if (oldPath) {
        const { error: rmErr } = await supabase.storage.from("artworks").remove([oldPath]);
        // si policy bloque remove, on ne casse pas l'UX
        if (rmErr) console.warn("Remove old image failed:", rmErr.message);
      }

      // 4) UI
      setImgPath(newPath);
      setImgUrl(supabase.storage.from("artworks").getPublicUrl(newPath).data.publicUrl);
      setNewImage(null);
      setMsg("✅ Image remplacée");
    } catch (err: any) {
      setMsg("❌ " + (err?.message ?? "Erreur remplacement image"));
    } finally {
      setImgBusy(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;

    const ok = window.confirm("Supprimer définitivement cette œuvre ?");
    if (!ok) return;

    setSaving(true);
    setMsg(null);

    try {
      await deleteArtworkCascade(id);
      window.location.href = "/admin/artworks";
    } catch (err: any) {
      setMsg("❌ " + (err?.message ?? "Erreur suppression"));
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/80">Chargement…</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="h1">Modifier l’œuvre</h1>
          <p className="mt-2 text-white/70">
            ID: <span className="font-mono text-white/80">{id}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/artworks"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            ← Retour
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">
        {/* Colonne Image */}
        <Card
          title="Image"
          right={
            imgUrl ? (
              <a
                href={imgUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/70 hover:text-white"
              >
                Ouvrir ↗
              </a>
            ) : null
          }
        >
          <div className="grid gap-4">
            {imgUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl}
                alt=""
                className="w-full max-w-[320px] aspect-square object-cover rounded-2xl border border-white/10"
              />
            ) : (
              <div className="text-white/70">Aucune image</div>
            )}

            <div className="grid gap-2">
              <Label>Remplacer l’image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files?.[0] ?? null)}
                className="text-sm text-white/80"
              />
              <Button type="button" onClick={replaceImage} disabled={!newImage || imgBusy}>
                {imgBusy ? "Remplacement…" : "Remplacer"}
              </Button>
            </div>

            <p className="text-xs text-white/60">
              Astuce : privilégie une image carrée (ex: 1500×1500) pour un rendu homogène.
            </p>
          </div>
        </Card>

        {/* Colonne Form */}
        <Card title="Informations">
          <form onSubmit={onSave} className="grid gap-5">
            <div className="grid gap-2">
              <Label>Titre *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
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
                <Input value={technique} onChange={(e) => setTechnique(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Largeur (cm)</Label>
                <Input
                  value={widthCm}
                  onChange={(e) =>
                    setWidthCm(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  type="number"
                />
              </div>

              <div className="grid gap-2">
                <Label>Hauteur (cm)</Label>
                <Input
                  value={heightCm}
                  onChange={(e) =>
                    setHeightCm(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  type="number"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Univers</Label>
                <Input value={universe} onChange={(e) => setUniverse(e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label>Sujet</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 items-start">
              <div className="grid gap-2">
                <Label>Statut</Label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
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
              <Button type="submit" disabled={saving}>
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => (window.location.href = "/admin/artworks")}
                disabled={saving}
              >
                Annuler
              </Button>

              <Button type="button" variant="danger" onClick={onDelete} disabled={saving}>
                Supprimer
              </Button>
            </div>

            {msg && <Notice msg={msg} />}
          </form>
        </Card>
      </div>
    </div>
  );
}