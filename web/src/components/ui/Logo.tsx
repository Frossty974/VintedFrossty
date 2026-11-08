import Link from "next/link";
import { site } from "@/data/site";

export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="lg-k" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b86ff" />
          <stop offset=".55" stopColor="#8b6cff" />
          <stop offset="1" stopColor="#3fd0e8" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="url(#lg-k)" strokeWidth="1.4" opacity=".55" />
      <path d="M16 6.5v19" stroke="url(#lg-k)" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 16l7-6.5M16 16l7 6.5" stroke="url(#lg-k)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.6" fill="#fff" />
      <circle cx="23" cy="9.5" r="1.6" fill="#3fd0e8" />
      <circle cx="23" cy="22.5" r="1.6" fill="#8b6cff" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label={`${site.name} — accueil`}>
      <LogoMark className="size-7 transition-transform duration-500 group-hover:rotate-[30deg]" />
      <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">{site.name}</span>
    </Link>
  );
}
