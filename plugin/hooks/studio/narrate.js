// Studio: what Claude is doing, in plain words.
// describe(e) turns a tool.call event into { label, kind }, where label reads
// as the working line ("Editing styles.css"). Returns null for steps that
// aren't worth narrating (Claude's own step list, for example).

import { friendlyFigma } from './figma.js'

const base = p => String(p || '').split('/').filter(Boolean).pop() || 'a file'

function describeBash(cmd) {
  const c = String(cmd || '').trim()
  const has = re => re.test(c)
  if (has(/^studio-snapshot\b/)) return { label: 'Making a snapshot', kind: 'snapshot' }
  if (has(/^studio-(project|team)\b/)) return { label: 'Checking your setup', kind: 'setup' }
  if (has(/\bgit\s+restore\b/)) return { label: 'Going back to an earlier version', kind: 'snapshot' }
  if (has(/\bgit\s+push\b|\bgh\s+pr\b/)) return { label: 'Uploading', kind: 'upload' }
  if (has(/\b(npm|pnpm|yarn)\s+(install|i|add)\b/)) return { label: 'Downloading packages', kind: 'packages' }
  if (has(/^(ls|find|grep|rg|cat|head|tail|wc)\b/)) return { label: 'Looking through files', kind: 'files' }
  return { label: 'Running a step', kind: 'step' }
}

export function describe(e) {
  const t = String(e.tool || '')
  if (t === 'Read') return { label: 'Reading ' + base(e.file_path), kind: 'files' }
  if (t === 'Edit' || t === 'NotebookEdit') return { label: 'Editing ' + base(e.file_path || e.notebook_path), kind: 'edit' }
  if (t === 'Write') return { label: 'Writing ' + base(e.file_path), kind: 'edit' }
  if (t === 'Grep' || t === 'Glob') return { label: 'Looking through files', kind: 'files' }
  if (t === 'Bash') return describeBash(e.command)
  if (t === 'WebFetch') return { label: 'Reading a web page', kind: 'web' }
  if (t === 'WebSearch') return { label: 'Searching the web', kind: 'web' }
  if (t === 'AskUserQuestion') return { label: 'Waiting for your answer', kind: 'ask' }
  if (t === 'Agent' || t === 'Task') return { label: 'Asking a helper to look into something', kind: 'helper' }
  if (t === 'Skill') return { label: 'Following Studio’s steps', kind: 'step' }
  if (/figma/i.test(t)) return { label: (friendlyFigma(t, e) || { label: 'Working in Figma' }).label, kind: 'figma' }
  if (t === 'TodoWrite' || t === 'ToolSearch' || t === 'mcp__studio__story') return null
  if (t.startsWith('mcp__')) return { label: 'Using a connected app', kind: 'app' }
  return { label: 'Working', kind: 'step' }
}
