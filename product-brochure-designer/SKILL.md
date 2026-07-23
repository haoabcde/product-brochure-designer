---
name: product-brochure-designer
description: Create polished, editable A4 portrait product handbooks in PPTX and PDF from a structured product brief and approved local images. Use for product brochures, sales handbooks, study-tour handbooks, program catalogs, and client-facing multi-page product introductions in Codex, Claude Code, WorkBuddy, or another agent environment with Node.js.
---

# Product Brochure Designer — AI 执行手册

本 Skill 用于把结构化的产品资料和本地图片，生成可编辑的 A4 竖版 PPTX（并在可用时导出 PDF）。本手册面向任意 AI Agent：按章节顺序执行即可，不要跳过输入检查与质量报告。

## 1. 快速开始（3 步）

### 第 1 步：准备 `product.json`

复制 `examples/sustech-study-tour/product.json` 并改写。只填写已确认的事实；缺少的关键事实留空，系统会自动标记为 `【待确认】`。

### 第 2 步：准备图片

- 若已有本地图片：按 `images.json` 格式写入清单（见第 2 节）。
- 若需要收集图片：先运行图片工作流（见第 3 节），优先使用官方公众号/官网图片。

### 第 3 步：验证并生成

```bash
cd product-brochure-designer
pnpm install
pnpm validate -- --input /path/to/product.json --images /path/to/images.json
pnpm generate -- --input /path/to/product.json --images /path/to/images.json --mode sample
```

生成后检查 `output/<产品名>/reports/quality.json` 与 `information-gaps.md`，确认无错误再提升为 delivery。

---

## 2. 输入要求

### 2.1 `product.json` / `product.yaml`

支持 JSON 或 YAML。顶层字段如下（`name` 必填）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 产品名称（必填） |
| `category` | string | 类别，如 `university`、`technology`、`industrial` 等，用于自动选择预设 |
| `type` | string | 产品类型，辅助预设选择 |
| `description` | string | 产品描述（必填，过长会被截断） |
| `subtitle` / `tagline` | string | 副标题/标语 |
| `benefits` | array | 核心卖点，最多 5 条，每条可为 `{title, description}` 或字符串 |
| `modules` | array | 内容模块，最多 5 条 |
| `itinerary` | array | 行程/流程，最多 8 条，每条 `{time, title, description}` |
| `outcomes` | array | 成果/带走价值，最多 3 条 |
| `specifications` | object | 规格表，键值对 |
| `brand` | object | 品牌信息，见下文 |
| `preset` | string | 显式指定视觉预设，可选 |
| `variant` | string | 显式指定预设变体，可选 |

`brand` 对象：

| 字段 | 说明 |
|---|---|
| `name` | 品牌/机构名称（可留空，系统不会默认填入） |
| `contact` | 联系方式 |
| `disclaimer` | 免责声明 |
| `logo` | logo 图片路径（相对 `product.json` 所在目录） |
| `colors` | 可覆盖主题颜色：`background`、`ink`、`accent`、`overlay` |

关键限制：

- 字段名匹配 `(成本|分销|渠道|结算|利润|内部|底价|supplier|margin|cost|wholesale|internal)` 的内容会被视为内部数据并剥离。
- `name`、`description` 为空时会显示为 `【待确认】`。
- 不要编造价格、成本、渠道、供应商、审批结果、合作方承诺等未经确认的事实。

### 2.2 `images.json`

图片清单，每个图片字段如下：

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 图片唯一标识 |
| `path` | 是 | 相对 `images.json` 所在目录的本地路径 |
| `role` | 是 | 图片用途：`cover`、`venue`、`detail`、`activity`、`context` 等 |
| `status` | 是 | `approved` 或 `preview` |
| `sourceType` | 否 | `official_wechat`、`official_web`、`licensed`、`unknown` 等 |
| `sourceUrl` | 否 | 原始来源 URL |
| `rights` | 否 | 授权说明 |
| `width` / `height` | 否 | 像素尺寸（工作流可自动填写） |

规则：

