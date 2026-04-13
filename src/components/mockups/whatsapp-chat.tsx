import { cn } from "@/lib/utils";

export function WhatsAppChat({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 dark:bg-[#1F2C34]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
          AY
        </div>
        <div className="flex-1">
          <p
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "var(--font-geist)" }}
          >
            Ahmet Yılmaz
          </p>
          <p className="text-xs text-white/70">çevrimiçi</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-medium text-white">AI Aktif</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 bg-[#ECE5DD] px-3 py-4 dark:bg-[#0B141A]">
        {/* Customer message 1 */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg rounded-tr-none bg-[#DCF8C6] px-3 py-2 dark:bg-[#005C4B]">
            <p className="text-[13px] leading-relaxed text-gray-900 dark:text-gray-100">
              Merhaba, kurumsal yazılım çözümleriniz hakkında bilgi almak
              istiyorum.
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span
                className="text-[10px] text-gray-500 dark:text-gray-400"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                14:22
              </span>
            </div>
          </div>
        </div>

        {/* AI message 1 */}
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg rounded-tl-none bg-white px-3 py-2 dark:bg-[#202C33]">
            <p className="text-[13px] leading-relaxed text-gray-900 dark:text-gray-100">
              Merhaba Ahmet Bey! Size yardımcı olmaktan mutluluk duyarım.
              Şirketinizin büyüklüğü ve sektörü hakkında bilgi alabilir miyim?
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span
                className="text-[10px] text-gray-500 dark:text-gray-400"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                14:22
              </span>
              <span className="text-[10px] text-blue-500">✓✓</span>
            </div>
          </div>
        </div>

        {/* Customer message 2 */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg rounded-tr-none bg-[#DCF8C6] px-3 py-2 dark:bg-[#005C4B]">
            <p className="text-[13px] leading-relaxed text-gray-900 dark:text-gray-100">
              SaaS sektöründe 85 kişilik bir ekibiz. CRM entegrasyonu arıyoruz.
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span
                className="text-[10px] text-gray-500 dark:text-gray-400"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                14:23
              </span>
            </div>
          </div>
        </div>

        {/* AI message 2 */}
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg rounded-tl-none bg-white px-3 py-2 dark:bg-[#202C33]">
            <p className="text-[13px] leading-relaxed text-gray-900 dark:text-gray-100">
              Harika! Tam size uygun paketlerimiz var. Şirketinizi kısaca
              araştırıp size özel bir teklif hazırlıyorum.
            </p>
            <div className="mt-1 flex items-center justify-end gap-1">
              <span
                className="text-[10px] text-gray-500 dark:text-gray-400"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                14:23
              </span>
              <span className="text-[10px] text-blue-500">✓✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
