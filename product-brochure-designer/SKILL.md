---
name: product-brochure-designer
description: Create polished, premium A4 portrait product handbooks (HTML master → PDF, optionally PPTX) from a structured product brief and approved local images, using a world-class design knowledge base instead of hardcoded layouts. Use for product brochures, sales handbooks, study-tour handbooks, program catalogs, and client-facing multi-page product introductions in Codex, Claude Code, WorkBuddy, or another agent environment.
---

# Product Brochure Designer — AI 执行手册（v2）

本 Skill 把结构化的产品资料和本地图片，制作成高级、精美、杂志级的 A4 竖版产品手册。

**v2 工作方式**：设计不再是硬编码的版式引擎，而是**知识驱动**——你（Agent）阅读设计知识库，自己做出设计判断，手写一份 HTML 母版，用浏览器渲染目检，最后导出 PDF（可选 PPTX）。本手册按章节顺序执行即可。

**零依赖**：主线（HTML→PDF）不需要任何 npm 包；只有需要 PPTX 时才 `pnpm install`（pptxgenjs 为可选依赖）。

---

## 0. 交付物与路线

| 交付物 | 来源 | 何时用 |
|---|---|---|
| `brochure.html` | 你手写（按第 4 章设计流程） | 母版，唯一事实来源 |
| PDF | 浏览器打印 brochure.html（宿主浏览器工具/Chromium） | 主交付物 |
| PPTX | `node scripts/html-to-pptx.mjs` 转换同一 HTML | 客户要求可编辑源文件时 |

不要先写 PPTX 再导 PDF；HTML 是唯一母版，两条输出线都从它派生。

---

## 1. 快速开始（4 步）

### 第 1 步：准备 `product.json`

复制 `examples/sustech-study-tour/product.json` 并改写。只填已确认事实；缺失关键事实留空，渲染时写 `【待确认】`。

### 第 2 步：准备图片

按第 3 章图片工作流收集官方图片，生成 `images.json`。没有图片也能排版（纯色封面），但质量上限会低很多——至少努力拿到一张官方主图。

### 第 3 步：设计并写 HTML

按第 4 章流程：读设计知识 → 选风格方向 → 规划叙事页 → 基于 `templates/brochure.html` 改写每一页。

### 第 4 步：渲染目检 → 导出

用浏览器渲染每一页截图，按第 5 章清单逐项目检、迭代到通过，然后打印导出 PDF，需要时转 PPTX。

---

## 2. 输入要求

### 2.1 `product.json` / `product.yaml`

| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | string | 产品名称（必填） |
| `subtitle` / `tagline` | string | 副标题/标语 |
| `category` | string | 类别（university/technology/industrial/culture/ecology…），辅助选风格方向 |
| `description` | string | 产品描述（必填） |
| `benefits` | array | 核心卖点，最多 5 条，`{title, description}` 或字符串 |
| `modules` | array | 内容模块，最多 5 条 |
| `itinerary` | array | 行程/流程，最多 8 条，`{time, title, description}` |
| `outcomes` | array | 成果/带走价值，最多 3 条 |
| `specifications` | object | 规格表键值对 |
| `brand` | object | `{name, contact, disclaimer, colors}`；`colors` 只覆盖 `background/ink/accent/overlay` 四槽 |

关键限制：

- 字段名匹配 `(成本|分销|渠道|结算|利润|内部|底价|supplier|margin|cost|wholesale|internal)` 的内容是内部数据，**必须剥离**，不得出现在手册任何位置。
- `name`、`description` 缺失时页面写 `【待确认】`；不要编造价格、合作方承诺、审批结果等未确认事实。

### 2.2 `images.json`

| 字段 | 必填 | 说明 |
|---|---|---|
| `id` | 是 | 唯一标识 |
| `path` | 是 | 相对 `images.json` 所在目录的本地路径 |
| `role` | 是 | `cover` / `venue` / `detail` / `activity` / `context` |
| `status` | 是 | `approved`（可交付）/ `preview`（仅样稿） |
| `sourceType` | 交付必填 | `official_wechat` / `official_web` / `licensed` 可交付；`preview` / `web` / `ai_generated` 仅限样稿 |

---

## 3. 图片工作流（官方优先）

Skill 不联网抓图，而是为你生成搜图指令，你用宿主环境的浏览器/搜索工具下载：

```bash
# 阶段 1：分析产品内容需要哪些图、质量标准
node scripts/image-workflow.mjs analyze --product product.json

# 阶段 2：生成搜图计划：官方公众号 → 官网 → 授权图库
node scripts/image-workflow.mjs source-plan --product product.json

# 阶段 3：下载完成后扫描目录，生成 images.json 草稿
node scripts/image-workflow.mjs manifest --download-dir ./downloads --output images.json
```

- 图片数量不设上限，由内容丰富度动态决定；但每页最多一张主图（见设计知识库 §5.4）。
- 质量门槛：无水印、无大文字叠加、封面 ≥2400px 宽、真实场景；禁止 AI 生成图冒充真实场地/活动/人物。
- `manifest` 生成的草稿默认 `status: preview`；交付前必须人工把合格图片标记为 `approved` 并设置正确 `sourceType`。
- 交付模式（最终 PDF/PPTX）只允许 `approved` 且来源为官方/授权的图片；样稿阶段可用 `preview` 图，但页面上不标注来源差异——由你在报告中说明。

---

## 4. 设计流程（核心）

> 模板只保证技术机制正确；**设计判断由你做出**。不要机械复制模板页序——按产品内容规划叙事。