- `delivery` 模式仅接受 `status === 'approved'` 且 `sourceType` 为 `official_wechat`、`official_web` 或 `licensed` 的图片。
- 官方公众号/官网图片会被优先用于封面（cover）和主视觉（hero/venue）。
- 普通网页图片只能作为 `preview`，不能进入 delivery。

---

## 3. 图片工作流

图片工作流分三阶段，按需执行：

```bash
# 阶段 1：分析需要哪些图片
node scripts/image-workflow.mjs analyze --product product.json [--plan data/page-plan.json]

# 阶段 2：输出官方来源采集计划
node scripts/image-workflow.mjs source-plan --product product.json

# 阶段 3：把下载目录中的图片登记为 images.json
node scripts/image-workflow.mjs manifest --download-dir ./downloads --output images.json
```

### 3.1 官方优先原则

1. **官方公众号**（`official_wechat`）：搜索产品名称的官方公众号，查看最近 3–6 个月推文。封面图和文中高清图优先用于封面与 hero。
2. **官方网站**（`official_web`）：进入官网“新闻中心/图库/关于我们”，选择横版、无水印、高分辨率图片。
3. **授权图库**（`licensed`）：如 Unsplash、Pexels 等，作为补充。
4. **普通网页/AI 生成图**：仅能在 `sample` 模式下作为 `preview` 使用，`delivery` 与 `promote` 会拒绝。

### 3.2 质量门槛

- 封面/主视觉宽度建议 ≥ 2400px；细节/场景图宽度建议 ≥ 1800px。
- 拒绝：水印、大幅文字叠加、低分辨率、无关地点、噪杂人群、过度饱和、拉伸裁剪。
- 优先横版（landscape）照片；竖版照片仅用于细节展示。
- 不要在 PPTX 中直接修改原始像素；版式通过 PptxGenJS 的透明叠加层处理。

### 3.3 人工审核

`manifest` 生成的清单默认 `status: preview`、`sourceType: unknown`。采集后必须人工把合适图片标记为 `approved` 并设置正确的 `sourceType`，否则无法进入 delivery。

---

## 4. 生成与验证

### 4.1 命令速查

```bash
# 校验输入并输出缺口/图片问题
pnpm validate -- --input product.json --images images.json

# 生成 sample（允许 preview 图片）
pnpm generate -- --input product.json --images images.json --mode sample

# 生成 delivery（要求图片 approved 且来源合规）
pnpm generate -- --input product.json --images images.json --mode delivery

# 使用示例产品快速生成 sample
pnpm sample

# 提升 sample 为 delivery（仅当 quality.json pass 为 true）
pnpm promote -- --project output/<产品名>
```

### 4.2 校验阶段

`validate` 会：

1. 规范化 `product.json`，剥离内部字段。
2. 把缺失的 `name`、`description` 替换为 `【待确认】`。
3. 生成 `data/page-plan.json`（含 6/8/10 页计划）。
4. 检查图片是否存在、是否满足当前模式要求。
5. 输出 `reports/information-gaps.md` 与 `reports/image-sources.json`。

### 4.3 生成阶段

`generate` 在 `validate` 的基础上：

1. 加载主题与变体（见 `references/style-presets.md`）。
2. 为每页选择版式（见 `references/layout-rules.md`）。
3. 生成 `<产品名>_<mode>.pptx`。
4. 尝试调用 LibreOffice/soffice 导出 PDF。
5. 生成 `reports/quality.json`。

### 4.4 模式差异

| 模式 | preview 图片 | 未 approved 图片 | 无官方来源 | 质量报告 |
|---|---|---|---|---|
| `sample` | 允许，记为 WARNING | 允许 | 不报错 | pass 仍为 true（除非致命错误） |
| `delivery` | 拒绝，记为 ERROR | 拒绝 | 发出 WARNING | 有 ERROR 则 pass=false，退出码 2 |

### 4.5 提升

`promote` 只读取 `reports/quality.json`：

- 若 `pass === true`：输出 `promoted: true`。
- 若 `pass === false`：抛出 `PROMOTE_BLOCKED`。

