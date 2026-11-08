"use client";

import { useRef } from "react";

// Carte avec un halo lumineux qui suit le curseur. Purement décoratif.
export function SpotlightCard({ children, className = "", glow = "rgb(76 125 255 / 0.18)" }: { children: React.ReactNode; className?: string; glow?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group/spot relative overflow-hidden rounded-3xl border border-line bg-[linear-gradient(180deg,rgb(255_255_255/0.035),rgb(255_255_255/0.01))] transition-[border-color,transform] duration-500 hover:border-line-strong ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), ${glow}, transparent 60%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
