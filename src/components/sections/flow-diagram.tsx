"use client";

import { useRef, useState, useEffect } from "react";
import { FlowNode } from "@/components/ui/flow-node";
import { MessageSquare, Search, FileText, ArrowDown, GitBranch, Info } from "lucide-react";

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
  };
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
    { icon: <MessageSquare className="size-4" />, label: dict.trigger, sublabel: dict.triggerSub, variant: "trigger" as const, delay: 0 },
    { icon: <MessageSquare className="size-4" />, label: dict.conversation, sublabel: dict.conversationSub, variant: "action" as const, delay: 200 },
    { icon: <GitBranch className="size-4" />, label: dict.condition, variant: "condition" as const, delay: 400 },
  ];

  const yesBranch = [
    { icon: <Search className="size-4" />, label: dict.research, sublabel: dict.researchSub, variant: "action" as const, delay: 600 },
    { icon: <FileText className="size-4" />, label: dict.proposal, sublabel: dict.proposalSub, variant: "action" as const, delay: 800 },
  ];

  const noBranch = [
    { icon: <Info className="size-4" />, label: dict.inform, sublabel: dict.informSub, variant: "default" as const, delay: 600 },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto mb-12 max-w-xl px-4 text-center">
        <h2
          className="text-[28px] sm:text-[32px] md:text-[36px] font-medium leading-none text-foreground"
          style={{ letterSpacing: "-0.05em", fontFamily: "var(--font-geist)" }}
        >
          {dict.title}
        </h2>
        <p className="mt-4 text-base text-muted-foreground font-medium text-balance">
          {dict.description}
        </p>
      </div>

      <div ref={containerRef} className="mx-auto max-w-md px-4">
        <div className="flex flex-col items-center gap-3">
          {nodes.map((node, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-3">
              <div
                className="w-full transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(10px)",
                  transitionDelay: `${node.delay}ms`,
                }}
              >
                <FlowNode {...node} className="w-full" />
              </div>
              {i < nodes.length - 1 && (
                <ArrowDown className="size-4 text-muted-foreground/40" />
              )}
            </div>
          ))}

          <div
            className="grid grid-cols-2 gap-4 w-full mt-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.5s",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-medium text-emerald-600">{dict.conditionYes}</span>
              {yesBranch.map((node, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-3">
                  <div
                    className="w-full transition-all duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(10px)",
                      transitionDelay: `${node.delay}ms`,
                    }}
                  >
                    <FlowNode {...node} className="w-full" />
                  </div>
                  {i < yesBranch.length - 1 && (
                    <ArrowDown className="size-4 text-muted-foreground/40" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-3">
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
                  <FlowNode {...node} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
