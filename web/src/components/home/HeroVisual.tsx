"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/data/types";

interface Node {
  label: string;
  icon: IconName;
  angle: number;
  r: number;
  color: string;
  primary?: boolean;
}

const nodes: Node[] = [
  { label: "E-commerce", icon: "cart", angle: -90, r: 34, color: "#6f97ff", primary: true },
  { label: "IA & contenu", icon: "spark", angle: 0, r: 34, color: "#5fdcef", primary: true },
  { label: "Marchés financiers", icon: "chart", angle: 90, r: 34, color: "#a48dff", primary: true },
  { label: "Business digital", icon: "compass", angle: 180, r: 34, color: "#6fe0b4", primary: true },
  { label: "Création vidéo", icon: "play", angle: -38, r: 46, color: "#5fdcef" },
  { label: "Freelancing", icon: "user", angle: 142, r: 46, color: "#6fe0b4" },
  { label: "Investissement", icon: "scale", angle: 52, r: 46, color: "#a48dff" },
  { label: "Marketing", icon: "target", angle: 232, r: 46, color: "#6f97ff" },
];

const pos = (n: Node) => {
  const a = (n.angle * Math.PI) / 180;
  return { x: 50 + n.r * Math.cos(a), y: 50 + n.r * Math.sin(a) };
};

const ROTATION = 140; // secondes par tour

export function HeroVisual() {
  const reduce = useReducedMotion();
  const spin = reduce ? {} : { rotate: 360 };
  const counter = reduce ? {} : { rotate: -360 };
  const loop = { duration: ROTATION, ease: "linear" as const, repeat: Infinity };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(560px,92vw)] select-none" aria-hidden="true">
      {/* Halo */}
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgb(76_125_255/0.32),rgb(139_108_255/0.14)_45%,transparent_70%)] blur-2xl" />

      {/* Anneaux fixes */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4c7dff" stopOpacity=".5" />
            <stop offset=".5" stopColor="#8b6cff" stopOpacity=".12" />
            <stop offset="1" stopColor="#3fd0e8" stopOpacity=".45" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="34" fill="none" stroke="url(#ring)" strokeWidth=".18" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(255 255 255 / .07)" strokeWidth=".15" strokeDasharray=".6 1.4" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="rgb(255 255 255 / .06)" strokeWidth=".15" />
      </svg>

      {/* Système en rotation */}
      <motion.div className="absolute inset-0" animate={spin} transition={loop}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
          <defs>
            {nodes.map((n, i) => {
              const p = pos(n);
              return (
                <linearGradient key={i} id={`l${i}`} gradientUnits="userSpaceOnUse" x1="50" y1="50" x2={p.x} y2={p.y}>
                  <stop offset="0" stopColor="#fff" stopOpacity=".35" />
                  <stop offset="1" stopColor={n.color} stopOpacity={n.primary ? ".55" : ".25"} />
                </linearGradient>
              );
            })}
          </defs>
          {nodes.map((n, i) => {
            const p = pos(n);
            return (
              <g key={n.label}>
                <line x1="50" y1="50" x2={p.x} y2={p.y} stroke={`url(#l${i})`} strokeWidth={n.primary ? 0.22 : 0.14} />
                {!reduce && (
                  <circle r={n.primary ? 0.55 : 0.4} fill={n.color}>
                    <animateMotion dur={`${3.2 + (i % 4) * 0.7}s`} begin={`${i * 0.45}s`} repeatCount="indefinite" path={`M${p.x} ${p.y} L50 50`} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .2 1" />
                    <animate attributeName="opacity" dur={`${3.2 + (i % 4) * 0.7}s`} begin={`${i * 0.45}s`} values="0;1;1;0" keyTimes="0;.15;.85;1" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
          {/* Liaisons entre domaines voisins */}
          {nodes.slice(0, 4).map((n, i) => {
            const a = pos(n);
            const b = pos(nodes[(i + 1) % 4]);
            return <path key={i} d={`M${a.x} ${a.y} Q50 50 ${b.x} ${b.y}`} fill="none" stroke="rgb(255 255 255 / .05)" strokeWidth=".15" />;
          })}
        </svg>

        {nodes.map((n) => {
          const p = pos(n);
          return (
            <div key={n.label} className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}>
              <motion.div animate={counter} transition={loop}>
                <div
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border backdrop-blur-md ${
                    n.primary ? "border-white/15 bg-[#0d1122]/80 px-3 py-1.5 text-[clamp(0.62rem,1.6vw,0.8rem)] text-fg shadow-[0_8px_30px_-8px_rgb(0_0_0/0.6)]" : "border-white/[0.08] bg-[#0b0e1b]/70 px-2.5 py-1 text-[clamp(0.56rem,1.4vw,0.7rem)] text-muted"
                  }`}
                  style={n.primary ? { boxShadow: `0 0 24px -6px ${n.color}66` } : undefined}
                >
                  <span style={{ color: n.color }}>
                    <Icon name={n.icon} className={n.primary ? "size-[1.1em]" : "size-[1em]"} />
                  </span>
                  {n.label}
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Noyau central */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 size-[clamp(64px,16vw,96px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-electric/40"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.9], opacity: [0.6, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, delay: i * 1.2, ease: "easeOut" }}
            />
          ))}
        <div className="relative grid size-[clamp(64px,16vw,96px)] place-items-center rounded-full border border-white/20 bg-[radial-gradient(circle_at_30%_25%,#2a3a7a,#0e1330_60%,#080a18)] shadow-[0_0_60px_-4px_rgb(76_125_255/0.7),inset_0_1px_0_rgb(255_255_255/0.2)]">
          <div className="text-center">
            <div className="font-mono text-[clamp(0.5rem,1.3vw,0.62rem)] uppercase tracking-[0.2em] text-[#9db4ff]">Ton profil</div>
            <div className="mx-auto mt-1 size-1.5 rounded-full bg-cyan shadow-[0_0_12px_3px_rgb(63_208_232/0.7)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
