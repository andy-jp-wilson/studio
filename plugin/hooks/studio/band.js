// Studio: the band above the prompt (Figma page 01).
//   ✓ Explore ─ ● Refine ─ ○ Build    Now  editing styles.css, step 2 of 3    ✓ Saved 2m ago    [1 Preview] [3 Stop]
// Pure drawing: takes the element table, Studio's state and the actions, and
// returns the band. Narrower bands drop text before buttons. Until the first
// request of a session, the band shows the welcome instead.
import { STAGES, GLYPH, COLOR, stageState, saveStatus } from './journey.js'

// The STUDIO wordmark, 6 rows, 47 columns.
export const WORDMARK = [
  '███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ',
  '██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗',
  '███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║',
  '╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║',
  '███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝',
  '╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ ',
]
export const TAGLINE = 'Calm Claude Code for designers'
export const TIP = 'Try: “make the heading softer”'

function buttons(el, s, actions) {
  const { Box, Button } = el
  const list = [Button({ key: 'band-preview', label: 'Preview', hotkey: '1', plain: true, onPress: actions.show })]
  // Save point appears only when there's something new worth keeping.
  if (s.unsaved && !s.working) list.push(Button({ key: 'band-save', label: 'Save point', hotkey: '2', plain: true, onPress: actions.save }))
  if (s.working) list.push(Button({ key: 'band-stop', label: 'Stop', hotkey: '3', plain: true, onPress: actions.stop }))
  return Box({ key: 'buttons', flexDirection: 'row', columnGap: 2, children: list })
}

function drawWelcome(el, s, actions, columns, rows) {
  const { Box, Text } = el
  const big = columns >= 60 && (rows == null || rows >= WORDMARK.length + 2)
  if (!big) {
    return Box({ key: 'studio-welcome', flexDirection: 'row', columnGap: 2, width: columns, children: [
      Text({ key: 'welcome-name', color: 'claude', bold: true, children: ['Studio'] }),
      Text({ key: 'welcome-tagline', color: 'subtle', wrap: 'truncate-end', children: [TAGLINE + ' · /guide'] }),
      Box({ key: 'spacer', flexGrow: 1, children: [] }),
      buttons(el, s, actions),
    ] })
  }
  return Box({ key: 'studio-welcome', flexDirection: 'column', width: columns, children: [
    ...WORDMARK.map((line, i) => Text({ key: 'mark-' + i, color: 'claude', bold: true, wrap: 'truncate-end', children: [line] })),
    Box({ key: 'welcome-row', flexDirection: 'row', columnGap: 3, children: [
      Text({ key: 'welcome-tagline', color: 'text', children: [TAGLINE + ' · /guide'] }),
      ...(columns >= 96 ? [Text({ key: 'welcome-tip', color: 'subtle', wrap: 'truncate-end', children: [TIP] })] : []),
      Box({ key: 'spacer', flexGrow: 1, children: [] }),
      buttons(el, s, actions),
    ] }),
  ] })
}

export function drawBand(el, s, actions, columns, rows) {
  if (s.welcome && !s.working) return drawWelcome(el, s, actions, columns, rows)
  const { Box, Text } = el
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

  const save = saveStatus(s)
  if (medium && save && !s.working) parts.push(Text({ key: 'save-status', color: save.color, children: [save.text] }))

  parts.push(buttons(el, s, actions))
  return Box({ key: 'studio-band', flexDirection: 'row', columnGap: 3, width: columns, children: parts })
}
