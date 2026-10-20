// Studio mod: the band above the prompt and the Studio panel (D5 Mist).
// The band shows the journey step; the panel follows the story. Claude fills
// both in with the story tool. Works in the terminal and the Desktop Code tab;
// nothing draws in VS Code.
import { describe } from './studio/narrate.js'
import { MIST } from './studio/mist.js'
import { drawBand, hintFor } from './studio/band.js'
import { drawPane } from './studio/pane.js'
import { FIGMA_WRITE, keysIn, designSystemKeys, figmaQuestion, FIGMA_YES, friendlyFigma } from './studio/figma.js'
import { LAB_PANE, drawLab, drawBandTest, drawBandMotion } from './studio/lab.js'

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
  if (e.step != null) next.step = Math.min(9, Math.max(1, Math.round(Number(e.step)) || 1))
  if (typeof e.status === 'string') next.status = e.status.slice(0, 80)
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
  return { ...live, story: storyCard, dsName: notes.dsName, figmaName: notes.figmaName, figmaUrl: notes.figmaUrl, answers }
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

// The Studio lab (temporary): what the app really draws. See studio/lab.js.
let labState = { page: '1', said: '', bandSvg: false, hint: false, bandMotion: false, running: false, frame: 0, progressStyle: 'bars' }
let labTimer = null
let ccVersion = ''

function labFor($) {
  const redraw = () => $.ui.invalidate('ui.render')
  const say = text => { labState = { ...labState, said: text }; redraw() }
  return {
    ...labState,
    go: k => { labState = { ...labState, page: k, said: '' }; redraw() },
    say,
    toast: async () => { try { await $.ui.toast('Studio lab: this is a toast'); say('Toast sent') } catch (err) { say('Toast failed: ' + err) } },
    status: async on => { try { await $.ui.status(on ? 'Step 2 of 9 · 4 questions for you' : ''); say(on ? 'Status line set' : 'Status line cleared') } catch (err) { say('Status failed: ' + err) } },
    log: async () => { try { await $.ui.log('Studio lab: a log line'); say('Log line added') } catch (err) { say('Log failed: ' + err) } },
    ask: async () => { try { const a = await $.ui.ask('Work in Studio’s design file in Figma?', ['Yes, go ahead', 'No']); say('You picked: ' + a) } catch (err) { say('Question closed: ' + err) } },
    toggleBand: () => { labState = { ...labState, bandSvg: !labState.bandSvg }; redraw() },
    toggleHint: () => { labState = { ...labState, hint: !labState.hint }; redraw() },
    setProgress: id => { labState = { ...labState, progressStyle: id }; redraw() },
    toggleBandMotion: () => { labState = { ...labState, bandMotion: !labState.bandMotion }; redraw() },
    toggleRun: async () => {
      if (labTimer) { try { labTimer.cancel() } catch {} labTimer = null; labState = { ...labState, running: false }; return redraw() }
      labState = { ...labState, running: true }
      // Slow (4 a second) so buttons keep working, and it stops by itself after 10 seconds.
      const startFrame = labState.frame
      try {
        labTimer = await $.clock.every(250, () => {
          if (labState.frame - startFrame >= 40) { try { labTimer && labTimer.cancel() } catch {} labTimer = null; labState = { ...labState, running: false }; return $.ui.invalidate('ui.render') }
          labState = { ...labState, frame: labState.frame + 1 }; $.ui.invalidate('ui.render')
        })
      } catch (err) { labState = { ...labState, running: false, said: 'Timer failed: ' + err } }
      redraw()
    },
  }
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
    // A checklist item's button: the designer asks Claude for that next step.
    ask: text => { $.prompt.submit({ text: String(text), asUser: true }).catch(() => {}) },
  }
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    try { sessionId = String(await $.session.id()) } catch {}
    try { storyKey = 'story:' + (await $.session.id()); const saved = await $.store.get(storyKey); storyCard = saved && typeof saved === 'object' ? saved : null } catch { storyCard = null }
    try { await $.tool.register(STORY_TOOL) } catch {}
    await readNotes($)
    await loadWords($)
    await loadPrefs($)
    try { await $.ui.open({ id: PANE, title: 'Studio' }) } catch {}
    try { await $.command.register({ name: 'panel', description: 'Open the Studio panel', immediate: true }) } catch {}
    try { await $.command.register({ name: 'studio-lab', description: 'Studio lab (temporary): test what the app draws', immediate: true }) } catch {}
    try { ccVersion = String(await $.session.version()) } catch {}
    return next(e)
  })

  on('command.run', { command: 'panel' }, async ($) => {
    await $.ui.open({ id: PANE, title: 'Studio', focus: true })
    return {}
  })

  on('command.run', { command: 'studio-lab' }, async ($) => {
    await $.ui.open({ id: LAB_PANE, title: 'Studio lab', focus: true })
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
    const st = storyCard
    return { result: 'Studio story card updated' + (st.step ? ': step ' + st.step + ' of 9' : '') + (st.needs ? ', waiting for: ' + st.needs : '') + '.' }
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
    const extra = labState.bandMotion && e.surface !== 'terminal' ? drawBandMotion(el, labState.frame) : []
    const studioBand = drawBand(el, { ...state(), surface: e.surface, extra, progressStyle: labState.progressStyle }, actionsFor($), e.props.bodyColumns)
    const extras = e.surface === 'terminal' ? [] : (labState.bandSvg ? [drawBandTest(el)] : [])
    const band = extras.length ? el.Box({ key: 'lab-band-wrap', flexDirection: 'column', children: [studioBand, ...extras] }) : studioBand
    const rest = await next(e)
    return rest ? el.Box({ key: 'studio-band-wrap', flexDirection: 'column', children: [band, rest] }) : band
  })

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== PANE) return next(e)
    const el = $.ui.resolve(e)
    return drawPane(el, { ...state(), surface: e.surface }, actionsFor($), e.props.bodyColumns)
  })

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== LAB_PANE) return next(e)
    return drawLab($.ui.resolve(e), labFor($), ccVersion)
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
