// Studio mod: the band above the prompt and the Studio panel (D5 Mist).
// The band shows the journey step; the panel follows the story. Claude fills
// both in with the story tool. Works in the terminal and the Desktop Code tab;
// nothing draws in VS Code.
import { describe } from './studio/narrate.js'
import { drawBand } from './studio/band.js'
import { drawPane } from './studio/pane.js'

const PANE = 'studio'

// What Claude is doing in this request (for Stop and the working line).
let live = { working: false, turnId: '', current: null }
// The story card for this session: the story, the journey step, what needs
// the designer, and the panel's sections. Claude fills it in with the story
// tool (mcp__studio__story); Claude Code keeps it ($.store), so no project
// folder is needed.
let storyCard = null
let storyKey = ''
const STATES = ['done', 'now', 'todo', 'need', 'muted', 'none', 'plain', 'strong']
const STORY_TOOL = {
  name: 'story',
  description: 'Update the Studio story card that the designer sees in the Studio band and panel. Call it when a Jira story is pasted, and whenever the journey step, its status, what needs the designer, or the panel sections change. Steps: 1 pick up the story, 2 play the brief back, 3 choose where and how, 4 say first then wait for a yes, 5 build in Figma, 6 review and change, 7 check the work, 8 make interactions clear, 9 ready to hand over. Use short, plain wording and no em dashes. Fields you leave out stay as they were; send the whole list of sections whenever you change any. Set clear to true to start a new story.',
  inputSchema: {
    type: 'object',
    properties: {
      clear: { type: 'boolean', description: 'Start over with an empty card (a new story).' },
      story: { type: 'object', description: 'The Jira story.', properties: {
        key: { type: 'string', description: 'The Jira key, e.g. SIGN-142.' },
        title: { type: 'string', description: 'The story title, short.' },
        hasDesignDoc: { type: 'boolean', description: 'True if a Confluence technical design document was given.' },
      } },
      step: { type: 'integer', minimum: 1, maximum: 9, description: 'The current journey step.' },
      status: { type: 'string', description: 'How the step is going, a few words, e.g. "building screen 3 of 6".' },
      needs: { type: 'string', description: 'What is waiting for the designer, a few words, e.g. "2 questions for you". Empty string when nothing is.' },
      sections: { type: 'array', description: 'The panel sections for this step, in order (do not repeat the story itself).', items: { type: 'object', properties: {
        title: { type: 'string' },
        needs: { type: 'boolean', description: 'True if this section is waiting for the designer (shown first, in coral text).' },
        items: { type: 'array', items: { type: 'object', properties: {
          text: { type: 'string' },
          state: { type: 'string', enum: STATES, description: 'done ✓, now ●, todo ○, need (waiting for the designer), muted, none (—, not applicable), plain, strong.' },
        }, required: ['text'] } },
      }, required: ['title'] } },
    },
  },
}

function applyStory(card, e) {
  const next = e.clear ? {} : { ...(card || {}) }
  if (e.story && typeof e.story === 'object') next.story = { ...(next.story || {}), ...e.story }
  if (e.step != null) next.step = Math.min(9, Math.max(1, Math.round(Number(e.step)) || 1))
  if (typeof e.status === 'string') next.status = e.status.slice(0, 80)
  if (typeof e.needs === 'string') next.needs = e.needs.slice(0, 80)
  if (Array.isArray(e.sections)) next.sections = e.sections.slice(0, 12).map(sec => ({
    title: String(sec?.title || '').slice(0, 60), needs: Boolean(sec?.needs),
    items: (Array.isArray(sec?.items) ? sec.items : []).slice(0, 12).map(it => ({ text: String(it?.text ?? it ?? '').slice(0, 120), state: STATES.includes(it?.state) ? it.state : 'plain' })),
  }))
  return next
}

// The person's own default for where designs are made (bin/studio-prefs):
// 'figma' (results in Figma, code only for a prototype) or 'prototype'.
let prefs = { designs: 'figma' }

async function loadPrefs($) {
  try {
    const r = await $.process.run([$.plugin.root + '/bin/studio-prefs', 'show'], { timeoutMs: 5000 })
    prefs = { designs: /designs: prototype/.test(String(r.stdout || '')) ? 'prototype' : 'figma' }
  } catch {}
}

// The project's Studio notes (.studio/project.json, written by /setup), from
// the folder Claude Code is open in, or the top of its git project.
let notes = { figmaUrl: '', figmaName: '', dsName: '', dsUrl: '', setUp: false }

async function readNotes($) {
  const cwd = String(await $.session.cwd())
  const roots = [cwd]
  try {
    const r = await $.process.run(['git', 'rev-parse', '--show-toplevel'], { timeoutMs: 3000 })
    const top = r.exitCode === 0 ? String(r.stdout || '').trim() : ''
    if (top && top !== cwd) roots.push(top)
  } catch {}
  let n = { figmaUrl: '', figmaName: '', dsName: '', dsUrl: '', setUp: false }
  for (const root of roots) {
    try {
      const p = JSON.parse(await $.fs.read(root + '/.studio/project.json'))
      n = { setUp: true, figmaUrl: p.targetFileUrl || '', figmaName: p.targetFileName || '', dsName: p.designSystemName || '', dsUrl: p.designSystemUrl || '' }
      break
    } catch {}
  }
  notes = n
}

