---
name: ccb-diff-viewer
description: |
  Rich diff viewer with side-by-side view / 富文本差异对比工具
  Syntax highlighting, file tree, unified/side-by-side view.
  Use when: reviewing code changes, comparing files, or understanding diffs.
  用途：代码审查、文件对比、理解变更。含语法高亮、文件树、统一/并排视图。
  触发词 / Triggers: "show diff", "compare files", "side-by-side diff", "文件对比", "代码审查"
---

# Diff Viewer / 差异对比工具

Rich diff visualization with multiple output formats.
多格式差异可视化工具。

## 功能 / Features

- **统一视图 Unified** - 标准 diff -u 格式
- **并排视图 Side-by-side** - 双列对比，清晰直观
- **HTML 输出** - 可嵌入文档 / Embeddable in docs
- **JSON 输出** - 供工具使用的结构化数据 / Structured data for tools
- **语法高亮** - 代码着色 / Syntax highlighting
- **文件树** - 多文件差异汇总 / Multi-file diff summary
- **变更统计** - 行数增减统计 / Change statistics

## 使用方法 / Usage

```bash
# 对比两个文件 / Compare two files
node diff.mjs file1.txt file2.txt

# Git diff（含颜色）/ Git diff with color
node diff.mjs --git /path/to/repo

# 并排视图 / Side-by-side view
node diff.mjs --side-by-side old.js new.js

# 显示变更文件列表 / Show changed files summary
node summary.mjs --git /path/to/repo
```

## 输出格式 / Output Formats

| 格式 | 说明 |
|------|------|
| `unified` | 标准 diff -u 格式 / Standard diff format |
| `side-by-side` | 双列并排 / Two columns |
| `html` | HTML 格式，可嵌入 / Embeddable HTML |
| `json` | 结构化 JSON / Structured JSON |
