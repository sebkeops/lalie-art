import { supabase } from "@/lib/supabase/client";

export function getPublicImageUrl(path: string) {
  const { data } = supabase.storage.from("artworks").getPublicUrl(path);
  return data.publicUrl;
}

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Extrait le path Storage à partir d'une URL publique du type :
 * https://xxxx.supabase.co/storage/v1/object/public/<bucket>/<path>
 */
export function extractStoragePathFromPublicUrl(publicUrl: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

/**
 * Supprime un fichier Storage à partir de son URL publique.
 * Safe: si on n'arrive pas à extraire le path, on ne plante pas.
 */
export async function removeStorageObjectFromPublicUrl(
  supabase: SupabaseClient,
  bucket: string,
  publicUrl: string | null | undefined
) {
  if (!publicUrl) return;

  const path = extractStoragePathFromPublicUrl(publicUrl, bucket);
  if (!path) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    // On remonte une erreur claire (ou tu peux choisir de "silent fail" si tu préfères)
    throw new Error(error.message);
  }
}