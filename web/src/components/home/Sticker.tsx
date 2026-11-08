// Éléments graphiques réutilisables du style NO LARP : traits, flèches, coches manuscrites.

export function HandArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 58c18 6 38-4 34-16-3-9-16-4-10 6 8 13 42 8 70-30" />
      <path d="M86 14l15 3-4 15" />
    </svg>
  );
}

export function Burst({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} stroke="currentColor" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
      <path d="M8 26l-6 3M12 14L6 8M24 10l2-8" />
    </svg>
  );
}

export function HandCheck({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5c5-.6 13-.8 19 .3.4 6 .4 12-.2 17.5-6 .7-13 .5-18.5-.2-.5-6-.6-12-.3-17.6z" />
      <path d="M8.5 14.5l4 4.5L25 4" />
    </svg>
  );
}
