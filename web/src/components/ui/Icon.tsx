import type { IconName } from "@/data/types";

// Jeu d'icônes au trait, dessiné sur une grille de 24 px, trait 1.5.
const paths: Record<IconName, React.ReactNode> = {
  cart: (<><path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2" /><circle cx="9.5" cy="19.5" r="1.2" /><circle cx="17" cy="19.5" r="1.2" /></>),
  chart: (<><path d="M4 20h16" /><path d="M7 16V10M7 8V6" /><rect x="5.5" y="10" width="3" height="5" rx=".6" /><path d="M12 14V7M12 18v-1" /><rect x="10.5" y="7" width="3" height="7" rx=".6" /><path d="M17 12V9M17 17v-1" /><rect x="15.5" y="12" width="3" height="4" rx=".6" /></>),
  spark: (<><path d="M12 3.5l1.7 5.1a2 2 0 0 0 1.3 1.3l5.1 1.7-5.1 1.7a2 2 0 0 0-1.3 1.3L12 19.7l-1.7-5.1a2 2 0 0 0-1.3-1.3L3.9 11.6 9 9.9a2 2 0 0 0 1.3-1.3z" /><path d="M19 3v3M17.5 4.5h3" /></>),
  compass: (<><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>),
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  "chevron-down": <path d="M6 9l6 6 6-6" />,
  clock: (<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>),
  wallet: (<><rect x="3.5" y="6" width="17" height="13" rx="2.5" /><path d="M3.5 9.5h17M16 14h1.5" /><path d="M6 6l9.5-2.5a1.5 1.5 0 0 1 1.9 1.1L17.8 6" /></>),
  layers: (<><path d="M12 4l8.5 4.5L12 13 3.5 8.5z" /><path d="M3.5 12.5L12 17l8.5-4.5" /><path d="M3.5 16.2L12 20.7l8.5-4.5" /></>),
  shield: (<><path d="M12 3.5l7 2.8v5.4c0 4.3-2.9 7.5-7 8.8-4.1-1.3-7-4.5-7-8.8V6.3z" /><path d="M9 12l2.2 2.2L15.5 10" /></>),
  alert: (<><path d="M12 4.2l8.8 15.3H3.2z" /><path d="M12 10v4.2M12 16.8v.2" /></>),
  play: (<><circle cx="12" cy="12" r="8.5" /><path d="M10.2 8.8l5 3.2-5 3.2z" /></>),
  download: (<><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" /><path d="M5 19.5h14" /></>),
  user: (<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.8 20c.9-3.6 3.8-5.5 7.2-5.5s6.3 1.9 7.2 5.5" /></>),
  target: (<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.8" /><circle cx="12" cy="12" r="1.2" /></>),
  route: (<><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16" /></>),
  book: (<><path d="M4.5 5.5A2 2 0 0 1 6.5 3.5H19.5v14H6.5a2 2 0 0 0-2 2z" /><path d="M4.5 19.5a2 2 0 0 0 2 1h13v-3" /></>),
  eye: (<><path d="M2.8 12S6.2 5.5 12 5.5 21.2 12 21.2 12 17.8 18.5 12 18.5 2.8 12 2.8 12z" /><circle cx="12" cy="12" r="2.8" /></>),
  scale: (<><path d="M12 4v16M7 20h10M5 7h14" /><path d="M5 7l-2.5 6a3 3 0 0 0 5 0zM19 7l-2.5 6a3 3 0 0 0 5 0z" /></>),
  flag: (<><path d="M5.5 21V4" /><path d="M5.5 4.5h11l-2 4 2 4h-11" /></>),
  lock: (<><rect x="5" y="10.5" width="14" height="10" rx="2.2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>),
  mail: (<><rect x="3.5" y="5.5" width="17" height="13" rx="2.2" /><path d="M4 7l8 6 8-6" /></>),
  menu: <path d="M4 7.5h16M4 12h16M4 16.5h16" />,
  logout: (<><path d="M14 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H14" /><path d="M10 12h10M16.5 8.5L20 12l-3.5 3.5" /></>),
  refresh: (<><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" /><path d="M19.5 4.5v4h-4" /></>),
};

export function Icon({ name, className = "size-5", strokeWidth = 1.5 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
