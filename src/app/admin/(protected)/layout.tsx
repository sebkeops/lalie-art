import type { ReactNode } from "react";
import AdminTopbar from "../_components/AdminTopbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen adminShell">
      <AdminTopbar />
      <main className="mx-auto max-w-6xl px-4 py-8 adminShell">{children}</main>
    </div>
  );
}