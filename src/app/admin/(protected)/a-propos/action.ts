"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

export async function saveAboutPage(formData: FormData) {
  const supabase = await createClient();

  // Sécurité: on vérifie que l'utilisateur est admin (profiles.role = 'admin')
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;

  if (!userId) throw new Error("Non authentifié.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Accès refusé.");
  }

  const payload = {
    title: getString(formData, "title"),
    subtitle: getString(formData, "subtitle"),
    body: getString(formData, "body"),
    hero_image_url: getString(formData, "hero_image_url") || null,
  };

  const { error } = await supabase
    .from("content_pages")
    .update(payload)
    .eq("slug", "a-propos");

  if (error) throw new Error(error.message);

  // Rafraîchir la page publique + l'admin
  revalidatePath("/a-propos");
  revalidatePath("/admin/a-propos");
}