import Link from "next/link";
import type { Accent } from "@/data/types";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
const sizes = { md: "h-11 px-5 text-[0.92rem]", lg: "h-13 px-7 text-base", sm: "h-9 px-4 text-sm" };
const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(110deg,#3f6dff,#7b5cff_55%,#36bfe0)] shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset,0_8px_30px_-8px_rgb(76_125_255/0.6)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2)_inset,0_12px_40px_-8px_rgb(123_92_255/0.75)] hover:-translate-y-px active:translate-y-0",
  secondary:
    "text-fg bg-white/[0.04] border border-line-strong hover:bg-white/[0.08] hover:border-white/25 backdrop-blur-md",
  ghost: "text-muted hover:text-fg",
};

export function buttonClass(variant: Variant = "primary", size: keyof typeof sizes = "md", extra = "") {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
      {arrow && <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
    </Link>
  );
}

export const accentText: Record<Accent, string> = {
  electric: "text-[#8aa8ff]",
  violet: "text-[#b3a1ff]",
  cyan: "text-[#7fe3f2]",
  emerald: "text-[#79e3bb]",
};

export const accentGlow: Record<Accent, string> = {
  electric: "rgb(76 125 255 / 0.35)",
  violet: "rgb(139 108 255 / 0.35)",
  cyan: "rgb(63 208 232 / 0.3)",
  emerald: "rgb(74 214 160 / 0.28)",
};

export const accentSoft: Record<Accent, string> = {
  electric: "rgb(76 125 255 / 0.16)",
  violet: "rgb(139 108 255 / 0.16)",
  cyan: "rgb(63 208 232 / 0.13)",
  emerald: "rgb(74 214 160 / 0.12)",
};

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow inline-flex items-center gap-2 ${className}`}>
      <span className="h-px w-6 bg-gradient-to-r from-transparent to-cyan/70" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <Eyebrow className={align === "center" ? "justify-center" : ""}>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-gradient text-balance">{title}</h2>
      {lead && <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">{lead}</p>}
    </div>
  );
}

export function DemoBadge({ children = "Contenu de démonstration" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warn/30 bg-warn/[0.08] px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-warn">
      <span className="size-1.5 rounded-full bg-warn" />
      {children}
    </span>
  );
}

export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-muted ${className}`}>{children}</span>;
}

export function RiskNotice({ text, compact }: { text: string; compact?: boolean }) {
  return (
    <div role="note" className={`flex gap-3 rounded-2xl border border-risk/25 bg-risk/[0.06] ${compact ? "p-3.5 text-sm" : "p-5"}`}>
      <Icon name="alert" className="mt-0.5 size-5 shrink-0 text-risk" />
      <div>
        <p className="font-medium text-[#ffb3b3]">Avertissement sur les risques</p>
        <p className="mt-1 leading-relaxed text-[#e9c4c4]/85">{text}</p>
      </div>
    </div>
  );
}

export function formatPrice(n: number) {
  return `${n.toLocaleString("fr-FR")} €`;
}

export function formatBudget(min: number, max: number) {
  if (max === 0) return "0 €";
  if (min === 0) return `0 – ${max.toLocaleString("fr-FR")} €`;
  return `${min.toLocaleString("fr-FR")} – ${max.toLocaleString("fr-FR")} €`;
}

export function formatHours(h: number) {
  return `${h.toLocaleString("fr-FR")} h`;
}
