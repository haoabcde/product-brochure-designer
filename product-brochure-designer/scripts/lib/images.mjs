import fs from 'node:fs/promises';
import path from 'node:path';
import { exists, writeJson } from './utils.mjs';

const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

export async function prepareImages(manifest, inputDir, projectDir, mode) {
  const issues = [];
  const prepared = [];
  for (const image of manifest?.images || []) {
    const source = path.resolve(inputDir, image.path);
    const valid = IMAGE_EXT.test(source) && await exists(source);
    if (!valid) { issues.push({ severity: 'ERROR', code: 'IMAGE_MISSING', image: image.id }); continue; }
    if (mode === 'delivery' && image.status !== 'approved') {
      issues.push({ severity: 'ERROR', code: 'IMAGE_NOT_APPROVED', image: image.id });
      continue;
    }
    const target = path.join(projectDir, 'assets', 'processed', `${image.id}${path.extname(source)}`);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
    prepared.push({ ...image, sourcePath: source, path: target, treatment: 'subtle overlay applied in PPTX; source pixels unchanged' });
    if (image.status !== 'approved') issues.push({ severity: 'WARNING', code: 'IMAGE_PREVIEW_ONLY', image: image.id });
  }
  await writeJson(path.join(projectDir, 'reports', 'image-sources.json'), { images: prepared, issues });
  return { images: prepared, issues };
}

export function imageForRole(images, role) {
  return images.find((image) => image.role === role) || images[0] || null;
}
