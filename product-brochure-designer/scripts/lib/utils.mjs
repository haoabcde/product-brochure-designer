import fs from 'node:fs/promises';
import path from 'node:path';

export const INTERNAL_KEY = /(?:成本|分销|渠道|结算|利润|内部|底价|supplier|margin|cost|wholesale|internal)/i;
export const REQUIRED_FACTS = ['name', 'description'];

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    args[key.slice(2)] = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
  }
  return args;
}

export async function readData(file) {
  const raw = await fs.readFile(file, 'utf8');
  if (!/\.ya?ml$/i.test(file)) return JSON.parse(raw);
  try {
    const { default: YAML } = await import('yaml');
    return YAML.parse(raw);
  } catch {
    throw new Error(`读取 YAML 需要可选依赖 yaml：请先运行 pnpm install，或改用 JSON 格式的输入文件（${file}）`);
  }
}

export async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function safeName(value) {
  return String(value || 'product').replace(/[<>:"/\\|?*]/g, '').replace(/\s+/g, '_').slice(0, 80) || 'product';
}

export function clip(value, length = 150) {
  const text = String(value || '').trim();
  return text.length <= length ? text : `${text.slice(0, Math.max(0, length - 1)).trim()}…`;
}

export function findBinary(names) {
  const paths = (process.env.PATH || '').split(path.delimiter);
  for (const name of names) {
    for (const entry of paths) {
      const candidate = path.join(entry, process.platform === 'win32' ? `${name}.exe` : name);
      try { return candidate; } catch { /* continue */ }
    }
  }
  return null;
}

export async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}
