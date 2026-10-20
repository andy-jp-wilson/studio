// Studio: the panel beside the conversation (Figma page 15, "The panel at
// five moments"). It follows the story: the story at the top with its
// progress, then white cards for whatever matters at this step, with what
// needs you first, outlined in ochre. Items can link straight to their frame
// in Figma, questions can be answered here, and checklist items can ask Claude
// for the next step. Claude fills it in with the story tool. No background of
// its own: the app draws the panel's box and its "Studio" header.
import { MIST, stageOf } from './mist.js'
import { progress } from './band.js'

const GLYPH = { done: '✓', now: '●', todo: '○', need: '!', none: '—' }
const CHECK = { done: '☑', todo: '☐', now: '☐', need: '☐', none: '—' }

function itemRow(el, it, i, key, ctx) {
  const { Box, Text, Link, Button } = el
  const state = it.state || 'plain'
  const glyph = (ctx.checklist ? CHECK : GLYPH)[state] || ''
  const glyphColor = state === 'need' ? MIST.needs : state === 'todo' || state === 'none' || state === 'muted' ? MIST.line : ctx.color
  const textColor = state === 'need' || ctx.needs ? MIST.needsText : state === 'muted' || state === 'none' ? MIST.muted : MIST.text
  const weight = state === 'now' || state === 'strong' ? 'semibold' : ctx.needs && ctx.ask ? 'medium' : 'regular'
  const k = key + '-i' + i
  const right = []
  if (it.link) right.push(Link({ key: k + '-link', href: it.link, label: (it.linkLabel || 'Open') + ' ↗' }))
  if (it.action) right.push(Button({ key: k + '-act', label: it.actionLabel || 'Start', plain: true, onPress: () => ctx.actions.ask(it.action) }))
  const body = [Text({ key: k + '-t', color: textColor, weight, wrap: 'wrap', children: [String(it.text || '')] })]
  if (it.sub) body.push(Text({ key: k + '-s', color: MIST.muted, size: 'footnote', wrap: 'wrap', children: [String(it.sub)] }))
  const rows = [Box({ key: k, flexDirection: 'row', columnGap: 1, children: [
    ...(glyph ? [Text({ key: k + '-g', color: glyphColor, weight: 'semibold', children: [glyph] })] : []),
    Box({ key: k + '-body', flexDirection: 'column', flexGrow: 1, flexShrink: 1, children: body }),
    ...right,
  ] })]
  // A question you can answer here: a text box under it, and the pair given
  // room to breathe (a line above each question after the first).
  if (ctx.ask) {
    rows.push(el.Input({ key: k + '-answer', placeholder: it.placeholder || 'Your answer', value: ctx.answers[k] || '', onInput: v => ctx.actions.setAnswer(k, v), onSubmit: v => ctx.actions.setAnswer(k, v) }))
    return [Box({ key: k + '-q', flexDirection: 'column', rowGap: 1, marginTop: 1, children: rows })]
  }
  return rows
}

function card(el, sec, i, color, actions, answers) {
  const { Box, Text, Button } = el
  const key = 'sec-' + i
  const needs = Boolean(sec.needs)
  const items = (sec.items || []).map(it => typeof it === 'string' ? { text: it } : it)
  const questions = sec.ask ? items.map((it, j) => ({ text: it.text, key: key + '-i' + j })) : []
  const ctx = { needs, ask: Boolean(sec.ask), checklist: Boolean(sec.checklist), color, actions, answers, questions }
  const children = [
    Text({ key: key + '-title', size: 'heading', weight: 'semibold', color: needs ? MIST.needsText : MIST.text, children: [String(sec.title || '')] }),
    ...items.flatMap((it, j) => itemRow(el, it, j, key, ctx)),
  ]
  if (sec.ask && items.length) children.push(Box({ key: key + '-send', flexDirection: 'row', columnGap: 2, alignItems: 'center', marginTop: 1, children: [
    Button({ key: key + '-send-btn', label: 'Send answers', onPress: () => actions.sendAnswers(questions) }),
    Text({ key: key + '-send-or', color: MIST.muted, size: 'footnote', children: ['or answer in the chat'] }),
  ] }))
  return Box({ key, flexDirection: 'column', rowGap: 0, paddingX: 2, paddingY: sec.ask ? 2 : 1, backgroundColor: MIST.raised,
    ...(needs ? { borderStyle: 'round', borderColor: MIST.needs } : {}), children })
}

function storyHead(el, st) {
  const { Box, Text } = el
  const story = st.story || {}
  const step = Math.min(9, Math.max(1, Number(st.step) || 1))
  const stage = stageOf(step)
  const color = st.needs ? MIST.needs : stage.color
  const line = [stage.name, st.needs || st.status].filter(Boolean).join(' · ')
  return Box({ key: 'story', flexDirection: 'column', paddingX: 1, children: [
    Text({ key: 'story-key', size: 'caption', weight: 'medium', color: MIST.muted, children: [[story.key, 'Jira story', 'step ' + step + ' of 9'].filter(Boolean).join(' · ')] }),
    Text({ key: 'story-title', size: 'title', weight: 'semibold', color: MIST.text, wrap: 'wrap', children: [String(story.title || 'Untitled story')] }),
    Text({ key: 'story-doc', size: 'footnote', color: MIST.muted, children: [story.hasDesignDoc ? 'Technical design in Confluence' : 'No technical design yet · optional, but encouraged'] }),
    progress(el, step, color, 'bars', 'pane-progress'),
    Text({ key: 'story-stage', size: 'footnote', weight: 'medium', color: st.needs ? MIST.needsText : color, wrap: 'wrap', children: [line] }),
  ] })
}

export function drawPane(el, s, actions, columns) {
  const { Box } = el
  const st = s.story
  const children = []
  if (!st || !st.story) {
    children.push(card(el, { title: 'Start with a story', items: [{ text: 'Paste a Jira story into the conversation.' }, { text: 'Adding its Confluence technical design is optional, but encouraged.', state: 'muted' }] }, 0, MIST.coral, actions, {}))
    children.push(card(el, { title: 'This project', items: [
      { text: s.dsName || 'No design system chosen yet', state: s.dsName ? 'plain' : 'muted', sub: s.dsName ? 'Design system · never changed by Studio' : 'Choose one with /setup' },
      { text: s.figmaName || 'No Figma file chosen yet', state: s.figmaName ? 'plain' : 'muted', sub: s.figmaName ? 'Figma file' : 'Choose one with /setup', ...(s.figmaUrl ? { link: s.figmaUrl } : {}) },
    ] }, 1, MIST.coral, actions, {}))
  } else {
    const step = Math.min(9, Math.max(1, Number(st.step) || 1))
    const color = stageOf(step).color
    children.push(storyHead(el, st))
    const list = Array.isArray(st.sections) ? st.sections : []
    // What needs the designer comes first.
    const ordered = [...list.filter(x => x && x.needs), ...list.filter(x => x && !x.needs)]
    ordered.forEach((sec, i) => children.push(card(el, sec, i, color, actions, s.answers || {})))
  }
  return Box({ key: 'studio-pane', flexDirection: 'column', rowGap: 1, width: Math.max(20, columns || 40), children })
}
