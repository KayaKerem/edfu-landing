"use client";

import Link from "next/link";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { EdfuThemeLogo } from "@/components/ui/edfu-brand";
import { TrustIcon, SecureDocumentIcon, StatsCircleIcon, CheckCircleIcon } from "@/components/ui/compliance-icons";
import type { Dictionary } from "@/dictionaries";

const complianceBadges = [
  { label: "GDPR", Icon: TrustIcon },
  { label: "CCPA", Icon: SecureDocumentIcon },
  { label: "ISO", Icon: StatsCircleIcon },
] as const;

interface FooterProps {
  dict: Dictionary["footer"];
  lang: string;
}

export function Footer({ dict, lang }: FooterProps) {
  const prefix = lang === "tr" ? "" : `/${lang}`;

  /* Route map keyed by column index + link index.
     This avoids matching on translated label text, which breaks
     if translations change. The indices correspond to the order
     in the dictionary's footer.columns arrays. */
  const routesByPosition: Record<string, string> = {
    // Column 1 ("Product"/"Ürün") — index 0: Features, 1: Pricing, 2: Integrations
    "1-0": `${prefix}/agents`,
    "1-1": `${prefix}/pricing`,
    "1-2": `${prefix}/integrations`,
    // Column 2 ("Resources") — index 1: Subprocessors
    "2-1": `${prefix}/subprocessors`,
  };

  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href={`${prefix}/`} className="flex items-end gap-2">
              <EdfuThemeLogo alt="Edfu" width={22} height={22} className="size-6" />
              <span className="text-xl leading-none translate-y-[2px] font-semibold tracking-tight">Edfu</span>
            </Link>

            {/* Description */}
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {dict.description}
            </p>

            {/* Compliance badges */}
            <div className="mt-6 flex justify-start items-center gap-10 overflow-hidden">
              {complianceBadges.map(({ label, Icon }) => (
                <div key={label} className="flex flex-col items-center justify-center gap-3">
                  <Icon className="w-8 h-8 opacity-70" />
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                    <CheckCircleIcon />
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {dict.columns.map((col, colIdx) => (
            <div key={col.heading}>
              <h4 className="font-heading font-bold text-sm mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link, linkIdx) => {
                  const route = routesByPosition[`${colIdx}-${linkIdx}`];
                  return (
                    <li key={link}>
                      {route ? (
                        <Link
                          href={route}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link}
                        </Link>
                      ) : (
                        <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default">
                          {link}
                        </span>
                      )}
                    </li>
                  );
                })}
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
