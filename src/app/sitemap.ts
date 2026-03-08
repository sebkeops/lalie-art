import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://crealalieart.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/gallery`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/a-propos`, changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const supabase = await createClient();
    const { data: artworks } = await supabase
      .from("artworks")
      .select("slug")
      .eq("is_published", true);

    const artworkPages: MetadataRoute.Sitemap = (artworks ?? []).map((a) => ({
      url: `${BASE_URL}/gallery/${a.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    return [...staticPages, ...artworkPages];
  } catch {
    return staticPages;
  }
}
