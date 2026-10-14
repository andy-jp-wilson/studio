// Studio: the band above the prompt (Figma page 01).
//   ✓ Explore ─ ● Refine ─ ○ Build    Now  editing styles.css, step 2 of 3    ✓ Saved 2m ago    [1 Preview] [3 Stop]
// Pure drawing: takes the element table, Studio's state and the actions, and
// returns the band. Narrower bands drop text before buttons. Until the first
// request of a session, the band shows the welcome instead, with a short
// "where you left off" summary under the wordmark (the same facts as /start).
import { STAGES, GLYPH, COLOR, stageState, saveStatus, ago } from './journey.js'

// The STUDIO wordmark, 6 rows, 47 columns.
export const WORDMARK = [
  '███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ',
  '██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗',
  '███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║',
  '╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║',
  '███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝',
  '╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ ',
]
// The STUDIO wordmark for the Desktop app: the same pixel letters, drawn as
// a crisp picture (SVG), since block characters come apart in the app's type.
// Each letter is 3 by 5 pixels with a 1-pixel gap; clay, lighter in dark mode.
const PIXEL_LETTERS = {
  S: ['111', '100', '111', '001', '111'],
  T: ['111', '010', '010', '010', '010'],
  U: ['101', '101', '101', '101', '111'],
  D: ['110', '101', '101', '101', '110'],
  I: ['111', '010', '010', '010', '111'],
  O: ['111', '101', '101', '101', '111'],
}
const PIXEL = 6
function pixelWordmark(word) {
  let rects = '', x = 0
  for (const ch of word) {
    PIXEL_LETTERS[ch].forEach((row, y) => [...row].forEach((on, i) => {
      if (on === '1') rects += `<rect x="${(x + i) * PIXEL}" y="${y * PIXEL}" width="${PIXEL}" height="${PIXEL}"/>`
    }))
    x += 4
  }
  const w = (x - 1) * PIXEL, h = 5 * PIXEL
  return { width: w, height: h, source: `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><style>rect{fill:#C2643D}@media (prefers-color-scheme: dark){rect{fill:#E08A62}}</style>${rects}</svg>` }
}
export const APP_WORDMARK = pixelWordmark('STUDIO')

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

// Two lines under the wordmark:
//   project onboarding · exploring fewer-steps
//   last save point “Calmer sign-up”, 2h ago · 2 files not saved yet
export function leftOff(el, s) {
  const { Box, Text } = el
  const label = (key, text) => Text({ key, color: 'subtle', children: [text] })
  const value = (key, text) => Text({ key, color: 'text', bold: true, children: [text] })
  const where = [label('left-project-label', 'project '), value('left-project', s.project)]
  if (s.hasSavePoints) {
    where.push(label('left-sep', ' · '))
    if (s.isMain) where.push(label('left-exploring-label', 'on the '), value('left-exploring', 'main design'))
    else where.push(label('left-exploring-label', 'exploring '), value('left-exploring', s.exploration))
  }
  const lines = [Box({ key: 'left-where', flexDirection: 'row', children: where })]
  if (!s.hasSavePoints) {
    lines.push(Text({ key: 'left-setup', color: 'subtle', wrap: 'truncate-end', children: ['Save points aren’t set up here yet; /start can set them up'] }))
    return lines
  }
  const saved = []
  if (s.lastSaveNote) {
    const when = ago(s.lastSaveAt, s.now)
    saved.push(label('left-save-label', 'last save point '))
    saved.push(Text({ key: 'left-save-note', color: 'text', wrap: 'truncate-end', children: ['“' + s.lastSaveNote + '”'] }))
    if (when) saved.push(label('left-save-when', ', ' + when.replace(/^saved /, '')))
    saved.push(label('left-save-sep', ' · '))
  }
  const n = s.unsavedCount || 0
  saved.push(n
    ? Text({ key: 'left-unsaved', color: 'warning', children: [`${n} file${n === 1 ? '' : 's'} not saved yet`] })
    : Text({ key: 'left-unsaved', color: 'success', children: ['everything saved'] }))
  lines.push(Box({ key: 'left-saved', flexDirection: 'row', children: saved }))
  return lines
}

// The one-line version for small bands: "onboarding · fewer-steps · not saved yet".
function leftOffShort(s) {
  const parts = [s.project]
  if (s.hasSavePoints) parts.push(s.isMain ? 'main design' : s.exploration)
  if (s.unsaved) parts.push('not saved yet')
  return parts.filter(Boolean).join(' · ')
}

function drawWelcome(el, s, actions, columns, rows) {
  const { Box, Text } = el
  const summary = leftOff(el, s)
  const app = s.surface === 'desktop' && el.Svg
  const markRows = app ? 2 : WORDMARK.length
  const big = columns >= 60 && (rows == null || rows >= markRows + 1 + summary.length)
  if (!big) {
    return Box({ key: 'studio-welcome', flexDirection: 'row', columnGap: 2, width: columns, children: [
      Text({ key: 'welcome-name', color: 'claude', bold: true, children: ['Studio'] }),
      Text({ key: 'welcome-left-off', color: 'subtle', wrap: 'truncate-end', children: [leftOffShort(s) + ' · /guide'] }),
      Box({ key: 'spacer', flexGrow: 1, children: [] }),
      buttons(el, s, actions),
    ] })
  }
  return Box({ key: 'studio-welcome', flexDirection: 'column', width: columns, children: [
    ...(app
      ? [Box({ key: 'mark', marginBottom: 1, children: [el.Svg({ key: 'mark-svg', source: APP_WORDMARK.source, alt: 'Studio', width: APP_WORDMARK.width, height: APP_WORDMARK.height })] })]
      : WORDMARK.map((line, i) => Text({ key: 'mark-' + i, color: 'claude', bold: true, wrap: 'truncate-end', children: [line] }))),
    ...summary,
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
