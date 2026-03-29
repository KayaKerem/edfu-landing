"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Ana Sayfa", href: "#hero", sectionId: "hero" },
  { label: "Nasıl Çalışır", href: "#how-it-works", sectionId: "how-it-works" },
  { label: "Özellikler", href: "#features", sectionId: "features" },
  { label: "Fiyatlandırma", href: "#pricing", sectionId: "pricing" },
] as const;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const { theme, setTheme } = useTheme();
  const navRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navLinks.forEach((link) => {
      const el = document.getElementById(link.sectionId);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(link.sectionId);
        },
        { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Update pill position
  const updatePill = useCallback(() => {
    const activeLi = linkRefs.current.get(activeSection);
    const nav = navRef.current;
    if (!activeLi || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const liRect = activeLi.getBoundingClientRect();
    setPillStyle({
      left: liRect.left - navRect.left,
      width: liRect.width,
    });
  }, [activeSection]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={false}
        animate={{
          maxWidth: isScrolled ? 800 : 1120,
          marginTop: isScrolled ? 16 : 8,
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
          <div className="flex h-14 items-center justify-between px-4 sm:px-5">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="size-4 fill-primary-foreground text-primary-foreground" />
              </div>
              <span className="text-lg font-heading font-bold tracking-tight">
                Edfu
              </span>
            </a>

            {/* Desktop nav links */}
            <ul
              ref={navRef}
              className="relative mx-auto hidden items-center md:flex"
            >
              {/* Animated pill indicator */}
              {pillStyle.width > 0 && (
                <motion.li
                  className="absolute inset-y-0 -my-0.5 rounded-full border border-border bg-background"
                  animate={{ left: pillStyle.left, width: pillStyle.width }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ listStyle: "none" }}
                  aria-hidden
                />
              )}
              {navLinks.map((link) => (
                <li
                  key={link.href}
                  ref={(el) => {
                    if (el) linkRefs.current.set(link.sectionId, el);
                  }}
                  style={{ listStyle: "none" }}
                >
                  <a
                    href={link.href}
                    className={`relative z-10 flex items-center px-4 py-2 text-sm font-medium tracking-tight transition-colors duration-200 ${
                      activeSection === link.sectionId
                        ? "text-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Right: CTA + Theme toggle */}
            <div className="hidden items-center gap-2 md:flex">
              <a
                href="#pricing"
                className="bg-primary h-8 flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-primary-foreground dark:text-primary-foreground w-fit px-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12]"
              >
                Ücretsiz Dene
              </a>
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label="Tema değiştir"
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
              )}
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label="Tema değiştir"
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground"
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
              )}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground"
              >
                {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
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
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      activeSection === link.sectionId
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex h-10 items-center justify-center rounded-full bg-primary text-sm font-normal tracking-wide text-primary-foreground shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_3px_3px_-1.5px_rgba(16,24,40,0.06),0_1px_1px_rgba(16,24,40,0.08)] border border-white/[0.12] transition-all ease-out active:scale-95"
                >
                  Ücretsiz Dene
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
