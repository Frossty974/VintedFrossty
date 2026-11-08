"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { CourseModule } from "@/data/types";

export function ProgramAccordion({ modules }: { modules: CourseModule[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const toggle = (i: number) => setOpen((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  const allOpen = open.size === modules.length;
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(modules.map((_, i) => i)))} className="text-sm text-[#9db4ff] hover:text-fg">
          {allOpen ? "Tout replier" : "Tout déplier"}
        </button>
      </div>
      <ol className="grid gap-3">
        {modules.map((m, i) => {
          const isOpen = open.has(i);
          return (
            <li key={m.title} className={`overflow-hidden rounded-2xl border transition-colors ${isOpen ? "border-line-strong bg-white/[0.025]" : "border-line"}`}>
              <button type="button" onClick={() => toggle(i)} aria-expanded={isOpen} className="flex w-full items-center gap-4 p-5 text-left">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line-strong font-mono text-xs text-[#9db4ff]">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block font-medium">{m.title}</span>
                  <span className="mt-0.5 block text-xs text-faint">{m.lessons.length} leçons · {m.hours.toLocaleString("fr-FR")} h</span>
                </span>
                <Icon name="chevron-down" className={`size-4 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                    <ul className="grid gap-1 px-5 pb-5 pl-[4.25rem]">
                      {m.lessons.map((l) => (
                        <li key={l} className="flex items-center gap-3 py-1.5 text-sm text-muted">
                          <Icon name="play" className="size-3.5 shrink-0 text-faint" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
