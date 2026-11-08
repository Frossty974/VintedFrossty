import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { accentSoft, accentText, formatHours, formatPrice } from "@/components/ui/primitives";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { getDomain } from "@/data/domains";
import { lessonCount } from "@/data/courses";
import type { Course } from "@/data/types";

export function CourseCard({ course }: { course: Course }) {
  const domain = getDomain(course.domain)!;
  return (
    <SpotlightCard glow={accentSoft[domain.accent]} className="h-full">
      <Link href={`/formations/${course.slug}`} className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-2 text-xs font-medium ${accentText[domain.accent]}`}>
            <Icon name={domain.icon} className="size-4" />
            {domain.name}
          </span>
          {domain.riskNotice && (
            <span className="inline-flex items-center gap-1 rounded-full border border-risk/25 px-2 py-0.5 text-[0.65rem] text-[#ffb3b3]" title="Domaine comportant des risques financiers">
              <Icon name="alert" className="size-3" /> Risques
            </span>
          )}
        </div>
        <h3 className="mt-5 text-xl font-semibold leading-snug tracking-[-0.02em]">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{course.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs text-faint">
          <span className="inline-flex items-center gap-1.5"><Icon name="layers" className="size-3.5" />{course.level}</span>
          <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="size-3.5" />{formatHours(course.hours)}</span>
          <span className="inline-flex items-center gap-1.5"><Icon name="book" className="size-3.5" />{lessonCount(course)} leçons</span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-lg font-semibold tracking-tight">{formatPrice(course.price)}</span>
          <span className="inline-flex items-center gap-1 text-sm text-muted transition group-hover/spot:text-fg">
            Voir le programme
            <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover/spot:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}
