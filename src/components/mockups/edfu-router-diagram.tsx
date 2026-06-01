'use client'

/**
 * EdfuRouterDiagram — standalone clone of the onboarding flow stage.
 *
 * Self-contained: no backend, no i18n, no external icon libs. Drop the file
 * into any React + Tailwind project and render <EdfuRouterDiagram />.
 *
 * Tailwind v3+ assumed. Brand-specific colors (channel/playbook accents) are
 * inline styles since they are data, not design tokens.
 */

import {
  forwardRef,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

// ──────────────────────────────────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────────────────────────────────

type ProviderId =
  | 'EDFU_LINK'
  | 'WEB'
  | 'WHATSAPP'
  | 'TELEGRAM'
  | 'EMAIL'
  | 'INSTAGRAM'
  | 'META_ADS'

interface ProviderRow {
  id: ProviderId
  label: string
  brand: string
  soft: string
  status: 'live' | 'soon' | 'draft' | 'configuring'
  builtin?: boolean
  description: string
  bullets?: string[]
  icon: ReactNode
}

interface PlaybookRow {
  id: string
  label: string
  color: string
  soft: string
  status: 'live' | 'draft'
  rules: number
  desc: string
  bullets: string[]
  sample: string
}

const PROVIDERS: ProviderRow[] = [
  {
    id: 'EDFU_LINK',
    label: 'Edfu Sohbet',
    brand: '#266DF0',
    soft: '#ede9fe',
    status: 'draft',
    builtin: true,
    description:
      'Hesabınla birlikte gelir, hep bağlı kalır. chat.edfu.ai/seninhesabin adresini müşterilere verirsin, doğrudan sohbet açılır.',
    bullets: [
      'Tek tıkla paylaş',
      'App gerekmez',
      "Tüm playbook'lara bağlı",
      'Marka rengiyle özelleştir',
    ],
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <rect width="24" height="24" rx="6" fill="#0a0a0a" />
        <path d="M9 8l6 4-6 4V8z" fill="#fff" />
      </svg>
    ),
  },
  {
    id: 'WEB',
    label: 'Web',
    brand: '#0ea5e9',
    soft: '#e0f2fe',
    status: 'soon',
    description: "Kendi web sitenize gömeceğiniz sohbet widget'ı. Yakında.",
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18" />
      </svg>
    ),
  },
  {
    id: 'WHATSAPP',
    label: 'WhatsApp',
    brand: '#16a34a',
    soft: '#dcfce7',
    status: 'soon',
    description: 'Resmi WhatsApp Business API. QR kod ile bağlan, template mesajlar.',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="#16a34a" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1c-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.4.1-.6.1-.1.3-.4.4-.5l.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.5.8 3.3 1.3 5.2 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
    ),
  },
  {
    id: 'TELEGRAM',
    label: 'Telegram',
    brand: '#229ED9',
    soft: '#dbeafe',
    status: 'soon',
    description: 'Telegram Bot API ile bağlan. Bot token üzerinden mesaj alıp gönder.',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="#229ED9" aria-hidden>
        <path d="M22 3L2 11l6 2 2 6 4-4 5 4 3-16zm-4 4l-9 8-1-1 10-7z" />
      </svg>
    ),
  },
  {
    id: 'EMAIL',
    label: 'E-posta',
    brand: '#a16207',
    soft: '#fef3c7',
    status: 'soon',
    description: 'IMAP/SMTP veya Google Workspace. Cevaplar threadte kalır.',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#a16207" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
  },
  {
    id: 'INSTAGRAM',
    label: 'Instagram',
    brand: '#E4405F',
    soft: '#fce7f3',
    status: 'soon',
    description: "Instagram DM'lerini ekibinin gelen kutusuna bağla. Meta hesabıyla giriş.",
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#E4405F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="#E4405F" />
      </svg>
    ),
  },
  {
    id: 'META_ADS',
    label: 'Meta Ads',
    brand: '#1877F2',
    soft: '#dbeafe',
    status: 'soon',
    description: 'Facebook/Instagram lead reklamlarındaki form gönderimlerini al.',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="#1877F2" aria-hidden>
        <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9V15h-2.5v-3h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 3h-2.3v6.9C18.3 21.1 22 17 22 12z" />
      </svg>
    ),
  },
]

