"use client";

import { useRef, useState, useEffect } from "react";
import { FlowNode } from "@/components/ui/flow-node";
import { MessageSquare, Search, FileText, GitBranch, Info } from "lucide-react";

interface FlowDiagramProps {
  dict: {
    title: string;
    description: string;
    trigger: string;
    triggerSub: string;
    conversation: string;
    conversationSub: string;
    condition: string;
    conditionYes: string;
    conditionNo: string;
    research: string;
    researchSub: string;
    proposal: string;
    proposalSub: string;
    inform: string;
    informSub: string;
    contextPanel: {
      title: string;
      messages: { from: string; text: string }[];
    };
  };
}

function VerticalConnector({ delay = 0, height = 24 }: { delay?: number; height?: number }) {
  return (
    <div className="flex justify-center py-1">
      <svg width="2" height={height} viewBox={`0 0 2 ${height}`} fill="none" className="overflow-visible">
        <line
          x1="1" y1="0" x2="1" y2={height}
          className="stroke-[#E4E7EC] dark:stroke-[#334155]"
          strokeWidth="1"
          strokeDasharray={height}
          strokeDashoffset={height}
          style={{ animation: `svg-connector-draw 0.6s cubic-bezier(0.2,0,0,1) ${delay}s forwards` }}
        />
      </svg>
    </div>
  );
}

function BranchConnector({ delay = 0, width = 200 }: { delay?: number; width?: number }) {
  const half = width / 2;
  const quarter = width / 4;
  return (
    <div className="flex justify-center py-1">
      <svg width={width} height="32" viewBox={`0 0 ${width} 32`} fill="none" className="overflow-visible">
        <path
          d={`M${half} 0 C${half} 16, ${quarter} 16, ${quarter} 32`}
          className="stroke-[#E4E7EC] dark:stroke-[#334155]"
          strokeWidth="1"
          strokeDasharray="60"
          strokeDashoffset="60"
          style={{ animation: `svg-connector-draw 0.8s cubic-bezier(0.2,0,0,1) ${delay}s forwards` }}
        />
        <path
          d={`M${half} 0 C${half} 16, ${half + quarter} 16, ${half + quarter} 32`}
          className="stroke-[#E4E7EC] dark:stroke-[#334155]"
          strokeWidth="1"
          strokeDasharray="60"
          strokeDashoffset="60"
          style={{ animation: `svg-connector-draw 0.8s cubic-bezier(0.2,0,0,1) ${delay + 0.1}s forwards` }}
        />
      </svg>
    </div>
  );
}

export function FlowDiagram({ dict }: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const nodes = [
    { icon: <MessageSquare className="size-3.5" />, label: dict.trigger, sublabel: dict.triggerSub, variant: "trigger" as const, delay: 0, status: "Running", statusPulse: true },
    { icon: <MessageSquare className="size-3.5" />, label: dict.conversation, sublabel: dict.conversationSub, variant: "action" as const, delay: 200, status: "Completed" },
    { icon: <GitBranch className="size-3.5" />, label: dict.condition, variant: "condition" as const, delay: 400 },
  ];

  const yesBranch = [
    { icon: <Search className="size-3.5" />, label: dict.research, sublabel: dict.researchSub, variant: "action" as const, delay: 600, status: "Running", statusPulse: true },
    { icon: <FileText className="size-3.5" />, label: dict.proposal, sublabel: dict.proposalSub, variant: "action" as const, delay: 800 },
  ];

  const noBranch = [
    { icon: <Info className="size-3.5" />, label: dict.inform, sublabel: dict.informSub, variant: "default" as const, delay: 600 },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto mb-12 max-w-xl px-4 text-center">
        <h2
          className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-[#0F172A] dark:text-[#F1F5F9]"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
        >
          {dict.title}
        </h2>
        <p className="mt-4 text-base font-medium text-balance text-[#475467] dark:text-[#94A3B8]">
          {dict.description}
        </p>
      </div>

      <div ref={containerRef} className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Flow column */}
          <div className="relative max-w-md mx-auto md:mx-0">
            {/* Dot-grid background */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-60"
              style={{
                backgroundImage: "radial-gradient(#E4E7EC 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />

            <div className="flex flex-col items-center">
              {nodes.map((node, i) => (
                <div key={i} className="w-full flex flex-col items-center">
                  <div
                    className="w-full transition-all duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(10px)",
                      transitionDelay: `${node.delay}ms`,
                    }}
                  >
                    <FlowNode
                      icon={node.icon}
                      label={node.label}
                      sublabel={"sublabel" in node ? node.sublabel : undefined}
                      variant={node.variant}
                      status={"status" in node ? node.status : undefined}
                      statusPulse={"statusPulse" in node ? node.statusPulse : undefined}
                      className="w-full"
                    />
                  </div>
                  {i < nodes.length - 1 && (
                    <VerticalConnector delay={isVisible ? (node.delay + 100) / 1000 : 0} />
                  )}
                </div>
              ))}

              {/* Branch split connector */}
              <BranchConnector delay={isVisible ? 0.5 : 0} />

              <div
                className="grid grid-cols-2 gap-4 w-full"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: "opacity 0.5s ease-out 0.5s",
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-emerald-600">{dict.conditionYes}</span>
                  {yesBranch.map((node, i) => (
                    <div key={i} className="w-full flex flex-col items-center">
                      <div
                        className="w-full transition-all duration-500"
                        style={{
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible ? "translateY(0)" : "translateY(10px)",
                          transitionDelay: `${node.delay}ms`,
                        }}
                      >
                        <FlowNode
                          icon={node.icon}
                          label={node.label}
                          sublabel={node.sublabel}
                          variant={node.variant}
                          status={"status" in node ? node.status : undefined}
                          statusPulse={"statusPulse" in node ? node.statusPulse : undefined}
                          className="w-full"
                        />
                      </div>
                      {i < yesBranch.length - 1 && (
                        <VerticalConnector delay={isVisible ? (node.delay + 100) / 1000 : 0} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-red-500">{dict.conditionNo}</span>
                  {noBranch.map((node, i) => (
                    <div
                      key={i}
                      className="w-full transition-all duration-500"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(10px)",
                        transitionDelay: `${node.delay}ms`,
                      }}
                    >
                      <FlowNode
                        icon={node.icon}
                        label={node.label}
                        sublabel={node.sublabel}
                        variant={node.variant}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Context panel — desktop only */}
          <div
            className="hidden md:block sticky top-28"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(20px)",
              transition: "opacity 0.5s ease-out 400ms, transform 0.5s ease-out 400ms",
            }}
          >
            <div className="rounded-xl border border-border overflow-hidden">
              {/* Green header */}
              <div className="flex items-center gap-2 bg-emerald-600 px-4 py-2.5">
                <span className="size-2 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-medium text-white">
                  {dict.contextPanel.title}
                </span>
              </div>

              {/* Chat area */}
              <div className="bg-[#ECE5DD] dark:bg-[#0B141A] px-3 py-4 space-y-3 min-h-[160px]">
                {dict.contextPanel.messages.map((msg, i) =>
                  msg.from === "customer" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[85%] rounded-lg rounded-tr-sm bg-[#DCF8C6] dark:bg-[#005C4B] px-3 py-2">
                        <p className="text-[13px] text-gray-800 dark:text-gray-100 leading-snug">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex justify-start">
                      <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-white dark:bg-[#1F2C34] px-3 py-2">
                        <p className="text-[13px] text-gray-800 dark:text-gray-100 leading-snug">
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
