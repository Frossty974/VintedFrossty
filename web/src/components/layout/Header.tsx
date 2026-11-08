"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FindPathButton } from "@/components/orientation/FindPathButton";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { nav } from "@/data/site";
import { useAccount } from "@/lib/account/AccountProvider";

export function Header() {
  const pathname = usePathname();
  const { user, ready } = useAccount();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`transition-colors duration-300 ${scrolled || menu ? "border-b border-line bg-[#121212]/95" : "border-b border-transparent"}`}>
        <div className="container-x flex h-16 items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Navigation principale" className="hidden items-center gap-6 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`display text-[1.1rem] tracking-[0.03em] transition-colors ${active(n.href) ? "text-lime" : "text-fg/80 hover:text-lime"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href={user ? "/espace" : "/connexion"} className="display hidden items-center gap-1.5 text-[1.05rem] text-fg/80 transition hover:text-lime sm:inline-flex">
              <Icon name="user" className="size-4" />
              {ready && user ? "Mon espace" : "Connexion"}
            </Link>
            <FindPathButton size="sm" className="hidden sm:inline-flex" />
            <button type="button" className="grid size-10 place-items-center rounded-md border-2 border-fg/70 text-fg lg:hidden" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}>
              <Icon name={menu ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav id="mobile-menu" aria-label="Navigation mobile" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="border-b border-line bg-[#121212] lg:hidden">
            <div className="container-x grid gap-1 py-5">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className={`display py-2 text-4xl ${active(n.href) ? "text-lime" : "text-fg"}`}>
                  {n.label}
                </Link>
              ))}
              <Link href={user ? "/espace" : "/connexion"} className="display py-2 text-4xl text-fg/60">
                {user ? "Mon espace" : "Connexion"}
              </Link>
              <FindPathButton className="mt-4 w-full" size="lg" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