---

## 5. 输出说明

生成目录为 `output/<安全产品名>/`：

| 文件/目录 | 说明 |
|---|---|
| `<产品名>_sample.pptx` / `<产品名>_delivery.pptx` | 可编辑 A4 竖版 PPTX |
| 同名 `.pdf`（可选） | 当 LibreOffice/soffice 可用时生成 |
| `data/product.normalized.json` | 规范化后的产品数据 |
| `data/page-plan.json` | 页面规划（预设、页数、每页类型与图片角色） |
| `data/image-manifest.json` | 处理后的图片清单 |
| `data/layout-bounds.json` | 每页版式与可编辑区域记录 |
| `reports/information-gaps.md` | 缺失事实清单 |
| `reports/image-sources.json` | 图片来源与问题 |
| `reports/quality.json` | 质量报告，含 `pass` 与 `issues` |

PPTX 中所有标题、正文、规格、联系方式、免责声明均为可编辑文本；照片仅作为背景或配图。

---

## 6. 故障排除

### 6.1 没有图片

- 封面和全出血页会退化为纯色叠加背景。
- 左右分栏页会自动切换为 `listVertical` 版式。
- 建议：先执行图片工作流，至少提供一张 `role: cover` 的 approved 图片。

### 6.2 图片不合格

常见错误码与处理：

| 错误码 | 含义 | 处理 |
|---|---|---|
| `IMAGE_MISSING` | 图片路径不存在或扩展名不对 | 检查 `path` 是否相对 `images.json` 目录；仅支持 `png/jpg/jpeg/webp` |
| `IMAGE_NOT_APPROVED` | delivery 模式下图片未 approved 或来源不合规 | 把图片 `status` 改为 `approved`，`sourceType` 改为官方或授权类型 |
| `IMAGE_PREVIEW_ONLY` | sample 模式下的预览图 | 如需交付，替换为 approved 图片 |
| `OFFICIAL_SOURCE_MISSING` | delivery 没有使用官方来源图片 | 优先从官方公众号/官网获取并登记 |

### 6.3 PDF 不可用

- 错误码 `PDF_EXPORT_UNAVAILABLE`：未安装 LibreOffice/soffice。PPTX 仍然有效，可在本地手动导出 PDF。
- 错误码 `PDF_EXPORT_FAILED`：已找到二进制但导出失败。检查文件路径是否过长、PPTX 是否损坏。

### 6.4 质量报告未通过

- `INTERNAL_FIELD_LEAK`：产品数据仍含内部字段，检查并删除成本、利润、渠道等字段。
- `CRITICAL_FACT_MISSING`：`name` 或 `description` 为空，补充后再生成。
- `DELIVERY_PREVIEW_IMAGE`：delivery 模式下存在 preview 图片，全部替换为 approved。

---

## 7. 安全规则

1. **待确认字段**：任何不确定的事实必须显示为 `【待确认】`，不要替用户猜测。
2. **内部字段**：字段名或内容包含成本、利润、分销、渠道、结算、内部、supplier、margin、cost、wholesale 等会被剥离；不要在对外稿件中保留。
3. **图片合规**：
   - delivery 禁止使用 `preview`、`web`、`ai_generated` 图片。
   - 不得用 AI 生成图代表真实场馆、工厂、客户活动、产品或人物。
4. **人工复核**：sample 生成后必须检查 `information-gaps.md`、`image-sources.json`、`quality.json` 后再决定是否可以 promote。
5. **免责声明**：涉及预约、审批、价格、入校、体验项目等可能变动的事项，应写入 `brand.disclaimer` 或 specifications 中注明“以最终确认/现场安排为准”。

---

## 参考文档

- `references/fact-policy.md` — 事实与资料缺口策略
- `references/image-policy.md` — 图片来源、审核与禁止项
- `references/layout-rules.md` — A4 版式、安全边距与 6 种版式模式
- `references/style-presets.md` — 6 套视觉预设与变体
- `references/platform-notes.md` — Node、PptxGenJS、LibreOffice 等平台注意事项
