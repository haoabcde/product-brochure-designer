import { A4, addBody, addFooter, addLabel, addPhoto, addTitle } from './layout.mjs';
import { clip } from './utils.mjs';
import { imageForRole } from './images.mjs';

const value = (item, fallback = '【待确认】') => typeof item === 'string' ? item : item?.description || item?.body || fallback;
const heading = (item, fallback) => typeof item === 'string' ? fallback : item?.title || item?.name || fallback;

function base(slide, theme, product, page) {
  slide.background = { color: theme.background };
  addFooter(slide, product, theme, page);
}

function cover(slide, ctx) {
  const { theme, product, images, page } = ctx;
  const photo = imageForRole(images, 'cover');
  base(slide, theme, product, page);
  if (addPhoto(slide, photo, 0, 0, A4.width, 11.05, theme)) {
    slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: 11.05, fill: { color: theme.overlay, transparency: 40 }, line: { color: theme.overlay, transparency: 100 } });
  } else {
    slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: 11.05, fill: { color: theme.overlay }, line: { color: theme.overlay } });
  }
  addLabel(slide, product.category || 'PRODUCT HANDBOOK', theme, A4.margin, 1.1);
  slide.addText(product.name, { x: A4.margin, y: 7.45, w: 6.45, h: 1.05, fontFace: 'Aptos Display', bold: true, fontSize: 31, color: 'FFFFFF', margin: 0, fit: 'shrink', breakLine: false });
  slide.addText(product.subtitle || product.tagline || '产品手册', { x: A4.margin, y: 8.68, w: 5.9, h: 0.36, fontFace: 'Aptos', fontSize: 12, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  slide.addText('01 / A4 PRODUCT HANDBOOK', { x: A4.margin, y: 10.44, w: 3, h: 0.16, fontFace: 'Aptos', fontSize: 7.5, color: 'FFFFFF', charSpacing: 1.3, margin: 0 });
}

function intro(slide, ctx) {
  const { theme, product, images, page } = ctx;
  base(slide, theme, product, page);
  addLabel(slide, 'INTRODUCTION', theme); addTitle(slide, product.introTitle || '从真实场景，理解产品价值', theme);
  addBody(slide, clip(product.description, 300), theme, A4.margin, 1.82, 3.15, 4.4, 12);
  const photo = imageForRole(images, 'venue') || imageForRole(images, 'cover');
  addPhoto(slide, photo, 4.12, 1.5, 3.52, 5.12, theme);
  slide.addText('清晰、克制、可验证的产品表达。', { x: A4.margin, y: 8.15, w: 5.8, h: 0.5, fontFace: 'Aptos Display', bold: true, fontSize: 19, color: theme.accent, margin: 0 });
}

function values(slide, ctx) {
  const { theme, product, page } = ctx;
  base(slide, theme, product, page); addLabel(slide, 'KEY VALUE', theme); addTitle(slide, product.valueTitle || '值得被看见的四个理由', theme);
  const benefits = product.benefits.length ? product.benefits.slice(0, 4) : [{ title: '产品定位', description: '【待确认】' }, { title: '核心体验', description: '【待确认】' }, { title: '适用对象', description: product.audience || '【待确认】' }];
  benefits.forEach((item, index) => {
    const y = 1.72 + index * 1.73;
    slide.addText(String(index + 1).padStart(2, '0'), { x: A4.margin, y, w: 0.8, h: 0.55, fontFace: 'Aptos Display', bold: true, fontSize: 27, color: theme.accent, margin: 0 });
    slide.addText(heading(item, `亮点 ${index + 1}`), { x: 1.48, y: y + 0.03, w: 2, h: 0.28, fontFace: 'Aptos', bold: true, fontSize: 12.5, color: theme.ink, margin: 0, fit: 'shrink' });
    addBody(slide, clip(value(item), 72), theme, 3.55, y, 3.42, 0.62, 9.8, theme.muted);
    slide.addShape('line', { x: 1.48, y: y + 0.78, w: 5.5, h: 0, line: { color: theme.muted, transparency: 78, width: 0.5 } });
  });
}

function venue(slide, ctx) {
  const { theme, product, images, page } = ctx; base(slide, theme, product, page);
  addPhoto(slide, imageForRole(images, 'venue') || imageForRole(images, 'cover'), 0, 0, 3.1, 11.05, theme);
  addLabel(slide, 'CONTEXT', theme, 3.7, 0.65); addTitle(slide, product.venueTitle || '场景与产品背景', theme, { x: 3.7, y: 0.95, w: 3.7, size: 22 });
  addBody(slide, clip(product.venueDescription || product.description, 380), theme, 3.7, 2.2, 3.5, 4.4, 11.2);
}

function modules(slide, ctx) {
  const { theme, product, images, page } = ctx; base(slide, theme, product, page); addLabel(slide, 'PRODUCT CONTENT', theme); addTitle(slide, product.moduleTitle || '内容围绕真实体验展开', theme);
  const list = product.modules.length ? product.modules.slice(0, 3) : [{ title: '核心模块', description: '【待确认】' }, { title: '互动与体验', description: '【待确认】' }, { title: '分享与总结', description: '【待确认】' }];
  const photo = imageForRole(images, 'detail') || imageForRole(images, 'activity');
  addPhoto(slide, photo, 4.68, 1.6, 2.55, 5.85, theme);
  list.forEach((item, index) => {
    const y = 1.75 + index * 1.82;
    slide.addText(`0${index + 1}`, { x: A4.margin, y, w: 0.45, h: 0.26, fontFace: 'Aptos', bold: true, fontSize: 9, color: theme.accent, margin: 0 });
    slide.addText(heading(item, `模块 ${index + 1}`), { x: 1.15, y: y - 0.02, w: 2.9, h: 0.25, fontFace: 'Aptos', bold: true, fontSize: 12.2, color: theme.ink, margin: 0, fit: 'shrink' });
    addBody(slide, clip(value(item), 84), theme, 1.15, y + 0.34, 2.95, 0.72, 9.5, theme.muted);
  });
}

function schedule(slide, ctx) {
  const { theme, product, page } = ctx; base(slide, theme, product, page); addLabel(slide, 'SCHEDULE', theme); addTitle(slide, product.scheduleTitle || '参考流程', theme);
  const list = product.itinerary.length ? product.itinerary.slice(0, 6) : [{ time: '01', title: '活动安排', description: '【待确认】' }, { time: '02', title: '核心体验', description: '【待确认】' }, { time: '03', title: '总结交流', description: '【待确认】' }];
  slide.addShape('line', { x: 1.08, y: 1.8, w: 0, h: Math.max(2.6, list.length * 1.12), line: { color: theme.accent, transparency: 32, width: 1.2 } });
  list.forEach((item, index) => {
    const y = 1.75 + index * 1.12;
    slide.addShape('ellipse', { x: 0.96, y: y + 0.09, w: 0.24, h: 0.24, fill: { color: theme.accent }, line: { color: theme.accent } });
    slide.addText(item.time || `0${index + 1}`, { x: 1.48, y, w: 1.15, h: 0.25, fontFace: 'Aptos', bold: true, fontSize: 10, color: theme.accent, margin: 0 });
    slide.addText(heading(item, `环节 ${index + 1}`), { x: 2.75, y, w: 3.7, h: 0.24, fontFace: 'Aptos', bold: true, fontSize: 12, color: theme.ink, margin: 0, fit: 'shrink' });
    slide.addText(clip(value(item), 86), { x: 2.75, y: y + 0.31, w: 3.85, h: 0.36, fontFace: 'Aptos', fontSize: 9.2, color: theme.muted, margin: 0, fit: 'shrink' });
  });
  slide.addText('实际流程以最终确认与现场安排为准。', { x: A4.margin, y: 9.2, w: 4.4, h: 0.18, fontFace: 'Aptos', fontSize: 8.5, italic: true, color: theme.muted, margin: 0 });
}

function outcomes(slide, ctx) {
  const { theme, product, images, page } = ctx; base(slide, theme, product, page); addLabel(slide, 'OUTCOMES', theme); addTitle(slide, product.outcomeTitle || '带走的不只是一次体验', theme);
  addPhoto(slide, imageForRole(images, 'activity') || imageForRole(images, 'detail'), 4.2, 1.45, 3.05, 6.3, theme);
  const values = product.outcomes?.length ? product.outcomes.slice(0, 3) : ['认识产品与场景', '建立观察与提问意识', '获得进一步探索的线索'];
  values.forEach((item, index) => {
    const y = 1.82 + index * 1.5;
    slide.addText(['UNDERSTAND', 'EXPLORE', 'CONNECT'][index] || 'LEARN', { x: A4.margin, y, w: 2.8, h: 0.24, fontFace: 'Aptos', bold: true, fontSize: 8.5, charSpacing: 1.1, color: theme.accent, margin: 0 });
    slide.addText(value(item), { x: A4.margin, y: y + 0.32, w: 3.05, h: 0.42, fontFace: 'Aptos', bold: true, fontSize: 13, color: theme.ink, margin: 0, fit: 'shrink' });
  });
}

function specs(slide, ctx) {
  const { theme, product, page } = ctx; base(slide, theme, product, page); addLabel(slide, 'PRODUCT FACTS', theme); addTitle(slide, product.specificationTitle || '产品信息与说明', theme);
  const facts = Object.entries(product.specifications || {});
  const rows = facts.length ? facts.slice(0, 9) : [['适用对象', product.audience || '【待确认】'], ['活动时长', product.duration || '【待确认】'], ['活动地点', product.location || '【待确认】']];
  rows.forEach(([key, item], index) => {
    const column = index % 2; const row = Math.floor(index / 2); const x = A4.margin + column * 3.38; const y = 1.65 + row * 1.17;
    slide.addText(String(key), { x, y, w: 1.12, h: 0.22, fontFace: 'Aptos', bold: true, fontSize: 9.2, color: theme.accent, margin: 0 });
    slide.addText(clip(item, 64), { x, y: y + 0.34, w: 2.72, h: 0.38, fontFace: 'Aptos', fontSize: 10.5, color: theme.ink, margin: 0, fit: 'shrink' });
    slide.addShape('line', { x, y: y + 0.88, w: 2.92, h: 0, line: { color: theme.muted, transparency: 75, width: 0.5 } });
  });
}

function story(slide, ctx) {
  const { theme, product, images, page } = ctx; base(slide, theme, product, page);
  addPhoto(slide, imageForRole(images, 'detail') || imageForRole(images, 'cover'), 0, 0, A4.width, 11.05, theme);
  slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: 11.05, fill: { color: theme.overlay, transparency: 34 }, line: { color: theme.overlay, transparency: 100 } });
  slide.addText(product.storyTitle || '从细节出发，形成更完整的理解。', { x: A4.margin, y: 4.5, w: 5.9, h: 1.15, fontFace: 'Aptos Display', bold: true, fontSize: 29, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  slide.addText(clip(product.story || product.description, 180), { x: A4.margin, y: 6.05, w: 4.85, h: 1.2, fontFace: 'Aptos', fontSize: 11.5, color: 'FFFFFF', margin: 0, fit: 'shrink' });
}

function contact(slide, ctx) {
  const { theme, product, images, page } = ctx; base(slide, theme, product, page);
  addPhoto(slide, imageForRole(images, 'cover'), 0, 0, A4.width, 11.05, theme);
  slide.addShape('rect', { x: 0, y: 0, w: A4.width, h: 11.05, fill: { color: theme.overlay, transparency: 18 }, line: { color: theme.overlay, transparency: 100 } });
  slide.addText(product.closing || '让一次了解，成为下一步探索的开始。', { x: A4.margin, y: 2.05, w: 5.8, h: 0.95, fontFace: 'Aptos Display', bold: true, fontSize: 27, color: 'FFFFFF', margin: 0, fit: 'shrink' });
  const contact = product.brand?.contact || '【待确认】';
  slide.addText(`咨询方式\n${contact}`, { x: A4.margin, y: 7.85, w: 4.3, h: 0.75, fontFace: 'Aptos', fontSize: 12, color: 'FFFFFF', breakLine: false, margin: 0, fit: 'shrink' });
  slide.addText(product.brand?.disclaimer || '实际内容以最终确认与现场安排为准。', { x: A4.margin, y: 9.7, w: 5.85, h: 0.24, fontFace: 'Aptos', fontSize: 8, color: 'FFFFFF', margin: 0, fit: 'shrink' });
}

const PAGES = { cover, intro, values, venue, modules, story, schedule, outcomes, specs, contact };
export function renderPage(slide, ctx) { return (PAGES[ctx.type] || intro)(slide, ctx); }
