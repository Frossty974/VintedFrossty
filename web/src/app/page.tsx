import Link from "next/link";
import { CourseCard } from "@/components/catalog/CourseCard";
import { Burst, HandArrow, HandCheck } from "@/components/home/Sticker";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { ButtonLink, Eyebrow, formatBudget } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { popularCourses } from "@/data/courses";
import { domains } from "@/data/domains";
import { faq } from "@/data/faq";
import { RankingBoard } from "@/components/community/RankingBoard";
import { CertifiedBadge } from "@/components/community/CertifiedBadge";

export default function Home() {
  return (
    <>
      <Hero />
      <FindYourModel />
      <Lambo />
      <Domains />
      <Popular />
      <WeeklyTop />
      <Propose />
      <Rules />
      <FaqSection />
    </>
  );
}

const promises = ["Anti-guru", "Anti-fake hustle", "Formations accessibles", "Programmes publics", "Progrès réels"];

function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-24 sm:pt-28">
      <div className="container-x grid items-start gap-10 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <Reveal>
            <div className="flex items-center gap-4 sm:gap-6">
              <LogoMark className="size-16 shrink-0 sm:size-28" />
              <h1 className="display whitespace-nowrap text-[clamp(4.2rem,13vw,9.6rem)] leading-[0.85]">
                <span className="sr-only">NO LARP — </span>
                <span aria-hidden="true">No Larp</span>
              </h1>
            </div>
            <div className="ml-20 mt-1 h-2 w-3/4 -rotate-1 bg-lime sm:ml-36" aria-hidden="true" />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-xl text-xl font-semibold leading-snug sm:text-2xl">
              Les formations en ligne pour entreprendre sur internet, <span className="hl">sans cinéma</span>, avec du concret.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <FindPathButton size="lg" />
              <ButtonLink href="/formations" variant="secondary" size="lg">Voir les formations</ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-fg">
              {[
                { i: "book" as const, t: "No Larp School" },
                { i: "layers" as const, t: "Programmes publics" },
                { i: "check" as const, t: "Faire avant de paraître" },
              ].map((x, idx) => (
                <li key={x.t} className="flex items-center gap-2">
                  {idx > 0 && <span className="mr-3 hidden h-8 w-0.5 rotate-12 bg-lime sm:block" aria-hidden="true" />}
                  <Icon name={x.i} className="size-6" strokeWidth={1.8} />
                  <span className="display text-lg leading-none">{x.t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="relative lg:mt-6">
          <div className="paper torn relative rotate-[1.5deg] px-7 pb-10 pt-9 sm:px-10">
            <Burst className="absolute right-8 top-6 size-10 text-red" />
            <p className="display text-[clamp(3rem,5.4vw,4.6rem)] text-[#171717]">Pas de cinéma.</p>
            <p className="display mt-1 inline-block -rotate-1 bg-lime whitespace-nowrap px-3 py-1 text-[clamp(3rem,5.4vw,4.6rem)] text-[#171717]">Du concret.</p>
          </div>
          <ul className="mt-10 grid gap-3 pl-2">
            {promises.map((p, i) => (
              <li key={p} className="hand flex items-center gap-3 text-2xl text-fg" style={{ transform: `rotate(${i % 2 ? 0.8 : -1}deg)` }}>
                <HandCheck className="size-7 shrink-0 text-lime" />
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function FindYourModel() {
  return (
    <section className="relative py-12 sm:py-20" aria-labelledby="modele">
      <div className="container-x grid items-stretch gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <div className="lime-block torn relative h-full -rotate-[0.8deg] px-7 py-12 sm:px-12 sm:py-16">
            <h2 id="modele" className="display text-[clamp(3.4rem,8vw,6.4rem)] text-[#171717]">
              Trouve ton modèle.<br />Teste.<br /><span className="scribble">Construis.</span>
            </h2>
            <HandArrow className="absolute bottom-10 right-8 hidden w-28 text-[#171717] sm:block" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between gap-8 rounded-lg border-2 border-line-strong bg-night p-7 sm:p-10">
            <div>
              <Eyebrow>Questionnaire gratuit · 2 min</Eyebrow>
              <p className="display mt-5 text-4xl sm:text-5xl">10 questions.<br />3 domaines faits pour toi.</p>
              <p className="mt-4 max-w-sm text-muted">Ton temps, ton budget, ton niveau. On compare, tu choisis.</p>
            </div>
            <div className="rounded-md border border-line bg-ink p-5" aria-hidden="true">
              <p className="text-sm text-faint">Question 4 / 10</p>
              <p className="mt-1 font-semibold">Quel budget peux-tu investir pour commencer ?</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {["0 €", "50 à 100 €", "100 à 300 €"].map((o, i) => (
                  <span key={o} className={`rounded-md border px-3 py-1.5 ${i === 1 ? "border-lime bg-lime text-[#121212]" : "border-line-strong text-muted"}`}>{o}</span>
                ))}
              </div>
            </div>
            <FindPathButton size="lg" className="self-start">Trouver ma voie</FindPathButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Lambo() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <p className="display max-w-5xl text-[clamp(3.6rem,11vw,9rem)]">
            Ton business n&apos;a pas besoin d&apos;une <span className="text-lime">Lambo.</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="lime-block torn mt-6 inline-block -rotate-1 px-6 py-4 sm:px-10">
            <p className="text-[clamp(1.6rem,4vw,2.8rem)] font-extrabold italic text-[#171717]">
              Il a besoin de <span className="scribble">3 vrais clients.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Domains() {
  return (
    <section className="relative py-20" aria-labelledby="domaines">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="domaines" className="display text-[clamp(3rem,8vw,6rem)]">4 terrains de jeu.</h2>
          <ButtonLink href="/domaines" variant="secondary" arrow>Comparer</ButtonLink>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.05}>
              <Link href={`/domaines/${d.slug}`} className="paper tape group block h-full p-6 pt-8 transition-transform duration-300 hover:-translate-y-1" style={{ rotate: `${[-1.2, 0.8, -0.6, 1.1][i]}deg` }}>
                <Icon name={d.icon} className="size-8 text-[#171717]" strokeWidth={1.8} />
                <h3 className="display mt-5 text-4xl text-[#171717]">{d.name}</h3>
                <dl className="mt-6 grid gap-2 border-t-2 border-[#171717]/15 pt-4 text-sm text-[#171717]">
                  <div className="flex justify-between gap-2"><dt className="text-[#171717]/60">Budget</dt><dd className="font-bold">{formatBudget(d.startBudget.min, d.startBudget.max)}</dd></div>
                  <div className="flex justify-between gap-2"><dt className="text-[#171717]/60">Temps</dt><dd className="font-bold">{d.weeklyTime.replace(" / semaine", "/sem.")}</dd></div>
                </dl>
                {d.riskNotice && <p className="mt-4 inline-block bg-red px-2 py-0.5 text-xs font-bold uppercase text-white">Risque de perte en capital</p>}
                <span className="display mt-5 flex items-center gap-1 text-lg text-[#171717] group-hover:underline">Explorer <Icon name="arrow-right" className="size-4" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Popular() {
  return (
    <section className="relative py-20" aria-labelledby="formations">
      <div className="container-x">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="formations" className="display text-[clamp(3rem,8vw,6rem)]">Par où commencer.</h2>
          <ButtonLink href="/formations" variant="secondary" arrow>Tout le catalogue</ButtonLink>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularCourses.slice(0, 6).map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.05}>
              <CourseCard course={c} />
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-xs text-faint">Tarifs de lancement indicatifs.</p>
      </div>
    </section>
  );
}

function WeeklyTop() {
  return (
    <section className="relative py-20" aria-labelledby="top">
      <div className="container-x">
        <p className="eyebrow">Remise à zéro chaque lundi</p>
        <h2 id="top" className="display mt-3 text-[clamp(3rem,8vw,6rem)]">Le top <span className="text-lime">de la semaine.</span></h2>
        <RankingBoard compact />
      </div>
    </section>
  );
}

function Propose() {
  return (
    <section className="relative py-16" aria-labelledby="proposer">
      <div className="container-x">
        <div className="paper torn grid items-center gap-8 px-7 py-12 sm:px-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 id="proposer" className="display text-[clamp(2.8rem,7vw,5.4rem)] text-[#171717]">Tu sais faire ? <span className="bg-lime px-2">Transmets.</span></h2>
            <p className="mt-4 max-w-md font-semibold text-[#171717]/80">Propose ta formation. On la vérifie leçon par leçon. Si elle respecte la charte, elle est certifiée NO LARP.</p>
            <Link href="/proposer" className="mt-7 inline-flex h-13 items-center gap-2 rounded-md bg-[#171717] px-6 font-display text-xl uppercase text-lime transition-transform hover:-translate-y-0.5">
              Proposer ma formation <Icon name="arrow-right" className="size-5" />
            </Link>
          </div>
          <div className="justify-self-center"><CertifiedBadge size="lg" /></div>
        </div>
      </div>
    </section>
  );
}

const rules = [
  { t: "Zéro promesse de revenus", d: "On vend des compétences. Pas des captures de gains." },
  { t: "Risques affichés", d: "Budget, temps, difficultés : tout est dit avant d'acheter." },
  { t: "Programmes publics", d: "Chaque leçon est visible avant l'inscription." },
  { t: "Pas de fausse urgence", d: "Pas de compte à rebours. Tu décides à ton rythme." },
];

function Rules() {
  return (
    <section className="relative py-20" aria-labelledby="regles">
      <div className="container-x">
        <h2 id="regles" className="display text-[clamp(3rem,8vw,6rem)]">Nos règles. <span className="text-lime">Non négociables.</span></h2>
        <ol className="mt-12 grid gap-px overflow-hidden border-2 border-line-strong bg-line-strong sm:grid-cols-2 lg:grid-cols-4">
          {rules.map((r, i) => (
            <li key={r.t} className="bg-ink p-6">
              <span className="display text-5xl text-lime">0{i + 1}</span>
              <p className="display mt-4 text-2xl">{r.t}</p>
              <p className="mt-2 text-sm text-muted">{r.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-end">
          <span className="paper tape inline-block rotate-3 px-6 py-4 text-center">
            <span className="display block text-3xl leading-none text-[#171717]">Zéro</span>
            <span className="display block text-3xl leading-none text-[#171717]">bullsh*t</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const items = faq.filter((_, i) => [0, 1, 5, 8].includes(i));
  return (
    <section className="relative py-16" aria-labelledby="faq">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <h2 id="faq" className="display text-[clamp(3rem,8vw,6rem)]">Questions.</h2>
          <ButtonLink href="/faq" variant="secondary" arrow className="mt-6">Toute la FAQ</ButtonLink>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}
