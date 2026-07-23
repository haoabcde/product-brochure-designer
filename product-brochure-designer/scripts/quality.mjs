import fs from 'node:fs/promises';
import path from 'node:path';
import { containsInternalData } from './lib/normalize.mjs';
import { exists, writeJson } from './lib/utils.mjs';

export async function createQualityReport({ product, plan, imageIssues, projectDir, mode, pptxPath, pdf }) {
  const issues = [...imageIssues];
  if (containsInternalData(product)) issues.push({ severity: 'ERROR', code: 'INTERNAL_FIELD_LEAK' });
  if (product.name === '【待确认】' || product.description === '【待确认】') issues.push({ severity: 'ERROR', code: 'CRITICAL_FACT_MISSING' });
  if (!(await exists(pptxPath))) issues.push({ severity: 'ERROR', code: 'PPTX_MISSING' });
  if (pdf?.status === 'warning') issues.push({ severity: 'WARNING', code: pdf.code, detail: pdf.detail });
  if (mode === 'delivery' && issues.some((issue) => issue.code === 'IMAGE_PREVIEW_ONLY')) issues.push({ severity: 'ERROR', code: 'DELIVERY_PREVIEW_IMAGE' });
  const report = { mode, pageCount: plan.pageCount, pass: !issues.some((issue) => issue.severity === 'ERROR'), issues, generatedAt: new Date().toISOString() };
  await writeJson(path.join(projectDir, 'reports', 'quality.json'), report);
  return report;
}
