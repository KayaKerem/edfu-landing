import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { MeetingHero } from "@/components/sections/meeting-hero";
import { ScrollPinnedFeatures } from "@/components/sections/scroll-pinned-features";
import { NumberedFeatures } from "@/components/sections/numbered-features";
import { PageCTA } from "@/components/sections/page-cta";
import { CrmTable } from "@/components/mockups/crm-table";
import { MeetingTranscript } from "@/components/mockups/meeting-transcript";
import { CallPlayer as CallPlayerMockup } from "@/components/mockups/call-player";
import { Zoom } from "@/components/ui/svgs/zoom";
import { GoogleMeet } from "@/components/ui/svgs/google-meet";
import { MsTeams } from "@/components/ui/svgs/ms-teams";

const BASE_URL = "https://edfu.ai";

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const isEn = lang === "en";

  return {
    title: isEn
      ? "Meeting Agent - Smarter Meetings, Start to Finish | Edfu"
      : "Toplantı Agenti - Daha Akıllı Toplantılar | Edfu",
    description: isEn
      ? "Automatic recording, transcription, action items. Meetings that feed your company memory."
      : "Otomatik kayıt, transkript, aksiyon maddeleri. Şirket hafızanızı besleyen toplantılar.",
    alternates: {
      canonical: isEn ? "/en/meeting" : "/meeting",
      languages: { tr: "/meeting", en: "/en/meeting", "x-default": "/meeting" },
    },
    openGraph: {
      title: isEn ? "Meeting Agent | Edfu" : "Toplantı Agenti | Edfu",
      description: isEn
        ? "Automatic recording, transcription, action items. Meetings that feed your company memory."
        : "Otomatik kayıt, transkript, aksiyon maddeleri. Şirket hafızanızı besleyen toplantılar.",
      url: isEn ? `${BASE_URL}/en/meeting` : `${BASE_URL}/meeting`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isEn ? "Meeting Agent | Edfu" : "Toplantı Agenti | Edfu",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Meeting Agent | Edfu" : "Toplantı Agenti | Edfu",
      description: isEn
        ? "Automatic recording, transcription, action items. Meetings that feed your company memory."
        : "Otomatik kayıt, transkript, aksiyon maddeleri. Şirket hafızanızı besleyen toplantılar.",
      images: ["/og-image.png"],
    },
  };
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Zoom,
  "Google Meet": GoogleMeet,
  "Microsoft Teams": MsTeams,
};

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const mp = dict.meetingPage;
  const m = dict.mockups;

  const stickyVisuals = [
    <CrmTable key="crm" dict={m.crmTable} />,
    <MeetingTranscript key="transcript" dict={m.meetingTranscript} />,
    <CallPlayerMockup key="player" dict={m.callPlayer} />,
  ];

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <MeetingHero
            dict={mp.hero}
            mockupsDict={{
              meetingList: m.meetingList,
              callPlayer: m.callPlayer,
            }}
          />

          {/* 3 Feature Cards */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mp.featureCards.map((card: { title: string; description: string }, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-white dark:bg-[#27272A] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]"
                  >
                    <h3
                      className="text-base font-semibold text-foreground tracking-tight"
                      style={{ fontFamily: "var(--font-geist)" }}
                    >
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ScrollPinnedFeatures
            title={mp.stickySection.title}
            features={mp.stickySection.features}
            visuals={stickyVisuals}
          />
          <NumberedFeatures features={mp.numberedFeatures} />

          {/* Integration Logos */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
              <h2
                className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground mb-10"
                style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
              >
                {mp.integrationLogos.title}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
                {mp.integrationLogos.tools.map((tool: string) => {
                  const Icon = ICON_MAP[tool];
                  return (
                    <div
                      key={tool}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white dark:bg-[#27272A] p-6 shadow-sm"
                    >
                      <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                        {Icon ? (
                          <Icon className="size-6" />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">{tool.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground">{tool}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Templates */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2
                className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground text-center mb-12"
                style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
              >
                {mp.templates.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mp.templates.items.map((tpl: { name: string; description: string }, i: number) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-white dark:bg-[#27272A] p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="text-xs font-bold text-muted-foreground/40"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        [{String(i + 1).padStart(2, "0")}]
                      </span>
                      <h3 className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-geist)" }}>
                        {tpl.name}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                      {tpl.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial */}
          <section className="relative z-20 bg-white dark:bg-card py-16 sm:py-20 px-4 sm:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl">
              <blockquote
                className="text-xl sm:text-2xl font-medium leading-relaxed tracking-tight"
                style={{ fontFamily: "var(--font-geist)" }}
              >
                &ldquo;{mp.testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-8">
                <p className="font-medium text-foreground">{mp.testimonial.authorName}</p>
                <p className="text-sm text-muted-foreground">{mp.testimonial.authorTitle}</p>
              </div>
            </div>
          </section>

          <PageCTA
            title={mp.cta.title}
            buttonText={mp.cta.button}
            buttonHref="https://app.edfu.ai"
          />
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
