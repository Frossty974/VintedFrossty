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
      <div className={`transition-all duration-500 ${scrolled || menu ? "border-b border-line bg-[#05060b]/70 backdrop-blur-xl" : "border-b border-transparent"}`}>
        <div className="container-x flex h-16 items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${active(n.href) ? "text-fg" : "text-muted hover:text-fg"}`}
                aria-current={active(n.href) ? "page" : undefined}
              >
                {active(n.href) && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href={user ? "/espace" : "/connexion"} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-muted transition hover:text-fg sm:inline-flex">
              <Icon name="user" className="size-4" />
              {ready && user ? "Mon espace" : "Connexion"}
            </Link>
            <FindPathButton size="sm" className="hidden sm:inline-flex" />
            <button type="button" className="grid size-10 place-items-center rounded-full border border-line text-fg lg:hidden" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-controls="mobile-menu" aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}>
              <Icon name={menu ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-menu"
            aria-label="Navigation mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border-b border-line bg-[#05060b]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-x grid gap-1 py-4">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className={`rounded-xl px-3 py-3 text-lg ${active(n.href) ? "bg-white/[0.05] text-fg" : "text-muted"}`}>
                  {n.label}
                </Link>
              ))}
              <Link href={user ? "/espace" : "/connexion"} className="rounded-xl px-3 py-3 text-lg text-muted">
                {user ? "Mon espace" : "Connexion"}
              </Link>
              <FindPathButton className="mt-3 w-full" size="lg" />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
