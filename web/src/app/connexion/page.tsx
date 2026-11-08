import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default function Page() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-5 pb-10 pt-28">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <Suspense>
        <AuthForm initialMode="signin" />
      </Suspense>
    </section>
  );
}
