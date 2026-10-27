// Studio's Designer notes page: where the project is, so a colleague (or cover
// for annual leave) can pick it up. Run it with use_figma in the project's own
// Figma file after filling in DATA (and nothing else). It rebuilds the page's
// "Designer notes" frame in place; anything else on the page stays. Read the
// page first and carry its decisions, questions and history over: this script
// writes only what's in DATA.
// Layout: Figma page "Proposal · Team notes and pick-up" (107:12).

const DATA = {
  title: 'SIGN-142 · Faster sign-up',      // "KEY · Title", or the task's name without a story
  links: [                                  // https links shown under the title; [] for none
    { label: 'Open in Jira ↗', url: '' },
  ],
  stage: 'Visual design',
  status: 'Feedback',                       // Not started, In progress, Feedback or Ready for dev
  updated: 'Sam Rivera · 27 Oct 2026',      // who and when
  decisions: [{ text: 'Email check is format only', sub: 'Answered by Sam, 20 Oct' }],
  questions: [{ text: 'Should “Email sent again” disappear on its own?', sub: 'Raised in review, 27 Oct' }],
  next: [{ text: 'Wait for stakeholder feedback', sub: '' }],
  frames: [{ text: 'Sign up · Check your inbox', sub: 'Page “Final design”', url: '' }],
  history: ['27 Oct · Sam · Visual design shared for feedback'],   // newest first
}

const C = { text: '#40404A', muted: '#7E7E88', link: '#4F6D8F', card: '#F6F6F8', rule: '#E6E6EA', white: '#FFFFFF', coral: '#E07A6E', sage: '#5E7D5B', ochre: '#B8862B' }
const STATUS = { 'Not started': '#9C9CA6', 'In progress': '#E07A6E', 'Feedback': '#4F6D8F', 'Ready for dev': '#5E7D5B' }
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 })
const solid = h => [{ type: 'SOLID', color: rgb(h) }]
const https = u => typeof u === 'string' && /^https:\/\/\S+$/.test(u)

const page = figma.root.children.find(p => p.name === 'Designer notes')
if (!page) throw new Error('No "Designer notes" page: set up the project template first, or add a page called Designer notes')
await figma.setCurrentPageAsync(page)
await Promise.all([['Inter', 'Regular'], ['Inter', 'Medium'], ['Inter', 'Semi Bold']].map(([family, style]) => figma.loadFontAsync({ family, style })))

// Every text layer is named after what it says, so Studio can read the notes
// back later without changing anything (pick-up).
const text = (chars, size, style, color, width) => {
  const t = figma.createText()
  t.fontName = { family: 'Inter', style }
  t.fontSize = size
  t.characters = chars
  t.name = chars
  t.fills = solid(color)
  if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT' }
  return t
}
const row = (dir, props) => { const f = figma.createAutoLayout(dir, props); f.fills = []; return f }

const old = page.children.find(n => n.name === 'Designer notes' && n.type === 'FRAME')
const frame = figma.createAutoLayout('VERTICAL', { name: 'Designer notes', itemSpacing: 24, paddingTop: 44, paddingBottom: 44, paddingLeft: 48, paddingRight: 48, cornerRadius: 16 })
frame.fills = solid(C.white)
frame.strokes = solid(C.rule)
page.appendChild(frame)
frame.resize(1100, frame.height)
frame.counterAxisSizingMode = 'FIXED'
frame.primaryAxisSizingMode = 'AUTO'
if (old) { frame.x = old.x; frame.y = old.y; old.remove() } else { frame.x = 0; frame.y = 0 }

