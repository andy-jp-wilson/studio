// Studio mod: the band above the prompt and the Studio panel (D5 Mist).
// The band shows the journey step; the panel follows the story. Claude fills
// both in with the story tool. Works in the terminal and the Desktop Code tab;
// nothing draws in VS Code.
import { describe } from './studio/narrate.js'
import { MIST, STAGE_LIST, PROJECT_STATUSES, STAGE_STEP, stageOfStep } from './studio/mist.js'
import { drawBand, hintFor } from './studio/band.js'
import { drawPane } from './studio/pane.js'
import { FIGMA_WRITE, keysIn, designSystemKeys, figmaQuestion, FIGMA_YES, friendlyFigma } from './studio/figma.js'

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
  description: 'Update the Studio story card that the designer sees in the Studio band and panel. Call it when a user story is pasted or a task starts, and whenever the stage, what needs the designer, or the panel sections change. Stages: brief (read the story, play it back, choose where), concepting (wireframes and concepts), visual (full visuals with the design system, and the designer’s changes), review (check against the story, interactions, handover checklist). The project status (Not started, In progress, Feedback, Ready for dev) belongs to the designer: you can’t set it, only suggest a change with suggestStatus, which asks them. Use short, plain wording and no em dashes. Fields you leave out stay as they were; send the whole list of sections whenever you change any. Set clear to true to start a new story.',
  inputSchema: {
    type: 'object',
    properties: {
      clear: { type: 'boolean', description: 'Start over with an empty card (a new story).' },
      story: { type: 'object', description: 'The user story (from Jira).', properties: {
        key: { type: 'string', description: 'The Jira key, e.g. SIGN-142. Leave out for work without a user story.' },
        title: { type: 'string', description: 'The story title, short; for work without a story, a short name for the task, e.g. "Sign-up screen tweaks".' },
        hasDesignDoc: { type: 'boolean', description: 'True if a Confluence technical design document was given.' },
      } },
      stage: { type: 'string', enum: STAGE_LIST.map(s => s.id), description: 'Where the work is: brief, concepting, visual or review.' },
      suggestStatus: { type: 'string', enum: PROJECT_STATUSES, description: 'Suggest a new project status. Studio asks the designer (Yes / Not yet) and tells you the answer; nothing changes without their yes. Use it when they ask for a status change, when they say they’ve shared the design for feedback (Feedback), and when the handover checklist is all done (Ready for dev).' },
      suggestReason: { type: 'string', description: 'One short sentence shown before the question, e.g. "The handover checklist is all ticked."' },
      needs: { type: 'string', description: 'What is waiting for the designer, a few words, e.g. "2 questions for you". Empty string when nothing is.' },
      sections: { type: 'array', description: 'The panel sections for this step, in order (do not repeat the story itself).', items: { type: 'object', properties: {
        title: { type: 'string' },
        needs: { type: 'boolean', description: 'True if this section is waiting for the designer (shown first, outlined in ochre).' },
        ask: { type: 'boolean', description: 'True for questions the designer can answer in the panel: each item gets a text box, and their answers come back to you as a message.' },
        checklist: { type: 'boolean', description: 'True for a checklist, such as the handover checklist (items shown with ☑ for done and ☐ for to do).' },
        items: { type: 'array', items: { type: 'object', properties: {
          text: { type: 'string' },
          state: { type: 'string', enum: STATES, description: 'done ✓, now ●, todo ○, need ! (waiting for the designer, or something that doesn’t match), muted, none (—, not applicable), plain, strong.' },
          sub: { type: 'string', description: 'A short second line in small grey type, e.g. "Note left in Figma beside the screen".' },
          link: { type: 'string', description: 'An https link, shown as "Open ↗": for a screen, the link to its frame in Figma (with node-id); for a note, the link to the note.' },
          linkLabel: { type: 'string', description: 'The link’s word, default "Open", e.g. "Show".' },
          action: { type: 'string', description: 'What the designer is asking for if they press this item’s button, in their words, e.g. "Mock up the presentation for stakeholders in Figma". Sent to you as their message.' },
          actionLabel: { type: 'string', description: 'The button’s word, default "Start".' },
          placeholder: { type: 'string', description: 'For a question: the hint in its answer box, e.g. "Format only, or more?".' },
        }, required: ['text'] } },
      }, required: ['title'] } },
    },
  },
}

