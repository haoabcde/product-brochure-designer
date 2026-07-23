import { A4, addFooter, addLabel, addSectionTitle, addBody } from './layout.mjs';
import { clip } from './utils.mjs';

export function cover(slide, ctx) {
  const { theme, product, images, page } = ctx;
  const photo = images.find(img => img.role === 'cover') || images[0];
  const titleSize = theme.titleSize || 32;
  slide.background = { color: theme.background };
  if (photo?.path) {
    slide.addImage({ path: photo.path, x: 0, y: 0, w: A4.width, h: A4.height });
    slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: A4.height, fill: { color: theme.overlay, transparency: 45 }, line: { color: theme.overlay, transparency: 100 } });
  } else {
    slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: A4.height, fill: { color: theme.overlay }, line: { color: theme.overlay } });
  }
  addLabel(slide, product.category || 'PRODUCT HANDBOOK', theme, A4.margin, 1.2);
  slide.addText(product.name, { x: A4.margin, y: 7.2, w: 6.5, h: 1.4, fontFace: 'Aptos Display', bold: true, fontSize: titleSize, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  slide.addText(product.subtitle || product.tagline || '产品手册', { x: A4.margin, y: 8.75, w: 5.8, h: 0.4, fontFace: 'Aptos', fontSize: 13, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  slide.addText(`${String(page.page).padStart(2, '0')} / A4 PRODUCT HANDBOOK`, { x: A4.margin, y: 10.6, w: 3, h: 0.16, fontFace: 'Aptos', fontSize: 7.5, color: 'FFFFFF', charSpacing: 1.3, margin: 0 });
}

export function splitLeft(slide, ctx) {
  const { theme, product, images, page } = ctx;
  slide.background = { color: theme.background };
  addFooter(slide, product, theme, page.page);
  const photo = images.find(img => img.role === 'venue' || img.role === 'cover') || images[0];
  if (photo?.path) {
    slide.addImage({ path: photo.path, x: 0, y: 0, w: 3.2, h: A4.height });
    slide.addShape('rect', { x: 0, y: 0, w: 3.2, h: A4.height, fill: { color: theme.overlay, transparency: 78 }, line: { color: theme.overlay, transparency: 100 } });
  }
  addLabel(slide, 'INTRODUCTION', theme, 3.8, 0.65);
  addSectionTitle(slide, product.introTitle || '从真实场景，理解产品价值', theme, { x: 3.8, y: 0.95, w: 3.8, size: 22 });
  addBody(slide, clip(product.description, 300), theme, 3.8, 2.0, 3.6, 4.4, 11.2);
}

export function splitRight(slide, ctx) {
  const { theme, product, images, page } = ctx;
  slide.background = { color: theme.background };
  addFooter(slide, product, theme, page.page);
  const photo = images.find(img => img.role === 'detail' || img.role === 'activity') || images[0];
  if (photo?.path) {
    slide.addImage({ path: photo.path, x: 4.6, y: 0, w: 3.67, h: A4.height });
    slide.addShape('rect', { x: 4.6, y: 0, w: 3.67, h: A4.height, fill: { color: theme.overlay, transparency: 78 }, line: { color: theme.overlay, transparency: 100 } });
  }
  addLabel(slide, 'KEY VALUE', theme);
  addSectionTitle(slide, product.valueTitle || '值得被看见的四个理由', theme);
  const benefits = product.benefits?.length ? product.benefits.slice(0, 4) : [{ title: '产品定位', description: '【待确认】' }];
  benefits.forEach((item, index) => {
    const y = 1.75 + index * 1.72;
    slide.addText(String(index + 1).padStart(2, '0'), { x: A4.margin, y, w: 0.8, h: 0.55, fontFace: 'Aptos Display', bold: true, fontSize: 26, color: theme.accent, margin: 0 });
    slide.addText(item.title || `亮点 ${index + 1}`, { x: 1.48, y: y + 0.03, w: 2.2, h: 0.28, fontFace: 'Aptos', bold: true, fontSize: 12.5, color: theme.ink, margin: 0, fit: 'shrink' });
    addBody(slide, clip(item.description || item, 72), theme, 3.55, y, 3.4, 0.62, 9.8, theme.muted);
  });
}

export function fullBleed(slide, ctx) {
  const { theme, product, images } = ctx;
  const photo = images.find(img => img.role === 'detail' || img.role === 'cover') || images[0];
  if (photo?.path) {
    slide.addImage({ path: photo.path, x: 0, y: 0, w: A4.width, h: A4.height });
    slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: A4.height, fill: { color: theme.overlay, transparency: 34 }, line: { color: theme.overlay, transparency: 100 } });
  } else {
    slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: A4.height, fill: { color: theme.overlay }, line: { color: theme.overlay } });
  }
  slide.addText(product.storyTitle || '从细节出发，形成更完整的理解。', { x: A4.margin, y: 4.4, w: 5.9, h: 1.3, fontFace: 'Aptos Display', bold: true, fontSize: 28, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  slide.addText(clip(product.story || product.description, 180), { x: A4.margin, y: 6.1, w: 4.9, h: 1.3, fontFace: 'Aptos', fontSize: 11.5, color: 'FFFFFF', margin: 0, fit: 'shrink' });
}

export function listVertical(slide, ctx) {
  const { theme, product, page } = ctx;
  slide.background = { color: theme.background };
  addFooter(slide, product, theme, page.page);
  addLabel(slide, 'OUTCOMES', theme);
  addSectionTitle(slide, product.outcomeTitle || '带走的不只是一次体验', theme);
  const values = product.outcomes?.length ? product.outcomes.slice(0, 3) : ['认识产品与场景', '建立观察与提问意识', '获得进一步探索的线索'];
  values.forEach((item, index) => {
    const y = 1.85 + index * 1.55;
    slide.addText(['UNDERSTAND', 'EXPLORE', 'CONNECT'][index] || 'LEARN', { x: A4.margin, y, w: 2.8, h: 0.24, fontFace: 'Aptos', bold: true, fontSize: 8.5, charSpacing: 1.1, color: theme.accent, margin: 0 });
    slide.addText(item, { x: A4.margin, y: y + 0.35, w: 3.2, h: 0.5, fontFace: 'Aptos', bold: true, fontSize: 14, color: theme.ink, margin: 0, fit: 'shrink' });
  });
}

export function timeline(slide, ctx) {
  const { theme, product, page } = ctx;
  slide.background = { color: theme.background };
  addFooter(slide, product, theme, page.page);
  addLabel(slide, 'SCHEDULE', theme);
  addSectionTitle(slide, product.scheduleTitle || '参考流程', theme);
  const list = product.itinerary?.length ? product.itinerary.slice(0, 6) : [{ time: '01', title: '活动安排', description: '【待确认】' }];
  slide.addShape('line', { x: 1.1, y: 1.8, w: 0, h: Math.max(2.8, list.length * 1.15), line: { color: theme.accent, transparency: 32, width: 1.2 } });
  list.forEach((item, index) => {
    const y = 1.75 + index * 1.15;
    slide.addShape('ellipse', { x: 0.98, y: y + 0.1, w: 0.24, h: 0.24, fill: { color: theme.accent }, line: { color: theme.accent } });
    slide.addText(item.time || `0${index + 1}`, { x: 1.5, y, w: 1.1, h: 0.25, fontFace: 'Aptos', bold: true, fontSize: 10, color: theme.accent, margin: 0 });
    slide.addText(item.title || `环节 ${index + 1}`, { x: 2.75, y, w: 3.6, h: 0.24, fontFace: 'Aptos', bold: true, fontSize: 12, color: theme.ink, margin: 0, fit: 'shrink' });
    slide.addText(clip(item.description || item, 86), { x: 2.75, y: y + 0.32, w: 3.7, h: 0.36, fontFace: 'Aptos', fontSize: 9.2, color: theme.muted, margin: 0, fit: 'shrink' });
  });
}
