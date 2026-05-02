# Edfu Brand Kit

**v1.0 — 2026**

> Edfu is a customer-conversation router. Three streams, one center, one channel out.

---

## Logo

| File | Use |
|------|-----|
| `logos/mark-light.svg` | Mark only, ink (#18181B) — light backgrounds |
| `logos/mark-dark.svg` | Mark only, white — dark backgrounds |
| `logos/primary-light.svg` | Mark + "edfu" wordmark, ink — light backgrounds |
| `logos/primary-dark.svg` | Mark + "edfu" wordmark, white — dark backgrounds |
| `logos/monokrom-ink.svg` | Mark on rounded ink square, white mark — favicon, monochrome contexts |
| `logos/monokrom-white.svg` | Mark on rounded white square, ink mark — favicon, monochrome contexts |
| `logos/ios-front-light.svg` | Glassy 3D iOS app icon — light backdrop |
| `logos/ios-front-dark.svg` | Glassy 3D iOS app icon — dark backdrop |

**Clearspace:** Always reserve at least 1× mark height of empty space around the logo.
**Minimum size:** Mark — 16px digital, 8mm print. Primary lockup — 24px digital, 12mm print.

---

## Color

### Monokrom omurga
| Token | Hex | Use |
|-------|-----|-----|
| Ink | `#18181B` | Primary text, mark default |
| Ink-2 | `#3F3F46` | Body text, secondary UI |
| Muted | `#71717A` | Captions, metadata |
| Muted-2 | `#A1A1AA` | Placeholder, disabled |
| Line | `#E4E4E7` | Borders, dividers |
| Surface | `#EFEEEC` | Page background (warm off-white) |
| Paper | `#FFFFFF` | Cards, panels |

### Mavi spektrum (brand)
| Token | Hex | Use |
|-------|-----|-----|
| Blue 1 | `#93C5FD` | Tints, soft fills |
| Blue 2 | `#60A5FA` | Hover, secondary |
| Blue 3 | `#3B82F6` | **Primary brand color** |
| Blue 4 | `#2563EB` | Active, pressed |
| Blue 5 | `#1D4ED8` | Deep accent, gradient end |

**Brand gradient:** `linear-gradient(180deg, #6EA8FE 0%, #3B82F6 45%, #1D4ED8 100%)`

### Aksesuar & status
| Token | Hex | Use |
|-------|-----|-----|
| Violet (accent) | `#7C3AED` | "Playbook" theme, accent badges |
| Live | `#16A34A` | Active connection, success |
| Critical | `#DC2626` | Errors, paused, blocked |
| Warn | `#F59E0B` | Warnings, attention |

---

## Typography

### Inter
**License:** SIL Open Font License 1.1 — free for commercial use.
**Source:** https://fonts.google.com/specimen/Inter
**Weights used:** 400, 500, 600, 700
**Features:** `ss01`, `cv11` (single-storey `a`, straight `l`)

```css
font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
font-feature-settings: "ss01", "cv11";
```

**Display tracking:** `-0.035em` to `-0.045em` for large display sizes.

### JetBrains Mono
**License:** Apache License 2.0 — free for commercial use.
**Source:** https://fonts.google.com/specimen/JetBrains+Mono
**Weights used:** 400, 500
**Use for:** Code, message IDs, `// ` comment prefixes, technical labels.

```css
font-family: "JetBrains Mono", ui-monospace, monospace;
```

### Type scale
| Role | Size | Weight | Line height |
|------|------|--------|-------------|
| Display | 72px | 600 | 1.0 |
| H1 | 48px | 600 | 1.0 |
| H2 | 32px | 600 | 1.1 |
| H3 | 24px | 600 | 1.2 |
| Subhead | 20px | 500 | 1.3 |
| Body | 16px | 400 | 1.55 |
| Caption | 13px | 400 | 1.5 |
| Mono / label | 11px | 500 | 1.4 |

---

## Voice

- **Lowercase wordmark.** Always "edfu" — never "Edfu" in marks (sentence case is fine in body copy).
- **Functional, not poetic.** Describe what it does, not how it feels.
- **Comment prefix:** Use `// ` (mono) for inline annotations, section labels, and metadata in UI.
- **Turkish first.** Default copy is Turkish; English is secondary.

---

## Don't

- Don't stretch, rotate, or skew the mark.
- Don't apply unapproved gradients or photos behind the mark.
- Don't use SF Pro — Apple-platform-only license.
- Don't replace the mark with emoji or icon-font glyphs.
- Don't combine the mark with another brand's mark in a single composition without approval.

---

**Questions:** brand@edfu.app
