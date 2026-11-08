"use client";

import { CourseDetail } from "@/components/catalog/CourseDetail";
import { EnrollPanel } from "@/components/catalog/EnrollPanel";
import { ButtonLink } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { communitySlug } from "@/lib/community/types";
import { useResolvedCourse } from "@/lib/community/useCommunity";
import { useAccount } from "@/lib/account/AccountProvider";

function NotAvailable() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <h1 className="display text-5xl">Formation introuvable</h1>
      <p className="mt-4 max-w-md text-muted">Elle n&apos;existe pas, ou n&apos;a pas encore été certifiée par l&apos;équipe NO LARP.</p>
      <div className="mt-8"><ButtonLink href="/formations" arrow>Voir le catalogue</ButtonLink></div>
    </section>
  );
}

function Loading() {
  return (
    <div className="container-x grid min-h-[70vh] place-items-center pt-24" aria-busy="true">
      <span className="size-8 animate-spin rounded-full border-2 border-white/10 border-t-lime" />
    </div>
  );
}

export function CommunityCoursePage({ id }: { id: string }) {
  const { course, loading } = useResolvedCourse(communitySlug(id));
  const { mode } = useAccount();
  if (loading) return <Loading />;
  if (!course) return <NotAvailable />;
  return (
    <>
      {mode === "demo" && (
        <p className="fixed inset-x-0 top-16 z-30 bg-warn px-4 py-1.5 text-center text-xs font-semibold text-[#121212]">
          Mode démo : cette formation communautaire n&apos;est visible que dans ce navigateur.
        </p>
      )}
      <CourseDetail course={course} />
    </>
  );
}

export function CommunityEnrollPage({ id }: { id: string }) {
  const { course, loading } = useResolvedCourse(communitySlug(id));
  if (loading) return <Loading />;
  if (!course) return <NotAvailable />;
  return (
    <section className="container-x pb-10 pt-28 sm:pt-36">
      <Link href={`/formations/c/${id}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><Icon name="arrow-left" className="size-4" />Retour au programme</Link>
      <h1 className="display mt-6 text-[clamp(2.4rem,5vw,3.8rem)]">S&apos;inscrire à « {course.title} »</h1>
      <p className="mt-3 text-muted">Proposée par {course.community?.author} · certifiée NO LARP</p>
      <div className="mt-10 max-w-2xl"><EnrollPanel course={course} /></div>
    </section>
  );
}
