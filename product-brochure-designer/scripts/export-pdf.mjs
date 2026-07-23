import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function candidateBinaries() {
  return process.platform === 'win32' ? ['soffice', 'libreoffice'] : ['libreoffice', 'soffice'];
}

export async function exportPdf(pptxPath) {
  const outDir = path.dirname(pptxPath);
  for (const binary of candidateBinaries()) {
    const result = spawnSync(binary, ['--headless', '--convert-to', 'pdf', '--outdir', outDir, pptxPath], { encoding: 'utf8', timeout: 120000 });
    const target = path.join(outDir, `${path.basename(pptxPath, '.pptx')}.pdf`);
    try { await fs.access(target); return { status: 'ok', path: target, binary }; } catch { /* try next */ }
    if (result.error?.code !== 'ENOENT') return { status: 'warning', code: 'PDF_EXPORT_FAILED', detail: result.stderr || result.error?.message || 'unknown export error' };
  }
  return { status: 'warning', code: 'PDF_EXPORT_UNAVAILABLE', detail: 'LibreOffice/soffice not found; PPTX is still available.' };
}
