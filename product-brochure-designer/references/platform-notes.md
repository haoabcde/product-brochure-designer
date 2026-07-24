# Platform notes

## Runtime

- Node.js 20 or later（仅运行图片工作流与检查脚本时需要；主线 HTML→PDF 不依赖 Node）。
- 主线（HTML 母版 → 浏览器打印 PDF）：**零 npm 依赖**。
- 可选依赖（`pnpm install` 后可用）：
  - `pptxgenjs` — `scripts/html-to-pptx.mjs` 把 HTML 转为可编辑 PPTX。
  - `yaml` — 输入文件使用 YAML 格式时需要（JSON 输入不需要）。

## Agent hosts

Skill 在 Codex、Claude Code、WorkBuddy 或任意 Agent 环境中的用法一致：

1. 按 `SKILL.md` 准备 product.json / images.json；
2. 基于 `templates/brochure.html` 手写 brochure.html；
3. 用宿主环境的浏览器工具渲染目检、打印导出 PDF；
4. （可选）`pnpm install && node scripts/html-to-pptx.mjs --html brochure.html --output out.pptx`。

## Scripts

- `scripts/image-workflow.mjs` — 图片工作流 `analyze` / `source-plan` / `manifest`（零依赖）。
- `scripts/check.mjs` — 交付前安全检查：内部字段泄露、`【待确认】`、图片来源合规（零依赖）。
- `scripts/html-to-pptx.mjs` — HTML → PPTX 转换（需要 pptxgenjs）。
- `scripts/smoke.mjs` — Skill 结构自检（零依赖）。

## PDF export

PDF 由宿主浏览器工具从 HTML 打印得到（Chromium print-to-PDF）：纸张 A4、纵向、边距"无"、勾选"背景图形"。模板已内置 `@page { size: A4; margin: 0 }` 与 `print-color-adjust: exact`。不依赖 LibreOffice，也不需要为本 Skill 安装任何办公软件。

## Fonts

模板字体栈：标题 `"Noto Serif SC", "Source Han Serif SC", serif`；正文 `"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`。这些栈覆盖了 macOS / Windows / Linux 的常见中文字体；缺字体时浏览器按栈回退，排版设计已容忍合理回退。追求最佳效果可安装思源宋体/思源黑体。

## Print production（送印刷厂时）

办公室打印无需额外处理；送印刷厂装订时注意：

- **装订边**：骑马钉/胶装会吃掉内侧 3–6mm。偶数页左侧、奇数页右侧的安全边距额外 +5mm（调整 `--margin` 或对 `.page:nth-child(even/odd)` 单独设置）。
- **跨页**：本模板每页独立（无跨页设计元素），天然安全；不要自行添加跨页图片或文字。
- **色彩**：浏览器输出 RGB；印刷厂要求 CMYK 时，让对方做色彩转换，或在打样时重点核对 accent 与 overlay 两个深色（RGB 藏青转 CMYK 容易偏灰）。
- **纸张建议**：封面 200–250g 哑粉/特种纸，内页 128–157g 哑粉；哑光纸比光面铜版纸更显高级。