const PLAYBOOKS: PlaybookRow[] = [
  {
    id: 'sales',
    label: 'Satış',
    color: '#a855f7',
    soft: '#f3e8ff',
    status: 'live',
    rules: 8,
    desc: 'teklif, fiyat, ürün soruları',
    bullets: [
      'Fiyat ve teklif soruları',
      'Ürün karşılaştırma',
      'Stok / kargo durumu',
      'Lead toplama → CRM',
    ],
    sample: '"Bu ürünün fiyatı nedir?" → otomatik teklif',
  },
  {
    id: 'support',
    label: 'Destek',
    color: '#0891b2',
    soft: '#cffafe',
    status: 'live',
    rules: 12,
    desc: 'kullanıcı problemleri, nasıl yapılır',
    bullets: [
      'Sıkça sorulan sorular',
      'Hesap & ayar yardımı',
      'Hata teşhisi',
      'Çözülemezse insana devir',
    ],
    sample: '"Şifremi unuttum" → sıfırlama linki',
  },
  {
    id: 'complaint',
    label: 'Şikayet',
    color: '#dc2626',
    soft: '#fee2e2',
    status: 'draft',
    rules: 6,
    desc: 'iade, hata, eskalasyon',
    bullets: [
      'İade & değişim talebi',
      'Şikayet kaydı oluşturma',
      'SLA takibi',
      'Otomatik insana devir',
    ],
    sample: '"Ürün bozuk geldi" → iade süreci',
  },
  {
    id: 'renewal',
    label: 'Yenileme',
    color: '#71717a',
    soft: '#f4f4f5',
    status: 'live',
    rules: 0,
    desc: 'abonelik yenileme hatırlatmaları',
    bullets: [
      'Yaklaşan yenilemeler',
      'Otomatik hatırlatma',
      'Ödeme linki gönderimi',
      'İptal akışı yönetimi',
    ],
    sample: '"Aboneliğim bitiyor mu?" → yenileme linki',
  },
]

// ──────────────────────────────────────────────────────────────────────────
// Selection / hover types
// ──────────────────────────────────────────────────────────────────────────

type Selection =
  | { kind: 'provider'; id: ProviderId }
  | { kind: 'playbook'; id: string }
  | { kind: 'new-playbook' }
  | null

type HoverState =
  | { kind: 'provider'; id: ProviderId }
  | { kind: 'playbook'; id: string }
  | null

interface PathSpec {
  id: string
  brand: string
  d: string
}

// ──────────────────────────────────────────────────────────────────────────
// Inline brain glyph (used in hub + playbook nodes + hover heads)
// ──────────────────────────────────────────────────────────────────────────

