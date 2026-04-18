import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import type { Locale } from "@/dictionaries";
import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { AgentsHero } from "@/components/sections/agents-hero";
import { AgentTabs } from "@/components/sections/agent-tabs";
import { NumberedFeatures } from "@/components/sections/numbered-features";
import { PageCTA } from "@/components/sections/page-cta";
import { BentoFeatures } from "@/components/sections/bento-features";

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
      : "AI Agent'lar - Otomatikleştirin, Araştırın, Satın | Edfu",
    description: isEn
      ? "5 AI agents working together: Conversation, Proposal, Research, Meeting, and RAG agents."
      : "Birlikte çalışan 5 AI agent: Konuşma, Teklif, Araştırma, Toplantı ve RAG agentları.",
    alternates: {
      canonical: isEn ? "/en/agents" : "/agents",
      languages: {
        tr: "/agents",
        en: "/en/agents",
        "x-default": "/agents",
      },
    },
    openGraph: {
      title: isEn ? "AI Agents | Edfu" : "AI Agent'lar | Edfu",
      description: isEn
        ? "5 AI agents working together to automate your customer communication."
        : "Müşteri iletişiminizi otomatikleştiren 5 AI agent.",
      url: isEn ? `${BASE_URL}/en/agents` : `${BASE_URL}/agents`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isEn ? "AI Agents | Edfu" : "AI Agent'lar | Edfu",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isEn ? "AI Agents | Edfu" : "AI Agent'lar | Edfu",
      description: isEn
        ? "5 AI agents working together to automate your customer communication."
        : "Müşteri iletişiminizi otomatikleştiren 5 AI agent.",
      images: ["/og-image.png"],
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
  const prefix = lang === "tr" ? "" : `/${lang}`;
  const ap = dict.agentsPage;
  const m = dict.mockups;

  const tabs = [
    ap.tabs.conversation,
    ap.tabs.proposal,
    ap.tabs.research,
    ap.tabs.meeting,
    ap.tabs.rag,
  ];

  return (
    <>
      <Navbar dict={dict.navbar} lang={lang} />
      <div className="relative mx-auto max-w-7xl border-x border-border">
        <div className="pointer-events-none absolute inset-y-0 left-4 md:left-6 z-10 w-px bg-border" />
        <div className="pointer-events-none absolute inset-y-0 right-4 md:right-6 z-10 w-px bg-border" />
        <main className="divide-y divide-border">
          <AgentsHero dict={ap.hero} ctaText={ap.cta.button} prefix={prefix} />
          <AgentTabs
            tabs={tabs}
            mockupsDict={{
              whatsappChat: m.whatsappChat,
              proposalDoc: m.proposalDoc,
              researchReport: m.researchReport,
              callPlayer: m.callPlayer,
              ragSearch: m.ragSearch,
            }}
          />
          <NumberedFeatures features={ap.numberedFeatures} />
          <BentoFeatures dict={dict.features} />
          <PageCTA
            title={ap.cta.title}
            buttonText={ap.cta.button}
            buttonHref="https://app.edfu.ai"
          />
        </main>
        <Footer dict={dict.footer} lang={lang} />
      </div>
    </>
  );
}
