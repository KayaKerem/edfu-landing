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
      url: isEn ? `${BASE_URL}/en/integrations` : `${BASE_URL}/integrations`,
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
            sources={[
              { label: "WhatsApp" },
              { label: "Instagram" },
              { label: "Telegram" },
              { label: "Zoom / Meet" },
              { label: "Drive / Notion" },
              { label: "CRM / ERP" },
            ]}
            centerLabel="Edfu AI"
            centerBadges={ip.dataModelBadges}
            outputs={[
              { label: ip.dataModelOutputs.lead },
              { label: ip.dataModelOutputs.proposal },
              { label: ip.dataModelOutputs.report },
              { label: ip.dataModelOutputs.summary },
              { label: ip.dataModelOutputs.knowledge },
            ]}
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
