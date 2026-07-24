#!/usr/bin/env node
/**
 * smoke.mjs — v2 结构自检（零依赖）
 * 检查 Skill 关键资产存在、模板包含语义锚点与 CSS 变量、知识库文件非空。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = [
  'SKILL.md',
  'references/design-system.md',
  'references/style-directions.md',
  'references/fact-policy.md',
  'references/image-policy.md',
  'templates/brochure.html',
  'scripts/image-workflow.mjs',
  'scripts/html-to-pptx.mjs',
  'scripts/check.mjs',
  'schemas/product.schema.json',
];

const ANCHORS = ['page-cover', 'page-split', 'page-bleed', 'page-timeline', 'page-specs', 'page-closing'];
const TOKENS = ['--bg', '--ink', '--accent', '--overlay', '--font-title', '--font-body', '--margin'];

const failures = [];
for (const rel of REQUIRED) {
  try {
    const stat = await fs.stat(path.join(root, rel));
    if (!stat.size) failures.push(`${rel}: 文件为空`);
  } catch {
    failures.push(`${rel}: 缺失`);
  }
}

try {
  const html = await fs.readFile(path.join(root, 'templates/brochure.html'), 'utf8');
  for (const a of ANCHORS) if (!html.includes(a)) failures.push(`templates/brochure.html: 缺少语义锚点 ${a}`);
  for (const tk of TOKENS) if (!html.includes(tk)) failures.push(`templates/brochure.html: 缺少 CSS 变量 ${tk}`);
  if (!html.includes('@page')) failures.push('templates/brochure.html: 缺少 @page 打印规则');
  if (!html.includes('object-fit: cover')) failures.push('templates/brochure.html: 图片未使用 cover 填充');
} catch { /* 上面已记录缺失 */ }

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(2);
}
console.log(JSON.stringify({ ok: true, checked: REQUIRED.length + ANCHORS.length + TOKENS.length }));
