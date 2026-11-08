"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
  /** Anime dès l'affichage plutôt qu'à l'entrée dans l'écran (contenu prioritaire). */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0, filter: "blur(0px)" } }
        : { whileInView: { opacity: 1, y: 0, filter: "blur(0px)" }, viewport: { once: true, margin: "0px 0px -8% 0px" } })}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
