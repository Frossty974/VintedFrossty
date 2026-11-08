import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/account/CoursePlayer";
import { RequireAuth } from "@/components/account/RequireAuth";
import { getCourse } from "@/data/courses";

export const metadata: Metadata = { title: "Ma formation", robots: { index: false } };

export default async function CourseSpacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCourse(slug)) notFound();
  return (
    <RequireAuth>
      <CoursePlayer slug={slug} />
    </RequireAuth>
  );
}
