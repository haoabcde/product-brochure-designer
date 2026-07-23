# Platform notes

## Runtime

- Node.js 20 or later.
- Package manager: `pnpm` (preferred) or `npm`.
- Dependencies: `pptxgenjs` for PPTX generation, `yaml` for YAML product files.
- No platform-specific binaries are required for PPTX generation.

## Agent hosts

The Skill runs the same way in Codex, Claude Code, WorkBuddy, or any other Node-capable agent environment:

```bash
cd product-brochure-designer
pnpm install
pnpm validate -- --input product.json --images images.json
pnpm generate -- --input product.json --images images.json --mode sample
```

Use the host agent's browser/search capability only to collect images into local files and update `images.json`. The generator intentionally does not scrape web search results.

## Scripts

- `scripts/product-brochure.mjs` — entry point for `validate`, `generate`, `sample`, `promote`.
- `scripts/image-workflow.mjs` — `analyze`, `source-plan`, `manifest`.
- `scripts/smoke.mjs` — quick health check for required skill assets.

## PDF export

PDF export is optional. `scripts/export-pdf.mjs` looks for `libreoffice` or `soffice`:

- On Linux/macOS: `libreoffice` or `soffice` in `PATH`.
- On Windows: `soffice.exe` or `libreoffice.exe` in `PATH`.

If neither is available, the PPTX remains valid and `quality.json` records `PDF_EXPORT_UNAVAILABLE`. If the binary is found but export fails, `PDF_EXPORT_FAILED` is recorded.

## Fonts

The generated PPTX uses `Aptos` and `Aptos Display`. These fonts are available on most modern systems. If they are missing, PowerPoint will substitute a fallback font; the layout is designed to tolerate reasonable substitution.
