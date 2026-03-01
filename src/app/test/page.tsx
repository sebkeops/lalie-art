"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestPage() {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("artworks").select("id").limit(1);
      if (error) setStatus("❌ Supabase error: " + error.message);
      else setStatus("✅ Supabase connected. Rows: " + (data?.length ?? 0));
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Supabase Test</h1>
      <p>{status}</p>
    </main>
  );
}