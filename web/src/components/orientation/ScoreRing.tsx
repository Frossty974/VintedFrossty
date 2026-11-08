"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useId, useRef } from "react";

export function ScoreRing({ score, size = 120, delay = 0 }: { score: number; size?: number; delay?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const id = useId();
  const v = useMotionValue(reduce ? score : 0);
  const text = useTransform(v, (x) => `${Math.round(x)}`);
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = useTransform(v, (x) => c - (x / 100) * c);

  useEffect(() => {
    if (!inView || reduce) return;
    const ctl = animate(v, score, { duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] });
    return () => ctl.stop();
  }, [inView, score, v, delay, reduce]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Compatibilité ${score} %`}>
      <svg ref={ref} viewBox="0 0 100 100" className="size-full -rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c7ff3d" />
            <stop offset=".6" stopColor="#c7ff3d" />
            <stop offset="1" stopColor="#e6ff9c" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(244 240 230 / 0.1)" strokeWidth="7" />
        <motion.circle cx="50" cy="50" r={r} fill="none" stroke={`url(#${id})`} strokeWidth="7" strokeLinecap="butt" strokeDasharray={c} style={{ strokeDashoffset: offset }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
        <div className="text-center leading-none">
          <span className="display" style={{ fontSize: size * 0.27 }}>
            <motion.span>{text}</motion.span>
            <span className="text-muted" style={{ fontSize: size * 0.14 }}> %</span>
          </span>
        </div>
      </div>
    </div>
  );
}
