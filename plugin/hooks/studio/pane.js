// Studio: the panel beside the conversation (Figma page 13, D5 Mist).
// It follows the story: the story itself, then whatever matters at this step
// (questions for you, requirements, paths, needs you, changes, notes in Figma,
// the handover checklist). Claude fills it in with the story tool.
// No background of its own: like the band, the app draws the panel's box, and
// a second colour wouldn't line up with its edges. Pure drawing.
import { MIST, mark } from './mist.js'

const GLYPH = { done: '✓  ', now: '●  ', todo: '○  ', none: '—  ' }

function item(el, it, i, key, inNeeds) {
  const { Box, Text } = el
  const state = it.state || 'plain'
  const glyph = GLYPH[state] || ''
  const color = state === 'need' || inNeeds ? MIST.tintText : state === 'muted' || state === 'none' ? MIST.muted : state === 'todo' ? MIST.text : MIST.text
  return Box({ key: key + '-i' + i, flexDirection: 'row', children: [
    ...(glyph ? [Text({ key: key + '-g' + i, color: state === 'now' ? MIST.coral : color, children: [glyph] })] : []),
    Text({ key: key + '-t' + i, color, bold: state === 'now' || state === 'strong', wrap: 'wrap', children: [String(it.text || '')] }),
  ] })
}

function section(el, sec, i) {
  const { Box, Text } = el
  const key = 'sec-' + i
  const needs = Boolean(sec.needs)
  return Box({ key, flexDirection: 'column', ...(needs ? { backgroundColor: MIST.tint, paddingX: 1 } : {}), children: [
    Text({ key: key + '-title', color: needs ? MIST.tintText : MIST.text, bold: true, children: [String(sec.title || '')] }),
    ...(sec.items || []).map((it, j) => item(el, typeof it === 'string' ? { text: it } : it, j, key, needs)),
  ] })
}

export function drawPane(el, s, actions, columns) {
  const { Box } = el
  const st = s.story
  const sections = []
  if (!st || !st.story) {
    sections.push({ title: 'Start with a story', items: [{ text: 'Paste a Jira story into the conversation.' }, { text: 'Adding its Confluence technical design is optional, but encouraged.', state: 'muted' }] })
    sections.push({ title: 'Project', items: [
      { text: 'Design system · ' + (s.dsName || 'not chosen yet'), state: s.dsName ? 'plain' : 'muted' },
      { text: 'Figma file · ' + (s.figmaName || 'not chosen yet'), state: s.figmaName ? 'plain' : 'muted' },
    ] })
  } else {
    const story = st.story
    sections.push({ title: 'Story', items: [
      { text: [story.key, story.title].filter(Boolean).join(' · '), state: 'strong' },
      { text: story.hasDesignDoc ? 'Jira · technical design in Confluence' : 'Jira', state: 'muted' },
    ] })
    const list = Array.isArray(st.sections) ? st.sections : []
    // What needs the designer comes first.
    for (const sec of [...list.filter(x => x && x.needs), ...list.filter(x => x && !x.needs)]) sections.push(sec)
  }
  return Box({ key: 'studio-pane', flexDirection: 'column', rowGap: 1, width: Math.max(20, columns || 40), children: [
    mark(el, s.surface, 'pane-mark'),
    ...sections.map((sec, i) => section(el, sec, i)),
  ] })
}
