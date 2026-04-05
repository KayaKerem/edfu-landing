"use client";

import Image from "next/image";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import type { Dictionary } from "@/dictionaries";

const badges = ["KVKK", "EU Data", "GDPR"] as const;

interface FooterProps {
  dict: Dictionary["footer"];
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <a href="#hero" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Edfu" width={32} height={32} className="size-8" />
              <span className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-geist)" }}>Edfu</span>
            </a>

            {/* Description */}
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {dict.description}
            </p>

            {/* Compliance badges */}
            <div className="mt-6 flex items-center gap-3">
              {badges.map((badge) => (
                <div
                  key={badge}
                  className="h-10 w-10 rounded-full border border-border bg-card flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-muted-foreground leading-tight text-center">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {dict.columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-heading font-bold text-sm mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Flickering grid text */}
      <div className="relative h-[120px] sm:h-[160px] md:h-[200px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Ctext x='50%25' y='72%25' text-anchor='middle' dominant-baseline='middle' font-family='system-ui,-apple-system,sans-serif' font-size='200' font-weight='800' fill='black'%3EEdfu%3C/text%3E%3C/svg%3E")`,
            WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Ctext x='50%25' y='72%25' text-anchor='middle' dominant-baseline='middle' font-family='system-ui,-apple-system,sans-serif' font-size='200' font-weight='800' fill='black'%3EEdfu%3C/text%3E%3C/svg%3E")`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        >
          <FlickeringGrid
            squareSize={2}
            gridGap={4}
            flickerChance={0.3}
            color="rgb(0, 0, 0)"
            maxOpacity={0.25}
            className="h-full w-full dark:hidden"
          />
          <FlickeringGrid
            squareSize={2}
            gridGap={4}
            flickerChance={0.3}
            color="rgb(255, 255, 255)"
            maxOpacity={0.25}
            className="h-full w-full hidden dark:block"
          />
        </div>
      </div>
    </footer>
  );
}
