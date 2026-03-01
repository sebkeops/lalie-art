"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  label?: string;
  value: string | null;
  onChange: (next: string | null) => void;
  bucket?: string; // default: artworks
  folder?: string; // default: pages/about
  helperText?: string;
};

export default function ImageUploadField({
  label = "Image",
  value,
  onChange,
  bucket = "artworks",
  folder = "pages/about",
  helperText,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const previewUrl = localPreview ?? value;

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  async function handleUpload(file: File) {
    setError(null);
    setBusy(true);

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Le fichier doit être une image.");
      }

      const maxMb = 8;
      if (file.size > maxMb * 1024 * 1024) {
        throw new Error(`Image trop lourde (max ${maxMb}MB).`);
      }

      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const path = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: true,
          cacheControl: "3600",
          contentType: file.type,
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      if (!data?.publicUrl) throw new Error("Impossible de récupérer l’URL publique.");

      onChange(data.publicUrl);

      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    } catch (e: any) {
      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
      setError(e?.message ?? "Upload impossible.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    // Simple et safe : on enlève l’URL côté DB (comme demandé).
    // (Option suppression Storage réelle possible ensuite si tu veux)
    setError(null);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/90">{label}</label>

      {/* Aperçu */}
      {previewUrl ? (
        <div className="overflow-hidden rounded-xl border border-white/20 bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Aperçu"
            className="h-56 w-full object-cover"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-white/20 bg-white/5 px-4 py-6 text-sm text-white/60">
          Aucune image sélectionnée.
        </div>
      )}

      {/* Input file */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={busy}
          className="block w-full text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white/90 hover:file:bg-white/15"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
          }}
        />

        {value ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10 disabled:opacity-50"
          >
            Supprimer
          </button>
        ) : null}

        {busy ? <span className="text-xs text-white/60">Upload…</span> : null}
      </div>

      {helperText ? <p className="text-xs text-white/60">{helperText}</p> : null}
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}