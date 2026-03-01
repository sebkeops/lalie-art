"use client";

import Link from "next/link";
import { useRequireAuth } from "../_hooks/useRequireAuth";

export default function AdminHome() {
  const { ready } = useRequireAuth();
  if (!ready) return <div className="text-white/80">Chargement…</div>;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="h1">Tableau de gestion du site</h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 max-w-3xl">
        <Link
          href="/admin/artworks"
          className="rounded-2xl border border-white/10 bg-black/20 p-6 hover:bg-black/30 transition block"
        >
          <div className="text-2xl">🎨</div>
          <div className="mt-3 text-lg font-medium">Gérer les œuvres</div>
          <div className="text-sm text-white/70 mt-1">
            Ajouter, modifier, supprimer, images, statuts.
          </div>
        </Link>

        <Link
          href="/admin/a-propos"
          className="rounded-2xl border border-white/10 bg-black/20 p-6 hover:bg-black/30 transition block"
        >
          <div className="text-2xl">✍️</div>
          <div className="mt-3 text-lg font-medium">Page “À propos”</div>
          <div className="text-sm text-white/70 mt-1">
            Titre, sous-titre, texte, image.
          </div>
        </Link>
      </div>
    </div>
  );
}