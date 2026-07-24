#!/usr/bin/env node
/**
 * check.mjs — 交付前安全与完整性检查（v2）
 *
 * 对最终的 brochure.html 与 product.json 做三道检查：
 *   1. INTERNAL_FIELD_LEAK — 页面文本中出现内部字段关键词（成本/渠道/margin…）
 *   2. PENDING_FACT        — 页面中仍存在的【待确认】占位（逐条列出，人工确认）
 *   3. IMAGE_SOURCE        — images.json 中非官方/授权来源的图片（delivery 前必须为 0）
 *
 * 用法：node scripts/check.mjs --html brochure.html [--product product.json] [--images images.json]
 * 退出码：0 = 无 ERROR；2 = 存在 ERROR（INTERNAL_FIELD_LEAK / 未授权图片）。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { INTERNAL_KEY, readData } from './lib/utils.mjs';

const DELIVERY_SOURCES = ['official_wechat', 'official_web', 'licensed'];

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) args[argv[i].replace(/^--/, '')] = argv[i + 1];
  return args;
}

const stripTags = (s) => s.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');

export async function check({ html: htmlPath, product, images }) {
  const issues = [];
  const pending = [];

  if (htmlPath) {
    const text = stripTags(await fs.readFile(htmlPath, 'utf8'));
    const leak = text.match(new RegExp(`.{0,12}${INTERNAL_KEY.source}.{0,12}`, 'gi'));
    if (leak) issues.push({ code: 'INTERNAL_FIELD_LEAK', level: 'ERROR', detail: [...new Set(leak)] });
    const pend = text.match(/【待确认】[^，。<\s]{0,20}/g);
    if (pend) pending.push(...pend);
  }

  if (product) {
    const data = await readData(path.resolve(product));
    const raw = JSON.stringify(data);
    const leak = raw.match(new RegExp(INTERNAL_KEY.source, 'gi'));
    if (leak) issues.push({ code: 'INTERNAL_FIELD_IN_PRODUCT', level: 'ERROR', detail: [...new Set(leak)] });
    for (const key of ['name', 'description']) {
      if (!data[key]) pending.push(`product.${key} 缺失（页面应为【待确认】）`);
    }
  }

  if (images) {
    const data = await readData(path.resolve(images));
    for (const img of data.images || []) {
      if (img.status !== 'approved' || !DELIVERY_SOURCES.includes(img.sourceType)) {
        issues.push({ code: 'IMAGE_NOT_DELIVERABLE', level: 'ERROR', detail: `${img.id || img.path}: status=${img.status}, sourceType=${img.sourceType}` });
      }
    }
  }

  const errors = issues.filter((i) => i.level === 'ERROR');
  const report = { pass: errors.length === 0, errors, pendingFacts: pending };
  console.log(JSON.stringify(report, null, 2));
  return report;
}

if (process.argv[1] && process.argv[1].endsWith('check.mjs')) {
  const args = parseArgs(process.argv);
  if (!args.html && !args.product && !args.images) {
    console.error('用法: node scripts/check.mjs --html brochure.html [--product product.json] [--images images.json]');
    process.exit(1);
  }
  check(args).then((r) => process.exit(r.pass ? 0 : 2)).catch((e) => { console.error(e.message); process.exit(1); });
}
