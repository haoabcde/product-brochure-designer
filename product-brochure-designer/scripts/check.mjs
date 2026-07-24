#!/usr/bin/env node
/**
 * check.mjs — 交付前安全与完整性检查（v2）
 *
 * 对最终的 brochure.html 与 product.json 做四道检查：
 *   1. INTERNAL_FIELD_LEAK — 页面文本中出现内部字段关键词（成本/渠道/margin…）【ERROR】
 *   2. PENDING_FACT        — 页面中仍存在的【待确认】占位（逐条列出，人工确认）【INFO】
 *   3. IMAGE_SOURCE        — images.json 中非官方/授权来源的图片（delivery 前必须为 0）【ERROR】
 *   4. AD_CLAIM            — 广告法敏感词（保过/确保/100%/最好…，见 fact-policy.md）【WARNING】
 *
 * 用法：node scripts/check.mjs --html brochure.html [--product product.json] [--images images.json]
 * 退出码：0 = 无 ERROR；2 = 存在 ERROR（INTERNAL_FIELD_LEAK / 未授权图片）。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { INTERNAL_KEY, readData } from './lib/utils.mjs';

const DELIVERY_SOURCES = ['official_wechat', 'official_web', 'licensed'];
// 广告法敏感词（《广告法》第 9 条绝对化用语、第 24 条教育培训保证性承诺）；WARNING 级，需人工判断语境
const AD_CLAIM = /(?:保过|包过|百分百|100%|确保(?:升学|录取|通过|入学|就业)|保证(?:升学|录取|通过|入学|效果)|承诺(?:升学|录取|效果)|最(?:好|优|强|受欢迎|具影响力)|顶级|第一品牌|首选品牌|国家级|权威认证|官方指定|独家合作|名校直通|guaranteed)/i;

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
    const claims = text.match(new RegExp(`.{0,10}${AD_CLAIM.source}.{0,10}`, 'gi'));
    if (claims) issues.push({ code: 'AD_CLAIM', level: 'WARNING', detail: [...new Set(claims)], note: '广告法敏感词，需人工逐条确认语境（见 references/fact-policy.md）' });
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
  const warnings = issues.filter((i) => i.level === 'WARNING');
  const report = { pass: errors.length === 0, errors, warnings, pendingFacts: pending };
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