function BrainGlyph({ size = 14, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9.5 3a3 3 0 0 0-3 3v1a3 3 0 0 0-2 2.8V12a3 3 0 0 0 2 2.8V17a3 3 0 0 0 5 2.6A3 3 0 0 0 17 17v-2.2a3 3 0 0 0 2-2.8V9.8a3 3 0 0 0-2-2.8V6a3 3 0 0 0-3-3 3 3 0 0 0-2.5 1.3A3 3 0 0 0 9.5 3z" />
    </svg>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Hub (center card)
// ──────────────────────────────────────────────────────────────────────────

interface HubProps {
  liveProvCount: number
  livePbCount: number
  hubLive: boolean
}

const Hub = forwardRef<HTMLDivElement, HubProps>(function Hub(
  { liveProvCount, livePbCount, hubLive },
  ref,
) {
  const stage: 'empty' | 'building' | 'live' = hubLive
    ? 'live'
    : livePbCount > 0 || liveProvCount > 0
      ? 'building'
      : 'empty'

  const borderClass =
    stage === 'live'
      ? 'border-[1.5px] border-zinc-900 edfu-hub-live'
      : stage === 'building'
        ? 'border-[1.5px] border-zinc-700 opacity-95'
        : 'border-[1.5px] border-dashed border-zinc-200 opacity-55'

  return (
    <div
      ref={ref}
      className={`relative w-full rounded-xl bg-white px-[18px] py-4 transition-all ${borderClass}`}
    >
      {stage === 'live' && (
        <div
          className="pointer-events-none absolute -inset-0.5 rounded-xl"
          style={{
            background:
              'radial-gradient(closest-side, rgba(38,109,240,0.22), transparent 70%)',
          }}
        />
      )}
      <div className="relative z-[1] mb-1 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
          <BrainGlyph size={14} color="#fff" />
        </span>
        <div className="relative z-[1]">
          <div className="text-[13px] font-semibold leading-tight text-zinc-900">
            Edfu Router
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] text-zinc-500">
            // kural motoru
          </div>
        </div>
      </div>

      <div className="relative z-[1] mt-2 flex items-baseline gap-2 border-t border-dashed border-zinc-200 py-[7px] text-[11.5px]">
        <span className="flex-1 font-mono text-[10.5px] text-zinc-500">
          Kanal
        </span>
        <span className="text-[11.5px] font-medium text-zinc-700">
          {liveProvCount}
        </span>
      </div>
      <div className="relative z-[1] flex items-baseline gap-2 border-t border-dashed border-zinc-200 py-[7px] text-[11.5px]">
        <span className="flex-1 font-mono text-[10.5px] text-zinc-500">
          Playbook
        </span>
        <span className="text-[11.5px] font-medium text-zinc-700">
          {livePbCount}
        </span>
      </div>
      <div className="relative z-[1] flex items-baseline gap-2 border-t border-dashed border-zinc-200 py-[7px] text-[11.5px]">
        <span className="flex-1 font-mono text-[10.5px] text-zinc-500">
          Durum
        </span>
        <span
          className="text-[11.5px] font-semibold"
          style={{ color: hubLive ? '#16a34a' : '#71717a' }}
        >
          {hubLive ? '● Canlı' : '○ Hazırlanıyor'}
        </span>
      </div>
    </div>
  )
})

// ──────────────────────────────────────────────────────────────────────────
// Provider node (left column)
// ──────────────────────────────────────────────────────────────────────────

interface ProviderNodeProps {
  row: ProviderRow
  selected: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const ProviderNode = forwardRef<HTMLDivElement, ProviderNodeProps>(function ProviderNode(
  { row, selected, onClick, onMouseEnter, onMouseLeave },
  ref,
) {
  const isLive = row.status === 'live'
  const isSoon = row.status === 'soon'
  const isDraft = row.status === 'draft'

  const wrapperStyle: CSSProperties = {
    cursor: isSoon ? 'not-allowed' : 'pointer',
    opacity: isSoon ? 0.65 : 1,
  }

  const nodeBorder = selected
    ? 'border-zinc-900 shadow-[0_0_0_3px_#f4f4f5] bg-white'
    : isDraft
      ? 'border-zinc-200 border-dashed bg-transparent group-hover:border-solid group-hover:border-zinc-700 group-hover:bg-zinc-100'
      : 'border-zinc-200 bg-white'

  return (
    <div
      ref={ref}
      style={wrapperStyle}
      className="group relative rounded-[10px] transition-transform hover:-translate-y-px"
      onClick={isSoon ? undefined : onClick}
      onMouseEnter={isSoon ? undefined : onMouseEnter}
      onMouseLeave={isSoon ? undefined : onMouseLeave}
      title={isSoon ? 'Backend altyapısı yok — yakında' : undefined}
    >
      <div className={`relative flex items-center gap-2.5 rounded-[9px] border px-3 py-[9px] transition-colors ${nodeBorder}`}>
        <span
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md"
          style={{
            background: isLive ? row.soft : '#f4f4f5',
            opacity: isSoon ? 0.5 : 1,
          }}
        >
          {row.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[12.5px] font-semibold leading-tight"
              style={{ color: isLive ? '#18181b' : '#71717a' }}
            >
              {row.label}
            </span>
            {row.builtin && (
              <span className="rounded-[3px] border border-zinc-200 bg-zinc-100 px-[5px] py-px font-mono text-[9.5px] tracking-[0.04em] text-zinc-500">
                hazır
              </span>
            )}
            {isSoon && (
              <span className="rounded-[3px] border border-dashed border-zinc-200 bg-zinc-100 px-[5px] py-px font-mono text-[9.5px] tracking-[0.04em] text-zinc-500">
                yakında
              </span>
            )}
          </div>
          <div className="mt-0.5 font-mono flex justify-start text-start text-[10.5px] text-zinc-500">
            {isSoon ? '// backend hazır olduğunda açılır' : '// bağla'}
          </div>
        </div>
        {!isSoon &&
          (isLive ? (
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: row.brand, color: row.brand, animation: 'edfu-dot-pulse 2s ease-in-out infinite' }}
            />
          ) : (
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-dashed border-zinc-200 bg-zinc-100 text-[13px] leading-none text-zinc-500 transition-colors group-hover:border-solid group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white">
              +
            </span>
          ))}
      </div>
    </div>
  )
})

// ──────────────────────────────────────────────────────────────────────────
// Playbook node (right column)
// ──────────────────────────────────────────────────────────────────────────

interface PlaybookNodeProps {
  row: PlaybookRow
  selected: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

const PlaybookNode = forwardRef<HTMLDivElement, PlaybookNodeProps>(function PlaybookNode(
  { row, selected, onClick, onMouseEnter, onMouseLeave },
  ref,
) {
  const isLive = row.status === 'live'
  const sub = isLive ? `// ${row.rules} kural` : `// ${row.desc}`

  const innerBaseClass = selected
    ? 'border-zinc-900 shadow-[0_0_0_3px_#f4f4f5] bg-white'
    : isLive
      ? 'border-zinc-200 bg-white'
      : 'border-zinc-200 border-dashed bg-transparent group-hover:border-solid group-hover:border-zinc-700 group-hover:bg-zinc-100'

  return (
    <div
      ref={ref}
      className="group relative cursor-pointer rounded-[10px] transition-transform hover:-translate-y-px"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`relative flex items-center gap-2.5 rounded-[9px] border px-3 py-[9px] transition-colors ${innerBaseClass}`}>
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{
            background: isLive ? row.color : 'transparent',
            border: isLive ? 'none' : '1.5px dashed #d4d4d8',
            color: row.color,
            animation: isLive ? 'edfu-dot-pulse 2s ease-in-out infinite' : undefined,
          }}
        />
        <div className="min-w-0 flex-1 text-right">
          <div
            className="text-[12.5px] font-semibold leading-tight"
            style={{ color: isLive ? '#18181b' : '#71717a' }}
          >
            {row.label}
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] text-zinc-500">
            {sub}
          </div>
        </div>
        <span
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md"
          style={{ background: isLive ? row.soft : '#f4f4f5' }}
        >
          <BrainGlyph size={12} color={isLive ? row.color : '#a1a1aa'} />
        </span>
        {!isLive && (
          <span className="pointer-events-none absolute right-2 top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center rounded-full border border-dashed border-zinc-200 bg-zinc-100 text-[13px] leading-none text-zinc-500 transition-colors group-hover:border-solid group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white">
            +
          </span>
        )}
      </div>
    </div>
  )
})

