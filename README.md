# product-brochure-designer

让任意 AI Agent 都能产出高级、精美、可编辑的 A4 竖版产品手册（PPTX）。

一个跨 Agent 可移植的 Skill：输入结构化产品资料 + 本地图片，输出杂志级排版的产品手册。适用于产品宣传册、销售手册、研学手册、项目目录、客户介绍等多页文档场景。可在 Codex、Claude Code、WorkBuddy 或任何有 Node.js 的 Agent 环境中运行。

## 特性

- **杂志级版式引擎**：6 种版式模式（全出血封面 / 左右分栏 / 全出血故事页 / 序号列表 / 时间轴），按页面类型自动路由，相邻页自动避免重复轮廓
- **6 套视觉预设 × 2 个变体**：editorial / technology / industrial / heritage / ecology / history，每套含 light-minimal 与 dark-bleed 变体，按产品名稳定选择
- **照片不变形**：所有图片以 cover 模式等比居中裁剪填充，杜绝拉伸
- **官方图片优先**：内置三阶段图片工作流，优先指引从官方公众号、官网收集素材
- **事实安全**：内部价格/成本/渠道字段自动剥离；缺失事实显示为 `【待确认】`，绝不编造
- **交付质量门禁**：sample 模式容忍 preview 图，delivery 模式拒绝未授权图片并生成质量报告
- **轻量可移植**：核心源码 < 100KB，仅依赖 pptxgenjs + yaml，无平台特定二进制；PDF 转换委托宿主 Agent 的 Office/PDF 工具链

## 快速开始

```bash
cd product-brochure-designer
pnpm install

# 结构自检
pnpm smoke

# 用内置示例跑一遍（无图占位示例）
pnpm sample
```

生成的 PPTX 位于 `examples/sustech-study-tour/output/<产品名>/`，同时产出 `reports/quality.json`（质量报告）、`reports/information-gaps.md`（事实缺口）、`data/layout-bounds.json`（每页版式记录）。

## 输入

### product.json（必填）

```json
{
  "name": "产品名称",
  "subtitle": "一句话副标题",
  "category": "university",
  "description": "产品描述，只写已确认的事实。",
  "benefits": [{ "title": "亮点", "description": "说明" }],
  "modules": [{ "title": "模块", "description": "说明" }],
  "itinerary": [{ "time": "09:00", "title": "环节", "description": "说明" }],
  "outcomes": ["收获一", "收获二"],
  "specifications": { "时长": "0.5天", "人数": "30人" },
  "preset": "editorial",
  "variant": "dark-bleed",
  "brand": {
    "name": "品牌名（可留空）",
    "contact": "联系方式",
    "disclaimer": "免责声明",
    "colors": { "accent": "276EF1" }
  }
}
```

- `preset` / `variant` 可省略，系统按 category 自动路由、按产品名哈希选变体
- `brand.colors` 只能覆盖 `background` / `ink` / `accent` / overlay 四个色槽
- 字段名匹配 `成本|渠道|结算|margin|cost|internal` 等的内容会被自动剥离

### images.json（可选，但强烈建议）

```json
{
  "images": [
    {
      "id": "img-001",
      "path": "images/cover.jpg",
      "role": "cover",
      "status": "approved",
      "sourceType": "official_wechat"
    }
  ]
}
```

- `role`：`cover` / `venue` / `detail` / `activity`
- `status`：`approved`（可交付）/ `preview`（仅样稿）
- `sourceType`：`official_wechat` / `official_web` / `licensed` 可用于 delivery；`preview` / `web` / `ai_generated` 仅限 sample

## 图片工作流（官方优先）

Skill 不联网抓图，而是为你（Agent）生成搜图指令，由你用自己环境的浏览器/搜索工具完成下载：

```bash
# 1. 分析产品内容，输出需要哪些图、什么质量标准
node scripts/image-workflow.mjs analyze --product product.json

# 2. 生成搜图计划：官方公众号 → 官网 → 授权图库，含质量门槛
node scripts/image-workflow.mjs source-plan --product product.json

# 3. 下载完成后扫描目录，生成 images.json 草稿
node scripts/image-workflow.mjs manifest --download-dir ./downloads --output images.json
```

图片数量不设上限，由产品内容丰富度动态决定。质量门槛：无水印、无大文字、封面 ≥2400px 宽、低饱和、真实场景（禁止 AI 生成图冒充真实场地/活动）。

## 命令

```bash
pnpm validate  -- --input product.json --images images.json          # 校验输入，输出页数计划
pnpm generate  -- --input product.json --images images.json --mode sample    # 样稿（容忍 preview 图）
pnpm generate  -- --input product.json --images images.json --mode delivery  # 交付（严格门禁）
pnpm sample                                                           # 跑内置示例
pnpm promote   -- --project output/<产品名>                            # 质量通过后确认交付
pnpm smoke                                                           # 结构自检
```

## 视觉系统

| 预设 | 适用 | 气质 |
|---|---|---|
| `editorial` | 高校、文化、综合 | 安静、建筑感、大留白 |
| `technology` | AI、科技、硬件 | 冷调、精密、低饱和 |
| `industrial` | 制造、企业 | 粗粝、结构感、金属色 |
| `heritage` | 工艺、非遗 | 温润、纸感、大地色 |
| `ecology` | 自然、环保 | 生机、柔和绿 |
| `history` | 历史、文博 | 沉稳、深棕米白 |

排版纪律由代码强制：每页最多 1 张主图、4 级字体层级、4 个主题色槽、统一深色遮罩保证文字可读。正文保持为可编辑 PPTX 文本对象，方便客户改字。

## PDF 导出

PPTX 是唯一核心交付物。PDF 转换请优先使用宿主 Agent 环境的 Office/PDF 工具（文档技能、WPS、PowerPoint 另存等）。内置 `scripts/export-pdf.mjs` 会尝试调用 LibreOffice/soffice 作为兜底，找不到时只记录 `PDF_EXPORT_UNAVAILABLE` 警告，不影响交付——**不需要为本 Skill 专门安装 LibreOffice**。

## 项目结构

```
product-brochure-designer/
├── SKILL.md                  # Agent 执行手册（先读这个）
├── package.json
├── agents/openai.yaml        # Agent 接口定义
├── schemas/                  # 输入 JSON Schema
├── scripts/
│   ├── product-brochure.mjs  # CLI 入口（validate/generate/sample/promote）
│   ├── image-workflow.mjs    # 图片工作流（analyze/source-plan/manifest）
│   ├── generate-pptx.mjs     # PPTX 生成
│   ├── export-pdf.mjs        # PDF 兜底导出
│   ├── quality.mjs           # 质量报告
│   └── lib/
│       ├── compositions.mjs  # 6 种版式模式
│       ├── pages.mjs         # 版式选择器
│       ├── layout.mjs        # 排版原语
│       ├── theme.mjs         # 主题与变体
│       ├── planning.mjs      # 页数规划与预设路由
│       ├── normalize.mjs     # 事实清洗
│       └── images.mjs        # 图片校验
├── assets/presets/           # 6 套视觉预设
├── references/               # 设计约束文档
└── examples/                 # 占位示例 + 完整示例
```

## 环境要求

- Node.js ≥ 20
- pnpm（推荐）或 npm
- 可选：LibreOffice/soffice（仅 PDF 兜底导出用）

## License

[MIT](LICENSE)
