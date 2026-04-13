"use client";

import { usePathname } from "next/navigation";

export function LanguageSwitcher({ lang }: { lang: string }) {
  const isEn = lang === "en";
  const pathname = usePathname();

  function handleSwitch(targetLocale: string) {
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000`;
    // Strip existing locale prefix to get the path
    const currentPath = pathname.replace(/^\/(en|tr)/, "") || "/";
    window.location.href =
      targetLocale === "en" ? `/en${currentPath}` : currentPath;
  }

  return (
    <button
      onClick={() => handleSwitch(isEn ? "tr" : "en")}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {isEn ? "TR" : "EN"}
    </button>
  );
}
