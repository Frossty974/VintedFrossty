import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatHours, formatPrice } from "@/components/ui/primitives";
import { lessonCount } from "@/data/courses";
import { getDomain } from "@/data/domains";
import type { Course } from "@/data/types";

export function CourseCard({ course }: { course: Course }) {
  const domain = getDomain(course.domain)!;
  return (
    <Link href={`/formations/${course.slug}`} className="paper group flex h-full flex-col rounded-md p-5 transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-0.6deg]">
      <div className="flex items-center justify-between gap-3">
        <span className="bg-red px-2 py-0.5 font-display text-sm uppercase tracking-wide text-white">Formation</span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#171717]/60">
          <Icon name={domain.icon} className="size-4" />
          {domain.name}
        </span>
      </div>
      <h3 className="mt-4 text-[1.4rem] font-extrabold leading-tight text-[#171717]">{course.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#171717]/70">{course.subtitle}</p>
      {domain.riskNotice && <p className="mt-3 self-start bg-[#171717] px-2 py-0.5 text-[0.7rem] font-bold uppercase text-red">Risque de perte en capital</p>}
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[#171717]/70">
        <span className="inline-flex items-center gap-1"><Icon name="layers" className="size-3.5" />{course.level}</span>
        <span className="inline-flex items-center gap-1"><Icon name="clock" className="size-3.5" />{formatHours(course.hours)}</span>
        <span className="inline-flex items-center gap-1"><Icon name="book" className="size-3.5" />{lessonCount(course)} leçons</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[#171717]/20 pt-4">
        <span className="display text-3xl text-[#171717]">{formatPrice(course.price)}</span>
        <span className="grid size-10 place-items-center rounded-full bg-[#171717] text-lime transition-transform group-hover:translate-x-1">
          <Icon name="arrow-right" className="size-5" />
        </span>
      </div>
    </Link>
  );
}
