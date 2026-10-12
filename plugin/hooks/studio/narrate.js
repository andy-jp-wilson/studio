// Studio: what Claude is doing, in plain words.
// describe(e) turns a tool.call event into { label, kind }, where label reads
// as the end of "Claude is …" and the working line ("Editing styles.css"),
// and kind feeds the panel's "Did you know?" note. Returns null for steps
// that aren't worth narrating (Claude's own step list, for example).

const base = p => String(p || '').split('/').filter(Boolean).pop() || 'a file'

function describeBash(cmd) {
  const c = String(cmd || '').trim()
  const has = re => re.test(c)
  if (has(/^studio-snapshot\b/)) return { label: 'Making a snapshot', kind: 'snapshot' }
  if (has(/^studio-changelog\b/)) return { label: 'Gathering your save points', kind: 'handover' }
  if (has(/^studio-capture\b/)) return { label: 'Taking a picture of the screen', kind: 'preview' }
  if (has(/^studio-pack\b/)) return { label: 'Building the developer pack', kind: 'handover' }
  if (has(/\bgit\s+commit\b/)) return { label: 'Making a save point', kind: 'save' }
  if (has(/\bgit\s+(switch|checkout)\b/)) return { label: 'Switching exploration', kind: 'exploration' }
  if (has(/\bgit\s+restore\b/)) return { label: 'Going back to an earlier version', kind: 'snapshot' }
  if (has(/\bgit\s+push\b/)) return { label: 'Sharing your exploration online', kind: 'handoff' }
  if (has(/\bgh\s+pr\b/)) return { label: 'Opening a handoff for review', kind: 'handoff' }
  if (has(/\bgit\s+(status|log|diff|branch|show|for-each-ref|rev-parse)\b/)) return { label: 'Checking your save points', kind: 'save' }
  if (has(/\b(npm|pnpm|yarn)\s+(install|i|add)\b/)) return { label: 'Downloading packages', kind: 'packages' }
  if (has(/http\.server|\b(npm|pnpm|yarn)\s+(run\s+)?(dev|start)\b|\bvite\b/)) return { label: 'Starting your private preview', kind: 'preview' }
  if (has(/^(ls|find|grep|rg|cat|head|tail|wc)\b/)) return { label: 'Looking through files', kind: 'files' }
  if (has(/\blsof\b|\bcurl\b/)) return { label: 'Checking the preview', kind: 'preview' }
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
  if (/figma/i.test(t)) return { label: 'Working in Figma', kind: 'figma' }
  if (t === 'TodoWrite' || t === 'ToolSearch') return null
  if (t.startsWith('mcp__')) return { label: 'Using a connected app', kind: 'app' }
  return { label: 'Working', kind: 'step' }
}

// A short note for "Did you know?", linked to what just happened.
const NOTES = {
  save: 'Developers call a save point a “commit”.',
  exploration: 'Developers call an exploration a “branch”.',
  preview: 'Your private preview is what developers call “localhost”.',
  handoff: 'A handoff for review is what developers call a “pull request”.',
  handover: 'A handover stays on your computer; only the Figma page leaves it.',
  snapshot: 'Studio keeps a hidden snapshot before every change, so you can always go back.',
  packages: 'Packages (developers say “dependencies”) are ready-made code your project borrows.',
  memory: 'Claude’s working memory is what developers call the “context window”.',
}
export function noteFor(kind) { return NOTES[kind] || null }
