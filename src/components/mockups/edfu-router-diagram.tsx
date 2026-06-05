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
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Brain } from 'lucide-react'
import { OnboardingConfetti } from './onboarding-confetti'

// ──────────────────────────────────────────────────────────────────────────
// Mock data
// ──────────────────────────────────────────────────────────────────────────

type ProviderId =
  | 'EDFU_LINK'
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
  /** True when this provider has a click-through mock setup panel on the right. */
  clickable?: boolean
  description: string
  bullets?: string[]
  /** Setup fields shown in the right-side detail panel when clicked. */
  setupFields?: { label: string; value: string; mono?: boolean }[]
  /** Primary action label on the detail panel. */
  primaryAction?: string
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
    clickable: true,
    description:
      'Hesabınla birlikte gelir, hep bağlı kalır. chat.edfu.ai/seninhesabin adresini müşterilere verirsin, doğrudan sohbet açılır.',
    bullets: [
      'Tek tıkla paylaş',
      'App gerekmez',
      "Tüm playbook'lara bağlı",
      'Marka rengiyle özelleştir',
    ],
    setupFields: [
      { label: 'Sohbet linki', value: 'chat.edfu.ai/seninhesabin', mono: true },
      { label: 'Marka rengi', value: '#266DF0', mono: true },
      { label: 'Karşılama mesajı', value: 'Merhaba! Size nasıl yardımcı olabilirim?' },
      { label: 'Bağlı playbook', value: 'Satış · Destek · Yenileme' },
    ],
    primaryAction: 'Linki kopyala',
    icon: (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logos/monokrom-ink.svg" alt="Edfu" className="block h-3.5 w-3.5 object-contain dark:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logos/monokrom-white.svg" alt="" aria-hidden="true" className="hidden h-3.5 w-3.5 object-contain dark:block" />
      </>
    ),
  },
  {
    id: 'WHATSAPP',
    label: 'WhatsApp',
    brand: '#16a34a',
    soft: '#dcfce7',
    status: 'draft',
    clickable: true,
    description: 'Resmi WhatsApp Business API. QR kod ile bağlan, template mesajlar.',
    bullets: [
      'Resmi WhatsApp Business API',
      'Template & onaylı mesajlar',
      'Toplu gönderim',
      'Etiket & gruplama',
    ],
    setupFields: [
      { label: 'Telefon numarası', value: '+90 555 123 45 67', mono: true },
      { label: 'Hesap adı', value: 'Firma Destek', mono: false },
      { label: 'Template mesaj', value: '12 onaylı', mono: false },
      { label: 'Doğrulama', value: 'Meta Business onaylı', mono: false },
    ],
    primaryAction: 'QR kod oluştur',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="#16a34a" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
    {
    id: 'EMAIL',
    label: 'E-posta',
    brand: '#a16207',
    soft: '#fef3c7',
    status: 'draft',
    clickable: true,
    description: 'IMAP/SMTP veya Google Workspace. Cevaplar threadte kalır.',
    bullets: [
      'IMAP/SMTP & Google Workspace',
      'Thread takibi & yanıtlama',
      'Otomatik etiketleme',
      'Spam filtreleme',
    ],
    setupFields: [
      { label: 'Hesap', value: 'destek@firmaniz.com', mono: true },
      { label: 'Sunucu', value: 'IMAP / SMTP', mono: true },
      { label: 'Cevap süresi', value: '< 2 dakika (ortalama)', mono: false },
      { label: 'Bağlı thread', value: '142 aktif konuşma', mono: false },
    ],
    primaryAction: 'Bağlantıyı test et',
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: 'TELEGRAM',
    label: 'Telegram',
    brand: '#229ED9',
    soft: '#dbeafe',
    status: 'draft',
    clickable: true,
    description: 'Telegram Bot API ile bağlan. Bot token üzerinden mesaj alıp gönder.',
    bullets: [
      'Bot token ile hızlı kurulum',
      'Grup & kanal desteği',
      'Inline keyboard akışları',
      'Dosya & medya transferi',
    ],
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#229ED9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 2 11 13" />
        <path d="m22 2-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
  },

  {
    id: 'INSTAGRAM',
    label: 'Instagram',
    brand: '#E4405F',
    soft: '#fce7f3',
    status: 'draft',
    clickable: true,
    description: "Instagram DM'lerini ekibinin gelen kutusuna bağla. Meta hesabıyla giriş.",
    bullets: [
      'DM otomasyonu',
      'Story mention takibi',
      'Yorumlardan lead toplama',
      'Reels & post etkileşimi',
    ],
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
        <defs>
          <linearGradient id="edfu-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="25%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="75%" stopColor="#C13584" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
        <path fill="url(#edfu-ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: 'META_ADS',
    label: 'Meta Ads',
    brand: '#1877F2',
    soft: '#dbeafe',
    status: 'draft',
    clickable: true,
    description: 'Facebook/Instagram lead reklamlarındaki form gönderimlerini al.',
    bullets: [
      'Lead form gerçek zamanlı sync',
      'Webhook ile anında bildirim',
      'Özel form alanları',
      'CRM entegrasyonu',
    ],
    icon: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="#1877F2" aria-hidden>
        <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a4.892 4.892 0 00.825 1.736c.461.577 1.09.924 1.84.924 1.17 0 2.139-.693 2.987-1.743.85-1.05 1.597-2.49 2.235-4.12l.263-.672c.456-1.166.975-2.137 1.555-2.854.59-.73 1.247-1.163 1.976-1.163 1.095 0 1.964.809 2.602 2.106.636 1.288 1.005 3.063 1.005 5.233 0 1.12-.114 2.09-.343 2.86a3.786 3.786 0 01-.888 1.635A2.044 2.044 0 0113.2 21.5l-.606-.1a3.27 3.27 0 01-.855-.32c-.246-.15-.364-.376-.364-.678a1.895 1.895 0 01.295-.984c.2-.32.452-.594.755-.82l.182-.138c-.644-.105-1.184-.4-1.607-.886-.413-.473-.7-1.063-.853-1.718a7.8 7.8 0 01-.22-1.874c0-1.122.15-2.395.567-3.528.412-1.117 1.067-2.058 1.983-2.558a2.61 2.61 0 00-1.282-.312c-.973 0-1.825.593-2.53 1.497-.71.91-1.28 2.167-1.704 3.555l-.217.705c-.593 1.93-1.226 3.464-1.948 4.51C4.123 18.819 3.34 19.5 2.413 19.5c-.878 0-1.594-.547-2.059-1.4-.44-.806-.667-1.87-.667-3.101 0-2.86.776-5.771 2.179-7.9C3.323 5.029 5.076 4.03 6.915 4.03z" />
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

// Providers connected on first render — anything else is "hazır" until clicked.
const INITIAL_CONNECTED: ProviderId[] = ['EDFU_LINK', 'WHATSAPP', 'EMAIL']

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
  return <Brain size={size} color={color} aria-hidden />
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
  const isClickable = !!row.clickable || isLive || isDraft

  const wrapperStyle: CSSProperties = {
    cursor: isClickable ? 'pointer' : 'default',
  }

  const nodeBorder = selected
    ? 'border-zinc-900 shadow-[0_0_0_3px_#f4f4f5] bg-white'
    : isDraft || isSoon
      ? 'border-zinc-200 border-dashed bg-transparent group-hover:border-solid group-hover:border-zinc-700 group-hover:bg-zinc-100'
      : 'border-zinc-200 bg-white'

  return (
    <div
      ref={ref}
      style={wrapperStyle}
      className={`group relative flex min-h-[58px] items-center gap-2.5 rounded-md border px-3 py-[9px] transition-all hover:-translate-y-px ${nodeBorder}`}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={isSoon ? 'Backend altyapısı yok — yakında' : undefined}
    >
      <span
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-md"
        style={{
          background: row.soft,
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
          {isLive ? (
            <span
              className="rounded-sm border px-[5px] py-px font-mono text-[9.5px] tracking-[0.04em]"
              style={{
                borderColor: `${row.brand}40`,
                background: row.soft,
                color: row.brand,
              }}
            >
              bağlı
            </span>
          ) : row.clickable ? (
            <span className="rounded-sm border border-zinc-200 bg-zinc-100 px-[5px] py-px font-mono text-[9.5px] tracking-[0.04em] text-zinc-500">
              hazır
            </span>
          ) : null}
          {isSoon && (
            <span className="rounded-sm border border-dashed border-zinc-200 bg-zinc-100 px-[5px] py-px font-mono text-[9.5px] tracking-[0.04em] text-zinc-500">
              yakında
            </span>
          )}
        </div>
        <div className="mt-0.5 font-mono flex justify-start text-start text-[10.5px] text-zinc-500">
          {isSoon ? '' : isLive ? '// bağlı' : '// bağla'}
        </div>
      </div>
      {isLive ? (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ background: row.brand, color: row.brand, animation: 'edfu-dot-pulse 2s ease-in-out infinite' }}
        />
      ) : (
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-dashed border-zinc-200 bg-zinc-100 text-[13px] leading-none text-zinc-500 transition-colors group-hover:border-solid group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white">
          +
        </span>
      )}
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

  const nodeBorder = selected
    ? 'border-zinc-900 shadow-[0_0_0_3px_#f4f4f5] bg-white'
    : isLive
      ? 'border-zinc-200 bg-white'
      : 'border-zinc-200 border-dashed bg-transparent group-hover:border-solid group-hover:border-zinc-700 group-hover:bg-zinc-100'

  return (
    <div
      ref={ref}
      className={`group relative flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-[9px] transition-all hover:-translate-y-px ${nodeBorder}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{
          background: isLive ? row.color : 'transparent',
          border: isLive ? 'none' : '1.5px dashed #d4d4d8',
          color: row.color,
          animation: 'edfu-dot-pulse 2s ease-in-out infinite',
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
  )
})

// ──────────────────────────────────────────────────────────────────────────
// Hover card (320px, bottom-center of stage)
// ──────────────────────────────────────────────────────────────────────────

function ProviderHoverCard({ row }: { row: ProviderRow }) {
  const isLive = row.status === 'live'
  const isSoon = row.status === 'soon'
  const isEdfu = row.id === 'EDFU_LINK'
  const statusLabel = isLive
    ? '● Bağlı'
    : isSoon
      ? '○ Yakında'
      : row.status === 'configuring'
        ? '○ Kuruluyor'
        : '○ Boş — bağlanmamış'

  return (
    <div
      className="pointer-events-none absolute bottom-1/2 left-0 right-0 z-[3] mx-auto w-[320px] translate-y-1/2 rounded-xl border border-zinc-200 bg-[#fafaf9] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.22),0_3px_8px_-1px_rgba(0,0,0,0.1)]"
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
      {!isLive && !isEdfu && !isSoon && (
        <div
          className="mx-3 mb-3 rounded-md border border-dashed px-2.5 py-2 text-center text-[11.5px] font-medium tracking-[0.01em]"
          style={{ borderColor: row.brand, color: row.brand }}
        >
          → Bağlamak için tıkla
        </div>
      )}
      {isSoon && (
        <div className="mx-3 mb-3 rounded-md border border-dashed border-zinc-200 bg-zinc-50 px-2.5 py-2 text-center font-mono text-[10.5px] tracking-[0.04em] text-zinc-500">
          
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
      className="pointer-events-none absolute bottom-1/2 left-0 right-0 z-[3] mx-auto w-[320px] translate-y-1/2 rounded-xl border border-zinc-200 bg-[#fafaf9] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.22),0_3px_8px_-1px_rgba(0,0,0,0.1)]"
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
  const [connectedIds, setConnectedIds] = useState<Set<ProviderId>>(
    () => new Set(INITIAL_CONNECTED),
  )
  const [justConnected, setJustConnected] = useState<{ id: ProviderId; key: number } | null>(
    null,
  )
  const [confettiActive, setConfettiActive] = useState(false)

  useEffect(() => {
    if (!justConnected) return
    setHovered(null)
    setConfettiActive(true)
    const t = setTimeout(() => setConfettiActive(false), 1800)
    return () => clearTimeout(t)
  }, [justConnected])

  const stageRef = useRef<HTMLDivElement | null>(null)
  const hubRef = useRef<HTMLDivElement | null>(null)
  const provRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const pbRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const providers = useMemo<ProviderRow[]>(
    () =>
      PROVIDERS.map(p =>
        connectedIds.has(p.id) ? ({ ...p, status: 'live' } as ProviderRow) : p,
      ),
    [connectedIds],
  )

  const liveProvs = providers.filter(p => p.status === 'live')
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
      brand = providers.find(p => p.id === hovered.id)?.brand ?? '#71717a'
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

  function handleProviderClick(id: ProviderId) {
    if (connectedIds.has(id)) {
      setSelection({ kind: 'provider', id })
      return
    }
    setConnectedIds(prev => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setJustConnected({ id, key: Date.now() })
  }

  // Hovered provider → also light the hub→default-playbook spoke (real route).
  const hoveredDefaultOut = (() => {
    if (hovered?.kind !== 'provider') return null
    const row = providers.find(p => p.id === hovered.id)
    if (!row || row.status !== 'live') return null
    return paths.outs.find(p => p.id === defaultPbId) ?? null
  })()

  // Hovered row → drives hover card content
  const hoveredProviderRow =
    hovered?.kind === 'provider'
      ? providers.find(p => p.id === hovered.id) ?? null
      : null
  const hoveredPlaybookRow =
    hovered?.kind === 'playbook'
      ? PLAYBOOKS.find(p => p.id === hovered.id) ?? null
      : null

  return (
    <div className="ob-root font-sans text-[13px] text-left text-zinc-900">
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
        /* Confetti dots — subtle, on completion */
        .ob-root .ob-confetti {
          position: absolute; inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 5;
        }
        .ob-root .ob-confetti-dot {
          position: absolute;
          width: 6px; height: 6px; border-radius: 99px;
          animation: ob-confetti-fall 1.4s ease-out forwards;
          top: 0;
        }
        @keyframes ob-confetti-fall {
          0%   { opacity: 0; transform: translateY(-40px) scale(0.4); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(420px) scale(1.1); }
        }
      `}</style>

      <div className="relative flex flex-col overflow-hidden bg-white p-6">
        <OnboardingConfetti trigger={justConnected?.key ?? 0} />
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
          className="relative z-[2] grid min-h-[540px] -mt-14 flex-1 items-center gap-x-8"
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
            {providers.map(p => (
              <ProviderNode
                key={p.id}
                ref={el => {
                  provRefs.current[p.id] = el
                }}
                row={p}
                selected={isSelected('provider', p.id)}
                onClick={() => handleProviderClick(p.id)}
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
              className="group/addbtn mt-1 flex items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-zinc-200 bg-transparent px-3 py-[11px] font-sans text-[12px] text-zinc-500 transition-all hover:border-zinc-900 hover:bg-zinc-100 hover:text-zinc-900 data-[active=true]:border-zinc-900 data-[active=true]:bg-zinc-100 data-[active=true]:text-zinc-900"
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
        {!confettiActive && hoveredProviderRow && <ProviderHoverCard row={hoveredProviderRow} />}
        {!confettiActive && hoveredPlaybookRow && <PlaybookHoverCard row={hoveredPlaybookRow} />}
      </div>
    </div>
  )
}
