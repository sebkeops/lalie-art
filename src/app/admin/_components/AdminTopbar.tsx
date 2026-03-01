"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function Button({
  variant = "ghost",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-60";
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

export default function AdminTopbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

 const onLogout = async () => {
  setBusy(true);
  try {
    // 1) demande Supabase
    await supabase.auth.signOut();

    // 2) purge locale (évite que le client réutilise un token en cache)
    try {
      localStorage.removeItem("supabase.auth.token");
      // Supabase stocke souvent sous une clé "sb-<project-ref>-auth-token"
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("sb-") && k.endsWith("-auth-token")) localStorage.removeItem(k);
      });
    } catch {}

    // 3) force un refresh du runtime Next (recalcule les layouts)
    window.location.replace("/admin/login");
  } finally {
    setBusy(false);
  }
};

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm font-medium text-white/90 hover:text-white"
            >
              Admin — Lalie Art
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Voir le site
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-2">
              {email && (
                <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                  Connecté : <span className="font-medium text-white/90">{email}</span>
                </span>
              )}

              <Button variant="ghost" onClick={onLogout} disabled={busy}>
                {busy ? "Déconnexion…" : "Déconnexion"}
              </Button>
            </div>

            {/* Mobile: juste logout */}
            <div className="sm:hidden">
              <Button variant="ghost" onClick={onLogout} disabled={busy}>
                {busy ? "…" : "Déco"}
              </Button>
            </div>
          </div>
        </div>

        {/* Email en mobile sous la barre */}
        {email && (
          <div className="sm:hidden mt-2 text-xs text-white/70">
            Connecté : <span className="text-white/85">{email}</span>
          </div>
        )}
      </div>
    </header>
  );
}