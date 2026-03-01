"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) setMsg("❌ " + error.message);
    else {
      setMsg("✅ Connecté. Tu peux aller sur /admin");
      window.location.href = "/admin";
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={signIn} style={{ width: "100%", maxWidth: 420, display: "grid", gap: 12 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Admin • Connexion</h1>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="email@exemple.com"
            style={{ padding: 12, borderRadius: 10, border: "1px solid #333", background: "#111", color: "#fff" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Mot de passe</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="••••••••"
            style={{ padding: 12, borderRadius: 10, border: "1px solid #333", background: "#111", color: "#fff" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: "#7a2423",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {msg && <p style={{ marginTop: 8 }}>{msg}</p>}

        <p style={{ opacity: 0.7, fontSize: 12 }}>
          Accès réservé à l’administration du site Lalie.
        </p>
      </form>
    </main>
  );
}