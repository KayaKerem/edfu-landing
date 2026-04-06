"use client";

export function LanguageSwitcher({ lang }: { lang: string }) {
  const isEn = lang === "en";

  function handleSwitch(targetLocale: string) {
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000`;
    window.location.href = targetLocale === "en" ? "/en" : "/";
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
