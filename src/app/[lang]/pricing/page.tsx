import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale, Dictionary } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Pricing } from "@/components/sections/pricing";
import { FAQ } from "@/components/sections/faq";
import { PageCTA } from "@/components/sections/page-cta";
import { Footer } from "@/components/sections/footer";

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
      ? "Pricing - Choose the Right Plan | Edfu"
      : "Fiyatlandırma - İşletmenize Uygun Plan | Edfu",
    description: isEn
      ? "Starter, Professional, and Enterprise plans. All with 14-day free trial."
      : "Başlangıç, Profesyonel ve Kurumsal planlar. Tümünde 14 gün ücretsiz deneme.",
    alternates: {
      canonical: isEn ? "/en/pricing" : "/pricing",
      languages: { tr: "/pricing", en: "/en/pricing", "x-default": "/pricing" },
    },
    openGraph: {
      title: isEn ? "Pricing | Edfu" : "Fiyatlandırma | Edfu",
      url: isEn ? `${BASE_URL}/en/pricing` : `${BASE_URL}/pricing`,
    },
  };
}

function PricingJsonLd({ dict }: { dict: Dictionary }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const prefix = lang === "tr" ? "" : `/${lang}`;

  return (
    <>
      <PricingJsonLd dict={dict} />
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="pt-20">
          <Pricing dict={dict.pricing} />
          <div className="divide-y divide-border">
            <FAQ dict={dict.faq} />
            <PageCTA
              title={dict.pricingPage.cta.title}
              description={dict.pricingPage.cta.description}
              buttonText={dict.pricingPage.cta.button}
              buttonHref="https://app.edfu.ai"
            />
          </div>
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
