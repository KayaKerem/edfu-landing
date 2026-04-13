import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
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
      : "Fiyatlandirma - Isletmenize Uygun Plan | Edfu",
    description: isEn
      ? "Starter, Professional, and Enterprise plans. All with 14-day free trial."
      : "Baslangic, Profesyonel ve Kurumsal planlar. Tumunde 14 gun ucretsiz deneme.",
    alternates: {
      canonical: isEn ? "/en/pricing" : "/pricing",
      languages: { tr: "/pricing", en: "/en/pricing", "x-default": "/pricing" },
    },
    openGraph: {
      title: isEn ? "Pricing | Edfu" : "Fiyatlandirma | Edfu",
      url: isEn ? `${BASE_URL}/en/pricing` : `${BASE_URL}/pricing`,
    },
  };
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
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <div className="flex items-center justify-center min-h-[60vh] pt-20">
            <p className="text-muted-foreground">Pricing page — coming soon</p>
          </div>
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
