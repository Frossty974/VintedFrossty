"use client";

import { useEffect, useState } from "react";
import { getCourse } from "@/data/courses";
import type { Course } from "@/data/types";
import { useAccount } from "@/lib/account/AccountProvider";
import { idFromSlug, isCommunitySlug, toCourse } from "./types";

/** Formations communautaires certifiées, chargées côté navigateur. */
export function useCommunityCourses() {
  const { backend } = useAccount();
  const [list, setList] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    backend
      .listApprovedCommunity()
      .then((l) => alive && setList(l.map(toCourse)))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [backend]);
  return { list, loading };
}

/** Résout une formation par son identifiant, qu'elle soit officielle ou communautaire. */
export function useResolvedCourse(slug: string) {
  const { backend } = useAccount();
  const official = getCourse(slug);
  const [course, setCourse] = useState<Course | null>(official ?? null);
  const [loading, setLoading] = useState(!official);
  useEffect(() => {
    if (official || !isCommunitySlug(slug)) {
      setLoading(false);
      return;
    }
    let alive = true;
    backend
      .getCommunityCourse(idFromSlug(slug))
      .then((cc) => alive && setCourse(cc && cc.status === "approved" ? toCourse(cc) : null))
      .catch(() => alive && setCourse(null))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug, official, backend]);
  return { course, loading };
}
