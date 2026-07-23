import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readData, parseArgs, safeName, writeJson } from './lib/utils.mjs';
import { normalizeProduct } from './lib/normalize.mjs';
import { buildPagePlan, savePlan } from './lib/planning.mjs';
import { prepareImages } from './lib/images.mjs';
import { generatePptx } from './generate-pptx.mjs';
import { exportPdf } from './export-pdf.mjs';
import { createQualityReport } from './quality.mjs';

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function usage() {
  return 'Usage: product-brochure <validate|generate|sample|promote> --input product.json [--images images.json] [--mode sample|delivery]';
}

async function runGenerate(args, command = 'generate') {
  const input = args.input;
  if (!input) throw new Error(`INPUT_REQUIRED\n${usage()}`);
  const raw = await readData(path.resolve(input));
  const mode = args.mode || 'sample';
  if (!['sample', 'delivery'].includes(mode)) throw new Error('MODE_INVALID: use sample or delivery');
  const root = path.resolve(args.output || path.join(process.cwd(), 'output'));
  const projectDir = path.join(root, safeName(raw.name));
  await fs.mkdir(projectDir, { recursive: true });
  const { product, gaps } = await normalizeProduct(raw, projectDir);
  const plan = await savePlan(buildPagePlan(product), projectDir);
  const imageInput = args.images ? await readData(path.resolve(args.images)) : { images: [] };
  const { images, issues: imageIssues } = await prepareImages(imageInput, args.images ? path.dirname(path.resolve(args.images)) : process.cwd(), projectDir, mode);
  await writeJson(path.join(projectDir, 'data', 'image-manifest.json'), { images });
  if (command === 'validate') {
    console.log(JSON.stringify({ projectDir, valid: product.name !== '【待确认】', gaps, pageCount: plan.pageCount, imageIssues }, null, 2));
    return { projectDir, product, plan, images, imageIssues, gaps };
  }
  const pptxPath = await generatePptx({ product, plan, images, projectDir, skillDir, mode });
  const pdf = await exportPdf(pptxPath);
  const quality = await createQualityReport({ product, plan, images, imageIssues, projectDir, mode, pptxPath, pdf });
  console.log(JSON.stringify({ projectDir, pptxPath, pdf, quality }, null, 2));
  if (mode === 'delivery' && !quality.pass) process.exitCode = 2;
  return { projectDir, pptxPath, pdf, quality };
}

async function promote(args) {
  if (!args.project) throw new Error('PROJECT_REQUIRED');
  const projectDir = path.resolve(args.project);
  const quality = JSON.parse(await fs.readFile(path.join(projectDir, 'reports', 'quality.json'), 'utf8'));
  if (!quality.pass) throw new Error('PROMOTE_BLOCKED: resolve quality errors before delivery.');
  console.log(JSON.stringify({ promoted: true, projectDir }, null, 2));
}

async function main() {
  const [command = 'help', ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  if (command === 'help' || args.help) { console.log(usage()); return; }
  if (command === 'sample') {
    await runGenerate({ input: path.join(skillDir, 'examples', 'sustech-study-tour', 'product.json'), images: path.join(skillDir, 'examples', 'sustech-study-tour', 'images.json'), output: path.join(skillDir, 'examples', 'sustech-study-tour', 'output'), mode: 'sample' });
    return;
  }
  if (command === 'promote') { await promote(args); return; }
  if (command === 'validate' || command === 'generate') { await runGenerate(args, command); return; }
  throw new Error(`COMMAND_INVALID\n${usage()}`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
