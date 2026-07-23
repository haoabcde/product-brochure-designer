---
name: product-brochure-designer
description: Create polished, editable A4 portrait product handbooks in PPTX and PDF from a structured product brief and approved local images. Use for product brochures, sales handbooks, study-tour handbooks, program catalogs, and client-facing multi-page product introductions in Codex, Claude Code, WorkBuddy, or another agent environment with Node.js.
---

# Product Brochure Designer

Create a restrained, photo-led product handbook without rebuilding its structure from scratch each time. Use the portable Node scripts in this folder; do not depend on a platform-specific plugin or UI.

## Quick start

1. Copy `examples/sustech-study-tour/product.json` and adapt it. Supply facts only; do not invent missing activities, prices, approvals, outcomes, or affiliations.
2. Add local images to an `images.json` manifest. Ask the hosting agent to find and download images only when its environment supports browsing. Prefer supplied assets, official images, and licensed stock. Normal web images remain preview-only.
3. Run:

```bash
pnpm install
pnpm generate -- --input /path/product.json --images /path/images.json --mode sample
```

4. Review `output/<product>/reports/information-gaps.md`, `image-sources.json`, and `quality.json` before sharing the output.

## Inputs

- `product.json` or `product.yaml`: product name, description, audience, benefits, modules, schedule, specifications, sources, and optional `brand` object.
- `images.json`: local file path, source URL, role, usage status, and rights status for each image.
- Optional `brand` object: logo, brand name, contact, QR code, disclaimer, colors. It is per-run. Never add a default organizer or institution.

Read [references/fact-policy.md](references/fact-policy.md) when facts are incomplete. Read [references/image-policy.md](references/image-policy.md) before collecting images. Read [references/style-presets.md](references/style-presets.md) only when choosing or overriding a visual direction. Read [references/platform-notes.md](references/platform-notes.md) only when adapting commands to a specific Agent host.

## Required workflow

1. Normalize and validate input.
2. Remove private fields and mark missing public facts as `【待确认】`.
3. Choose a visual preset and a 6, 8, or 10-page plan.
4. Check image paths, source status, and role suitability.
5. Generate editable A4 PPTX.
6. Export PDF if LibreOffice is available; otherwise retain PPTX and record the limitation.
7. Inspect the output manifest and quality report. Do not promote a sample with private facts, missing critical facts, or preview-only images.

## Visual rules

- Use real or approved photos as the main visual. Let simple lines, labels, and large numbers support the page; do not make SVG art or card grids the main subject.
- Use one dominant color family and at most two accent colors per page. Prefer lower saturation, strong crop choices, and breathing room.
- Keep title, body, specifications, contact details, and disclaimer as editable PPTX text. Use rasterized photo composition only behind them.
- Do not force every product into the same visual theme. Use the six supplied presets or a compact brand override.

## Commands

```bash
pnpm validate -- --input product.json --images images.json
pnpm generate -- --input product.json --images images.json --mode sample
pnpm generate -- --input product.json --images images.json --mode delivery
pnpm sample
pnpm promote -- --project output/<product>
```

`sample` permits preview-only web images but marks the report. `delivery` and `promote` reject them. PDF export is optional when `libreoffice` or `soffice` is unavailable.

## Output

Each run writes `output/<product>/`:

- `<product>_sample.pptx` or `<product>_delivery.pptx`
- matching PDF if export is available
- `data/product.normalized.json`, `data/page-plan.json`, `data/layout-bounds.json`
- `reports/information-gaps.md`, `reports/image-sources.json`, `reports/quality.json`

## Safety

Never put internal prices, margins, costs, supplier contacts, private notes, or unverified claims in a client-facing deck. Treat unknown fields as `【待确认】`; replace unapproved preview images before delivery.

