import Link from "next/link";
import { CourseCard } from "@/components/catalog/CourseCard";
import { HeroVisual } from "@/components/home/HeroVisual";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { accentSoft, accentText, ButtonLink, Eyebrow, formatBudget, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { getCoursesByDomain, popularCourses } from "@/data/courses";
import { domains } from "@/data/domains";
import { faq } from "@/data/faq";
import type { IconName } from "@/data/types";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <Domains />
      <Method />
      <QuizCta />
      <Popular />
      <Commitments />
      <FaqSection />
      <FinalCta />
    </>
  );
}

function Hero() {
  return (
    <section className="noise relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgb(76_125_255/0.22),transparent)]" />
        <div className="absolute -right-40 top-20 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(139_108_255/0.16),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>
      <div className="container-x relative grid items-center gap-10 pb-20 lg:grid-cols-[1.15fr_1fr] lg:gap-4 lg:pb-28">
        <div>
          <Reveal>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-cyan" />
              </span>
              Plateforme d&apos;orientation et de formation · 16 – 30 ans
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-7 text-[clamp(2.45rem,5.6vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
              <span className="text-gradient">Tu ne sais pas encore quoi faire de ta vie ?</span>{" "}
              <span className="text-accent">C&apos;est justement pour ça qu&apos;on existe.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-[1.12rem] leading-relaxed text-muted text-pretty">
              E-commerce, intelligence artificielle, création de contenu, finance… Découvre les opportunités du monde actuel et trouve le domaine qui correspond réellement à tes ambitions.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <FindPathButton size="lg" />
              <ButtonLink href="/formations" variant="secondary" size="lg">
                Découvrir les formations
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.32}>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-faint">
              {["Orientation gratuite, sans inscription", "Programmes publics et détaillés", "Aucune promesse de revenus"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Icon name="check" className="size-4 text-cyan" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.2} y={10}>
          <HeroVisual />
        </Reveal>
      </div>
    </section>
  );
}

const problems: { icon: IconName; title: string; text: string }[] = [
  { icon: "layers", title: "Trop d'informations", text: "Vidéos, conseils, « méthodes » : tout se contredit, et il est impossible de savoir qui croire." },
  { icon: "eye", title: "Des promesses irréalistes", text: "On te montre des résultats spectaculaires sans jamais parler du temps, du travail ni des risques." },
  { icon: "route", title: "Aucune direction claire", text: "Personne ne t'aide à relier tes envies, tes moyens et ton temps à un domaine concret." },
  { icon: "alert", title: "La peur de se tromper", text: "Perdre du temps ou de l'argent sur la mauvaise voie bloque souvent avant même de commencer." },
];

function Problem() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="probleme">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Le constat"
            title={<span id="probleme">Ce n&apos;est pas la motivation qui manque. C&apos;est la direction.</span>}
            lead="Beaucoup de jeunes veulent réussir, devenir indépendants, construire quelque chose. Mais entre le bruit d'Internet et la peur de mal choisir, il est difficile de savoir par où commencer."
          />
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-line bg-white/[0.02] p-6">
                <Icon name={p.icon} className="size-6 text-[#9db4ff]" />
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const pillars = [
  { n: "01", title: "Explorer", text: "Découvrir les domaines qui recrutent, se développent ou permettent d'entreprendre aujourd'hui." },
  { n: "02", title: "Comprendre", text: "Voir chaque domaine tel qu'il est : opportunités, difficultés, compétences, temps et budget nécessaires." },
  { n: "03", title: "Choisir", text: "Comparer ton profil aux exigences réelles de chaque domaine grâce à un questionnaire précis." },
  { n: "04", title: "Apprendre", text: "Suivre un parcours structuré, du premier module au premier projet concret." },
];

function Solution() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="solution">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[500px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(76_125_255/0.08),transparent_65%)]" />
      <div className="container-x relative">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="Notre solution"
            title={<span id="solution">Tu n&apos;as pas besoin de savoir ce que tu veux faire de ta vie.</span>}
            lead="Tu as besoin de découvrir ce qui te correspond. Nous avons étudié chaque domaine pour te donner une vision honnête, puis une méthode pour avancer."
          />
        </Reveal>
        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-[27px] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent lg:block" />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.n} delay={i * 0.08} className="relative">
                <div className="relative z-10 grid size-14 place-items-center rounded-2xl border border-line-strong bg-night font-mono text-sm text-[#9db4ff] shadow-[0_0_30px_-8px_rgb(76_125_255/0.5)]">{p.n}</div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Domains() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="domaines">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Les domaines"
              title={<span id="domaines">Quatre univers, analysés sans filtre.</span>}
              lead="Pour chacun : ce qu'il permet, ce qu'il exige, et ce que personne ne te dit."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/domaines" variant="secondary" arrow>
              Comparer les domaines
            </ButtonLink>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {domains.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 2) * 0.08}>
              <SpotlightCard glow={accentSoft[d.accent]} className="h-full">
                <Link href={`/domaines/${d.slug}`} className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div className={`grid size-12 place-items-center rounded-2xl border border-line-strong bg-white/[0.03] ${accentText[d.accent]}`}>
                      <Icon name={d.icon} className="size-6" />
                    </div>
                    <span className="font-mono text-xs text-faint">{getCoursesByDomain(d.slug).length} formations</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em]">{d.name}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{d.tagline}</p>
                  <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
                    <div>
                      <dt className="text-faint">Temps conseillé</dt>
                      <dd className="mt-1 text-fg/90">{d.weeklyTime}</dd>
                    </div>
                    <div>
                      <dt className="text-faint">Budget de départ</dt>
                      <dd className="mt-1 text-fg/90">{formatBudget(d.startBudget.min, d.startBudget.max)}</dd>
                    </div>
                  </dl>
                  {d.riskNotice && (
                    <p className="mt-5 flex items-center gap-2 text-xs text-[#ffb3b3]">
                      <Icon name="alert" className="size-3.5" /> Risque de perte en capital — formations pédagogiques uniquement
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-sm text-muted transition group-hover/spot:text-fg">
                    Explorer le domaine <Icon name="arrow-right" className="size-4 transition-transform group-hover/spot:translate-x-0.5" />
                  </span>
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: "compass" as IconName, title: "Réponds à 10 questions", text: "Ta situation, ton temps, ton budget, tes envies et ce qui te bloque. Deux minutes, sans inscription." },
  { icon: "target" as IconName, title: "Découvre tes compatibilités", text: "Un score calculé pour chaque domaine, avec les raisons, les contraintes et les points de vigilance." },
  { icon: "route" as IconName, title: "Suis ton parcours", text: "Cinq étapes, de la découverte au premier projet, avec une durée estimée selon ton rythme." },
];

