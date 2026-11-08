import Link from "next/link";

// Logo NO LARP : un masque de théâtre barré, avec une flèche vers l'avant.
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 9c-6 0-10.5 1.6-10.5 1.6s-.6 8.3 1.6 14c2 5.4 5.6 8.4 8.9 8.4s6.9-3 8.9-8.4c2.2-5.7 1.6-14 1.6-14S30 9 24 9z" fill="#f4f0e6" />
      <path d="M17.2 17.6c1.4-1 3.3-1 4.6.2-1.5 1-3.2 1-4.6-.2zM26.2 17.8c1.3-1.2 3.2-1.2 4.6-.2-1.4 1.2-3.1 1.2-4.6.2zM19.6 26.4c2.6-1.6 6.2-1.6 8.8 0-2.6.8-6.2.8-8.8 0z" fill="#121212" />
      <path d="M24 3.5A20.5 20.5 0 1 0 41.6 34" fill="none" stroke="#c7ff3d" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M9.5 9.5l29 29" stroke="#c7ff3d" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M33.5 36.5h10m-4-4.5 4.5 4.5-4.5 4.5" fill="none" stroke="#c7ff3d" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="NO LARP — accueil">
      <LogoMark className="size-9 transition-transform duration-300 group-hover:-rotate-12" />
      <span className="display whitespace-nowrap text-[1.65rem] leading-none">No Larp</span>
    </Link>
  );
}
