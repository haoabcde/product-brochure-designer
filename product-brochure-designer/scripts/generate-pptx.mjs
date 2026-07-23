import fs from 'node:fs/promises';
import path from 'node:path';
import pptxgen from 'pptxgenjs';
import { loadTheme } from './lib/theme.mjs';
import { renderPage } from './lib/pages.mjs';
import { writeJson } from './lib/utils.mjs';

export async function generatePptx({ product, plan, images, projectDir, skillDir, mode }) {
  const theme = await loadTheme(plan.preset, product, skillDir);
  const pptx = new pptxgen();
  pptx.defineLayout({ name: 'A4_PORTRAIT', width: 8.2677, height: 11.6929 });
  pptx.layout = 'A4_PORTRAIT';
  pptx.author = 'Product Brochure Designer';
  pptx.subject = product.name;
  pptx.title = product.name;
  pptx.company = product.brand?.name || '';
  pptx.lang = 'zh-CN';
  const bounds = [];
  let previousMode = null;
  for (const page of plan.pages) {
    const slide = pptx.addSlide();
    const ctx = { ...page, product, images, theme, previousMode };
    renderPage(slide, ctx);
    previousMode = ctx.previousMode;
    bounds.push({ page: page.page, type: page.type, mode: ctx.previousMode, safeMarginInches: 0.62, editable: ['title', 'body', 'facts', 'contact', 'disclaimer'] });
  }
  const outputDir = projectDir;
  await fs.mkdir(outputDir, { recursive: true });
  const fileName = `${product.name.replace(/[<>:"/\\|?*]/g, '')}_${mode}.pptx`;
  const outputPath = path.join(outputDir, fileName);
  await pptx.writeFile({ fileName: outputPath });
  await writeJson(path.join(projectDir, 'data', 'layout-bounds.json'), bounds);
  return outputPath;
}