function projectNote() {
  const ds = notes.dsName ? ' Its design system is ' + notes.dsName + (notes.dsUrl ? ' (' + notes.dsUrl + ')' : '') + '; use its components, styles and variables.' : ' No design system is chosen yet.'
  if (prefs.designs === 'prototype') {
    return 'Studio project note: the person has made coded prototypes their default. When they ask to design or build something, build it as a prototype in prototype/ (HTML and CSS), using the design system.' + ds +
      ' Work in Figma only when they ask or it’s needed' + (notes.figmaUrl ? ', in "' + (notes.figmaName || 'the project file') + '" (' + notes.figmaUrl + ')' : '') + '. They can switch back with `studio-prefs designs figma`.'
  }
  if (notes.figmaUrl) {
    return 'Studio project note: design work for this project happens in Figma, in "' + (notes.figmaName || 'the project file') + '" (' + notes.figmaUrl + ').' + ds +
      ' Only make HTML or CSS files if the person asks for a coded prototype.'
  }
  return 'Studio project note: ' + (notes.setUp ? 'no Figma file is chosen for this project yet.' : 'this project hasn’t been set up yet, so no Figma file or design system is chosen.') +
    ' If the person asks for design work, offer /setup (a short chat) or ask for the Figma file’s link. Only make HTML or CSS files if they ask for a coded prototype.' + (notes.dsName ? ds : '')
}

function state() {
  return { ...live, story: storyCard, dsName: notes.dsName, figmaName: notes.figmaName }
}

// Word explanations: on or off, and the words the person already knows
// (bin/studio-words). Claude reads the current choice before every reply.
let words = { explain: true, known: [] }

async function loadWords($) {
  try {
    const r = await $.process.run([$.plugin.root + '/bin/studio-words', 'show'], { timeoutMs: 5000 })
    const out = String(r.stdout || '')
    const explain = !/explain: off/.test(out)
    const known = ((out.match(/known: (.*)/) || [])[1] || '').split(',').map(x => x.trim()).filter(Boolean)
    words = { explain, known }
  } catch {}
}

function wordsNote() {
  if (!words.explain) return 'Studio word explanations are OFF: the person said "don’t show again". Use plain words, and explain only if they ask. If they want explanations back, run `studio-words on`.'
  return 'Studio word explanations are ON: explain technical words and file names every time they come up, as the Studio voice says.' +
    (words.known.length ? ' The person already knows these, so do not explain them: ' + words.known.join(', ') + '.' : '')
}

function actionsFor($) {
  return {
    stop: () => { if (live.turnId) $.turn.abort({ turnId: live.turnId }).catch(() => {}) },
  }
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    try { storyKey = 'story:' + (await $.session.id()); const saved = await $.store.get(storyKey); storyCard = saved && typeof saved === 'object' ? saved : null } catch { storyCard = null }
    try { await $.tool.register(STORY_TOOL) } catch {}
    await readNotes($)
    await loadWords($)
    await loadPrefs($)
    try { await $.ui.open({ id: PANE, title: 'Studio' }) } catch {}
    try { await $.command.register({ name: 'panel', description: 'Open the Studio panel', immediate: true }) } catch {}
    return next(e)
  })

  on('command.run', { command: 'panel' }, async ($) => {
    await $.ui.open({ id: PANE, title: 'Studio', focus: true })
    return {}
  })

  on('turn.start', async ($, e, next) => {
    live = { working: true, turnId: e.turnId, current: null }
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    live = { ...live, working: false, current: null }
    await readNotes($)
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('tool.call', { tool: 'mcp__studio__story' }, async ($, e) => {
    storyCard = applyStory(storyCard, e)
    try { if (storyKey) await $.store.set(storyKey, storyCard) } catch {}
    $.ui.invalidate('ui.render')
    const st = storyCard
    return { result: 'Studio story card updated' + (st.step ? ': step ' + st.step + ' of 9' : '') + (st.needs ? ', waiting for: ' + st.needs : '') + '.' }
  })

  on('tool.call', async ($, e, next) => {
    if (e.tool === 'mcp__studio__story' || e.agentId) return next(e)
    // Claude records choices with studio-words, studio-prefs and studio-project; pick them up straight away.
    if (e.tool === 'Bash' && /^studio-(words|prefs|project)\b/.test(String(e.command || '').trim())) {
      const result = await next(e)
      await loadWords($)
      await loadPrefs($)
      await readNotes($)
      $.ui.invalidate('ui.render')
      return result
    }
    const d = describe(e)
    if (!d) return next(e)
    live = { ...live, current: d }
    $.ui.invalidate('ui.render')
    return next(e)
  }).catch(async ($, e, next) => next(e)) // Studio only narrates: if this hook fails, the step runs as normal

  on('prompt.compose', async ($, e, next) => {
    const r = await next(e)
    return { ...r, sections: [...r.sections, { id: 'studio:words', text: wordsNote(), scope: 'session' }, { id: 'studio:project', text: projectNote(), scope: 'session' }] }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const el = $.ui.resolve(e)
    const band = drawBand(el, { ...state(), surface: e.surface }, actionsFor($), e.props.bodyColumns)
    const rest = await next(e)
    return rest ? el.Box({ key: 'studio-band-wrap', flexDirection: 'column', children: [band, rest] }) : band
  })

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== PANE) return next(e)
    const el = $.ui.resolve(e)
    return drawPane(el, { ...state(), surface: e.surface }, actionsFor($), e.props.bodyColumns)
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (!live.working || !live.current) return next(e)
    return next({ ...e, props: { ...e.props, message: live.current.label } })
  })
}
