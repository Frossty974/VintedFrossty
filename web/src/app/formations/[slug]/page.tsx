import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetail } from "@/components/catalog/CourseDetail";
import { courses, getCourse, getCoursesByDomain } from "@/data/courses";
import { getDomain } from "@/data/domains";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse((await params).slug);
  if (!course) return {};
  return {
    title: course.title,
    description: `${course.subtitle} ${course.presentation.slice(0, 120)}…`,
    alternates: { canonical: `/formations/${course.slug}` },
    openGraph: { title: `${course.title} · ${site.name}`, description: course.subtitle },
  };
}

export default async function CoursePage({ params }: Props) {
  const course = getCourse((await params).slug);
  if (!course) notFound();
  const domain = getDomain(course.domain)!;
  const related = getCoursesByDomain(domain.slug).filter((c) => c.slug !== course.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.presentation,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    educationalLevel: course.level,
    inLanguage: "fr",
    timeRequired: `PT${course.hours}H`,
    teaches: course.skills,
    offers: { "@type": "Offer", price: course.price, priceCurrency: "EUR", category: "Paid" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CourseDetail course={course} related={related} />
    </>
  );
}
