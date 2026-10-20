// Studio: the band above the prompt (Figma page 13, D5 Mist).
//   ● studio  Step 5 of 9 · The design · building screen 3 of 6        [Stop]
// Status only: which step of the journey, and how it's going. When something
// needs the designer, the last part is in coral text, with no background
// (the tint was removed, 2026-10-20). (No top line: the
// app can't draw a one-sided border, and drawn line characters didn't match
// the design, so it was removed, 2026-10-20.)
// Stop appears only while Claude is working. Pure drawing.
import { MIST, mark } from './mist.js'

export const STAGES_BY_STEP = { 1: 'The brief', 2: 'The brief', 3: 'The brief', 4: 'The design', 5: 'The design', 6: 'The design', 7: 'Ready for developers', 8: 'Ready for developers', 9: 'Ready for developers' }

// The status parts for the band, from the story card (or its absence).
export function statusParts(s) {
  const st = s.story
  if (!st || !st.step) return { parts: ['Step 1 of 9', 'The brief', 'waiting for a Jira story'], needs: false }
  const step = Math.min(9, Math.max(1, Number(st.step) || 1))
  const detail = st.needs ? st.needs : (st.status || '')
  return { parts: ['Step ' + step + ' of 9', STAGES_BY_STEP[step], detail].filter(Boolean), needs: Boolean(st.needs) }
}

export function drawBand(el, s, actions, columns) {
  const { Box, Text, Button } = el
  const { parts, needs } = statusParts(s)
  const width = Math.max(20, columns || 80)

  const status = []
  parts.forEach((p, i) => {
    if (i) status.push(Text({ key: 'sep-' + i, color: MIST.muted, children: [' · '] }))
    const last = i === parts.length - 1
    if (last && needs) {
      status.push(Box({ key: 'status-needs', children: [
        Text({ key: 'status-' + i, color: MIST.tintText, bold: true, wrap: 'truncate-end', children: [p] }),
      ] }))
    } else {
      status.push(Text({ key: 'status-' + i, color: last ? MIST.text : MIST.muted, bold: last, wrap: 'truncate-end', children: [p] }))
    }
  })

  const row = [
    mark(el, s.surface, 'band-mark'),
    Box({ key: 'status', flexDirection: 'row', flexGrow: 1, flexShrink: 1, children: status }),
  ]
  if (s.working) row.push(Button({ key: 'band-stop', label: 'Stop', hotkey: '3', plain: true, onPress: actions.stop }))

  // No background of Studio's own: the app draws the band's box (a rounded
  // grey) and Studio can only draw inside it, so a second colour never lines
  // up with its edges (seen 2026-10-20). The app's box is the band's colour.
  return Box({ key: 'studio-band', flexDirection: 'row', columnGap: 2, alignItems: 'center', width, children: row })
}
