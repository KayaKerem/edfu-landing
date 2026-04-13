"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { GradientBorder } from "@/components/ui/gradient-border";
import { SvgConnector } from "@/components/ui/svg-connector";
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

interface ConnectorPoint {
  from: { x: number; y: number };
  to: { x: number; y: number };
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
  const gridRef = useRef<HTMLDivElement>(null);
  const sourceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hubRef = useRef<HTMLDivElement>(null);
  const outputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [connectors, setConnectors] = useState<ConnectorPoint[]>([]);

  // Initialize ref arrays when sources/outputs count changes
  sourceRefs.current = new Array(sources.length).fill(null);
  outputRefs.current = new Array(outputs.length).fill(null);

  const measureConnectors = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const gridRect = grid.getBoundingClientRect();
    const points: ConnectorPoint[] = [];

    const hubEl = hubRef.current;
    if (!hubEl) return;
    const hubRect = hubEl.getBoundingClientRect();
    const hubLeftX = hubRect.left - gridRect.left;
    const hubRightX = hubRect.right - gridRect.left;
    const hubCenterY = hubRect.top - gridRect.top + hubRect.height / 2;

    // Source → Hub connectors
    for (let i = 0; i < sources.length; i++) {
      const el = sourceRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      points.push({
        from: {
          x: rect.right - gridRect.left,
          y: rect.top - gridRect.top + rect.height / 2,
        },
        to: {
          x: hubLeftX,
          y: hubCenterY,
        },
      });
    }

    // Hub → Output connectors
    for (let i = 0; i < outputs.length; i++) {
      const el = outputRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      points.push({
        from: {
          x: hubRightX,
          y: hubCenterY,
        },
        to: {
          x: rect.left - gridRect.left,
          y: rect.top - gridRect.top + rect.height / 2,
        },
      });
    }

    setConnectors(points);
  }, [sources.length, outputs.length]);

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

  // After entrance animations complete, measure positions for connectors.
  // The last element to finish animating is the last output card:
  // delay = (outputs.length - 1) * 100 + 600 ms, duration = 500 ms → total ≈ 1200ms+
  useEffect(() => {
    if (!isVisible) return;

    const lastOutputDelay = (outputs.length - 1) * 100 + 600 + 500 + 100; // +100ms buffer
    const timer = setTimeout(measureConnectors, lastOutputDelay);
    return () => clearTimeout(timer);
  }, [isVisible, measureConnectors, outputs.length]);

  // Re-measure on resize
  useEffect(() => {
    if (!isVisible) return;
    const handleResize = () => measureConnectors();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isVisible, measureConnectors]);

  // Number of source connectors (for stagger offset on output side)
  const sourceCount = sources.length;

  return (
    <section className={cn("py-20 overflow-hidden", className)}>
      <div ref={containerRef} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          ref={gridRef}
          className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center"
        >
          {/* SVG connector overlay — md+ only */}
          {connectors.length > 0 && (
            <svg
              aria-hidden="true"
              className="hidden md:block absolute inset-0 pointer-events-none overflow-visible"
              style={{ width: "100%", height: "100%" }}
            >
              {connectors.map((c, i) => (
                <SvgConnector
                  key={i}
                  from={c.from}
                  to={c.to}
                  animated
                  delay={i < sourceCount ? i * 0.12 : (i - sourceCount) * 0.12 + 0.15}
                  className="text-muted-foreground/30"
                />
              ))}
            </svg>
          )}

          {/* Left: Sources */}
          <div className="flex flex-col gap-3">
            {sources.map((node, i) => (
              <div
                key={i}
                ref={(el) => { sourceRefs.current[i] = el; }}
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
            <div ref={hubRef}>
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
          </div>

          {/* Right: Outputs */}
          <div className="flex flex-col gap-3">
            {outputs.map((node, i) => (
              <div
                key={i}
                ref={(el) => { outputRefs.current[i] = el; }}
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
