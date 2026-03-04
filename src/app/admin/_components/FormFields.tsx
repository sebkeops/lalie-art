import type { ReactNode } from "react";

export function Card({
  title,
  children,
  right,
}: {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
      {(title || right) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          {title ? <h2 className="text-lg font-semibold">{title}</h2> : <div />}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="text-sm font-medium text-white/90">{children}</span>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none",
        "focus:border-white/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none",
        "focus:border-white/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 outline-none",
        "focus:border-white/40",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function Button({
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition disabled:opacity-60";
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

export function Notice({ msg }: { msg: string }) {
  const ok = msg.startsWith("✅");
  return (
    <div
      className={[
        "text-sm rounded-xl border px-4 py-3",
        ok
          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
          : "border-red-400/30 bg-red-500/10 text-red-100",
      ].join(" ")}
    >
      {msg}
    </div>
  );
}
