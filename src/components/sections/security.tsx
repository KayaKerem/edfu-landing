"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Globe } from "@/components/ui/globe";

/* ------------------------------------------------------------------ */
/*  Shield SVG Visual                                                  */
/* ------------------------------------------------------------------ */
function ShieldVisual() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="245"
      height="282"
      viewBox="0 0 245 282"
      className="h-[160px] w-auto object-contain fill-accent"
    >
      <g filter="url(#filter0_dddd_2_33)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M113.664 7.33065C116.025 5.21236 119.082 4.04126 122.25 4.04126C125.418 4.04126 128.475 5.21236 130.836 7.33065C154.045 28.2076 183.028 41.5233 213.948 45.5151C216.984 45.9065 219.781 47.3695 221.839 49.6419C223.897 51.9144 225.081 54.8476 225.178 57.916C226.339 92.0322 217.849 125.781 200.689 155.261C183.529 184.74 158.4 208.746 128.209 224.501C126.368 225.462 124.323 225.962 122.248 225.959C120.173 225.956 118.13 225.45 116.291 224.484C86.0997 208.728 60.971 184.723 43.811 155.244C26.6511 125.764 18.1608 92.015 19.322 57.8988C19.4235 54.8334 20.6091 51.9043 22.6666 49.6354C24.7242 47.3665 27.5195 45.906 30.5524 45.5151C61.4706 41.5281 90.4531 28.2186 113.664 7.34787V7.33065Z"
        />
      </g>
      <defs>
        <filter
          id="filter0_dddd_2_33"
          x="0.217041"
          y="0.0412598"
          width="244.066"
          height="292.917"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_33" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="6" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0" />
          <feBlend mode="normal" in2="effect1_dropShadow_2_33" result="effect2_dropShadow_2_33" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="27" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0" />
          <feBlend mode="normal" in2="effect2_dropShadow_2_33" result="effect3_dropShadow_2_33" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="48" />
          <feGaussianBlur stdDeviation="9.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
          <feBlend mode="normal" in2="effect3_dropShadow_2_33" result="effect4_dropShadow_2_33" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect4_dropShadow_2_33" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Security Section                                                   */
/* ------------------------------------------------------------------ */
const features = [
  {
    title: "Gelişmiş Görev Güvenliği",
    description: "Son teknoloji şifreleme ve güvenli erişim ile görevlerinizi koruyun.",
    visual: <ShieldVisual />,
  },
  {
    title: "Takımlar İçin Ölçeklenebilir",
    description: "Takımınızla birlikte büyüyün. Birden fazla çalışma alanı ve tüm ekip üyeleri arasında görevleri takip edin.",
    visual: null, // Globe
  },
];

export function Security() {
  const { resolvedTheme } = useTheme();
  const [globeKey, setGlobeKey] = useState(0);

  useEffect(() => {
    setGlobeKey((k) => k + 1);
  }, [resolvedTheme]);

  return (
    <section id="security" className="relative">
      {/* Hatched areas */}
      <div className="pointer-events-none absolute inset-y-0 left-6 w-4 md:w-14 text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-6 w-4 md:w-14 text-foreground/5 bg-[size:10px_10px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      {/* Inner vertical lines */}
      <div className="pointer-events-none absolute inset-y-0 left-10 md:left-20 w-px bg-border" />
      <div className="pointer-events-none absolute inset-y-0 right-10 md:right-20 w-px bg-border" />

      <div className="pt-12">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl px-4 text-center">
          <h2 className="text-[36px] font-medium text-balance text-foreground leading-none" style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}>
            Güvenli Büyüme İçin Tasarlandı
          </h2>
          <p className="mt-4 text-base text-muted-foreground font-medium text-balance tracking-tight">
            Gelişmiş güvenlik ile sorunsuz ölçeklenebilirliğin buluştuğu yer
            — verilerinizi korumak ve büyümenizi güçlendirmek için tasarlandı.
          </p>
        </div>

        {/* Grid - same structure as bento-features */}
        <div className="relative mx-10 md:mx-20">
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-x border-border">
            {/* Card 1 */}
            <div className="relative flex flex-col overflow-hidden aspect-[554/496] md:border-r border-border">
              <div className="relative flex-1 flex items-center justify-center">
                <ShieldVisual />
                <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-24 w-full bg-gradient-to-t from-background to-transparent" />
              </div>
              <div className="relative z-20 px-6 pb-8 -mt-4">
                <h3 className="text-lg font-semibold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-geist)" }}>Gelişmiş Görev Güvenliği</h3>
                <p className="mt-1.5 text-base text-muted-foreground">Son teknoloji şifreleme ve güvenli erişim ile görevlerinizi koruyun.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative flex flex-col overflow-hidden aspect-[554/496] border-t md:border-t-0 border-border">
              <div className="relative flex-1 overflow-hidden">
                <div className="relative flex size-full items-center justify-center [mask-image:linear-gradient(to_top,transparent,black_50%)] -translate-y-20">
                  <Globe key={globeKey} dark={resolvedTheme === "dark"} className="top-28" />
                </div>
              </div>
              <div className="relative z-20 px-6 pb-8 -mt-4">
                <h3 className="text-lg font-semibold tracking-tighter text-foreground" style={{ fontFamily: "var(--font-geist)" }}>Takımlar İçin Ölçeklenebilir</h3>
                <p className="mt-1.5 text-base text-muted-foreground">Takımınızla birlikte büyüyün. Birden fazla çalışma alanı ve tüm ekip üyeleri arasında görevleri takip edin.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
