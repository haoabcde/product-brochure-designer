import fs from 'node:fs/promises';
import path from 'node:path';

export async function loadTheme(preset, product, skillDir) {
  const fallback = 'editorial';
  const file = path.join(skillDir, 'assets', 'presets', `${preset || fallback}.json`);
  let theme;
  try { theme = JSON.parse(await fs.readFile(file, 'utf8')); } catch { theme = JSON.parse(await fs.readFile(path.join(skillDir, 'assets', 'presets', `${fallback}.json`), 'utf8')); }
  const colors = product.brand?.colors || {};
  return { ...theme, background: colors.background || theme.background, ink: colors.ink || theme.ink, accent: colors.accent || theme.accent, overlay: colors.overlay || theme.overlay };
}
