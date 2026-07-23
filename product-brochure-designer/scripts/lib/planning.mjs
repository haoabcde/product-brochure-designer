import fs from 'node:fs/promises';
import path from 'node:path';
import { writeJson } from './utils.mjs';

const PRESET_BY_CATEGORY = {
  university: 'editorial', education: 'editorial', study: 'editorial', technology: 'technology', science: 'technology', industrial: 'industrial', enterprise: 'industrial', heritage: 'heritage', culture: 'heritage', ecology: 'ecology', nature: 'ecology', history: 'history'
};

export function choosePreset(product) {
  if (product.preset) return product.preset;
  const words = `${product.category || ''} ${product.type || ''}`.toLowerCase();
  return Object.entries(PRESET_BY_CATEGORY).find(([key]) => words.includes(key))?.[1] || 'editorial';
}

export function buildPagePlan(product) {
  const richness = product.modules.length + product.benefits.length + product.itinerary.length + Object.keys(product.specifications).length;
  const pageCount = richness >= 13 ? 10 : richness >= 7 ? 8 : 6;
  const core = ['cover', 'intro', 'values'];
  const middle = pageCount === 10 ? ['venue', 'modules', 'story', 'schedule', 'outcomes', 'specs']
    : pageCount === 8 ? ['venue', 'modules', 'schedule', 'outcomes']
      : ['schedule', 'specs'];
  const pages = [...core, ...middle, 'contact'].map((type, index) => ({ page: index + 1, type, imageRole: type === 'cover' ? 'cover' : type === 'venue' ? 'venue' : type === 'modules' ? 'detail' : type === 'outcomes' ? 'activity' : null }));
  return { preset: choosePreset(product), pageCount, pages };
}

export async function savePlan(plan, projectDir) {
  await writeJson(path.join(projectDir, 'data', 'page-plan.json'), plan);
  return plan;
}