// The header: Studio's mark and "Designer notes", the title, and the links.
const head = row('VERTICAL', { name: 'Header', itemSpacing: 6 })
frame.appendChild(head)
const brand = row('HORIZONTAL', { name: 'Brand', itemSpacing: 10, counterAxisAlignItems: 'CENTER' })
head.appendChild(brand)
const mark = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="#40404A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5V4.5A2.5 2.5 0 0 1 4.5 2H8.5"/><path d="M15.5 2H19.5A2.5 2.5 0 0 1 22 4.5V8.5"/><path d="M22 15.5V19.5A2.5 2.5 0 0 1 19.5 22H15.5"/><path d="M8.5 22H4.5A2.5 2.5 0 0 1 2 19.5V15.5"/></g><circle cx="12" cy="12" r="3.5" fill="#E07A6E"/></svg>')
mark.name = 'Studio logo'
brand.appendChild(mark)
brand.appendChild(text('Designer notes', 13, 'Semi Bold', C.coral))
head.appendChild(text(DATA.title, 32, 'Semi Bold', C.text, 1002))
const links = (DATA.links || []).filter(l => https(l.url))
if (links.length) {
  const line = row('HORIZONTAL', { name: 'Links', itemSpacing: 16 })
  head.appendChild(line)
  for (const l of links) { const t = text(l.label, 13, 'Regular', C.link); t.hyperlink = { type: 'URL', value: l.url }; line.appendChild(t) }
}

// Where it stands: stage, status (with its dot) and last updated.
const facts = row('HORIZONTAL', { name: 'Where it stands', itemSpacing: 16 })
frame.appendChild(facts)
facts.layoutSizingHorizontal = 'FILL'
for (const [label, value, dot] of [['Stage', DATA.stage], ['Status', DATA.status, STATUS[DATA.status]], ['Last updated', DATA.updated]]) {
  const box = figma.createAutoLayout('VERTICAL', { name: label, itemSpacing: 4, paddingTop: 14, paddingBottom: 14, paddingLeft: 18, paddingRight: 18, cornerRadius: 10 })
  box.fills = solid(C.card)
  facts.appendChild(box)
  box.layoutSizingHorizontal = 'FILL'
  box.appendChild(text(label, 12, 'Medium', C.muted))
  const v = row('HORIZONTAL', { name: 'Value', itemSpacing: 8, counterAxisAlignItems: 'CENTER' })
  box.appendChild(v)
  if (dot) { const e = figma.createEllipse(); e.resize(10, 10); e.fills = solid(dot); e.name = 'Status dot'; v.appendChild(e) }
  v.appendChild(text(String(value || ''), 17, 'Semi Bold', C.text))
}

// The lists, each with its own mark. Empty lists say "None".
const lists = [
  ['Decisions', '✓', C.sage, DATA.decisions],
  ['Open questions', '?', C.ochre, DATA.questions],
  ['What’s next', '→', C.coral, DATA.next],
  ['Key frames', '↗', C.link, DATA.frames],
  ['History', '·', C.muted, (DATA.history || []).map(h => ({ text: h }))],
]
for (const [title, glyph, color, items] of lists) {
  const sec = row('VERTICAL', { name: title, itemSpacing: 8 })
  frame.appendChild(sec)
  sec.layoutSizingHorizontal = 'FILL'
  sec.appendChild(text(title, 18, 'Semi Bold', C.text, 1002))
  if (!items || !items.length) sec.appendChild(text('None', 15, 'Regular', C.muted, 1002))
  for (const it of items || []) {
    const r = row('HORIZONTAL', { name: 'Item', itemSpacing: 10 })
    sec.appendChild(r)
    r.layoutSizingHorizontal = 'FILL'
    r.appendChild(text(glyph, 15, 'Semi Bold', color))
    const body = row('VERTICAL', { name: 'Text', itemSpacing: 2 })
    r.appendChild(body)
    body.layoutSizingHorizontal = 'FILL'
    const t = text(String(it.text || ''), 15, 'Regular', C.text, 960)
    if (https(it.url)) { t.hyperlink = { type: 'URL', value: it.url } }
    body.appendChild(t)
    if (it.sub) body.appendChild(text(String(it.sub), 13, 'Regular', C.muted, 960))
  }
}

return { createdNodeIds: [frame.id], frameId: frame.id, pageId: page.id }