### 4.1 读设计知识

先读两个文件，它们是本 Skill 的设计大脑：

- `references/design-system.md` — 网格、字体排印、色彩、留白、图像、叙事弧、反模式清单
- `references/style-directions.md` — 5 个风格方向（editorial / swiss / muji / dark-bleed / heritage）

### 4.2 选风格方向并定设计 Token

按 `style-directions.md` 的选择方法定一个方向（拿不准用 editorial），然后推导四个色槽与字体配对，写入 HTML 顶部的 CSS 变量：

```css
:root {
  --bg: ...; --ink: ...; --accent: ...; --overlay: ...;
  --font-title: ...; --font-body: ...; --margin: 14mm~18mm;
}
```

品牌提供了主色时，以它推导 `--accent`（压暗降饱和），其余槽位围绕它协调。

### 4.3 规划叙事页

按设计知识库 §7 的叙事弧，把 product.json 的内容映射到 6/8/10 页计划：封面钩子 → 语境 → 价值 → 展开 → 呼吸页 → 证据 → 高潮 → 行动。**信息量不够就做 6 页，不注水**。

### 4.4 写 HTML

复制 `templates/brochure.html` 为工作文件，逐页改写：

- 每页是一个 `<section class="page">`，A4 竖版 210×297mm，溢出裁剪。
- 模板中的语义 class（`page-cover` / `page-split` / `page-bleed` / `page-timeline` / `page-specs` / `page-closing`）是 **PPTX 转换锚点**——改写内容时保留这些 class；你也可以新增版式，但新增版式不会进入 PPTX 转换。
- 所有图片 `object-fit: cover`；文字压图必须配渐变遮罩（模板已给出正确写法）。
- 遵守空间刻度 `{2,4,6,10,16,24,40}mm`；正文 9–10.5pt；每页空白率 ≥35%。

### 4.5 没有图片时

封面与出血页退化为 overlay 纯色 + 大字标题（依然成立）；分栏页改为整页文字版式。在交付报告中明确说明缺图。

---

## 5. 渲染目检与导出

### 5.1 渲染目检（必做，不可跳过）

用宿主环境的浏览器工具打开 `brochure.html`，逐页截图，对照 `references/design-system.md` §8 反模式清单逐项检查，重点：

1. 文字与图片是否重叠、文字是否可读（遮罩够不够深）
2. 图片是否变形（宽高比）、是否模糊/廉价
3. 每页空白率、对齐、间距刻度
4. 字体是否成功加载（衬线标题是否真的是衬线）
5. 叙事节奏：密页之后有没有呼吸页

发现问题 → 改 HTML → 重新渲染，直到全部通过。**没有目检过的手册不算完成。**

### 5.2 安全检查（交付前必跑）

```bash
node scripts/check.mjs --html brochure.html --product product.json --images images.json
```

检查内部字段泄露（成本/渠道/margin…）、遗留的 `【待确认】`、不合规图片来源。存在 ERROR 时退出码为 2，**不得交付**。

### 5.3 导出 PDF

用宿主浏览器工具的"打印为 PDF"（Chromium print-to-pdf）：

- 纸张 A4、纵向、边距"无"、勾选"背景图形/Background graphics"
- 模板已内置 `@page { size: A4; margin: 0 }` 与打印色彩修正

### 5.4 导出 PPTX（可选）

```bash
pnpm install   # 仅此路径需要依赖（pptxgenjs）
node scripts/html-to-pptx.mjs --html brochure.html --output <产品名>.pptx
```

转换器按语义 class 锚点把每页映射为可编辑 PPTX 对象（文字可编辑，图片为配图）。转换后抽查 2–3 页确认无错位。

---

## 6. 输出与质量报告

建议在输出目录写一份 `delivery-notes.md`：所选风格方向与色板、页数计划、图片来源清单（official/preview 各几张）、`【待确认】` 项汇总、目检结论。交付时随 PDF 一并给出。

---

## 7. 故障排除

| 问题 | 处理 |
|---|---|
| 打印 PDF 颜色/背景丢失 | 打印设置勾选"背景图形"；模板已设 `print-color-adjust: exact` |
| 页与页之间出现白缝 | 确认 `@page margin: 0`，打印边距设为"无" |
| 中文字体回退成默认黑体 | 系统缺 Noto Serif SC；接受回退（排版已容忍），或提示用户安装思源宋体 |
| PPTX 转换后某版式丢失 | 该页用了非模板语义 class 的新版式；改用模板 class 或接受 PDF-only |
| 图片不够 | 见 4.5；优先补一张 cover 角色官方图 |

---

## 8. 安全规则

1. 任何不确定的事实显示为 `【待确认】`，不替用户猜测。
2. 成本、利润、渠道、结算、供应商等内部字段必须剥离，不得出现在任何页面。
3. 交付稿禁止 `preview` / `web` / `ai_generated` 图片；禁止用 AI 生成图代表真实场馆、产品、活动或人物。
4. 涉及价格、预约、审批、体验项目等可能变动的事项，在尾页或规格页注明"以最终确认/现场安排为准"。
5. 交付前必须完成第 5.1 节目检并在交付说明中记录。

---

## 参考文档

- `references/design-system.md` — 设计系统知识库（先读）
- `references/style-directions.md` — 5 个风格方向
- `references/fact-policy.md` — 事实与资料缺口策略
- `references/image-policy.md` — 图片来源、审核与禁止项
- `templates/brochure.html` — A4 技术机制参考模板（含语义锚点说明）
