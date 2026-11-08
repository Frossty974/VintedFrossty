import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur l'orientation, une formation ou un partenariat ? Écris-nous.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Parlons-en." lead="Une question sur ton orientation, une formation, un partenariat ? Nous répondons à chaque message, généralement sous deux jours ouvrés." />
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid content-start gap-4">
          {[
            { icon: "mail" as const, t: "E-mail", d: site.email },
            { icon: "compass" as const, t: "Orientation", d: "Le questionnaire répond à la plupart des questions d'orientation, en deux minutes." },
            { icon: "flag" as const, t: "Partenariats", d: "Écoles, associations, entreprises : choisis le sujet « Partenariat »." },
          ].map((x) => (
            <div key={x.t} className="flex gap-4 rounded-2xl border border-line p-5">
              <Icon name={x.icon} className="mt-0.5 size-5 shrink-0 text-cyan" />
              <div><p className="font-medium">{x.t}</p><p className="mt-1 text-sm text-muted">{x.d}</p></div>
            </div>
          ))}
        </div>
        <ContactForm />
      </div>
    </>
  );
}
