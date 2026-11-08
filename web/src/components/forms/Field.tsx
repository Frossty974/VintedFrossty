"use client";

import { useId } from "react";

const inputCls =
  "w-full rounded-md border bg-white/[0.025] px-4 text-[0.95rem] text-fg placeholder:text-faint transition focus:bg-white/[0.04] focus:outline-none";

export function Field({
  label,
  error,
  hint,
  textarea,
  ...props
}: { label: string; error?: string; hint?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  const border = error ? "border-risk/60 focus:border-risk" : "border-line-strong focus:border-electric/70";
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-fg/85">{label}</label>
      {textarea ? (
        <textarea id={id} aria-invalid={!!error} aria-describedby={describedBy} className={`${inputCls} ${border} min-h-36 py-3`} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={id} aria-invalid={!!error} aria-describedby={describedBy} className={`${inputCls} ${border} h-12`} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error ? <p id={`${id}-err`} className="mt-1.5 text-xs text-red">{error}</p> : hint ? <p id={`${id}-hint`} className="mt-1.5 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}

export function Checkbox({ label, error, ...props }: { label: React.ReactNode; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
        <input id={id} type="checkbox" aria-invalid={!!error} className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#c7ff3d]" {...props} />
        <span>{label}</span>
      </label>
      {error && <p className="ml-7 mt-1 text-xs text-red">{error}</p>}
    </div>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success" | "info"; children: React.ReactNode }) {
  const cls = { error: "border-risk/30 bg-risk/[0.07] text-red", success: "border-ok/30 bg-ok/[0.07] text-fg", info: "border-electric/30 bg-electric/[0.07] text-fg" }[tone];
  return <div role={tone === "error" ? "alert" : "status"} className={`rounded-md border px-4 py-3 text-sm leading-relaxed ${cls}`}>{children}</div>;
}
