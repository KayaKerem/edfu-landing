"use client";

import Image from "next/image";
import { useTheme } from "@/providers/theme-provider";

type EdfuBrandProps = {
  alt: string;
  width: number;
  height: number;
  className?: string;
};

function useThemeAsset(lightSrc: string, darkSrc: string) {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === "dark" ? darkSrc : lightSrc;
}

export function EdfuThemeLogo({ alt, width, height, className }: EdfuBrandProps) {
  const src = useThemeAsset("/edfu-lighttheme-logo.svg", "/edfu-darktheme-logo.svg");
  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}

export function EdfuThemeLoader({ alt, width, height, className }: EdfuBrandProps) {
  const src = useThemeAsset("/edfu-loader-light.svg", "/edfu-loader-dark.svg");
  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}
