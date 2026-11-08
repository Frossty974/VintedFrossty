"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "./AccountProvider";
import type { Enrollment, ProgressMap, QuizRecord } from "./backend";

export function useAccountData() {
  const { user, backend, ready } = useAccount();
  const [quiz, setQuiz] = useState<QuizRecord[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [q, e, p] = await Promise.all([backend.listQuiz(), backend.listEnrollments(), backend.getProgress()]);
      setQuiz(q);
      setEnrollments(e);
      setProgress(p);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger tes données.");
    } finally {
      setLoading(false);
    }
  }, [user, backend]);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  const setLesson = useCallback(
    async (slug: string, key: string, done: boolean) => {
      // Mise à jour optimiste, annulée en cas d'échec.
      const prev = progress;
      setProgress((p) => {
        const set = new Set(p[slug] ?? []);
        if (done) set.add(key);
        else set.delete(key);
        return { ...p, [slug]: [...set] };
      });
      try {
        await backend.setLesson(slug, key, done);
      } catch {
        setProgress(prev);
        setError("La progression n'a pas pu être enregistrée.");
      }
    },
    [backend, progress],
  );

  return { user, ready, loading, error, quiz, enrollments, progress, setLesson, reload: load };
}
