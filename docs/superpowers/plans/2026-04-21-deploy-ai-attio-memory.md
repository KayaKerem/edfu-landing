# Deploy AI Attio Memory

- Goal: keep the existing outer `SectionFrame` intact while matching Attio's homepage `Deploy AI` internals as closely as possible.
- Reference sources used on April 21, 2026: the user-provided screenshot and the live [Attio homepage](https://attio.com/) `Deploy AI` section.
- Parity decisions:
  - The workflow canvas uses a denser light-blue dot grid and blue connector spine.
  - Trigger and task cards use a subtle purple-to-blue border treatment instead of neutral gray halos.
  - The `Basepoint` card header uses a dark circular product mark rather than a letter avatar.
  - The right card renders filled data for `Categories`, `Funding raised`, and `Stakeholders` to match the Attio example state.
  - Categories are rendered as multiple chips, so the component now supports per-row chip arrays.
  - Response rows animate in sequentially after the card shell appears, instead of revealing as a single static block.
- Follow-up if more polish is needed:
  - Compare exact card x/y positions against a fresh Attio screenshot.
  - Tune chip paddings and row widths by screenshot overlay if visible drift remains.
