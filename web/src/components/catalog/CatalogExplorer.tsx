"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { courses } from "@/data/courses";
import { domains } from "@/data/domains";
import type { Level } from "@/data/types";
import { CourseCard } from "./CourseCard";

const levels: (Level | "Tous")[] = ["Tous", "Débutant", "Intermédiaire", "Avancé"];

export function CatalogExplorer({ initialDomain }: { initialDomain?: string }) {
  const [domain, setDomain] = useState<string>(domains.some((d) => d.slug === initialDomain) ? initialDomain! : "all");
  const [level, setLevel] = useState<(typeof levels)[number]>("Tous");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (domain === "all" || c.domain === domain) &&
        (level === "Tous" || c.level === level) &&
        (!q || [c.title, c.subtitle, ...c.skills].some((s) => s.toLowerCase().includes(q))),
    );
  }, [domain, level, query]);

  const selectDomain = (slug: string) => {
    setDomain(slug);
    const url = new URL(window.location.href);
    if (slug === "all") url.searchParams.delete("domaine");
    else url.searchParams.set("domaine", slug);
    window.history.replaceState(null, "", url);
  };

  const tabs = [{ slug: "all", name: "Tous les domaines" }, ...domains.map((d) => ({ slug: d.slug, name: d.name }))];

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="Filtrer par domaine">
          <div className="flex w-max gap-1 rounded-full border border-line bg-white/[0.02] p-1">
            {tabs.map((t) => (
              <button
                key={t.slug}
                role="tab"
                aria-selected={domain === t.slug}
                onClick={() => selectDomain(t.slug)}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${domain === t.slug ? "text-fg" : "text-muted hover:text-fg"}`}
              >
                {domain === t.slug && <motion.span layoutId="cat-tab" className="absolute inset-0 -z-0 rounded-full bg-white/[0.08]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                <span className="relative">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative block">
            <span className="sr-only">Rechercher une formation</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" strokeLinecap="round" /></svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une compétence…"
              className="h-10 w-full rounded-full border border-line bg-white/[0.02] pl-10 pr-4 text-sm text-fg placeholder:text-faint focus:border-electric/60 focus:outline-none sm:w-64"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Niveau</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as typeof level)} className="h-10 w-full appearance-none rounded-full border border-line bg-[#171717] pl-4 pr-10 text-sm text-fg focus:border-electric/60 focus:outline-none sm:w-auto">
              {levels.map((l) => (
                <option key={l} value={l}>{l === "Tous" ? "Tous niveaux" : l}</option>
              ))}
            </select>
            <Icon name="chevron-down" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-faint" aria-live="polite">{list.length} formation{list.length > 1 ? "s" : ""}</p>

      <motion.div layout className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c) => (
            <motion.div key={c.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
              <CourseCard course={c} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <div className="mt-10 rounded-lg border border-dashed border-line-strong p-10 text-center text-muted">
          Aucune formation ne correspond à ces filtres.
          <button className="ml-2 text-lime underline-offset-4 hover:underline" onClick={() => { setQuery(""); setLevel("Tous"); selectDomain("all"); }}>
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}
