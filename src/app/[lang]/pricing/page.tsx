import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale, Dictionary } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { PricingClient } from "./pricing-client";

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
      ? "Pricing - Standard, Pro & Enterprise Plans | Edfu"
      : "Fiyatlandırma - Standard, Pro ve Enterprise Planlar | Edfu",
    description: isEn
      ? "Simple, transparent pricing for every team. Start with Standard, scale with Pro, or go fully custom with Enterprise."
      : "Her ekip için şeffaf fiyatlandırma. Standard ile başlayın, Pro ile büyüyün veya Enterprise ile tam özelleştirme.",
    alternates: {
      canonical: isEn ? "/en/pricing" : "/pricing",
      languages: { tr: "/pricing", en: "/en/pricing", "x-default": "/pricing" },
    },
    openGraph: {
      title: isEn ? "Pricing | Edfu" : "Fiyatlandırma | Edfu",
      description: isEn
        ? "Simple, transparent pricing for every team."
        : "Her ekip için şeffaf fiyatlandırma.",
      url: isEn ? `${BASE_URL}/en/pricing` : `${BASE_URL}/pricing`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "Pricing | Edfu" : "Fiyatlandırma | Edfu",
      description: isEn
        ? "Simple, transparent pricing for every team."
        : "Her ekip için şeffaf fiyatlandırma.",
      images: ["/og-image.png"],
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
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
      }}
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

  return (
    <>
      <PricingJsonLd dict={dict} />
      <Navbar dict={dict.navbar} lang={lang} />
      <main style={{ paddingTop: 60 }}>
        <PricingClient pricingDict={dict.pricing} faqDict={dict.faq} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
