# product-brochure-designer

让任意 AI Agent 都能做出高级、精美、杂志级的 A4 竖版产品手册。

一个跨 Agent 可移植的 Skill：输入结构化产品资料 + 本地图片，Agent 依据内置的**国际顶尖设计知识库**做出设计判断，手写 HTML 母版，浏览器渲染目检后导出 PDF（可选 PPTX）。适用于产品宣传册、销售手册、研学手册、项目目录、客户介绍等多页文档场景。可在 Codex、Claude Code、WorkBuddy 或任何 Agent 环境中使用。

## v2：知识驱动，不再硬编码

v1 用代码硬编码版式引擎，真实使用中暴露出图文重叠、廉价感等问题。v2 改为 **superpowers 式的知识驱动**：

- **设计是知识，不是代码**：网格系统、字体排印、色彩纪律、留白比例、图像处理、叙事弧——蒸馏自瑞士国际主义（Müller-Brockmann）、Apple/Dieter Rams、原研哉/MUJI 与 2025 行业趋势，存放在 `references/design-system.md`，由 Agent 阅读后做出判断
- **5 个风格方向**（editorial / swiss / muji / dark-bleed / heritage）：`references/style-directions.md`
- **HTML 母版 → PDF** 为主线：浏览器打印即得高保真成品，**零 npm 依赖**
- **PPTX 保留为可选线**：同一 HTML 经语义锚点转换为可编辑 PPTX（pptxgenjs 为可选依赖）
- 模板只演示技术机制（A4 页块、CSS 变量、cover 填充、打印样式），不硬编码版式

## 特性

- **图文永不重叠**：grid/flex 分区 + 渐变遮罩，结构上杜绝 v1 的文字压图不可读问题
- **照片不变形**：所有图片 `object-fit: cover` 等比裁切
- **官方图片优先**：三阶段图片工作流，指引 Agent 优先从官方公众号、官网收集素材
- **事实安全**：内部价格/成本/渠道关键词检查；缺失事实显示 `【待确认】`，绝不编造
- **轻量可移植**：核心 = Markdown 知识库 + 1 个 HTML 模板 + 3 个零依赖 Node 脚本

## 快速开始

```
1. 阅读 SKILL.md（Agent 执行手册）
2. 准备 product.json + images.json（图片工作流可生成搜图计划）
3. 基于 templates/brochure.html 改写每一页
4. 浏览器渲染逐页目检 → node scripts/check.mjs 安全检查 → 打印导出 PDF
```

结构自检（零依赖）：

```bash
node scripts/smoke.mjs
```

## 命令

```bash
node scripts/image-workflow.mjs analyze     --product product.json        # 分析需要哪些图
node scripts/image-workflow.mjs source-plan --product product.json        # 官方优先搜图计划
node scripts/image-workflow.mjs manifest    --download-dir ./downloads --output images.json
node scripts/check.mjs --html brochure.html --product product.json --images images.json   # 交付前安全检查
pnpm install && node scripts/html-to-pptx.mjs --html brochure.html --output out.pptx      # 可选 PPTX
```

## 项目结构

```
product-brochure-designer/
├── SKILL.md                  # Agent 执行手册（先读这个）
├── package.json
├── agents/openai.yaml        # Agent 接口定义
├── references/
│   ├── design-system.md      # 设计系统知识库（网格/字体/色彩/留白/图像/叙事/反模式）
│   ├── style-directions.md   # 5 个风格方向
│   ├── fact-policy.md        # 事实与资料缺口策略
│   ├── image-policy.md       # 图片来源、审核与禁止项
│   └── platform-notes.md     # 平台注意事项
├── templates/
│   └── brochure.html         # A4 技术机制参考模板（含 PPTX 语义锚点）
├── schemas/                  # 输入 JSON Schema
├── scripts/
│   ├── image-workflow.mjs    # 图片工作流（零依赖）
│   ├── check.mjs             # 交付前安全检查（零依赖）
│   ├── html-to-pptx.mjs      # HTML → PPTX（可选依赖 pptxgenjs）
│   ├── smoke.mjs             # 结构自检
│   └── lib/utils.mjs
└── examples/                 # 示例产品输入
```

## 环境要求

- Node.js ≥ 20（仅脚本需要；HTML→PDF 主线不依赖 Node）
- 宿主环境的浏览器工具（渲染目检 + 打印 PDF）
- 可选：pptxgenjs（PPTX 转换）、yaml（YAML 输入）

## License

[MIT](LICENSE)
