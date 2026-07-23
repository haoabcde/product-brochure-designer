# Platform notes

The runtime is Node.js 20+ and PptxGenJS. In Codex, Claude Code, and WorkBuddy, run the commands from this Skill folder. Use the host agent's browser/search capability only to collect images into local files and update `images.json`; the generator intentionally does not scrape web search results.

PDF export uses `libreoffice` or `soffice` when available. If neither exists, the PPTX remains valid and the report records `PDF_EXPORT_UNAVAILABLE` instead of inventing a PDF result.
