export const A4 = { width: 8.2677, height: 11.6929, margin: 0.62 };

export function addFooter(slide, product, theme, number) {
  const brand = product.brand?.name || '';
  slide.addShape('line', { x: A4.margin, y: 11.08, w: 7.03, h: 0, line: { color: theme.muted, transparency: 60, width: 0.7 } });
  slide.addText(brand, { x: A4.margin, y: 11.16, w: 5.5, h: 0.17, fontFace: 'Aptos', fontSize: 7.5, color: theme.muted, margin: 0 });
  slide.addText(String(number).padStart(2, '0'), { x: 7.16, y: 11.13, w: 0.45, h: 0.2, fontFace: 'Aptos', fontSize: 8, color: theme.muted, align: 'right', margin: 0 });
}

export function addPhoto(slide, image, x, y, w, h, theme, transparency = 0) {
  if (!image?.path) return false;
  slide.addImage({ path: image.path, x, y, w, h, transparency });
  slide.addShape('rect', { x, y, w, h, fill: { color: theme.overlay, transparency: 78 }, line: { color: theme.overlay, transparency: 100 } });
  return true;
}

export function addTitle(slide, title, theme, options = {}) {
  slide.addText(title, { x: options.x ?? A4.margin, y: options.y ?? 0.68, w: options.w ?? 6.7, h: options.h ?? 0.65, fontFace: 'Aptos Display', bold: true, fontSize: options.size ?? 25, color: options.color ?? theme.ink, breakLine: false, margin: 0, fit: 'shrink' });
}

export function addLabel(slide, text, theme, x = A4.margin, y = 0.42) {
  slide.addText(text.toUpperCase(), { x, y, w: 2.4, h: 0.18, fontFace: 'Aptos', bold: true, fontSize: 7.5, charSpacing: 1.5, color: theme.accent, margin: 0 });
}

export function addBody(slide, text, theme, x, y, w, h, size = 11, color = null) {
  slide.addText(text, { x, y, w, h, fontFace: 'Aptos', fontSize: size, color: color || theme.ink, breakLine: false, valign: 'mid', margin: 0, breakLine: false, fit: 'shrink', paraSpaceAfterPt: 5, breakLine: false });
}

export function addSectionTitle(slide, title, theme, options = {}) {
  slide.addText(title, {
    x: options.x ?? A4.margin,
    y: options.y ?? 0.68,
    w: options.w ?? 6.7,
    h: options.h ?? 0.65,
    fontFace: 'Aptos Display',
    bold: true,
    fontSize: options.size ?? 25,
    color: options.color ?? theme.ink,
    breakLine: false,
    margin: 0,
    fit: 'shrink'
  });
}

export function addPageNumber(slide, number, theme, x, y) {
  slide.addText(String(number).padStart(2, '0'), {
    x,
    y,
    w: 0.45,
    h: 0.2,
    fontFace: 'Aptos',
    fontSize: 8,
    color: theme.muted,
    align: 'right',
    margin: 0
  });
}

export function addTexture(slide, theme, opacity = 6) {
  const spacing = 0.85;
  const width = 0.015;
  for (let x = A4.margin; x < A4.width - A4.margin; x += spacing) {
    slide.addShape('rect', {
      x,
      y: A4.margin,
      w: width,
      h: A4.height - A4.margin * 2,
      fill: { color: theme.accent, transparency: opacity },
      line: { color: theme.accent, transparency: 100 }
    });
  }
}

export function addDivider(slide, x, y, w, theme) {
  slide.addShape('line', {
    x,
    y,
    w,
    h: 0,
    line: { color: theme.accent, transparency: 40, width: 0.7 }
  });
}
