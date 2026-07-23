import fs from 'node:fs/promises';
import path from 'node:path';
import { readData, writeJson, parseArgs } from './lib/utils.mjs';

export async function analyze(productPath, planPath) {
  const product = await readData(path.resolve(productPath));
  const plan = planPath ? await readData(path.resolve(planPath)) : null;
  const pageCount = plan?.pageCount || 6;
  const required = [];
  if (pageCount >= 6) required.push({ role: 'hero', purpose: '封面主视觉', aspect: 'landscape', minWidth: 2400, quality: 'high' });
  if (product.modules?.length || product.benefits?.length) required.push({ role: 'detail', purpose: '细节展示', aspect: 'any', minWidth: 1800, quality: 'high' });
  if (product.itinerary?.length) required.push({ role: 'context', purpose: '场景背景', aspect: 'landscape', minWidth: 1800, quality: 'high' });
  const result = { required, totalRecommended: Math.min(required.length + 1, 6), pageCount };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

export async function sourcePlan(productPath) {
  const product = await readData(path.resolve(productPath));
  const name = product.name || '产品';
  const category = product.category || '';
  const result = {
    officialSources: [
      {
        priority: 1,
        type: 'official_wechat',
        accountName: name,
        searchHint: `搜索"${name}"官方公众号，查看最近 3-6 个月推文`,
        note: '封面图和文中高清图通常可直接使用，注意避开右下角水印'
      },
      {
        priority: 2,
        type: 'official_web',
        searchHint: `搜索"${name} 官网"，进入新闻中心/图库/关于我们`,
        note: '优先选择横版、无水印、高分辨率图片'
      }
    ],
    fallbackSources: [
      { type: 'licensed_stock', providers: ['Unsplash', 'Pexels'], searchTerms: [category, name] }
    ],
    qualityRules: {
      minWidth: 1800,
      avoid: ['watermark', 'AI generated', 'heavy filter', 'text overlay', 'low resolution']
    }
  };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

export async function manifest(downloadDir, outputPath) {
  const files = await fs.readdir(path.resolve(downloadDir));
  const images = files.filter(f => /\.(png|jpe?g|webp)$/i.test(f)).map((file, index) => ({
    id: `img-${String(index + 1).padStart(3, '0')}`,
    path: file,
    role: index === 0 ? 'cover' : index === 1 ? 'venue' : 'detail',
    status: 'preview',
    sourceType: 'unknown',
    width: null,
    height: null
  }));
  const result = { images };
  await writeJson(path.resolve(outputPath), result);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

const [command, ...rest] = process.argv.slice(2);
const args = parseArgs(rest);
if (command === 'analyze') await analyze(args.product, args.plan);
else if (command === 'source-plan') await sourcePlan(args.product);
else if (command === 'manifest') await manifest(args['download-dir'], args.output);
else console.log('Usage: image-workflow <analyze|source-plan|manifest> [--product product.json] [--plan page-plan.json] [--download-dir dir] [--output images.json]');
