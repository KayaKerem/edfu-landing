import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale, Dictionary } from "@/dictionaries";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { BentoFeatures } from "@/components/sections/bento-features";
import { Testimonial } from "@/components/sections/testimonial";
import { Security } from "@/components/sections/security";
import { MarqueeTestimonials } from "@/components/sections/marquee-testimonials";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
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
      <JsonLd dict={dict} lang={lang} />
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <Hero dict={dict.hero} lang={lang} />
          <Logos dict={dict.logos} />
          <BentoFeatures dict={dict.features} />
          <Testimonial dict={dict.testimonial} />
          <Security dict={dict.security} />
          <MarqueeTestimonials dict={dict.marqueeTestimonials} />
          <CTA dict={dict.cta} />
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
