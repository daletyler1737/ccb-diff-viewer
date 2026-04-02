/**
 * Diff Viewer - Rich diff with side-by-side and unified modes
 */
import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'

function diffLines(oldStr, newStr) {
  const oldLines = oldStr.split('\n')
  const newLines = newStr.split('\n')
  const result = []

  // Simple LCS-based diff
  const lcs = longestCommonSubsequence(oldLines, newLines)
  let oi = 0, ni = 0, li = 0

  while (oi < oldLines.length || ni < newLines.length) {
    if (li < lcs.length && oi < oldLines.length && ni < newLines.length &&
        oldLines[oi] === lcs[li] && newLines[ni] === lcs[li]) {
      result.push({ type: 'same', old: oi + 1, new: ni + 1, content: oldLines[oi] })
      oi++, ni++, li++
    } else {
      if (oi < oldLines.length && (li >= lcs.length || oldLines[oi] !== lcs[li])) {
        result.push({ type: 'deleted', old: oi + 1, content: oldLines[oi] })
        oi++
      }
      if (ni < newLines.length && (li >= lcs.length || newLines[ni] !== lcs[li])) {
        result.push({ type: 'added', new: ni + 1, content: newLines[ni] })
        ni++
      }
    }
  }

  return result
}

function longestCommonSubsequence(a, b) {
  const m = a.length, n = b.length
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i-1] === b[j-1]) dp[i][j] = dp[i-1][j-1] + 1
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
    }
  }
  const lcs = []
  let i = m, j = n
  while (i > 0 && j > 0) {
    if (a[i-1] === b[j-1]) { lcs.unshift(a[i-1]); i--; j-- }
    else if (dp[i-1][j] > dp[i][j-1]) i--
    else j--
  }
  return lcs
}

function renderUnified(diff) {
  const lines = []
  for (const d of diff) {
    if (d.type === 'same') {
      lines.push(`  ${d.content}`)
    } else if (d.type === 'deleted') {
      lines.push(`\x1b[31m-${d.content}\x1b[0m`)
    } else if (d.type === 'added') {
      lines.push(`\x1b[32m+${d.content}\x1b[0m`)
    }
  }
  return lines.join('\n')
}

function renderSideBySide(diff, width = 100) {
  const half = Math.floor((width - 4) / 2)
  const lines = []
  let left = [], right = []

  for (const d of diff) {
    if (d.type === 'same') {
      left.push(`${String(d.old).padStart(4)} | ${d.content.slice(0, half - 7)}`)
      right.push(`${String(d.new).padStart(4)} | ${d.content.slice(0, half - 7)}`)
    } else if (d.type === 'deleted') {
      left.push(`\x1b[31m${String(d.old).padStart(4)} - ${d.content.slice(0, half - 7)}\x1b[0m`)
      right.push(String('').padStart(half + 8))
    } else if (d.type === 'added') {
      left.push(String('').padStart(half + 8))
      right.push(`\x1b[32m${String(d.new).padStart(4)} + ${d.content.slice(0, half - 7)}\x1b[0m`)
    }
  }

  // Pair up
  const max = Math.max(left.length, right.length)
  for (let i = 0; i < max; i++) {
    const l = (left[i] || '').padEnd(half + 8)
    const r = right[i] || ''
    lines.push(`${l}  ${r}`)
  }

  return lines.join('\n')
}

function diffFiles(file1, file2, options = {}) {
  const { mode = 'unified', context = 3 } = options

  if (!existsSync(file1) || !existsSync(file2)) {
    // Fall back to git diff
    try {
      const gitDiff = execSync(`git diff --no-color "${file1}" "${file2}" 2>/dev/null || diff -u "${file1}" "${file2}"`, { encoding: 'utf-8' })
      return gitDiff
    } catch {
      return `Cannot diff: one or both files not found`
    }
  }

  const oldStr = readFileSync(file1, 'utf-8')
  const newStr = readFileSync(file2, 'utf-8')

  if (mode === 'side-by-side') {
    return renderSideBySide(diffLines(oldStr, newStr))
  } else {
    return renderUnified(diffLines(oldStr, newStr))
  }
}

// CLI
if (import.meta.url.endsWith(process.argv[1]?.replace(/^file:\/\//, ''))) {
  const args = process.argv.slice(2)
  const mode = args.includes('--side-by-side') ? 'side-by-side' : 'unified'
  const files = args.filter(a => !a.startsWith('--'))

  if (files.length < 2) {
    console.error('Usage: node diff.mjs [--side-by-side] <file1> <file2>')
    process.exit(1)
  }

  const result = diffFiles(files[0], files[1], { mode })
  console.log(result)
}
