"use client";

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
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="3.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2_33"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="6" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_2_33"
            result="effect2_dropShadow_2_33"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="27" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_2_33"
            result="effect3_dropShadow_2_33"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="48" />
          <feGaussianBlur stdDeviation="9.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
          />
          <feBlend
            mode="normal"
            in2="effect3_dropShadow_2_33"
            result="effect4_dropShadow_2_33"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect4_dropShadow_2_33"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Security Section                                                   */
/* ------------------------------------------------------------------ */
export function Security() {
  return (
    <section id="security" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Güvenli Büyüme İçin Tasarlandı
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Gelişmiş güvenlik ile sorunsuz ölçeklenebilirliğin buluştuğu yer
            — verilerinizi korumak ve büyümenizi güçlendirmek için tasarlandı.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1 – Gelişmiş Görev Güvenliği */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex h-[300px] items-center justify-center bg-gradient-to-b from-accent/10 to-transparent">
              <ShieldVisual />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold">
                Gelişmiş Görev Güvenliği
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Son teknoloji şifreleme ve güvenli erişim ile görevlerinizi
                koruyun.
              </p>
            </div>
          </div>

          {/* Card 2 – Takımlar İçin Ölçeklenebilir */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative flex h-[300px] items-center justify-center bg-gradient-to-b from-accent/10 to-transparent">
              <Globe className="absolute inset-0" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold">
                Takımlar İçin Ölçeklenebilir
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Takımınızla birlikte büyüyün. Birden fazla çalışma alanı ve tüm
                ekip üyeleri arasında görevleri takip edin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
