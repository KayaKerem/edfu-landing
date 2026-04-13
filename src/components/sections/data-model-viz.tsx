"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DataModelCardData {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  badge?: string;
  attrs: string[];
  moreCount?: number;
}

interface DataModelVizProps {
  sectionNumber?: string;
  sectionLabel?: string;
  cards: [DataModelCardData, DataModelCardData, DataModelCardData];
  addObjectLabel?: string;
  className?: string;
}

/* Small attribute row icon */
const AttrIcon = (
  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="1.5" width="11" height="11" rx="3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

/* --- Internal card component (Attio's DataModelCard pattern) --- */
function ModelCard({
  card,
  className,
  style,
}: {
  card: DataModelCardData;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-[10px] border border-[#EDEFF3] bg-white p-[7px] lg:rounded-xl lg:p-[11px]",
        "shadow-[0px_2px_3px_-2px_rgba(16,24,40,0.08)]",
        "dark:border-[#2E3238] dark:bg-[#1C1C1F] dark:shadow-[0px_2px_3px_-2px_rgba(0,0,0,0.3)]",
        className
      )}
      style={style}
    >
      <div className="pointer-events-none select-none">
        {/* Title + badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1.5 overflow-hidden pl-1 lg:pl-2">
            <div className="flex size-[14px] shrink-0 items-center justify-center">
              {card.icon}
            </div>
            <span className="truncate text-[11px] font-medium text-[#0F172A] dark:text-[#F1F5F9] lg:text-[14px]">
              {card.title}
            </span>
          </div>
          {card.badge && (
            <span
              className={cn(
                "border font-medium rounded-md px-[3px] py-[0.5px] text-[8px] leading-[11px]",
                "lg:rounded-lg lg:px-[5px] lg:py-px lg:text-[10px] lg:leading-[14px]",
                card.badge === "Custom"
                  ? "border-[#E9D7FE] bg-[#F9F5FF] text-[#6941C6] dark:border-[#5B21B6] dark:bg-[#2D1B69] dark:text-[#A78BFA]"
                  : "border-[#EDEFF3] bg-[#F9FAFB] text-[#475467] dark:border-[#2E3238] dark:bg-[#27272A] dark:text-[#94A3B8]"
              )}
            >
              {card.badge}
            </span>
          )}
        </div>

        {/* Attribute rows */}
        <div className="mt-2 border-t border-[#EDEFF3] dark:border-[#2E3238] lg:mt-3">
          {card.attrs.map((a) => (
            <div
              key={a}
              className="overflow-hidden border-b border-[#EDEFF3] dark:border-[#2E3238] pt-1 pb-[3px] pl-2 lg:pt-1.5 lg:pb-[5px] lg:pl-3"
            >
              <div className="flex items-center gap-x-1.5 text-[#98A2B3] dark:text-[#64748B]">
                {AttrIcon}
                <span className="truncate text-[10px] text-[#475467] dark:text-[#94A3B8] lg:text-[12px]">
                  {a}
                </span>
              </div>
            </div>
          ))}
          {card.moreCount && card.moreCount > 0 && (
            <div className="flex items-center mt-1 gap-x-[6.5px] pl-[8.5px] lg:mt-1.5 lg:gap-x-[7px] lg:pl-[13px]">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-[3px] w-[3px] rounded-full bg-[#98A2B3] dark:bg-[#64748B]"
                />
              ))}
              <span className="ml-1 text-[9px] text-[#98A2B3] dark:text-[#64748B] lg:text-[11px]">
                {card.moreCount} More
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- "Add object" dashed placeholder --- */
function AddObjectCard({ label = "Add object" }: { label?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center",
        "rounded-[10px] border border-dashed border-[#D0D5DD] lg:rounded-xl",
        "dark:border-[#475569]",
        "transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:scale-[1.01]"
      )}
    >
      <span className="flex items-center gap-x-1.5 text-[11px] text-[#98A2B3] dark:text-[#64748B] lg:text-[13px]">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 3v8M3 7h8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        {label}
      </span>
    </div>
  );
}

