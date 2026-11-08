"use client";

import { Icon } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/primitives";
import { useOrientation } from "./OrientationProvider";

export function FindPathButton({
  children = "Trouver ma voie",
  variant = "primary",
  size = "md",
  className = "",
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { open } = useOrientation();
  return (
    <button type="button" onClick={open} className={buttonClass(variant, size, className)} aria-haspopup="dialog">
      {children}
      <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}
