// Studio lab (temporary, 2026-10-20): one page per thing to test in the app,
// so we know what the app really draws before redesigning. Each page is its
// own drawing: if the app refuses a prop, only that page goes blank, which is
// itself the answer. Open it with /studio-lab. Remove once the tests are done.
import { MIST } from './mist.js'

export const LAB_PANE = 'studio-lab'

export const LAB_PAGES = [
  ['1', 'Type'], ['2', 'Colour'], ['3', 'Borders'], ['4', 'Pictures'], ['5', 'Controls'],
  ['6', 'Spacing'], ['7', 'Messages'], ['8', 'Hover'], ['9', 'Band and hint'], ['m', 'Motion'],
]

const DOT = (w, h, r) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="${MIST.coral}"/></svg>`
export const LAB_DOTS = [[1, 1, 0.4], [2, 1, 0.4], [8, 16, 3.5], [16, 16, 6], [24, 24, 9]]

function header(el, lab, version) {
  const { Box, Text, Button } = el
  return Box({ key: 'lab-head', flexDirection: 'column', rowGap: 1, children: [
    Text({ key: 'lab-title', bold: true, children: ['Studio lab · page ' + lab.page + ' · Claude Code ' + (version || '?')] }),
    Box({ key: 'lab-tabs', flexDirection: 'row', columnGap: 2, flexWrap: 'wrap', children: LAB_PAGES.map(([k, name]) =>
      Button({ key: 'lab-tab-' + k, label: name, hotkey: k, plain: true, dimColor: lab.page !== k, onPress: () => lab.go(k) })) }),
  ] })
}

const line = (el, key, props, text) => el.Text({ key, ...props, children: [text] })

function page(el, lab) {
  const { Box, Text, Button, Link, Markdown, Input, Select, Svg } = el
  switch (lab.page) {
    case '1': return [
      ...['caption', 'footnote', 'body', 'heading', 'title'].map(s => line(el, 'size-' + s, { size: s }, 'Size ' + s + ': Faster sign-up')),
      ...['regular', 'medium', 'semibold', 'bold'].map(w => line(el, 'weight-' + w, { weight: w }, 'Weight ' + w + ': Faster sign-up')),
      line(el, 'mono', { mono: true }, 'Mono: SIGN-142 · 0123456789'),
      line(el, 'italic', { italic: true }, 'Italic'),
      line(el, 'underline', { underline: true }, 'Underline'),
      line(el, 'strike', { strikethrough: true }, 'Strikethrough'),
      line(el, 'dim', { dimColor: true }, 'Dim'),
      line(el, 'inverse', { inverse: true }, 'Inverse'),
    ]
    case '2': return [
      line(el, 'hex', { color: MIST.coral }, 'Hex text #E07A6E'),
      ...['red', 'green', 'blue'].map(c => line(el, 'named-' + c, { color: c }, 'Named colour ' + c)),
      ...['claude', 'success', 'warning', 'error', 'subtle', 'suggestion', 'permission'].map(c => line(el, 'theme-' + c, { color: c }, 'Theme colour ' + c)),
      line(el, 'text-bg', { color: MIST.tintText, backgroundColor: MIST.tint }, 'Text with a background'),
      Box({ key: 'box-bg', backgroundColor: MIST.tint, paddingX: 2, paddingY: 1, children: [line(el, 'box-bg-t', { color: MIST.tintText }, 'Box with a background and padding')] }),
      Box({ key: 'box-bg2', backgroundColor: '#FFFFFF', paddingX: 2, paddingY: 1, children: [line(el, 'box-bg2-t', {}, 'White box')] }),
    ]
    case '3': return ['single', 'double', 'round', 'bold', 'singleDouble', 'doubleSingle', 'classic', 'arrow', 'dashed', 'quote'].map(s =>
      Box({ key: 'border-' + s, borderStyle: s, borderColor: MIST.line, paddingX: 1, children: [line(el, 'border-t-' + s, {}, 'borderStyle ' + s)] }))
    case '4': return [
      line(el, 'svg-note', {}, 'Coral dots at different sizes (width × height):'),
      ...LAB_DOTS.map(([w, h, r]) => Box({ key: 'svg-row-' + w + 'x' + h, flexDirection: 'row', columnGap: 1, alignItems: 'center', children: [
        Svg({ key: 'svg-' + w + 'x' + h, source: DOT(w, h, r), alt: 'dot', width: w, height: h }),
        line(el, 'svg-l-' + w + 'x' + h, { color: MIST.muted }, w + ' × ' + h),
      ] })),
      Box({ key: 'svg-word', flexDirection: 'row', columnGap: 1, alignItems: 'center', children: [
        Svg({ key: 'svg-inline', source: DOT(2, 1, 0.4), alt: 'dot', width: 2, height: 1 }),
        line(el, 'svg-word-t', { bold: true }, 'studio (a 2 × 1 dot beside the word)'),
      ] }),
    ]
    case '5': return [
      Button({ key: 'btn-bracket', label: 'A normal button', onPress: () => lab.say('Pressed the normal button') }),
      Button({ key: 'btn-plain', label: 'A plain button with hotkey a', hotkey: 'a', plain: true, onPress: () => lab.say('Pressed the plain button') }),
      Link({ key: 'link-figma', href: '(Studio's design file in Figma; link kept out of the repository)', label: 'A link to Studio’s design file in Figma' }),
      Link({ key: 'link-local', href: 'http://localhost:4321', label: 'A link to localhost:4321' }),
      Input({ key: 'input', label: 'Answer', placeholder: 'Type an answer and press Enter', value: '', submitLabel: 'send', onSubmit: v => lab.say('Typed: ' + v) }),
      Select({ key: 'select', label: 'Level', options: [{ value: 'wire', label: 'Wireframes' }, { value: 'concept', label: 'Concepts' }, { value: 'visual', label: 'Full visuals' }], value: 'wire', onSelect: v => lab.say('Chose: ' + v) }),
      Markdown({ key: 'md', text: '### A Markdown heading\n- **Bold** item with `code`\n- A [link](https://www.figma.com)\n\n> A quote' }),
      line(el, 'said', { color: MIST.muted }, lab.said || 'Nothing pressed yet'),
    ]
    case '6': return [
      ...['xs', 'sm', 'md', 'lg', 'xl'].map(g => Box({ key: 'gap-' + g, flexDirection: 'row', columnGap: g, children: [line(el, 'gap-a-' + g, {}, 'gap ' + g), line(el, 'gap-b-' + g, { color: MIST.muted }, '|'), line(el, 'gap-c-' + g, { color: MIST.muted }, '|')] })),
      Box({ key: 'pad-md', padding: 'md', backgroundColor: '#FFFFFF', children: [line(el, 'pad-md-t', {}, 'padding md on a white box')] }),
      Box({ key: 'width-half', width: 20, backgroundColor: '#FFFFFF', children: [line(el, 'width-t', {}, 'width 20')] }),
    ]
    case '7': return [
      Button({ key: 'msg-toast', label: 'Show a toast', onPress: () => lab.toast() }),
      Button({ key: 'msg-status', label: 'Set the status line', onPress: () => lab.status(true) }),
      Button({ key: 'msg-status-clear', label: 'Clear the status line', onPress: () => lab.status(false) }),
      Button({ key: 'msg-log', label: 'Add a log line to the conversation', onPress: () => lab.log() }),
      Button({ key: 'msg-ask', label: 'Ask a Studio question', onPress: () => lab.ask() }),
      line(el, 'said', { color: MIST.muted }, lab.said || 'Nothing pressed yet'),
    ]
    case '8': return [
      Box({ key: 'hover-box', paddingX: 1, hover: { backgroundColor: MIST.tint }, children: [line(el, 'hover-t', {}, 'Hover over me: I should turn pale coral')] }),
    ]
    case '9': return [
      Button({ key: 'band-svg', label: lab.bandSvg ? 'Hide the test dots in the band' : 'Show test dots in the band', onPress: () => lab.toggleBand() }),
      Button({ key: 'hint', label: lab.hint ? 'Put the prompt hint back' : 'Change the hint under the prompt', onPress: () => lab.toggleHint() }),
      line(el, 'band-note', { color: MIST.muted }, 'The band test adds a second row under the Studio band, with dots at three sizes.'),
    ]
  }
  return []
}

// Motion A: Studio redraws a still picture, frame by frame (lab.frame counts up).
export function pulseFrame(frame) {
  const t = (frame % 10) / 10, k = Math.sin(t * Math.PI)
  const ring = 4 + k * 4, op = (0.45 * (1 - k) + 0.1).toFixed(2)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="${ring.toFixed(2)}" fill="${MIST.coral}" opacity="${op}"/><circle cx="9" cy="9" r="4" fill="${MIST.coral}"/></svg>`
}
export function barFrame(frame, step = 5) {
  const t = (frame % 12) / 12, k = 0.35 + 0.65 * Math.abs(Math.sin(t * Math.PI))
  let x = 0, rects = ''
  for (let i = 1; i <= 9; i++) { const w = i === step ? 22 : 12; rects += `<rect x="${x}" y="0" width="${w}" height="5" rx="2.5" fill="${i <= step ? MIST.coral : MIST.control}"${i === step ? ` opacity="${k.toFixed(2)}"` : ''}/>`; x += w + 3 }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="5" viewBox="0 0 ${x} 5">${rects}</svg>`
}
// Motion B: the picture animates itself (SVG's own animation, then CSS inside the SVG).
export const PULSE_SMIL = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="4" fill="${MIST.coral}"><animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;0.1;0.5" dur="1s" repeatCount="indefinite"/></circle><circle cx="9" cy="9" r="4" fill="${MIST.coral}"/></svg>`
export const PULSE_CSS = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><style>@keyframes p{0%,100%{r:4px;opacity:.5}50%{r:8px;opacity:.1}}.r{animation:p 1s ease-in-out infinite}</style><circle class="r" cx="9" cy="9" r="4" fill="${MIST.coral}"/><circle cx="9" cy="9" r="4" fill="${MIST.coral}"/></svg>`

function motion(el, lab) {
  const { Box, Text, Button, Svg } = el
  const pic = (key, source, w, h) => Svg({ key, source, alt: 'animation', width: w, height: h })
  const rowOf = (key, picEl, label) => Box({ key, flexDirection: 'row', columnGap: 2, alignItems: 'center', children: [picEl, Text({ key: key + '-t', children: [label] })] })
  return [
    Button({ key: 'motion-run', label: lab.running ? 'Stop the redraws' : 'Start the redraws (for A)', onPress: () => lab.toggleRun() }),
    Text({ key: 'motion-frame', color: MIST.muted, children: ['Frame ' + lab.frame + (lab.running ? ' · redrawing about 10 times a second' : ' · not redrawing') ] }),
    rowOf('m-a1', pic('m-a1-svg', pulseFrame(lab.frame), 2, 1), 'A · pulse, redrawn by Studio'),
    rowOf('m-a2', pic('m-a2-svg', barFrame(lab.frame), 14, 1), 'A · progress shimmer, redrawn by Studio'),
    rowOf('m-b1', pic('m-b1-svg', PULSE_SMIL, 2, 1), 'B1 · pulse, the picture animates itself (SVG)'),
    rowOf('m-b2', pic('m-b2-svg', PULSE_CSS, 2, 1), 'B2 · pulse, the picture animates itself (CSS)'),
    Button({ key: 'motion-band', label: lab.bandMotion ? 'Take the moving dots out of the band' : 'Put the moving dots in the band', onPress: () => lab.toggleBandMotion() }),
    Text({ key: 'motion-note', color: MIST.muted, children: ['Look for: does each dot move, and is it smooth or jumpy? Then try the band.'] }),
  ]
}

// The band's motion test row: A, B1 and B2 side by side.
export function drawBandMotion(el, frame) {
  const { Box, Svg, Text } = el
  const item = (key, source, label) => Box({ key, flexDirection: 'row', columnGap: 1, alignItems: 'center', children: [Svg({ key: key + '-svg', source, alt: 'animation', width: 2, height: 1 }), Text({ key: key + '-t', children: [label] })] })
  return Box({ key: 'lab-band-motion', flexDirection: 'row', columnGap: 3, alignItems: 'center', children: [item('lbm-a', pulseFrame(frame), 'A'), item('lbm-b1', PULSE_SMIL, 'B1'), item('lbm-b2', PULSE_CSS, 'B2')] })
}

export function drawLab(el, lab, version) {
  return el.Box({ key: 'lab', flexDirection: 'column', rowGap: 1, children: [header(el, lab, version), ...(lab.page === 'm' ? motion(el, lab) : page(el, lab))] })
}

// The band test row: dots at three sizes beside the word, to see which draw.
export function drawBandTest(el) {
  const { Box, Svg, Text } = el
  return Box({ key: 'lab-band', flexDirection: 'row', columnGap: 2, alignItems: 'center', children: [[1, 1, 0.4], [2, 1, 0.4], [8, 16, 3.5]].map(([w, h, r]) =>
    Box({ key: 'lab-band-' + w + 'x' + h, flexDirection: 'row', columnGap: 1, alignItems: 'center', children: [
      Svg({ key: 'lab-band-svg-' + w + 'x' + h, source: DOT(w, h, r), alt: 'dot', width: w, height: h }),
      Text({ key: 'lab-band-t-' + w + 'x' + h, children: [w + '×' + h] }),
    ] })) })
}
