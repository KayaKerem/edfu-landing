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
      ? "AI Agents - Automate, Research, Sell | Edfu"
      : "AI Agent'lar - Otomatiklestirin, Arastirin, Satin | Edfu",
    description: isEn
      ? "5 AI agents working together: Conversation, Proposal, Research, Meeting, and RAG agents."
      : "Birlikte calisan 5 AI agent: Konusma, Teklif, Arastirma, Toplanti ve RAG agentlari.",
    alternates: {
      canonical: isEn ? "/en/agents" : "/agents",
      languages: {
        tr: "/agents",
        en: "/en/agents",
        "x-default": "/agents",
      },
    },
    openGraph: {
      title: isEn
        ? "AI Agents | Edfu"
        : "AI Agent'lar | Edfu",
      description: isEn
        ? "5 AI agents working together to automate your customer communication."
        : "Musteri iletisiminizi otomatiklestiren 5 AI agent.",
      url: isEn ? `${BASE_URL}/en/agents` : `${BASE_URL}/agents`,
    },
  };
}

export default async function AgentsPage({
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
            <p className="text-muted-foreground">Agents page — coming soon</p>
          </div>
        </main>
        <Footer dict={dict.footer} />
      </div>
    </>
  );
}