/* --- SVG connectors in the grid gutters --- */
function Connectors({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <>
      {/* Top-left -> bottom-left (vertical hook in left gutter) */}
      <div className="pointer-events-none absolute inset-0 col-start-1 col-end-2 row-start-2 row-end-3 flex justify-end pr-2">
        <svg width="14" height="100%" viewBox="0 0 14 41" fill="none" preserveAspectRatio="none">
          <path
            d="M13 41V29C13 26.4819 11.8144 24.1108 9.8 22.6L4.2 18.4C2.18555 16.8892 1 14.5181 1 12V0"
            stroke="#E4E7EC"
            strokeWidth="1"
            strokeDasharray="60"
            strokeDashoffset="60"
            className="dark:stroke-[#334155]"
            style={{ animation: "svg-connector-draw 1.2s cubic-bezier(0.2,0,0,1) 0.3s forwards" }}
          />
        </svg>
      </div>

      {/* Top-left -> top-right (horizontal across top gutter) */}
      <div className="pointer-events-none absolute inset-0 col-start-2 col-end-3 row-start-1 row-end-2 flex items-center justify-center">
        <svg width="100%" height="14" viewBox="0 0 64 14" fill="none" preserveAspectRatio="none">
          <path
            d="M0 7C16 7 48 7 64 7"
            stroke="#E4E7EC"
            strokeWidth="1"
            strokeDasharray="64"
            strokeDashoffset="64"
            className="dark:stroke-[#334155]"
            style={{ animation: "svg-connector-draw 1.2s cubic-bezier(0.2,0,0,1) 0.5s forwards" }}
          />
        </svg>
      </div>

      {/* Bottom-left -> bottom-right (horizontal across bottom gutter) */}
      <div className="pointer-events-none absolute inset-0 col-start-2 col-end-3 row-start-3 row-end-4 flex items-center justify-center">
        <svg width="100%" height="14" viewBox="0 0 64 14" fill="none" preserveAspectRatio="none">
          <path
            d="M0 7C16 7 48 7 64 7"
            stroke="#E4E7EC"
            strokeWidth="1"
            strokeDasharray="64"
            strokeDashoffset="64"
            className="dark:stroke-[#334155]"
            style={{ animation: "svg-connector-draw 1.2s cubic-bezier(0.2,0,0,1) 0.7s forwards" }}
          />
        </svg>
      </div>

      {/* Top-right -> bottom-right (vertical hook in right gutter) */}
      <div className="pointer-events-none absolute inset-0 col-start-3 col-end-4 row-start-2 row-end-3 flex justify-start pl-2">
        <svg width="14" height="100%" viewBox="0 0 14 41" fill="none" preserveAspectRatio="none">
          <path
            d="M1 41V29C1 26.4819 2.18555 24.1108 4.2 22.6L9.8 18.4C11.8144 16.8892 13 14.5181 13 12V0"
            stroke="#E4E7EC"
            strokeWidth="1"
            strokeDasharray="60"
            strokeDashoffset="60"
            className="dark:stroke-[#334155]"
            style={{ animation: "svg-connector-draw 1.2s cubic-bezier(0.2,0,0,1) 0.9s forwards" }}
          />
        </svg>
      </div>
    </>
  );
}

/* --- Main component --- */
export function DataModelViz({
  sectionNumber,
  sectionLabel,
  cards,
  addObjectLabel,
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
    <section ref={containerRef} className={cn("py-16 sm:py-20 overflow-hidden", className)}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section heading (Attio style) */}
        {(sectionNumber || sectionLabel) && (
          <div className="mb-8 flex items-center gap-x-[6px] text-[11px] uppercase tracking-[0.12em] text-[#475467] dark:text-[#94A3B8]">
            {sectionNumber && <span>{sectionNumber}</span>}
            {sectionLabel && (
              <span className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                {sectionLabel}
              </span>
            )}
          </div>
        )}

        {/* Cards grid + connectors */}
        <div className="relative">
          {/* Dot-grid background */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(#E4E7EC 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          <div className="relative mx-auto grid w-fit grid-cols-[1fr_40px_1fr] md:grid-cols-[1fr_64px_1fr] grid-rows-[auto_24px_auto] md:grid-rows-[auto_40px_auto] gap-0 px-4 pt-5 pb-10 md:px-6 md:pb-16">
            {/* Top-left card */}
            <div
              className="[grid-column:1] [grid-row:1]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.6s cubic-bezier(0.2,0,0,1) 0s",
              }}
            >
              <ModelCard card={cards[0]} />
            </div>

            {/* Top-right card */}
            <div
              className="[grid-column:3] [grid-row:1]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.6s cubic-bezier(0.2,0,0,1) 0.15s",
              }}
            >
              <ModelCard card={cards[1]} />
            </div>

            {/* Bottom-left card */}
            <div
              className="[grid-column:1] [grid-row:3]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.6s cubic-bezier(0.2,0,0,1) 0.3s",
              }}
            >
              <ModelCard card={cards[2]} />
            </div>

            {/* Bottom-right: Add object */}
            <div
              className="[grid-column:3] [grid-row:3]"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                transition: "all 0.6s cubic-bezier(0.2,0,0,1) 0.45s",
              }}
            >
              <AddObjectCard label={addObjectLabel} />
            </div>

            {/* SVG connectors */}
            <Connectors visible={isVisible} />
          </div>
        </div>
      </div>
    </section>
  );
}
