"use client";

import { useRef, useEffect, useState } from "react";
import { GradientBorder } from "@/components/ui/gradient-border";
import { cn } from "@/lib/utils";

interface VizNode {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
}

interface DataModelVizProps {
  sources: VizNode[];
  centerLabel: string;
  centerBadges: string[];
  outputs: VizNode[];
  className?: string;
}

function NodeCard({ node }: { node: VizNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[rgba(46,50,56,0.07)] dark:border-border bg-white dark:bg-[#27272A] px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.04)]">
      {node.icon && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {node.icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{node.label}</p>
        {node.sublabel && (
          <p className="text-xs text-muted-foreground truncate">{node.sublabel}</p>
        )}
      </div>
    </div>
  );
}

export function DataModelViz({
  sources,
  centerLabel,
  centerBadges,
  outputs,
  className,
}: DataModelVizProps) {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={cn("py-20 overflow-hidden", className)}>
      <div ref={containerRef} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center">
          {/* Left: Sources */}
          <div className="flex flex-col gap-3">
            {sources.map((node, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateX(0)"
                    : "translateX(-20px)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <NodeCard node={node} />
              </div>
            ))}
          </div>

          {/* Center: Hub */}
          <div
            className="flex justify-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "scale(1)" : "scale(0.9)",
              transition: "all 0.6s ease-out 0.4s",
            }}
          >
            <GradientBorder className="w-48 md:w-56">
              <div className="p-6 text-center">
                <p
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "var(--font-geist)" }}
                >
                  {centerLabel}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {centerBadges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </GradientBorder>
          </div>

          {/* Right: Outputs */}
          <div className="flex flex-col gap-3">
            {outputs.map((node, i) => (
              <div
                key={i}
                className="transition-all duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? "translateX(0)"
                    : "translateX(20px)",
                  transitionDelay: `${(i * 100) + 600}ms`,
                }}
              >
                <NodeCard node={node} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
