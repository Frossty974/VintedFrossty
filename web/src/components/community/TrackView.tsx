"use client";

import { useEffect } from "react";
import { getBackend } from "@/lib/account/backend";

/** Compte une vue de la formation (une seule fois par jour et par navigateur). */
export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    getBackend().track(slug, "view");
  }, [slug]);
  return null;
}