// ──────────────────────────────────────────────────────────────────────────
// Hover card (320px, bottom-center of stage)
// ──────────────────────────────────────────────────────────────────────────

function ProviderHoverCard({ row }: { row: ProviderRow }) {
  const isLive = row.status === 'live'
  const isEdfu = row.id === 'EDFU_LINK'
  const statusLabel = isLive
    ? '● Bağlı'
    : row.status === 'configuring'
      ? '○ Kuruluyor'
      : '○ Boş — bağlanmamış'

  return (
    <div
      className="pointer-events-none absolute bottom-1/2 left-0 right-0 z-10 mx-auto w-[320px] translate-y-1/2 rounded-xl border border-zinc-200 bg-[#fafaf9] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.22),0_3px_8px_-1px_rgba(0,0,0,0.1)]"
      style={{ animation: 'edfu-hover-pop-center 0.18s cubic-bezier(0.34,1.2,0.64,1) both' }}
    >
      <div
        className="flex items-center gap-2.5 px-3 py-2.5"
        style={{ borderBottom: `2px solid ${row.brand}` }}
      >
        <span
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md"
          style={{ background: row.soft }}
        >
          {row.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
            {row.label}
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] text-zinc-500">
            // Müşteri kaynağı
          </div>
        </div>
        <span
          className="whitespace-nowrap text-[10.5px] font-medium tracking-[0.02em]"
          style={{ color: isLive ? '#16a34a' : '#71717a' }}
        >
          {statusLabel}
        </span>
      </div>
      <div className="px-3 pb-1.5 pt-2.5 text-[12px] leading-[1.5] text-zinc-700">
        {row.description}
      </div>
      {row.bullets && row.bullets.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-[5px] px-3 pb-2.5">
          {row.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-[11.5px] leading-[1.4] text-zinc-700">
              <span
                className="h-1 w-1 shrink-0 rounded-full"
                style={{ background: row.brand }}
              />
              {b}
            </li>
          ))}
        </ul>
      )}
      {!isLive && !isEdfu && (
        <div
          className="mx-3 mb-3 rounded-md border border-dashed px-2.5 py-2 text-center text-[11.5px] font-medium tracking-[0.01em]"
          style={{ borderColor: row.brand, color: row.brand }}
        >
          → Bağlamak için tıkla
        </div>
      )}
    </div>
  )
}

