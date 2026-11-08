import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/account/AuthForm";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default function Page() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-5 pb-10 pt-28">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(76_125_255/0.18),transparent)]" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <Suspense>
        <AuthForm initialMode="signin" />
      </Suspense>
    </section>
  );
}
