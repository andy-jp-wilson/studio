// Studio: the band above the prompt (Figma page 04, stages and status).
//   Before any work:  [logo] studio  Paste a Jira story, or describe what you'd like
//   Once work starts: ● studio  ▬▬ ▬▬ ▬▬ ▬▬  Visual design · In progress · your review   [Stop]
// The dot shows the project status (grey not started, coral in progress, dusk
// blue feedback, sage ready for dev). Four segments show the stages: done grey,
// current charcoal, later light. What needs the designer is in ochre words.
// No step numbers and no progress detail. Nothing moves. Stop only while
// Claude works. No background of Studio's own: the app draws the band's box.
import { MIST, mark, STAGE_LIST, STATUS_COLOR, stageIndex } from './mist.js'

// The status parts for the band, from the story card (or its absence).
export function statusParts(s) {
  const st = s.story
  if (!st || !st.stage) {
    // No story card yet: while Claude works, say what it's doing; otherwise how to start.
    if (s.working) return { parts: [(s.current && s.current.label) || 'Working'], needs: false, stage: -1 }
    return { parts: ['Paste a Jira story, or describe what you’d like'], needs: false, stage: -1 }
  }
  const stage = stageIndex(st.stage)
  return { parts: [STAGE_LIST[stage].name, st.projectStatus || 'In progress', st.needs || ''].filter(Boolean), needs: Boolean(st.needs), stage, status: st.projectStatus || 'In progress' }
}

// Four segments, one per stage: done stages grey, the current one charcoal, later ones light.
export function stageBar(el, stage, key = 'band-stages') {
  const { Box, Text } = el
  const parts = []
  STAGE_LIST.forEach((_, i) => {
    if (i) parts.push(Text({ key: key + '-gap-' + i, children: ['\u2005'] }))
    parts.push(Text({ key: key + '-' + i, color: i < stage ? MIST.muted : i === stage ? MIST.text : MIST.control, children: ['▬▬'] }))
  })
  return Box({ key, flexDirection: 'row', children: parts })
}

// A still progress bar of nine steps, made of text: equal bars with a
// quarter-width space between them; done and current in colour, the rest grey.
const BAR = '▬', GAP = '\u2005'

export function progress(el, step, color, key = 'band-progress') {
  const { Box, Text } = el
  const parts = []
  for (let i = 1; i <= 9; i++) {
    if (i > 1) parts.push(Text({ key: key + '-gap-' + i, children: [GAP] }))
    parts.push(Text({ key: key + '-' + i, color: i <= step ? color : MIST.control, children: [BAR] }))
  }
  return Box({ key, flexDirection: 'row', children: parts })
}

export function drawBand(el, s, actions, columns) {
  const { Box, Text, Button } = el
  const { parts, needs, stage, status } = statusParts(s)
  const width = Math.max(20, columns || 80)
  const started = stage >= 0

  const words = []
  parts.forEach((p, i) => {
    if (i) words.push(Text({ key: 'sep-' + i, color: MIST.muted, children: [' · '] }))
    const isNeeds = needs && i === parts.length - 1
    if (!started) words.push(Text({ key: 'status-' + i, color: MIST.muted, wrap: 'truncate-end', children: [p] }))
    else if (isNeeds) words.push(Box({ key: 'status-needs', children: [Text({ key: 'status-' + i, color: MIST.needsText, bold: true, wrap: 'truncate-end', children: [p] })] }))
    else words.push(Text({ key: 'status-' + i, color: i === 0 ? MIST.text : MIST.muted, bold: i === 0, wrap: 'truncate-end', children: [p] }))
  })

  const row = [
    mark(el, s.surface, 'band-mark', started ? STATUS_COLOR[status] : null),
    ...(started && width >= 60 ? [stageBar(el, stage)] : []),
    Box({ key: 'status', flexDirection: 'row', flexGrow: 1, flexShrink: 1, children: words }),
  ]
  if (s.working) row.push(Button({ key: 'band-stop', label: 'Stop', hotkey: '3', plain: true, onPress: actions.stop }))
  return Box({ key: 'studio-band', flexDirection: 'row', columnGap: 2, alignItems: 'center', width, children: row })
}

// The hint under the prompt: what to do now, by stage (Figma page 04).
export const HINTS = {
  none: 'Paste a Jira story, or just describe what you’d like to design.',
  needs: 'Claude is waiting for you. Answer here, or in the panel.',
  working: 'Claude is working. Press Stop to pause it.',
  brief: 'Answer Claude’s questions, and say where in Figma the work should go.',
  concepting: 'Ask for changes in your own words, or say when it’s ready for visual design.',
  visual: 'Ask for changes in your own words. Each one is carried across every screen.',
  review: 'Tick off the handover checklist in the panel, or ask Claude to help with it.',
}
export function hintFor(s) {
  const st = s.story
  if (!st || !st.stage) return HINTS.none
  if (st.needs) return HINTS.needs
  if (s.working) return HINTS.working
  return HINTS[st.stage] || HINTS.none
}
