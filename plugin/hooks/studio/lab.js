// Studio lab (temporary, 2026-10-20): one page per thing to test in the app,
// so we know what the app really draws before redesigning. Each page is its
// own drawing: if the app refuses a prop, only that page goes blank, which is
// itself the answer. Open it with /studio-lab. Remove once the tests are done.
import { MIST } from './mist.js'

export const LAB_PANE = 'studio-lab'

export const LAB_PAGES = [
  ['1', 'Type'], ['2', 'Colour'], ['3', 'Borders'], ['4', 'Pictures'], ['5', 'Controls'],
  ['6', 'Spacing'], ['7', 'Messages'], ['8', 'Hover'], ['9', 'Band and hint'],
]

const DOT = (w, h, r) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="${MIST.coral}"/></svg>`
export const LAB_DOTS = [[1, 1, 0.4], [2, 1, 0.4], [8, 16, 3.5], [16, 16, 6], [24, 24, 9]]

function header(el, lab, version) {
  const { Box, Text, Button } = el
  return Box({ key: 'lab-head', flexDirection: 'column', rowGap: 1, children: [
    Text({ key: 'lab-title', bold: true, children: ['Studio lab · page ' + lab.page + ' of 9 · Claude Code ' + (version || '?')] }),
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

export function drawLab(el, lab, version) {
  return el.Box({ key: 'lab', flexDirection: 'column', rowGap: 1, children: [header(el, lab, version), ...page(el, lab)] })
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
