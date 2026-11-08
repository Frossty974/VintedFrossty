import Link from "next/link";
import type { Accent } from "@/data/types";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-md font-display uppercase tracking-[0.03em] transition-all duration-200 ease-out select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
const sizes = { md: "h-11 px-5 text-[1.05rem]", lg: "h-14 px-7 text-[1.3rem]", sm: "h-9 px-4 text-[0.95rem]" };
const variants: Record<Variant, string> = {
  primary:
    "bg-lime text-[#121212] border-2 border-[#121212] shadow-[4px_4px_0_0_#f4f0e6] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#f4f0e6] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_0_#f4f0e6]",
  secondary:
    "text-fg border-2 border-fg/80 hover:bg-fg hover:text-[#121212]",
  ghost: "text-muted hover:text-lime",
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
  electric: "text-lime",
  violet: "text-red",
  cyan: "text-lime",
  emerald: "text-paper",
};

export const accentGlow: Record<Accent, string> = {
  electric: "rgb(199 255 61 / 0.2)",
  violet: "rgb(255 91 69 / 0.2)",
  cyan: "rgb(199 255 61 / 0.2)",
  emerald: "rgb(244 240 230 / 0.15)",
};

export const accentSoft: Record<Accent, string> = {
  electric: "rgb(199 255 61 / 0.09)",
  violet: "rgb(255 91 69 / 0.09)",
  cyan: "rgb(199 255 61 / 0.09)",
  emerald: "rgb(244 240 230 / 0.07)",
};

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow inline-flex items-center gap-2 ${className}`}>
      <span className="inline-block size-2 rotate-45 bg-lime" />
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
      <h2 className="display mt-4 text-[clamp(2.6rem,6.4vw,5rem)] text-balance">{title}</h2>
      {lead && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted text-pretty">{lead}</p>}
    </div>
  );
}

export function DemoBadge({ children = "Contenu de démonstration" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex -rotate-1 items-center gap-1.5 bg-warn px-2.5 py-1 font-display text-[0.8rem] uppercase tracking-wide text-[#121212]">
      {children}
    </span>
  );
}

export function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-muted ${className}`}>{children}</span>;
}

export function RiskNotice({ text, compact }: { text: string; compact?: boolean }) {
  return (
    <div role="note" className={`flex gap-3 border-l-4 border-red bg-red/[0.08] ${compact ? "p-3.5 text-sm" : "p-5"}`}>
      <Icon name="alert" className="mt-0.5 size-5 shrink-0 text-red" />
      <div>
        <p className="display text-lg text-red">Risque de perte en capital</p>
        <p className="mt-1 leading-relaxed text-fg/80">{text}</p>
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
