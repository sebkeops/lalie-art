"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useRequireAuth() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.replace("/admin/login");
        return;
      }
      if (mounted) setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { ready };
}