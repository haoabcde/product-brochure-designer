# Layout rules

## Canvas

- Layout name: `A4_PORTRAIT`
- Size: 8.2677 in × 11.6929 in (210 mm × 297 mm)
- Safe margin: 0.62 in (~15.7 mm) on all sides

## Typography

- Headings: `Aptos Display`, bold, 22–32 pt
- Body: `Aptos`, 10 pt minimum
- Notes/captions: `Aptos`, 8.5 pt minimum
- Keep text editable in PPTX; do not rasterize copy.

## Composition patterns

The renderer uses six compositions defined in `scripts/lib/compositions.mjs`:

| Composition | Typical page types | Image usage |
|---|---|---|
| `cover` | `cover` | Full-bleed cover photo with dark overlay |
| `splitLeft` | `intro`, `venue` | Photo on the left ~38%, text on the right |
| `splitRight` | `values`, `modules` | Text on the left, photo on the right ~44% |
| `fullBleed` | `story`, `contact` | Full-bleed photo or solid background |
| `listVertical` | `outcomes`, `specs` | Text list, no required image |
| `timeline` | `schedule` | Vertical timeline with text |

## Page-type mapping

The page selector in `scripts/lib/pages.mjs` maps each page type to a default composition and falls back to `listVertical` when no image is available for image-led compositions. Consecutive `splitLeft`/`splitRight` pages are automatically mirrored to avoid repetition.

## Page count

Page count is decided by `scripts/lib/planning.mjs` based on content richness (`benefits + modules + itinerary + specifications` keys):

- 6 pages when richness < 7
- 8 pages when 7 ≤ richness < 13
- 10 pages when richness ≥ 13

Page sequences:

- 6 pages: `cover`, `intro`, `values`, `schedule`, `specs`, `contact`
- 8 pages: `cover`, `intro`, `values`, `venue`, `modules`, `schedule`, `outcomes`, `contact`
- 10 pages: `cover`, `intro`, `values`, `venue`, `modules`, `story`, `schedule`, `outcomes`, `specs`, `contact`

## Visual discipline

- One dominant color family and at most two accent colors per page.
- Lower saturation, strong crop choices, and breathing room.
- Avoid repetitive cards, busy textures, excessive icons, rainbow colors, and dense paragraphs.
- Every deck needs a photo-led cover, a quiet information page, and a change of composition between consecutive pages.
