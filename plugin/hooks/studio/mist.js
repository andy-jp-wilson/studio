// Studio's look: D5 Mist (Figma page 13, variable collection "Studio · Mist"),
// with the stage colours and logo chosen on 20 October 2026 (pages 15 to 17).
// In the app, the panel can set type sizes and weights, backgrounds, borders,
// hover and pictures; the band can show pictures. Pictures never move, so
// nothing in Studio moves (see plans/ui-limits.md).

export const MIST = {
  raised: '#FFFFFF',       // Studio's buttons
  card: '#F6F6F8',         // the panel's cards: light grey, since the app's panel is white
  text: '#40404A',         // main text
  muted: '#7E7E88',        // secondary text
  line: '#9C9CA6',         // waiting grey
  control: '#D6D6DC',      // borders of controls; the progress bar's steps to do
  coral: '#E07A6E',        // Studio's colour; the design stage
  brief: '#4F6D8F',        // the brief stage (steps 1 to 3), dusk
  ready: '#5E7D5B',        // ready for developers (steps 7 to 9), sage
  needs: '#B8862B',        // something needs you, at any step, ochre
  needsText: '#8E6516',    // words that need you, darker ochre for contrast
}

// The three stages of the journey, by step.
export const STAGES = [
  { name: 'The brief', steps: [1, 2, 3], color: MIST.brief },
  { name: 'The design', steps: [4, 5, 6], color: MIST.coral },
  { name: 'Ready for developers', steps: [7, 8, 9], color: MIST.ready },
]
export const stageOf = step => STAGES.find(s => s.steps.includes(step)) || STAGES[0]

// The Studio logo (Figma page 17, "Studio logo / 16"): rounded crop corners
// in charcoal with the coral dot, on a 24-unit grid. Light corners in dark mode.
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><style>.c{fill:none;stroke:${MIST.text};stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}@media (prefers-color-scheme: dark){.c{stroke:#ECE7DE}}</style><path class="c" d="M2 8.5V4.5A2.5 2.5 0 0 1 4.5 2H8.5"/><path class="c" d="M15.5 2H19.5A2.5 2.5 0 0 1 22 4.5V8.5"/><path class="c" d="M22 15.5V19.5A2.5 2.5 0 0 1 19.5 22H15.5"/><path class="c" d="M8.5 22H4.5A2.5 2.5 0 0 1 2 19.5V15.5"/><circle cx="12" cy="12" r="3.5" fill="${MIST.coral}"/></svg>`

// The Studio mark in the band. Before any work: the logo (a picture in the
// app; a coral ● in the terminal, which has no pictures). Once work starts:
// a still ● in the stage's colour, or ochre when something needs you.
export function mark(el, surface, key = 'mark', dotColor = null) {
  const { Box, Text, Svg } = el
  const symbol = dotColor
    ? Text({ key: key + '-dot', color: dotColor, children: ['●'] })
    : surface === 'terminal'
      ? Text({ key: key + '-dot', color: MIST.coral, children: ['●'] })
      : Svg({ key: key + '-logo', source: LOGO_SVG, alt: 'Studio', width: 2, height: 1 })
  return Box({ key, flexDirection: 'row', columnGap: 1, alignItems: 'center', children: [
    symbol,
    Text({ key: key + '-word', color: MIST.text, bold: true, children: ['studio'] }),
  ] })
}
