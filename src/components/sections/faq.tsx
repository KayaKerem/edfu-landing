"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Dictionary } from "@/dictionaries";

interface FAQProps {
  dict: Dictionary["faq"];
}

export function FAQ({ dict }: FAQProps) {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleExpandAll = () => {
    if (allExpanded) {
      setOpenIndexes(new Set());
      setAllExpanded(false);
    } else {
      setOpenIndexes(new Set(dict.items.map((_, i) => i)));
      setAllExpanded(true);
    }
  };

  return (
    <section
      style={{
        background: "#ffffff",
        width: "100%",
        borderTop: "1px solid #e5e7eb",
        paddingBottom: 80,
      }}
    >
      {/* Heading */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "60px 24px 0",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#111827",
              lineHeight: 1.1,
            }}
          >
            {dict.title}
          </h2>
          {dict.description && (
            <p
              style={{
                marginTop: 10,
                fontSize: 15,
                color: "#6b7280",
                lineHeight: 1.6,
                maxWidth: 440,
              }}
            >
              {dict.description}
            </p>
          )}
        </div>

        {/* Expand all button */}
        <button
          onClick={handleExpandAll}
          style={{
            flexShrink: 0,
            fontSize: 13,
            fontWeight: 500,
            color: "#374151",
            background: "transparent",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            padding: "7px 14px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 130ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          {allExpanded ? dict.collapseAll : dict.expandAll}
        </button>
      </div>

      {/* Accordion items */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px 24px 0",
        }}
      >
        {dict.items.map((faq, index) => {
          const isOpen = openIndexes.has(index);
          return (
            <div
              key={index}
              style={{ borderBottom: "1px solid #e5e7eb" }}
            >
              <button
                onClick={() => toggle(index)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 0",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#111827",
                    lineHeight: 1.4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {faq.question}
                </span>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#9ca3af",
                  }}
                >
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {/* Answer panel */}
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                  transition: "grid-template-rows 250ms ease",
                  overflow: "hidden",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#6b7280",
                      paddingBottom: 20,
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
