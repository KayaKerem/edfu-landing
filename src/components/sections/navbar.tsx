"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="size-8" />,
});
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { motion, AnimatePresence } from "motion/react";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Dictionary } from "@/dictionaries";

function NavbarCatLogo() {
  const lottieRef = useRef<any>(null);
  const [animData, setAnimData] = useState<unknown>(null);

  useEffect(() => {
    import("@/../public/navbar-cat.json").then((m) => setAnimData(m.default));
  }, []);

  const handleComplete = useCallback(() => {
    setTimeout(() => {
      lottieRef.current?.goToAndPlay(0);
    }, 4000);
  }, []);

  if (!animData) return <div className="size-8" />;

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animData}
      loop={false}
      autoplay
      onComplete={handleComplete}
      className="size-8"
    />
  );
}

interface NavLink {
  label: string;
  href: string;
  routeId: string;
}

interface NavbarProps {
  dict: Dictionary["navbar"];
  lang: string;
}

export function Navbar({ dict, lang }: NavbarProps) {
  const prefix = lang === "tr" ? "" : `/${lang}`;

  const navLinks: NavLink[] = [
    { label: dict.home, href: `${prefix}/`, routeId: "/" },
    { label: dict.agents, href: `${prefix}/agents`, routeId: "/agents" },
    { label: dict.meeting, href: `${prefix}/meeting`, routeId: "/meeting" },
    { label: dict.integrations, href: `${prefix}/integrations`, routeId: "/integrations" },
    { label: dict.pricing, href: `${prefix}/pricing`, routeId: "/pricing" },
  ];

  const pathname = usePathname();
  const currentRoute = pathname.replace(/^\/(tr|en)/, "") || "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updatePill = useCallback(() => {
    const activeLi = linkRefs.current.get(currentRoute);
    const nav = navRef.current;
    if (!activeLi || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const liRect = activeLi.getBoundingClientRect();
    setPillStyle({
      left: liRect.left - navRect.left,
      width: liRect.width,
    });
  }, [currentRoute]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={false}
        animate={{
          maxWidth: isScrolled ? 960 : 1120,
          marginTop: isScrolled ? 20 : 16,
        }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="w-full"
      >
        <div
          className={`rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "border border-border bg-background/75 shadow-sm backdrop-blur-lg"
              : "bg-transparent"
          }`}
        >
          <div className="relative flex h-14 items-center justify-between px-4 sm:px-5">
            <Link href={`${prefix}/`} className="flex items-end gap-2">
              <NavbarCatLogo />
              <span
                className="text-xl leading-none -translate-y-[1px] font-semibold tracking-tight"
              >
                Edfu
              </span>
            </Link>

            <ul
              ref={navRef}
              className="absolute left-1/2 -translate-x-1/2 hidden h-11 items-center justify-center rounded-full px-2 md:flex whitespace-nowrap"
            >
              {pillStyle.width > 0 && (
                <motion.li
                  className="absolute inset-y-0 my-1.5 rounded-full border border-border bg-background"
                  animate={{ left: pillStyle.left, width: pillStyle.width }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ listStyle: "none" }}
                  aria-hidden
                />
              )}
              {navLinks.map((link) => (
                <li
                  key={link.routeId}
                  ref={(el) => {
                    if (el) linkRefs.current.set(link.routeId, el);
                  }}
                  style={{ listStyle: "none" }}
                >
                  <Link
                    href={link.href}
                    className={`relative z-10 flex h-full cursor-pointer items-center justify-center px-3 py-2 text-sm font-medium tracking-tight transition-colors duration-200 ${
                      currentRoute === link.routeId
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href={`${prefix}/pricing`}
                className="bg-primary h-8 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-primary-foreground w-fit px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] hover:bg-primary/80 transition-all ease-out active:scale-95"
              >
                {dict.cta}
              </Link>
              <LanguageSwitcher lang={lang} />
              <AnimatedThemeToggler className="size-8 cursor-pointer rounded-full border border-border text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <LanguageSwitcher lang={lang} />
              <AnimatedThemeToggler className="size-8 cursor-pointer rounded-full border border-border text-muted-foreground" />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? dict.menuClose : dict.menuOpen}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground"
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 rounded-2xl border border-border bg-background/95 backdrop-blur-lg md:hidden"
            >
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.routeId}
                    href={link.href}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      currentRoute === link.routeId
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={`${prefix}/pricing`}
                  className="mt-2 flex h-10 items-center justify-center rounded-full bg-primary text-sm font-normal tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] transition-all ease-out active:scale-95"
                >
                  {dict.cta}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
