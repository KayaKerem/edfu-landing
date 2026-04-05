"use client";

export function LanguageSwitcher({ lang }: { lang: string }) {
  const isEn = lang === "en";

  function handleSwitch(targetLocale: string) {
    document.cookie = `NEXT_LOCALE=${targetLocale};path=/;max-age=31536000`;
    window.location.href = targetLocale === "en" ? "/en" : "/";
  }

  return (
    <div className="flex h-8 items-center rounded-full border border-border px-2 text-xs font-medium">
      <button
        onClick={() => handleSwitch("tr")}
        className={`cursor-pointer px-1.5 py-0.5 transition-colors ${
          !isEn ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        TR
      </button>
      <span className="text-border mx-0.5">|</span>
      <button
        onClick={() => handleSwitch("en")}
        className={`cursor-pointer px-1.5 py-0.5 transition-colors ${
          isEn ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
}
