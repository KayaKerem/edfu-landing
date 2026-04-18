"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { WhatsAppChat } from "@/components/mockups/whatsapp-chat";
import { ProposalDoc } from "@/components/mockups/proposal-doc";
import { ResearchReport } from "@/components/mockups/research-report";
import { CallPlayer } from "@/components/mockups/call-player";
import { RagSearch } from "@/components/mockups/rag-search";

interface AgentTab {
  title: string;
  description: string;
  features: string[];
}

interface MockupsDict {
  whatsappChat: Parameters<typeof WhatsAppChat>[0]["dict"];
  proposalDoc: Parameters<typeof ProposalDoc>[0]["dict"];
  researchReport: Parameters<typeof ResearchReport>[0]["dict"];
  callPlayer: Parameters<typeof CallPlayer>[0]["dict"];
  ragSearch: Parameters<typeof RagSearch>[0]["dict"];
}

interface AgentTabsProps {
  tabs: AgentTab[];
  mockupsDict: MockupsDict;
}

export function AgentTabs({ tabs, mockupsDict }: AgentTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const mockups = [
    <WhatsAppChat key="whatsapp" dict={mockupsDict.whatsappChat} />,
    <ProposalDoc key="proposal" dict={mockupsDict.proposalDoc} />,
    <ResearchReport key="research" dict={mockupsDict.researchReport} />,
    <CallPlayer key="call" dict={mockupsDict.callPlayer} />,
    <RagSearch key="rag" dict={mockupsDict.ragSearch} />,
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          role="tablist"
          className="flex overflow-x-auto border-b border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={activeTab === i}
              onClick={() => setActiveTab(i)}
              className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                activeTab === i
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}            >
              {tab.title}
              {activeTab === i && (
                <motion.div
                  layoutId="agentTabIndicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start"
          >
            <div>
              <h3
                className="text-2xl font-semibold text-foreground tracking-tight"
              >
                {tabs[activeTab].title}
              </h3>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {tabs[activeTab].description}
              </p>
              <ul className="mt-6 space-y-3">
                {tabs[activeTab].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="size-5 rounded-full border border-primary/20 flex items-center justify-center shrink-0">
                      <Check className="size-3 text-primary" strokeWidth={2.5} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {mockups[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
