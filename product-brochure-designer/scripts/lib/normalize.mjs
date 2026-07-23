import fs from 'node:fs/promises';
import path from 'node:path';
import { INTERNAL_KEY, REQUIRED_FACTS, clip, writeJson } from './utils.mjs';

function scrub(value, key = '') {
  if (INTERNAL_KEY.test(key)) return undefined;
  if (Array.isArray(value)) return value.map((item) => scrub(item)).filter((item) => item !== undefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .map(([childKey, childValue]) => [childKey, scrub(childValue, childKey)])
      .filter(([, childValue]) => childValue !== undefined));
  }
  return value;
}

export async function normalizeProduct(raw, projectDir) {
  const product = scrub(raw || {});
  const gaps = [];
  for (const field of REQUIRED_FACTS) {
    if (!String(product[field] || '').trim()) {
      product[field] = '【待确认】';
      gaps.push(field);
    }
  }
  product.description = clip(product.description, 360);
  product.benefits = Array.isArray(product.benefits) ? product.benefits.slice(0, 5) : [];
  product.modules = Array.isArray(product.modules) ? product.modules.slice(0, 5) : [];
  product.itinerary = Array.isArray(product.itinerary) ? product.itinerary.slice(0, 8) : [];
  product.specifications = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};
  product.brand = product.brand && typeof product.brand === 'object' ? product.brand : {};
  const dataDir = path.join(projectDir, 'data');
  const reportDir = path.join(projectDir, 'reports');
  await writeJson(path.join(dataDir, 'product.normalized.json'), product);
  const lines = ['# 资料缺口报告', '', '以下字段未提供，已在对外文案中显示为 `【待确认】`：', ''];
  lines.push(...(gaps.length ? gaps.map((gap) => `- ${gap}`) : ['- 无关键缺口。']));
  if (!product.brand.name) lines.push('- brand.name（可留空，不会默认加入机构名称）');
  if (!product.brand.contact) lines.push('- brand.contact');
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, 'information-gaps.md'), `${lines.join('\n')}\n`, 'utf8');
  return { product, gaps };
}

export function containsInternalData(value) {
  if (Array.isArray(value)) return value.some(containsInternalData);
  if (value && typeof value === 'object') return Object.entries(value).some(([key, child]) => INTERNAL_KEY.test(key) || containsInternalData(child));
  return false;
}
