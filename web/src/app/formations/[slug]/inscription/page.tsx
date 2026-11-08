import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollPanel } from "@/components/catalog/EnrollPanel";
import { Icon } from "@/components/ui/Icon";
import { formatBudget, formatHours, RiskNotice } from "@/components/ui/primitives";
import { courses, getCourse, lessonCount } from "@/data/courses";
import { getDomain } from "@/data/domains";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCourse((await params).slug);
  return { title: c ? `Inscription · ${c.title}` : "Inscription", robots: { index: false } };
}

export default async function EnrollPage({ params }: Props) {
  const course = getCourse((await params).slug);
  if (!course) notFound();
  const domain = getDomain(course.domain)!;
  return (
    <section className="container-x pb-10 pt-28 sm:pt-36">
      <Link href={`/formations/${course.slug}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><Icon name="arrow-left" className="size-4" />Retour au programme</Link>
      <h1 className="mt-6 text-[clamp(2rem,4.6vw,3.2rem)] display">S&apos;inscrire à « {course.title} »</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <div className="rounded-lg border border-line p-6">
            <p className="text-sm text-faint">{domain.name}</p>
            <p className="mt-1 text-lg font-medium">{course.title}</p>
            <ul className="mt-5 grid gap-3 text-sm text-muted">
              <li className="flex gap-2.5"><Icon name="layers" className="size-4 text-faint" />Niveau {course.level.toLowerCase()} · {course.prerequisites}</li>
              <li className="flex gap-2.5"><Icon name="clock" className="size-4 text-faint" />{formatHours(course.hours)} · {course.modules.length} modules · {lessonCount(course)} leçons</li>
              <li className="flex gap-2.5"><Icon name="wallet" className="size-4 text-faint" />Budget de départ indicatif hors formation : {formatBudget(course.startBudget.min, course.startBudget.max)}</li>
            </ul>
          </div>
          {domain.riskNotice && <div className="mt-5"><RiskNotice compact text={domain.riskNotice} /></div>}
          <ul className="mt-6 grid gap-2 text-sm text-faint">
            <li className="flex gap-2"><Icon name="shield" className="size-4" />Aucune promesse de résultat financier.</li>
            <li className="flex gap-2"><Icon name="scale" className="size-4" />Voir les <Link href="/legal/cgv" className="underline underline-offset-2 hover:text-fg">conditions générales</Link> et la <Link href="/legal/remboursement" className="underline underline-offset-2 hover:text-fg">politique de remboursement</Link>.</li>
          </ul>
        </div>
        <EnrollPanel course={course} />
      </div>
    </section>
  );
}
