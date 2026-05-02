"use client";

import Image from "next/image";
import { useTheme } from "@/providers/theme-provider";

type EdfuBrandProps = {
  alt: string;
  width: number;
  height: number;
  className?: string;
};

const STROKE_PATHS = (
  <>
    <path d="M 10 30 L 50 50" stroke="currentColor" strokeWidth={10} strokeLinecap="round" />
    <path d="M 10 50 L 50 50" stroke="currentColor" strokeWidth={10} strokeLinecap="round" />
    <path d="M 10 70 L 50 50" stroke="currentColor" strokeWidth={10} strokeLinecap="round" />
    <path d="M 50 50 L 90 50" stroke="currentColor" strokeWidth={10} strokeLinecap="round" />
  </>
);

export function EdfuThemeMark({ alt, width, height, className }: EdfuBrandProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={alt}
      fill="none"
    >
      {STROKE_PATHS}
    </svg>
  );
}

export function EdfuThemeLogo({ alt, width, height, className }: EdfuBrandProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 100"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={alt}
      fill="none"
    >
      {STROKE_PATHS}
      <text
        x={120}
        y={74}
        fontSize={72}
        fontWeight={600}
        letterSpacing={-3}
        fill="currentColor"
        stroke="none"
        style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
      >
        edfu
      </text>
    </svg>
  );
}

export function EdfuThemeLoader({ alt, width, height, className }: EdfuBrandProps) {
  return <EdfuThemeMark alt={alt} width={width} height={height} className={className} />;
}

export function EdfuIosIcon({ alt, width, height, className }: EdfuBrandProps) {
  const { resolvedTheme } = useTheme();
  const src =
    resolvedTheme === "dark"
      ? "/brand/logos/ios-front-dark.svg"
      : "/brand/logos/ios-front-light.svg";
  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}
