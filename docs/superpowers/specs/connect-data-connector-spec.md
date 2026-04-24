# Connect Data Connector Spec

Source: `/Users/senaeser/Downloads/Document 7.pdf`
Extraction date: April 22, 2026
Target reference: Attio homepage, `Connect any type of data`

## Purpose

This spec isolates the connector geometry and animation behavior used by Attio's `Connect any type of data` section so the local implementation can be rebuilt against the extracted DOM/SVG structure instead of visual guesswork.

## Layout Model

- The section is not built as one large SVG.
- Connectors are split into multiple absolutely-positioned SVG fragments.
- The lower chart uses an `8-column` grid shell:
  - `grid-cols-8`
  - `grid-rows-[70px_min-content_28px_min-content]`
  - container offset: `top: 18px`
- Record cards sit inside this grid, not free-positioned against the full canvas.

## Upper Source Matrix

- Source chips are rendered in `3` centered pairs.
- Chip dimensions:
  - width: `143px`
  - height: `35px`
- Pair spacing:
  - row 1 gap: `109px`
  - row 2 gap: `181px`
  - row 3 gap: `109px`
- Vertical stack:
  - pair stack gap: `37px`
  - source cluster bottom offset: `73px`
- Chip content:
  - icon size: `14px`
  - text size: `12px`
  - line-height: `14px`
  - letter spacing: `-2%`

## Connector Geometry

### Passive guide fragments

These appear as transparent paths that define the routing envelope around the hub area:

1. Right lower elbow:
   - svg: `108 x 72`
   - path: `M0.5 0V71.5 H72`
   - position: `absolute right-1/2 bottom-0 -translate-x-[0.5px]`

2. Right upper elbow:
   - svg: `108 x 109`
   - path: `M0 0.5H36 V108.5 H72`
   - position: `absolute right-1/2`
   - bottom offset: `36px`

3. Right long run:
   - svg: `72 x 181`
   - path: `M0 0.5H72 V180.5`
   - position: `absolute right-1/2`
   - bottom offset: `36px`

4. Left long run:
   - svg: `72 x 181`
   - path: `M0.5 180V0.5 H72`
   - position: `absolute left-1/2`
   - bottom offset: `36px`

5. Left upper elbow:
   - svg: `108 x 109`
   - path: `M0 108.5H72 V0.5 H108`
   - position: `absolute left-1/2`
   - bottom offset: `36px`

6. Left lower elbow:
   - svg: `108 x 72`
   - path: `M0.5 71.5H107.5 V0`
   - position: `absolute bottom-0 left-1/2 translate-x-[0.5px]`

### Active lower chart connectors

These are the visible record-card connector fragments:

1. Left shoulder:
   - svg: `132 x 70`
   - path: `M6 70V49.3438C6 42.7163 11.3726 37.3438 18 37.3438H114C120.627 37.3438 126 31.9712 126 25.3438V0`
   - base stroke: `#E4E7EC`
   - placement: left half, shifted slightly left (`-translate-x-1`)

2. Center stem:
   - svg: `1 x 165`
   - path: `M0.5 0V165`
   - base stroke: `#E4E7EC`
   - placement: centered across full chart width

3. Right shoulder:
   - svg: `132 x 70`
   - path: `M126 70V49.3438C126 42.7163 120.627 37.3438 114 37.3438H18C11.373 37.3438 6.00001 31.9712 6.00001 25.3438V0`
   - base stroke: `#E4E7EC`
   - placement: right half, shifted slightly right (`translate-x-1`)

## Animation Model

### Important behavior

- The visible blue highlight is not the whole connector.
- Attio draws a gray passive connector first, then overlays a moving gradient pulse.
- The pulse is short and directional.
- Motion appears to travel along one connector fragment at a time rather than flooding every segment simultaneously.

### Gradient pulse evidence from PDF

Extracted gradient example:

- gradient units: `userSpaceOnUse`
- direction:
  - left shoulder: `x1="100%" x2="0" y1="0" y2="100%"`
  - center stem: `x1="0" x2="100%" y1="0" y2="100%"`
- stops:
  - transparent white
  - transparent `#A3ECE9`
  - solid `#A3ECE9`
  - solid `#709FF5`
  - transparent white

Observed offset ranges in extracted markup:

- left shoulder:
  - `-198.98699%`
  - `-149.07141%`
  - `-9.45973%`

- center stem:
  - `-198.64593%`
  - `-148.75877%`
  - `-9.27783%`

Interpretation:

- The pulse starts fully off-path.
- It travels across the path as a narrow cyan-to-blue highlight.
- It exits the path completely, returning the connector to gray.

## Record Card Spec

- Card width: `180px`
- Radius: `12px`
- Padding: `9px`
- Badge:
  - radius: `8px`
  - horizontal padding: `6px`
  - font size: `10px`
- Title text:
  - size: `12px`
  - line-height: `16px`
  - tracking: `-2%`
- Meta number:
  - rendered with `number-flow-react`
  - size: `11px`
  - suffix label: `10px`

## Implementation Guidance

To match Attio more closely, local implementation should follow this order:

1. Keep the passive connector path permanently visible in gray.
2. Overlay a separate pulse path with a narrow traveling gradient.
3. Do not animate the whole path blue after reveal.
4. Use three lower chart fragments:
   - left shoulder
   - center stem
   - right shoulder
5. Treat the upper source-area blue accents as brief pulses, not persistent lines.
6. Anchor record cards to an 8-column chart layout instead of free absolute offsets where possible.

## Gaps

- The PDF gives path geometry and gradient structure, but not explicit CSS keyframes.
- Exact animation duration must still be inferred from motion capture or live DOM/runtime inspection.
- The lower passive routing envelope around the hub is partially present as transparent helper paths; their exact runtime usage remains inferred rather than explicitly confirmed.
