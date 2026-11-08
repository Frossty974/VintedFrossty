"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Quiz } from "./Quiz";

const Ctx = createContext<{ open: () => void } | null>(null);

export function OrientationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => returnFocus.current?.focus(), 50);
  }, []);

  // Bloque le défilement de la page et garde le focus dans la fenêtre.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Rend le reste de la page inaccessible au clavier et aux lecteurs d'écran.
    const background = [document.querySelector("header"), document.getElementById("contenu"), document.querySelector("footer")].filter(Boolean) as HTMLElement[];
    background.forEach((el) => el.setAttribute("inert", ""));
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const els = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])");
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = prev;
      background.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("keydown", trap);
    };
  }, [isOpen]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="absolute inset-0 bg-[#121212]/75 backdrop-blur-md" onClick={close} aria-hidden="true" />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Questionnaire d'orientation"
              className="ring-gradient relative h-[100dvh] w-full overflow-hidden bg-night sm:h-[min(720px,92dvh)] sm:max-w-2xl sm:rounded-lg"
              initial={{ y: 40, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Quiz onClose={close} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function useOrientation() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useOrientation doit être utilisé dans OrientationProvider");
  return v;
}
