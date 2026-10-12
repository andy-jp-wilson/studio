// Studio: the band above the prompt (Figma page 01).
//   ✓ Explore ─ ● Refine ─ ○ Build    Now  editing styles.css, step 2 of 3    [1 Show] [2 Save] [3 Stop]
// Pure drawing: takes the element table, Studio's state and the actions, and
// returns the children for the band. Narrower bands drop text before buttons.
import { STAGES, GLYPH, COLOR, stageState } from './journey.js'

export function drawBand(el, s, actions, columns) {
  const { Box, Text, Button } = el
  const wide = columns >= 96, medium = columns >= 60

  const journey = []
  STAGES.forEach((stage, i) => {
    const st = stageState(stage, s.stage)
    journey.push(Text({ key: 'stage-' + stage, color: COLOR[st], bold: st === 'current', children: [GLYPH[st] + (medium ? ' ' + stage : '')] }))
    if (i < STAGES.length - 1) journey.push(Text({ key: 'sep-' + i, color: 'subtle', children: [medium ? ' ─ ' : ' '] }))
  })

  const parts = [Box({ key: 'journey', flexDirection: 'row', children: journey })]

  if (wide) {
    let now = s.working ? (s.current ? s.current.label : 'Thinking') : 'Ready when you are'
    if (s.working && s.todo && s.todo.total > 1) now += `, step ${s.todo.current} of ${s.todo.total}`
    parts.push(Box({
      key: 'now', flexDirection: 'row', flexGrow: 1, children: [
        Text({ key: 'now-label', color: 'subtle', bold: true, children: ['Now  '] }),
        Text({ key: 'now-text', color: 'text', wrap: 'truncate-end', children: [now] }),
      ],
    }))
  } else {
    parts.push(Box({ key: 'spacer', flexGrow: 1, children: [] }))
  }

  const buttons = [
    Button({ key: 'band-show', label: 'Show', hotkey: '1', plain: true, onPress: actions.show }),
    Button({ key: 'band-save', label: 'Save', hotkey: '2', plain: true, onPress: actions.save }),
  ]
  if (s.working) buttons.push(Button({ key: 'band-stop', label: 'Stop', hotkey: '3', plain: true, onPress: actions.stop }))
  parts.push(Box({ key: 'buttons', flexDirection: 'row', columnGap: 2, children: buttons }))

  return Box({ key: 'studio-band', flexDirection: 'row', columnGap: 3, width: columns, children: parts })
}