function applyStory(card, e) {
  const next = e.clear ? {} : { ...(card || {}) }
  if (e.story && typeof e.story === 'object') next.story = { ...(next.story || {}), ...e.story }
  // The stage (Studio 0.5); an older step number is still understood.
  if (STAGE_STEP[e.stage]) { next.stage = e.stage; next.step = STAGE_STEP[e.stage] }
  else if (e.step != null) { next.step = Math.min(9, Math.max(1, Math.round(Number(e.step)) || 1)); next.stage = stageOfStep(next.step) }
  // The project status is the designer's: Claude can't set it. It starts as In progress once there's work.
  if (!PROJECT_STATUSES.includes(next.projectStatus) && (next.story || next.stage)) next.projectStatus = 'In progress'
  if (typeof e.needs === 'string') next.needs = e.needs.slice(0, 80)
  if (Array.isArray(e.sections)) next.sections = e.sections.slice(0, 12).map(sec => ({
    title: String(sec?.title || '').slice(0, 60), needs: Boolean(sec?.needs), ask: Boolean(sec?.ask), checklist: Boolean(sec?.checklist),
    items: (Array.isArray(sec?.items) ? sec.items : []).slice(0, 12).map(it => ({
      text: String(it?.text ?? it ?? '').slice(0, 120), state: STATES.includes(it?.state) ? it.state : 'plain',
      ...(it?.sub ? { sub: String(it.sub).slice(0, 120) } : {}),
      // Links must be https (the app draws anything else as plain text), with no raw @
      ...(typeof it?.link === 'string' && /^https:\/\/[^\s@]+$/.test(it.link) && it.link.length <= 2048 ? { link: it.link, linkLabel: String(it.linkLabel || 'Open').slice(0, 20) } : {}),
      ...(it?.action ? { action: String(it.action).slice(0, 300), actionLabel: String(it.actionLabel || 'Start').slice(0, 20) } : {}),
      ...(it?.placeholder ? { placeholder: String(it.placeholder).slice(0, 60) } : {}),
    })),
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

// Figma files the designer said yes to in this conversation (Studio's own question).
let figmaYes = new Set()
let sessionId = ''
let version = ''

// Before Claude's first step in a Figma file in a conversation, Studio asks in
// plain words. Design system files are refused without asking. Yes is
// remembered here and passed to hooks/guard-figma.sh, so its "Allow?" prompt
// doesn't appear as well.
async function figmaGate($, e, next) {
  const key = String(e.fileKey || '')
  if (!key || e.agentId) return next(e)
  const ds = designSystemKeys(await $.env.get('STUDIO_DESIGN_SYSTEMS'), notes.dsUrl, notes.dsName)
  if (ds[key]) return { deny: 'Studio never changes a design system file (' + ds[key] + '), so this was stopped and nothing in it changed. Tell the designer in plain words, and offer to write a note for the design system team instead. Read it with get_metadata, get_design_context or search_design_system; work in the project’s own Figma file.' }
  if (figmaYes.has(key)) return next(e)
  const isProject = keysIn(notes.figmaUrl).includes(key)
  let answer = ''
  try { answer = await $.ui.ask(figmaQuestion({ fileName: notes.figmaName, isProject, description: e.description }), [FIGMA_YES, 'No, not now']) } catch { answer = '' }
  if (answer !== FIGMA_YES) return { deny: answer ? 'The designer answered Studio’s question about working in this Figma file with: "' + answer + '". Nothing was changed. Follow what they said.' : 'The designer said no to working in this Figma file (or closed the question). Nothing was changed. Ask what they’d like instead.' }
  figmaYes.add(key)
  try { await $.process.run([$.plugin.root + '/hooks/guard-figma.sh', 'allow', sessionId, key], { timeoutMs: 5000 }) } catch {}
  return next(e)
}

// Answers the designer is typing into the panel's questions, by question.
let answers = {}

function state() {
  return { ...live, story: storyCard, dsName: notes.dsName, figmaName: notes.figmaName, figmaUrl: notes.figmaUrl, answers, version }
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
    // Typing in a question's answer box, or pressing Enter in it: keep it, without
    // redrawing (so typing isn't interrupted). Send answers sends them all.
    setAnswer: (k, v) => { answers = { ...answers, [k]: String(v || '') } },
    // Send answers: they go to Claude as the designer's own message.
    sendAnswers: async questions => {
      const lines = questions.map((q, i) => (i + 1) + '. ' + q.text + ' ' + ((answers[q.key] || '').trim() || '(no answer yet)'))
      if (!questions.some(q => (answers[q.key] || '').trim())) { try { await $.ui.toast('Type an answer first') } catch {} return }
      $.prompt.submit({ text: 'My answers:\n' + lines.join('\n'), asUser: true }).catch(() => {})
      answers = {}
      $.ui.invalidate('ui.render')
    },
    // The starting screen's guide button.
    guide: () => { $.command.run({ command: 'guide' }).catch(() => $.prompt.submit({ text: '/guide', asUser: true }).catch(() => {})) },
    // The designer sets the project status (the panel's dropdown, in S3).
    setStatus: async status => {
      if (!PROJECT_STATUSES.includes(status) || !storyCard) return
      storyCard = { ...storyCard, projectStatus: status }
      try { if (storyKey) await $.store.set(storyKey, storyCard) } catch {}
      $.ui.invalidate('ui.render')
    },
    // A checklist item's button: the designer asks Claude for that next step.
    ask: text => { $.prompt.submit({ text: String(text), asUser: true }).catch(() => {}) },
  }
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    try { sessionId = String(await $.session.id()) } catch {}
    try { version = String(JSON.parse(await $.fs.read($.plugin.root + '/.claude-plugin/plugin.json')).version || '') } catch {}
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
    if (e.clear) answers = {}
    storyCard = applyStory(storyCard, e)
    try { if (storyKey) await $.store.set(storyKey, storyCard) } catch {}
    $.ui.invalidate('ui.render')
    let asked = ''
    // A suggested status change becomes a one-click question for the designer.
    if (PROJECT_STATUSES.includes(e.suggestStatus) && e.suggestStatus !== storyCard.projectStatus) {
      const name = (storyCard.story && (storyCard.story.key || storyCard.story.title)) || 'this project'
      const question = (e.suggestReason ? String(e.suggestReason).trim().slice(0, 160).replace(/\.?$/, '. ') : '') + 'Mark ' + name + ' as ' + e.suggestStatus + '?'
      const yes = 'Yes, mark it ' + e.suggestStatus.toLowerCase()
      let answer = ''
      try { answer = await $.ui.ask(question, [yes, 'Not yet']) } catch { answer = '' }
      if (answer === yes) { storyCard = { ...storyCard, projectStatus: e.suggestStatus }; asked = ' The designer said yes: the project status is now ' + e.suggestStatus + '.' }
      else asked = ' The designer didn’t change the project status' + (answer && answer !== 'Not yet' ? ' and said: "' + answer + '"' : '') + '; it stays ' + storyCard.projectStatus + '.'
      try { if (storyKey) await $.store.set(storyKey, storyCard) } catch {}
      $.ui.invalidate('ui.render')
    }
    const st = storyCard
    const stage = STAGE_LIST.find(s => s.id === st.stage)
    return { result: 'Studio story card updated' + (stage ? ': ' + stage.name : '') + (st.projectStatus ? ' · ' + st.projectStatus : '') + (st.needs ? ', waiting for: ' + st.needs : '') + '.' + asked }
  })

  on('tool.call', { tool: FIGMA_WRITE }, async ($, e, next) => figmaGate($, e, next))
    .catch(async ($, e, next) => next.called ? next(e) : { deny: 'Studio couldn’t ask the designer about this Figma step, so it wasn’t run. Tell them in plain words and try again.' })

  // After a yes to Studio's own question, Claude Code doesn't ask again for that file.
  on('tool.check', { tool: FIGMA_WRITE }, async ($, e, next) => {
    const decided = await next(e)
    const key = String((e.input && e.input.fileKey) || '')
    if (decided && decided.decision === 'ask' && key && figmaYes.has(key)) return { decision: 'allow', reason: 'The designer said yes to Studio’s question for this Figma file' }
    return decided
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

  // The hint under the prompt says what to do at this step, while the prompt is empty.
  on('ui.render', { component: 'PromptHint' }, async ($, e, next) => {
    if (e.props.isDraft) return next(e)
    return next({ ...e, props: { ...e.props, hint: hintFor(state()) } })
  })

  // Figma steps in the conversation read as what they do, not their tool names.
  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    const p = e.props || {}
    const f = friendlyFigma(p.name || p.tool || p.toolName, p.input)
    if (!f) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    return Box({ key: 'figma-row', flexDirection: 'row', columnGap: 1, children: [
      Text({ key: 'figma-row-dot', color: MIST.coral, children: ['●'] }),
      Text({ key: 'figma-row-label', weight: 'semibold', children: [f.label] }),
      ...(f.detail ? [Text({ key: 'figma-row-detail', color: MIST.muted, wrap: 'truncate-end', children: ['· ' + f.detail] })] : []),
    ] })
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (!live.working || !live.current) return next(e)
    return next({ ...e, props: { ...e.props, message: live.current.label } })
  })
}
