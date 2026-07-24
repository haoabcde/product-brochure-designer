---
name: product-brochure-designer
description: Create polished, premium A4 portrait product handbooks (HTML master → PDF, optionally PPTX) from a structured product brief and approved local images, using a world-class design knowledge base instead of hardcoded layouts. Use for product brochures, sales handbooks, study-tour handbooks, program catalogs, and client-facing multi-page product introductions in Codex, Claude Code, WorkBuddy, or another agent environment.
---

# Product Brochure Designer — AI 执行手册

把结构化产品资料和本地图片，制作成高级、杂志级的 A4 竖版产品手册。**知识驱动**：你阅读设计知识库后自己做设计判断，手写 HTML 母版，浏览器渲染目检，导出 PDF（可选 PPTX）。主线**零 npm 依赖**；仅 PPTX 转换需要 `pnpm install`。

## 0. 交付物与路线

| 交付物 | 来源 | 说明 |
|---|---|---|
| `brochure.html` | 你手写（第 3 章流程） | 唯一母版 |
| PDF | 浏览器打印 HTML | 主交付物 |
| PPTX | `scripts/html-to-pptx.mjs` | 客户要可编辑源文件时 |

## 1. 快速开始

1. **product.json**：复制 `examples/sustech-study-tour/product.json` 改写。只填已确认事实，缺失留空（页面写 `【待确认】`）。`audience`（目标读者）务必填写——风格由它决定。
2. **图片**：按第 2 章工作流收集官方图片，生成 `images.json`。
3. **设计**：按第 3 章读知识 → 定概念 → 选方向 → 规划页面 → 基于 `templates/brochure.html` 改写。
4. **交付**：浏览器逐页渲染目检 → `node scripts/check.mjs` → 打印 PDF → 需要时转 PPTX。

## 2. 图片工作流（官方优先）

Skill 不联网抓图，而是生成搜图指令，你用宿主浏览器工具下载：

```bash
node scripts/image-workflow.mjs analyze     --product product.json      # 需要哪些图
node scripts/image-workflow.mjs source-plan --product product.json      # 官方公众号 → 官网 → 授权图库
node scripts/image-workflow.mjs manifest    --download-dir ./downloads --output images.json
```

- 图片数量不限，但每页最多一张主图，**不强制每页有图**（design-system §5.0）。
- `manifest` 草稿默认 `status: preview`；交付前人工把合格图标记 `approved` 并设 `sourceType`（`official_wechat`/`official_web`/`licensed` 可交付，其余仅限样稿）。
- 质量与合规细则：`references/image-policy.md`。

## 3. 设计流程（核心）

> 模板只保证技术机制；**设计判断由你做出**。

### 3.1 读设计知识

- `references/design-system.md` — 设计大脑：原则/默认/红线三层（§0 必读）
- `references/style-directions.md` — 6 个风格方向与选择框架

### 3.2 定概念 → 选方向 → 定 Token

1. **设计概念**（最重要）：一句话写下"读者合上手册时感觉到什么"。之后每个选择都拿它裁决——只执行规则、没有概念的手册，就是"全都类似的风格"的根因。
2. **风格方向由读者决定，不由产品决定**：按 style-directions 的三问框架（读者 → 目的 → 产品微调）。同一产品给企业版和给青少年家长版，风格必须不同。拿不准用 editorial。
3. 推导四色槽 + 字体配对，写入 HTML 顶部 CSS 变量（`--bg/--ink/--accent/--overlay/--font-title/--font-body/--margin`）。品牌给了主色就压暗降饱和推导 `--accent`。

### 3.3 规划叙事页

按 design-system §7：先做单产品/多产品目录的形态判断，再做**编辑取舍**（§7.0：砍、并、排序），最后映射到页面。信息量不够就少做页数，不注水。

### 3.4 写 HTML

复制 `templates/brochure.html` 逐页改写（机制见文件头注释）：

- 每页一个 `<section class="page">`；图片一律 `object-fit: cover` + `object-position` 保焦点；文字压图必配渐变遮罩。
- 保留模板的语义 class（`page-cover`/`page-split`/`page-bleed`/`page-timeline`/`page-specs`/`page-closing`）——它们是 PPTX 转换锚点；自创新版式仅进 PDF。
- 缺图时：封面/出血页用 overlay 纯色 + 大字标题，分栏页改纯文字版式，并在交付说明中注明。

## 4. 渲染目检与导出

### 4.1 渲染目检（必做）

浏览器打开 `brochure.html` 逐页截图，对照 design-system §8 逐项过：红线（重叠/变形/可读性/事实/合规）+ 设计自检（构图多样性、图片必要性、裁切焦点、字体加载、叙事节奏）。发现问题改 HTML 重渲，直到通过。**没有目检过的手册不算完成。**

### 4.2 安全检查（交付前必跑）

```bash
node scripts/check.mjs --html brochure.html --product product.json --images images.json
```

检查内部字段泄露、广告法敏感词（WARNING 级）、遗留 `【待确认】`、图片来源合规。有 ERROR 不得交付。

### 4.3 导出

- **PDF**：浏览器打印——A4、纵向、边距"无"、勾选"背景图形"。模板已内置 `@page` 与打印色彩修正。
- **PPTX**（可选）：`pnpm install && node scripts/html-to-pptx.mjs --html brochure.html --output <产品名>.pptx`，转换后抽查 2–3 页。

## 5. 交付说明

输出目录写一份 `delivery-notes.md`：设计概念、所选方向与色板、页数计划、图片来源清单（official/preview 各几张）、`【待确认】` 汇总、目检结论，随 PDF 一并交付。

## 6. 故障排除

| 问题 | 处理 |
|---|---|
| PDF 颜色/背景丢失 | 打印勾选"背景图形"（模板已设 `print-color-adjust: exact`） |
| 页间白缝 / 页数翻倍 | 打印边距设"无"；打印用 `margin:0` 规则必须在屏幕 `.page` 规则**之后**（CSS 顺序） |
| 衬线标题变默认黑体 | 系统缺 Noto Serif SC，接受回退或装思源宋体 |
| PPTX 某页丢失 | 该页是自定义版式（无锚点 class），改用模板 class 或接受 PDF-only |
| 送印刷厂 | 装订边/CMYK/纸张见 `references/platform-notes.md` |

## 7. 安全红线

1. 不确定的事实写 `【待确认】`，不编造。
2. 内部字段（成本/渠道/结算/利润/supplier/margin…）必须剥离，不出现在任何页面。
3. 交付稿只用 `approved` 且官方/授权来源图片；禁止 AI 生成图冒充真实场景。
4. 文案禁止保证性承诺与绝对化用语（广告法，见 fact-policy.md）。
5. 人物正脸需授权；未成年人照片优先背影/侧脸/远景（见 image-policy.md）。
6. 价格、预约、审批等可变动事项注明"以最终确认/现场安排为准"。

## 参考文档

- `references/design-system.md` — 设计系统知识库（先读）
- `references/style-directions.md` — 6 个风格方向
- `references/fact-policy.md` / `image-policy.md` / `platform-notes.md`
- `templates/brochure.html` — A4 技术机制参考模板
