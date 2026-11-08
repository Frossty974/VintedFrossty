"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { Icon } from "./Icon";

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-white/[0.015]">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-white/[0.02]"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-[1.02rem] font-medium">{it.q}</span>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full border border-line transition-transform duration-300 ${isOpen ? "rotate-180 border-line-strong" : ""}`}>
                  <Icon name="chevron-down" className="size-4 text-muted" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-${i}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 leading-relaxed text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