function Method() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="methode">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionHeading eyebrow="Comment ça marche" title={<span id="methode">Une méthode, pas une intuition.</span>} lead="Notre algorithme compare tes réponses aux exigences réelles de chaque domaine. Il ne te dit pas ce que tu « dois » faire : il t'aide à choisir en connaissance de cause." />
          </Reveal>
          <ol className="mt-10 grid gap-6">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="flex gap-5">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-line-strong bg-white/[0.03] text-[#9db4ff]">
                  <Icon name={s.icon} className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.2}>
            <Link href="/methode" className="mt-10 inline-flex items-center gap-1.5 text-sm text-[#9db4ff] hover:text-fg">
              Voir la méthode de calcul en détail <Icon name="arrow-right" className="size-4" />
            </Link>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ResultPreview />
        </Reveal>
      </div>
    </section>
  );
}

function ResultPreview() {
  const rows = [
    { name: "Création de contenu avec l'IA", score: 89, color: "from-cyan to-electric" },
    { name: "Création de sites Internet", score: 85, color: "from-electric to-violet" },
    { name: "Marketing digital", score: 83, color: "from-violet to-electric" },
  ];
  return (
    <div className="ring-gradient relative rounded-[28px] bg-[linear-gradient(180deg,#0e1226,#090b16)] p-6 shadow-[0_40px_100px_-30px_rgb(76_125_255/0.45)] sm:p-8">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Exemple de résultat</span>
        <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.65rem] text-faint">Profil Créatif</span>
      </div>
      <p className="mt-5 text-sm text-muted">Étudiant · 3 à 5 h par semaine · budget 50 à 100 € · attiré par le marketing et la technologie</p>
      <div className="mt-7 grid gap-5">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-fg/90">{r.name}</span>
              <span className="font-mono text-fg">{r.score} %</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div className={`h-full rounded-full bg-gradient-to-r ${r.color}`} style={{ width: `${r.score}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 rounded-2xl border border-warn/20 bg-warn/[0.05] p-4 text-sm">
        <p className="font-medium text-warn">Point de vigilance · E-commerce</p>
        <p className="mt-1 text-[#e8d6b5]/80">Démarrer demande généralement au moins 150 €. Ton budget actuel est inférieur : commence par la théorie et une validation gratuite.</p>
      </div>
      <p className="mt-5 text-xs text-faint">Score de compatibilité calculé, et non probabilité de réussite.</p>
    </div>
  );
}

function QuizCta() {
  return (
    <section className="relative py-16 sm:py-24" aria-labelledby="questionnaire">
      <div className="container-x">
        <Reveal>
          <div className="ring-gradient noise relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#0f1530,#0a0c19_50%,#0d1426)] px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(76_125_255/0.35),transparent)]" />
            <div className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(63_208_232/0.18),transparent)]" />
            <div className="relative">
              <Eyebrow className="justify-center">Questionnaire d&apos;orientation</Eyebrow>
              <h2 id="questionnaire" className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-gradient text-balance">
                Deux minutes pour y voir plus clair.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
                10 questions. Un profil détaillé, trois domaines compatibles, leurs contraintes et un parcours en cinq étapes. Gratuit, sans inscription.
              </p>
              <div className="mt-9 flex justify-center">
                <FindPathButton size="lg">Commencer le questionnaire</FindPathButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Popular() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="populaires">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading eyebrow="Formations" title={<span id="populaires">Par où commencent la plupart des parcours.</span>} lead="Des formations d'entrée, accessibles aux débutants, avec un programme entièrement public." />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/formations" variant="secondary" arrow>
              Tout le catalogue
            </ButtonLink>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularCourses.slice(0, 6).map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.06}>
              <CourseCard course={c} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-faint">Tarifs de lancement indicatifs, susceptibles d&apos;évoluer avant l&apos;ouverture des inscriptions.</p>
      </div>
    </section>
  );
}

const commitments: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Aucune promesse de revenus", text: "Nous vendons des compétences. Jamais de captures de gains, jamais de « liberté financière en 30 jours »." },
  { icon: "alert", title: "Les risques, toujours affichés", text: "Budget, temps, difficultés et risques financiers sont indiqués clairement, avant tout achat." },
  { icon: "book", title: "Programmes 100 % publics", text: "Chaque module et chaque leçon sont visibles avant l'inscription. Tu sais exactement ce que tu achètes." },
  { icon: "clock", title: "Pas de fausse urgence", text: "Pas de compte à rebours, pas de « dernières places ». Tu décides à ton rythme." },
  { icon: "eye", title: "Une méthode transparente", text: "Le fonctionnement de notre algorithme d'orientation est documenté publiquement." },
  { icon: "lock", title: "Tes données t'appartiennent", text: "Le questionnaire fonctionne sans compte. Aucune revente de données, jamais." },
];

function Commitments() {
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="engagements">
      <div className="container-x">
        <Reveal>
          <SectionHeading align="center" eyebrow="Notre philosophie" title={<span id="engagements">La confiance se mérite. Voici nos engagements.</span>} />
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {commitments.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 0.06} className="bg-ink">
              <div className="h-full bg-white/[0.012] p-7 transition-colors duration-500 hover:bg-white/[0.03]">
                <Icon name={c.icon} className="size-6 text-cyan" />
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const items = faq.filter((_, i) => [0, 1, 5, 8, 7, 3].includes(i));
  return (
    <section className="relative py-24 sm:py-32" aria-labelledby="faq">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title={<span id="faq">Les questions qu&apos;on nous pose.</span>} lead="Et si la tienne n'y est pas, écris-nous." />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/faq" variant="secondary" arrow>
              Toute la FAQ
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Nous contacter
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative pt-16">
      <div className="container-x text-center">
        <Reveal>
          <h2 className="mx-auto max-w-4xl text-[clamp(2.2rem,6vw,4.6rem)] font-semibold leading-[1] tracking-[-0.045em] text-balance">
            <span className="text-gradient">Le bon moment pour commencer,</span> <span className="text-accent">c&apos;est quand tu sais où aller.</span>
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <FindPathButton size="lg" />
            <ButtonLink href="/formations" variant="secondary" size="lg">
              Découvrir les formations
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
