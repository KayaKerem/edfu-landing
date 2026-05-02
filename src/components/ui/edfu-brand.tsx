"use client";

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
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label={alt}
    >
      <defs>
        <linearGradient id="edfuIosBg" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#6ea8fe" />
          <stop offset="45%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="edfuIosTopHighlight" cx="30%" cy="15%" r="60%" fx="30%" fy="15%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="edfuIosTopGloss" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="edfuIosBottomGlow" cx="50%" cy="100%" r="60%" fx="50%" fy="100%">
          <stop offset="0%" stopColor="#a5c8ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a5c8ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="edfuIosDiagShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect x="112" y="112" width="800" height="800" rx="220" ry="220" fill="url(#edfuIosBg)" />
      <rect x="112" y="112" width="800" height="800" rx="220" ry="220" fill="url(#edfuIosTopHighlight)" />
      <rect x="130" y="130" width="764" height="764" rx="206" ry="206" fill="url(#edfuIosTopGloss)" />
      <rect x="130" y="130" width="764" height="764" rx="206" ry="206" fill="url(#edfuIosBottomGlow)" />
      <rect x="112" y="112" width="800" height="800" rx="220" ry="220" fill="url(#edfuIosDiagShine)" opacity="0.6" />
      <rect x="113" y="113" width="798" height="798" rx="219" ry="219" fill="none" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
      <g transform="translate(280 280) scale(4.64)" fill="none">
        <path d="M 10 30 L 50 50" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
        <path d="M 10 50 L 50 50" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
        <path d="M 10 70 L 50 50" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
        <path d="M 50 50 L 90 50" stroke="#ffffff" strokeWidth={10} strokeLinecap="round" />
      </g>
    </svg>
  );
}