function PlaybookHoverCard({ row }: { row: PlaybookRow }) {
  const isLive = row.status === 'live'
  const statusLabel = isLive ? '● Bağlı' : '○ Boş — eklenmemiş'

  return (
    <div
      className="pointer-events-none absolute bottom-1/2 left-0 right-0 z-10 mx-auto w-[320px] translate-y-1/2 rounded-xl border border-zinc-200 bg-[#fafaf9] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.22),0_3px_8px_-1px_rgba(0,0,0,0.1)]"
      style={{ animation: 'edfu-hover-pop-center 0.18s cubic-bezier(0.34,1.2,0.64,1) both' }}
    >
      <div
        className="flex items-center gap-2.5 px-3 py-2.5"
        style={{ borderBottom: `2px solid ${row.color}` }}
      >
        <span
          className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md"
          style={{ background: row.soft }}
        >
          <BrainGlyph size={14} color={row.color} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-900">
            {row.label}
          </div>
          <div className="mt-0.5 font-mono text-[10.5px] text-zinc-500">
            // {row.rules} kural
          </div>
        </div>
        <span
          className="whitespace-nowrap text-[10.5px] font-medium tracking-[0.02em]"
          style={{ color: isLive ? '#16a34a' : '#71717a' }}
        >
          {statusLabel}
        </span>
      </div>
      <div className="px-3 pb-1.5 pt-2.5 text-[12px] leading-[1.5] text-zinc-700">
        {row.desc}
      </div>
      {row.bullets.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-[5px] px-3 pb-2.5">
          {row.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-[11.5px] leading-[1.4] text-zinc-700">
              <span
                className="h-1 w-1 shrink-0 rounded-full"
                style={{ background: row.color }}
              />
              {b}
            </li>
          ))}
        </ul>
      )}
      {row.sample && (
        <div className="mx-3 mb-3 rounded-md bg-zinc-100 px-2.5 py-2 font-mono text-[11px] leading-[1.5] text-zinc-900">
          <span className="mb-1 block font-mono text-[10.5px] text-zinc-500">
            // örnek
          </span>
          {row.sample}
        </div>
      )}
      {!isLive && (
        <div
          className="mx-3 mb-3 rounded-md border border-dashed px-2.5 py-2 text-center text-[11.5px] font-medium tracking-[0.01em]"
          style={{ borderColor: row.color, color: row.color }}
        >
          → Eklemek için tıkla
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────────

export default function EdfuRouterDiagram() {
  const [selection, setSelection] = useState<Selection>(null)
  const [hovered, setHovered] = useState<HoverState>(null)
  const [paths, setPaths] = useState<{
    ins: PathSpec[]
    outs: PathSpec[]
    width: number
    height: number
  }>({ ins: [], outs: [], width: 0, height: 0 })
  const [hoverPath, setHoverPath] = useState<{ d: string; brand: string } | null>(null)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const hubRef = useRef<HTMLDivElement | null>(null)
  const provRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const pbRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const liveProvs = PROVIDERS.filter(p => p.status === 'live')
  const livePbs = PLAYBOOKS.filter(p => p.status === 'live')

  // Edfu Sohbet is decorative — does not increment the hub's channel counter
  const liveProvCount = liveProvs.filter(p => !p.builtin).length
  const livePbCount = livePbs.length
  const hubLive = liveProvCount > 0 && livePbCount > 0

  // Default route playbook (first live one) — hub→default spoke lights on
  // provider hover, matching the real routing model.
  const defaultPbId = useMemo(() => livePbs[0]?.id ?? null, [livePbs])

  const liveProvKey = liveProvs.map(p => p.id).join(',')
  const livePbKey = livePbs.map(p => p.id).join(',')

  // Measure positions → build cubic bezier paths from each live node to the hub edge.
  useLayoutEffect(() => {
    function measure() {
      const stage = stageRef.current
      const hub = hubRef.current
      if (!stage || !hub) return
      const sb = stage.getBoundingClientRect()
      const hb = hub.getBoundingClientRect()
      const hubL = { x: hb.left - sb.left, y: hb.top - sb.top + hb.height / 2 }
      const hubR = { x: hb.right - sb.left, y: hb.top - sb.top + hb.height / 2 }

      const ins: PathSpec[] = liveProvs
        .map<PathSpec | null>(p => {
          const el = provRefs.current[p.id]
          if (!el) return null
          const b = el.getBoundingClientRect()
          const start = { x: b.right - sb.left, y: b.top - sb.top + b.height / 2 }
          const midX = (start.x + hubL.x) / 2
          return {
            id: p.id as string,
            brand: p.brand,
            d: `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${hubL.y}, ${hubL.x} ${hubL.y}`,
          }
        })
        .filter((x): x is PathSpec => x !== null)

      const outs: PathSpec[] = livePbs
        .map<PathSpec | null>(p => {
          const el = pbRefs.current[p.id]
          if (!el) return null
          const b = el.getBoundingClientRect()
          const end = { x: b.left - sb.left, y: b.top - sb.top + b.height / 2 }
          const midX = (hubR.x + end.x) / 2
          return {
            id: p.id,
            brand: p.color,
            d: `M ${hubR.x} ${hubR.y} C ${midX} ${hubR.y}, ${midX} ${end.y}, ${end.x} ${end.y}`,
          }
        })
        .filter((x): x is PathSpec => x !== null)

      setPaths({ ins, outs, width: sb.width, height: sb.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (stageRef.current) ro.observe(stageRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveProvKey, livePbKey])

  // Hover-preview path (lights up the spoke between hub and hovered node).
  useLayoutEffect(() => {
    if (!hovered) {
      setHoverPath(null)
      return
    }
    const stage = stageRef.current
    const hub = hubRef.current
    if (!stage || !hub) return
    const sb = stage.getBoundingClientRect()
    const hb = hub.getBoundingClientRect()
    const nodeEl =
      hovered.kind === 'provider'
        ? provRefs.current[hovered.id]
        : pbRefs.current[hovered.id]
    if (!nodeEl) {
      setHoverPath(null)
      return
    }
    const nb = nodeEl.getBoundingClientRect()
    let d: string
    let brand: string
    if (hovered.kind === 'provider') {
      const start = { x: nb.right - sb.left, y: nb.top - sb.top + nb.height / 2 }
      const end = { x: hb.left - sb.left, y: hb.top - sb.top + hb.height / 2 }
      const midX = (start.x + end.x) / 2
      d = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`
      brand = PROVIDERS.find(p => p.id === hovered.id)?.brand ?? '#71717a'
    } else {
      const start = { x: hb.right - sb.left, y: hb.top - sb.top + hb.height / 2 }
      const end = { x: nb.left - sb.left, y: nb.top - sb.top + nb.height / 2 }
      const midX = (start.x + end.x) / 2
      d = `M ${start.x} ${start.y} C ${midX} ${start.y}, ${midX} ${end.y}, ${end.x} ${end.y}`
      brand = PLAYBOOKS.find(p => p.id === hovered.id)?.color ?? '#71717a'
    }
    setHoverPath({ d, brand })
  }, [hovered])

  const isSelected = (kind: 'provider' | 'playbook', id: string) =>
    selection?.kind === kind && (selection as { id: string }).id === id

  // Hovered provider → also light the hub→default-playbook spoke (real route).
  const hoveredDefaultOut = (() => {
    if (hovered?.kind !== 'provider') return null
    const row = PROVIDERS.find(p => p.id === hovered.id)
    if (!row || row.status !== 'live') return null
    return paths.outs.find(p => p.id === defaultPbId) ?? null
  })()

  // Hovered row → drives hover card content
  const hoveredProviderRow =
    hovered?.kind === 'provider'
      ? PROVIDERS.find(p => p.id === hovered.id) ?? null
      : null
  const hoveredPlaybookRow =
    hovered?.kind === 'playbook'
      ? PLAYBOOKS.find(p => p.id === hovered.id) ?? null
      : null

  return (
    <div className="font-sans text-[13px] text-left text-zinc-900">
      <style>{`
        @keyframes edfu-dot-pulse {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; }
          50%      { box-shadow: 0 0 0 5px transparent; }
        }
        @keyframes edfu-path-draw {
          to { stroke-dashoffset: 0; }
        }
        .edfu-path-anim {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: edfu-path-draw 1.1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }
        .edfu-path-hover {
          stroke-dasharray: 6 4;
          animation: edfu-path-march 0.9s linear infinite, edfu-fade-in 0.18s ease;
          pointer-events: none;
        }
        @keyframes edfu-path-march { to { stroke-dashoffset: -10; } }
        @keyframes edfu-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes edfu-hover-pop {
          from { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes edfu-hover-pop-center {
          from { opacity: 0; transform: translateY(calc(50% + 8px)) scale(0.98); }
          to   { opacity: 1; transform: translateY(50%) scale(1); }
        }
        @keyframes edfu-hub-pulse {
          0%, 100% { box-shadow: 0 12px 36px -12px rgba(38,109,240,0.25); }
          50%      { box-shadow: 0 16px 48px -12px rgba(38,109,240,0.55); }
        }
        .edfu-hub-live {
          animation: edfu-hub-pulse 3s ease-in-out infinite;
        }
      `}</style>

      <div className="relative flex flex-col overflow-hidden rounded-[14px] border border-zinc-200 bg-white p-6">
        {/* dotted background */}
        <svg className="pointer-events-none absolute inset-0 text-zinc-500 opacity-55" width="100%" height="100%" aria-hidden>
          <defs>
            <pattern id="edfuDots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.7" fill="currentColor" opacity="0.45" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#edfuDots)" />
        </svg>

        {/* flow grid */}
        <div
          ref={stageRef}
          className="relative z-[2] grid min-h-[360px] flex-1 items-center gap-x-8"
          style={{ gridTemplateColumns: 'minmax(180px,1fr) 240px minmax(180px,1fr)' }}
        >
          {/* SVG paths layer */}
          <svg
            className="pointer-events-none absolute inset-0 z-[1] overflow-visible"
            width={paths.width || 0}
            height={paths.height || 0}
            aria-hidden
          >
            <defs>
              {paths.ins.map(p => (
                <linearGradient key={`gi-${p.id}`} id={`edfu-gi-${p.id}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={p.brand} stopOpacity="0.15" />
                  <stop offset="60%" stopColor={p.brand} stopOpacity="0.7" />
                  <stop offset="100%" stopColor={p.brand} stopOpacity="0.95" />
                </linearGradient>
              ))}
              {paths.outs.map(p => (
                <linearGradient key={`go-${p.id}`} id={`edfu-go-${p.id}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={p.brand} stopOpacity="0.95" />
                  <stop offset="40%" stopColor={p.brand} stopOpacity="0.7" />
                  <stop offset="100%" stopColor={p.brand} stopOpacity="0.15" />
                </linearGradient>
              ))}
            </defs>
            {paths.ins.map((p, i) => {
              const dur = 9 + ((i * 1.3) % 4)
              const begin = (i * 2.1) % 8
              return (
                <g key={`in-${p.id}-${p.d.length}`}>
                  <path
                    className="edfu-path-anim"
                    d={p.d}
                    stroke={`url(#edfu-gi-${p.id})`}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle r="4" fill={p.brand} opacity="0" style={{ filter: `drop-shadow(0 0 4px ${p.brand})` }}>
                    <animateMotion
                      dur={`${dur.toFixed(2)}s`}
                      begin={`${begin.toFixed(2)}s`}
                      repeatCount="indefinite"
                      path={p.d}
                      rotate="auto"
                      keyPoints="0;1;1"
                      keyTimes="0;0.32;1"
                    />
                    <animate
                      attributeName="opacity"
                      dur={`${dur.toFixed(2)}s`}
                      begin={`${begin.toFixed(2)}s`}
                      repeatCount="indefinite"
                      values="0;1;1;0;0"
                      keyTimes="0;0.04;0.3;0.36;1"
                    />
                  </circle>
                </g>
              )
            })}
            {paths.outs.map((p, i) => {
              const dur = 9.5 + ((i * 1.4) % 4.5)
              const begin = ((i * 2.3) + 1.2) % 8.5
              return (
                <g key={`out-${p.id}-${p.d.length}`}>
                  <path
                    className="edfu-path-anim"
                    d={p.d}
                    stroke={`url(#edfu-go-${p.id})`}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle r="4" fill={p.brand} opacity="0" style={{ filter: `drop-shadow(0 0 4px ${p.brand})` }}>
                    <animateMotion
                      dur={`${dur.toFixed(2)}s`}
                      begin={`${begin.toFixed(2)}s`}
                      repeatCount="indefinite"
                      path={p.d}
                      rotate="auto"
                      keyPoints="0;1;1"
                      keyTimes="0;0.34;1"
                    />
                    <animate
                      attributeName="opacity"
                      dur={`${dur.toFixed(2)}s`}
                      begin={`${begin.toFixed(2)}s`}
                      repeatCount="indefinite"
                      values="0;1;1;0;0"
                      keyTimes="0;0.04;0.32;0.38;1"
                    />
                  </circle>
                </g>
              )
            })}
            {hoverPath && (
              <path
                className="edfu-path-hover"
                d={hoverPath.d}
                stroke={hoverPath.brand}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${hoverPath.brand}aa)` }}
              />
            )}
            {hoveredDefaultOut && (
              <path
                className="edfu-path-hover"
                d={hoveredDefaultOut.d}
                stroke={hoveredDefaultOut.brand}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${hoveredDefaultOut.brand}aa)` }}
              />
            )}
          </svg>

          {/* left column — channels */}
          <div className="relative z-[2] flex w-full max-w-[240px] flex-col gap-2.5">
            <div className="mb-1 flex justify-start text-start font-mono text-[10px] tracking-[0.04em] text-zinc-500">
              // MÜŞTERİ KAYNAKLARI
            </div>
            {PROVIDERS.map(p => (
              <ProviderNode
                key={p.id}
                ref={el => {
                  provRefs.current[p.id] = el
                }}
                row={p}
                selected={isSelected('provider', p.id)}
                onClick={() => setSelection({ kind: 'provider', id: p.id })}
                onMouseEnter={() => setHovered({ kind: 'provider', id: p.id })}
                onMouseLeave={() =>
                  setHovered(h => (h?.kind === 'provider' && h.id === p.id ? null : h))
                }
              />
            ))}
          </div>

          {/* center column — hub */}
          <div className="relative z-[2] flex items-center justify-center">
            <Hub
              ref={hubRef}
              liveProvCount={liveProvCount}
              livePbCount={livePbCount}
              hubLive={hubLive}
            />
          </div>

          {/* right column — playbooks */}
          <div className="relative z-[2] ml-auto flex w-full max-w-[240px] flex-col gap-2.5">
            <div className="mb-1 text-right font-mono text-[10px] tracking-[0.04em] text-zinc-500">
              // PLAYBOOK
            </div>
            {PLAYBOOKS.map(p => (
              <PlaybookNode
                key={p.id}
                ref={el => {
                  pbRefs.current[p.id] = el
                }}
                row={p}
                selected={isSelected('playbook', p.id)}
                onClick={() => setSelection({ kind: 'playbook', id: p.id })}
                onMouseEnter={() => setHovered({ kind: 'playbook', id: p.id })}
                onMouseLeave={() =>
                  setHovered(h => (h?.kind === 'playbook' && h.id === p.id ? null : h))
                }
              />
            ))}
            <button
              type="button"
              onClick={() => setSelection({ kind: 'new-playbook' })}
              data-active={selection?.kind === 'new-playbook'}
              className="group/addbtn mt-1 flex items-center justify-center gap-2 rounded-[9px] border-[1.5px] border-dashed border-zinc-200 bg-transparent px-3 py-[11px] font-sans text-[12px] text-zinc-500 transition-all hover:border-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 data-[active=true]:border-zinc-900 data-[active=true]:bg-zinc-100 data-[active=true]:text-zinc-900"
            >
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] border-dashed border-zinc-200 bg-zinc-100 text-[13px] leading-none text-zinc-500 transition-colors group-hover/addbtn:border-solid group-hover/addbtn:border-zinc-900 group-hover/addbtn:bg-zinc-900 group-hover/addbtn:text-white group-data-[active=true]/addbtn:border-solid group-data-[active=true]/addbtn:border-zinc-900 group-data-[active=true]/addbtn:bg-zinc-900 group-data-[active=true]/addbtn:text-white">
                +
              </span>
              <span>Yeni playbook</span>
            </button>
          </div>

        </div>

        {/* hover cards (mounted on outer stage — its width is bounded by the
            host frame so bottom-center stays visually centered even when the
            inner grid content would push beyond viewport) */}
        {hoveredProviderRow && <ProviderHoverCard row={hoveredProviderRow} />}
        {hoveredPlaybookRow && <PlaybookHoverCard row={hoveredPlaybookRow} />}
      </div>
    </div>
  )
}
