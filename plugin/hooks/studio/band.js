// Studio: the band above the prompt (Figma pages 15 and 17).
//   Before any work:  [logo] studio  Paste a Jira story to start
//   Once work starts: ● studio  ▬▬▬▬▬▬▬▬  Step 5 of 9 · The design · building screen 3 of 5   [Stop]
// The dot and progress bar take the stage's colour (the brief dusk, the design
// coral, ready for developers sage), or ochre when something needs you, with
// those words in ochre too. Nothing moves. Stop appears only while Claude is
// working. No background or top line of Studio's own: the app draws the band's
// box. Pure drawing.
import { MIST, mark, stageOf } from './mist.js'

// The status parts for the band, from the story card (or its absence).
export function statusParts(s) {
  const st = s.story
  if (!st || !st.step) return { parts: ['Paste a Jira story to start'], needs: false, step: 0 }
  const step = Math.min(9, Math.max(1, Number(st.step) || 1))
  const detail = st.needs ? st.needs : (st.status || '')
  return { parts: ['Step ' + step + ' of 9', stageOf(step).name, detail].filter(Boolean), needs: Boolean(st.needs), step }
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
  const { parts, needs, step } = statusParts(s)
  const width = Math.max(20, columns || 80)
  const color = !step ? null : needs ? MIST.needs : stageOf(step).color

  const status = []
  parts.forEach((p, i) => {
    if (i) status.push(Text({ key: 'sep-' + i, color: MIST.muted, children: [' · '] }))
    const last = i === parts.length - 1
    if (!step) status.push(Text({ key: 'status-' + i, color: MIST.muted, wrap: 'truncate-end', children: [p] }))
    else if (last && needs) status.push(Box({ key: 'status-needs', children: [Text({ key: 'status-' + i, color: MIST.needsText, bold: true, wrap: 'truncate-end', children: [p] })] }))
    else status.push(Text({ key: 'status-' + i, color: last ? MIST.text : MIST.muted, bold: last, wrap: 'truncate-end', children: [p] }))
  })

  const row = [
    mark(el, s.surface, 'band-mark', color),
    ...(step && width >= 60 ? [progress(el, step, color)] : []),
    Box({ key: 'status', flexDirection: 'row', flexGrow: 1, flexShrink: 1, children: status }),
  ]
  if (s.working) row.push(Button({ key: 'band-stop', label: 'Stop', hotkey: '3', plain: true, onPress: actions.stop }))
  return Box({ key: 'studio-band', flexDirection: 'row', columnGap: 2, alignItems: 'center', width, children: row })
}

// The hint under the prompt for each step (Figma page 15).
export const HINTS = {
  0: 'Paste a Jira story to start. Adding its Confluence technical design helps.',
  1: 'Paste a Jira story to start. Adding its Confluence technical design helps.',
  2: 'Answer the questions here or in the panel.',
  3: 'Choose the Figma file and page, a branch, and the level.',
  4: 'Say yes when the plan looks right, or ask for changes.',
  5: 'Claude is building in Figma. Press Stop to pause it.',
  6: 'Ask for changes in your own words. Each one is carried across every screen.',
  7: 'Claude is checking the screens against the story.',
  8: 'Annotations or state pages next. A coded prototype only if you ask.',
  9: 'Tick off the handover checklist in the panel.',
}
export function hintFor(s) {
  const st = s.story
  const step = st && st.step ? Math.min(9, Math.max(1, Number(st.step) || 1)) : 0
  return HINTS[step]
}
