import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = ['SKILL.md', 'package.json', 'agents/openai.yaml', 'schemas/product.schema.json', 'scripts/product-brochure.mjs', 'scripts/generate-pptx.mjs', 'references/fact-policy.md', 'assets/presets/editorial.json'];
for (const file of required) await fs.access(path.join(root, file));
console.log(`smoke ok: ${required.length} required skill assets found`);
