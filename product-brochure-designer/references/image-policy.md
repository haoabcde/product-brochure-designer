# Image policy

## Source priority

1. **Client-supplied assets** — the safest source when rights are confirmed.
2. **Official WeChat account** (`official_wechat`) — search the product's official 公众号; cover images and in-article high-resolution photos are usually usable. Avoid the watermark in the lower-right corner.
3. **Official website** (`official_web`) — check the news center, gallery, or about-us pages; prefer landscape, watermark-free, high-resolution images.
4. **Licensed stock** (`licensed`) — e.g. Unsplash, Pexels; acceptable as fallback.
5. **Normal web images** — may only be used as `preview` in `sample` mode; never promoted to `delivery`.

## Banned sources for delivery

The following are rejected in `delivery` mode and by `promote`:

- `preview` status images
- `ai_generated` images used to represent a real venue, factory, customer activity, product, or person
- ordinary web images whose rights are not documented (`sourceType: unknown` or generic web)

## Roles and placement

- `cover` — front cover, full-bleed background.
- `venue` / `context` — campus, location, or scene background for split pages and full-bleed pages.
- `detail` / `activity` — close-up or action shots for split pages.
- Official WeChat / website images are sorted to the front and preferred for cover and hero/venue.

## Quality rules

- Cover/hero images: width ≥ 2400 px preferred.
- Detail/context images: width ≥ 1800 px preferred.
- Reject: watermarks, visible large text, low resolution, unrelated locations, noisy crowds, heavy saturation, stretched crops.
- Prefer landscape aspect. Apply lower saturation and a subtle dark overlay for readable copy; do not edit source pixels.

## Manifest and approval

`node scripts/image-workflow.mjs manifest` creates a draft `images.json` with `status: preview` and `sourceType: unknown`. Review each image, set `status: approved` and the correct `sourceType`, before running delivery.
