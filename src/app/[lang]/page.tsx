import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale, Dictionary } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { Testimonial } from "@/components/sections/testimonial";
import { Security } from "@/components/sections/security";
import { MarqueeTestimonials } from "@/components/sections/marquee-testimonials";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { AutomateEverything } from "@/components/sections/automate-everything";
import { ConnectData } from "@/components/sections/connect-data";
import type { ConnectDataDict } from "@/components/sections/connect-data";
import { DeployAi } from "@/components/sections/deploy-ai";
import type { DeployAiDict } from "@/components/sections/deploy-ai";
import { AiGradientCard } from "@/components/sections/ai-gradient-card";
import { LegacyHashRedirect } from "@/components/legacy-hash-redirect";
import { FlowDiagram } from "@/components/sections/flow-diagram";

const BASE_URL = "https://edfu.ai";

function JsonLd({ dict, lang }: { dict: Dictionary; lang: string }) {
  const j = dict.jsonLd;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Edfu",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: j.orgDescription,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: j.contactLanguage,
    },
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Edfu",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: j.softwareDescription,
    url: BASE_URL,
    offers: [
      {
        "@type": "Offer",
        name: j.planStarterName,
        price: "1592",
        priceCurrency: "TRY",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1592",
          priceCurrency: "TRY",
          unitText: j.planStarterUnit,
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: "1",
            unitCode: "MON",
          },
        },
        description: j.planStarterDesc,
      },
      {
        "@type": "Offer",
        name: j.planEnterpriseName,
        price: "0",
        priceCurrency: "TRY",
        description: j.planEnterpriseDesc,
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "50",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Edfu",
    url: BASE_URL,
    description: j.websiteDescription,
    inLanguage: lang,
  };

  return (
    <>
      {/* Safe: JSON.stringify escapes </script> sequences */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  const m = dict.metadata;

  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: lang === "tr" ? BASE_URL : `${BASE_URL}/en`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: m.ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.twitterTitle,
      description: m.twitterDescription,
      images: ["/og-image.png"],
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <LegacyHashRedirect />
      <JsonLd dict={dict} lang={lang} />
      <Navbar dict={dict.navbar} lang={lang} />
      <main className="relative">
        <Hero dict={dict.hero} lang={lang} />
        <div className="relative mx-auto max-w-7xl border-x border-border/70">
          <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border/70" />
          <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border/70" />
          <div className="divide-y divide-border/70">
            {/* <Logos dict={dict.logos} /> */}
            <AutomateEverything dict={dict.automateEverything} />
            <DeployAi dict={dict.deployAi as DeployAiDict} />
            <ConnectData dict={dict.connectData as ConnectDataDict} />
            <Testimonial dict={dict.testimonial} />
            <FlowDiagram dict={dict.flowDiagram} />
            <Security dict={dict.security} />
            {/* <AiGradientCard dict={dict.aiGradientCard} /> */}
            {/* <MarqueeTestimonials dict={dict.marqueeTestimonials} /> */}
            <CTA dict={dict.cta} />
          </div>
          <Footer dict={dict.footer} lang={lang} />
        </div>
      </main>
    </>
  );
}
