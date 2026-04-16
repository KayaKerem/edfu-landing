import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { IntegrationGrid } from "@/components/sections/integration-grid";
import { DataModelViz } from "@/components/sections/data-model-viz";
import { PageCTA } from "@/components/sections/page-cta";

const BASE_URL = "https://edfu.ai";

/* ---- Card icons (Attio 14x14 rounded-rect style) ---- */

const CustomerIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path fill="#0FC27B" d="M0 5.6c0-1.96 0-2.94.381-3.689a3.5 3.5 0 0 1 1.53-1.53C2.66 0 3.64 0 5.6 0h2.8c1.96 0 2.94 0 3.689.381a3.5 3.5 0 0 1 1.53 1.53C14 2.66 14 3.64 14 5.6v2.8c0 1.96 0 2.94-.382 3.689a3.5 3.5 0 0 1-1.529 1.53C11.34 14 10.36 14 8.4 14H5.6c-1.96 0-2.94 0-3.689-.382a3.5 3.5 0 0 1-1.53-1.529C0 11.34 0 10.36 0 8.4V5.6Zm4.308 5.708h5.384c.595 0 1.077-.482 1.077-1.077a2.585 2.585 0 0 0-2.584-2.585h-2.37a2.585 2.585 0 0 0-2.584 2.585c0 .595.482 1.077 1.077 1.077ZM7 6.618a1.963 1.963 0 1 0 0-3.926 1.963 1.963 0 0 0 0 3.926Z" />
  </svg>
);

const ConversationIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path fill="#9162F9" d="M.381 1.911C0 2.66 0 3.64 0 5.6v2.8c0 1.96 0 2.94.381 3.689a3.5 3.5 0 0 0 1.53 1.53C2.66 14 3.64 14 5.6 14h2.8c1.96 0 2.94 0 3.689-.382a3.5 3.5 0 0 0 1.53-1.529C14 11.34 14 10.36 14 8.4V5.6c0-1.96 0-2.94-.382-3.689A3.5 3.5 0 0 0 12.09.381C11.34 0 10.36 0 8.4 0H5.6C3.64 0 2.66 0 1.911.381a3.5 3.5 0 0 0-1.53 1.53Zm3.85 9.358a.75.75 0 0 1-.75-.75V3.75a.75.75 0 0 1 .75-.75h5.538a.75.75 0 0 1 .75.75v6.769a.75.75 0 0 1-.75.75H4.231Z" />
  </svg>
);

const ProposalIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path fill="#266DF0" d="M.381 1.911C0 2.66 0 3.64 0 5.6v2.8c0 1.96 0 2.94.381 3.689a3.5 3.5 0 0 0 1.53 1.53C2.66 14 3.64 14 5.6 14h2.8c1.96 0 2.94 0 3.689-.382a3.5 3.5 0 0 0 1.53-1.529C14 11.34 14 10.36 14 8.4V5.6c0-1.96 0-2.94-.382-3.689A3.5 3.5 0 0 0 12.09.381C11.34 0 10.36 0 8.4 0H5.6C3.64 0 2.66 0 1.911.381a3.5 3.5 0 0 0-1.53 1.53Zm3.927 9.397h5.384c.595 0 1.077-.483 1.077-1.078a2.585 2.585 0 0 0-2.584-2.584h-2.37a2.585 2.585 0 0 0-2.584 2.584c0 .595.482 1.078 1.077 1.078ZM7 6.618a1.963 1.963 0 1 0 0-3.926 1.963 1.963 0 0 0 0 3.926Z" />
  </svg>
);

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
      ? "Integrations - All Channels, One Platform | Edfu"
      : "Entegrasyonlar - Tüm Kanallarınız, Tek Platform | Edfu",
    description: isEn
      ? "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams and more. Connect all your channels."
      : "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams ve daha fazlası. Tüm kanallarınızı bağlayın.",
    alternates: {
      canonical: isEn ? "/en/integrations" : "/integrations",
      languages: { tr: "/integrations", en: "/en/integrations", "x-default": "/integrations" },
    },
    openGraph: {
      title: isEn ? "Integrations | Edfu" : "Entegrasyonlar | Edfu",
      description: isEn
        ? "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams and more. Connect all your channels."
        : "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams ve daha fazlası. Tüm kanallarınızı bağlayın.",
      url: isEn ? `${BASE_URL}/en/integrations` : `${BASE_URL}/integrations`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isEn ? "Integrations | Edfu" : "Entegrasyonlar | Edfu",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Integrations | Edfu" : "Entegrasyonlar | Edfu",
      description: isEn
        ? "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams and more. Connect all your channels."
        : "WhatsApp, Instagram, Telegram, Zoom, Meet, Teams ve daha fazlası. Tüm kanallarınızı bağlayın.",
      images: ["/og-image.png"],
    },
  };
}

export default async function IntegrationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const ip = dict.integrationsPage;
  const dm = ip.dataModel;

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          {/* Hero */}
          <section className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 text-center">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 mx-auto max-w-3xl pt-12">
              <h1
                className="text-[36px] sm:text-[48px] md:text-[56px] font-medium leading-none tracking-tight text-foreground"
                style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
              >
                {ip.hero.title}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {ip.hero.description}
              </p>
            </div>
          </section>

          {/* Integration Grid */}
          <IntegrationGrid
            sections={[
              {
                title: ip.channels.title,
                items: ip.channels.items,
              },
              {
                title: ip.meetingTools.title,
                items: ip.meetingTools.items,
              },
              {
                title: ip.businessTools.title,
                items: ip.businessTools.items,
                columns: 4,
              },
            ]}
          />

          {/* Data Model Viz */}
          <DataModelViz
            sectionNumber="[03]"
            sectionLabel={dm.sectionLabel}
            cards={[
              { icon: CustomerIcon, iconColor: "#0FC27B", title: dm.cards[0].title, badge: dm.cards[0].badge, attrs: dm.cards[0].attrs, moreCount: dm.cards[0].moreCount },
              { icon: ConversationIcon, iconColor: "#9162F9", title: dm.cards[1].title, badge: dm.cards[1].badge, attrs: dm.cards[1].attrs, moreCount: dm.cards[1].moreCount },
              { icon: ProposalIcon, iconColor: "#266DF0", title: dm.cards[2].title, badge: dm.cards[2].badge, attrs: dm.cards[2].attrs, moreCount: dm.cards[2].moreCount },
            ]}
            addObjectLabel={dm.addObject}
          />

          {/* CTA */}
          <PageCTA
            title={ip.cta.title}
            buttonText={ip.cta.button}
            buttonHref="https://app.edfu.ai"
          />
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
