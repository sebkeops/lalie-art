"use client";

import { supabase } from "@/lib/supabase/client";

/**
 * Supprime une œuvre + ses images (DB + Storage).
 * Mode best-effort sur le remove storage (ne bloque pas si policy remove échoue).
 */
export async function deleteArtworkCascade(artworkId: string) {
  // 1) récupérer paths
  const { data: imgs, error: imgsErr } = await supabase
    .from("artwork_images")
    .select("path")
    .eq("artwork_id", artworkId);

  if (imgsErr) throw new Error(imgsErr.message);

  // 2) remove storage (best effort)
  const paths = (imgs ?? []).map((i) => i.path).filter(Boolean);
  if (paths.length) {
    const { error: rmErr } = await supabase.storage.from("artworks").remove(paths);
    if (rmErr) console.warn("Remove images failed:", rmErr.message);
  }

  // 3) delete DB children then parent
  const { error: delImgsErr } = await supabase
    .from("artwork_images")
    .delete()
    .eq("artwork_id", artworkId);

  if (delImgsErr) throw new Error(delImgsErr.message);

  const { error: delArtworkErr } = await supabase
    .from("artworks")
    .delete()
    .eq("id", artworkId);

  if (delArtworkErr) throw new Error(delArtworkErr.message);
}