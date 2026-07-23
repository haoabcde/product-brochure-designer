# Style presets

The Skill ships six presets in `assets/presets/`. Each preset defines a color family and two variants.

| Preset | Best for | Background | Ink | Accent | Overlay |
|---|---|---|---|---|---|
| `editorial` | General, university, education | `F4F6F8` | `152231` | `2D6CDF` | `102A43` |
| `technology` | AI / science / tech | `EDF1F5` | `101923` | `276EF1` | `071827` |
| `industrial` | Company, manufacturing | `F1F2F2` | `20272D` | `D96A32` | `252A2F` |
| `heritage` | Culture, craft | `F7F2E9` | `26211E` | `9B3329` | `312622` |
| `ecology` | Nature, outdoor education | `F1F5F0` | `1B2921` | `2E7653` | `1B352A` |
| `history` | Historical themes | `F5F0E7` | `292524` | `8A2F2A` | `342725` |

## Preset selection

1. If `product.preset` is set, use it.
2. Otherwise, `scripts/lib/planning.mjs` maps keywords in `category` and `type`:
   - `university` / `education` / `study` → `editorial`
   - `technology` / `science` → `technology`
   - `industrial` / `enterprise` → `industrial`
   - `heritage` / `culture` → `heritage`
   - `ecology` / `nature` → `ecology`
   - `history` → `history`
3. Fallback: `editorial`.

## Variants

Each preset includes:

- `light-minimal` — light cover style, title size 30 pt
- `dark-bleed` — dark full-bleed cover style, title size 32 pt

If `product.variant` is not set, the variant is chosen deterministically by hashing `product.name`. To force a variant, set `product.variant` to `light-minimal` or `dark-bleed`.

## Brand color override

`brand.colors` can override any of: `background`, `ink`, `accent`, `muted`, `overlay`. Keep overrides restrained and consistent with the chosen preset.

## Design principles

- Photo-led cover and at least one quiet text page.
- No repetitive card grids, excessive icons, rainbow colors, or dense paragraphs.
- Use one dominant color family and at most two accents per page.
