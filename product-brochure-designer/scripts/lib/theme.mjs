import fs from 'node:fs/promises';
import path from 'node:path';

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function loadTheme(preset, product, skillDir) {
  const fallback = 'editorial';
  const file = path.join(skillDir, 'assets', 'presets', `${preset || fallback}.json`);
  let theme;
  try { theme = JSON.parse(await fs.readFile(file, 'utf8')); } catch { theme = JSON.parse(await fs.readFile(path.join(skillDir, 'assets', 'presets', `${fallback}.json`), 'utf8')); }
  const colors = product.brand?.colors || {};
  const variants = theme.variants || [];
  const variantIndex = product.variant ? variants.findIndex(v => v.name === product.variant) : hashCode(product.name || 'product') % Math.max(variants.length, 1);
  const variant = variants[variantIndex >= 0 ? variantIndex : 0] || {};
  return {
    ...theme,
    ...variant,
    background: colors.background || theme.background,
    ink: colors.ink || theme.ink,
    accent: colors.accent || theme.accent,
    overlay: colors.overlay || theme.overlay
  };
}
