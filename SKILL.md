---
name: ccb-diff-viewer
description: |
  Rich diff viewer with side-by-side view, syntax highlighting, and file tree.
  Use when: reviewing code changes, comparing files, or understanding diffs.
  Triggers: "show diff", "compare files", "side-by-side diff",
  "git diff", "file comparison".
---

# Diff Viewer

Rich diff visualization.

## Usage

```bash
# Compare two files
node diff.mjs file1.txt file2.txt

# Git diff (with color)
node diff.mjs --git /path/to/repo

# Side-by-side view
node diff.mjs --side-by-side old.js new.js

# Show changed files summary
node summary.mjs --git /path/to/repo
```

## Output Formats

- **Unified**: `diff -u` style
- **Side-by-side**: Two columns
- **HTML**: For embedding in docs
- **JSON**: Structured diff for tools

## Features

- Syntax highlighting
- File tree for multi-file diffs
- Line-by-line annotations
- Change statistics
- Export to HTML/JSON
