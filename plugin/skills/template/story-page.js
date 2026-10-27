// Studio's project template, part 2: the User story page, the story distilled
// for design. Run it with use_figma in the project's own Figma file after
// filling in DATA (and nothing else). Safe to run again: the page's "User
// story" frame is rebuilt in place; anything else on the page stays.
// Only what the story says goes in; never invent requirements or paths.

const DATA = {
  title: '[SIGN-142] Faster sign-up',
  storyLink: '',                     // https link to the user story in Jira, or ''
  storyLinkLabel: 'Open in Jira ↗',
  sections: [
    { title: 'The story', items: ['As a new user, I want to sign up with just my email, so I can get started faster.'] },
    { title: 'What the design needs to do', items: ['An email field with validation'] },
    { title: 'Paths', items: ['Sign up with a new email, then check your inbox'] },
    { title: 'Answered questions', items: ['What counts as a valid email? Format only.'] },
    { title: 'Open questions', items: [] },
    { title: 'Not in this story', items: [] },
  ],
}

const C = { text: '#40404A', muted: '#7E7E88', link: '#4F6D8F', card: '#F6F6F8', white: '#FFFFFF', coral: '#E07A6E' }
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 })
const solid = h => [{ type: 'SOLID', color: rgb(h) }]

const page = figma.root.children.find(p => p.name === 'User story')
if (!page) throw new Error('No "User story" page: run build-template.js first')
await figma.setCurrentPageAsync(page)
await Promise.all([['Inter', 'Regular'], ['Inter', 'Medium'], ['Inter', 'Semi Bold']].map(([family, style]) => figma.loadFontAsync({ family, style })))

const text = (chars, size, style, color, width) => {
  const t = figma.createText()
  t.fontName = { family: 'Inter', style }
  t.fontSize = size
  t.characters = chars
  t.name = chars
  t.fills = solid(color)
  t.lineHeight = { unit: 'PERCENT', value: 140 }
  if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT' }
  return t
}

const old = page.children.find(n => n.name === 'User story' && n.type === 'FRAME')
const frame = figma.createAutoLayout('VERTICAL', { name: 'User story', itemSpacing: 32, paddingTop: 80, paddingBottom: 80, paddingLeft: 80, paddingRight: 80, cornerRadius: 24 })
frame.fills = solid(C.card)
page.appendChild(frame)
frame.resize(1440, frame.height)
frame.counterAxisSizingMode = 'FIXED'
frame.primaryAxisSizingMode = 'AUTO'
if (old) { frame.x = old.x; frame.y = old.y; old.remove() } else { frame.x = 0; frame.y = 0 }

frame.appendChild(text(DATA.title, 48, 'Semi Bold', C.text, 1280))
if (DATA.storyLink) {
  const link = text(DATA.storyLinkLabel, 20, 'Medium', C.link, 1280)
  link.hyperlink = { type: 'URL', value: DATA.storyLink }
  frame.appendChild(link)
}

for (const sec of DATA.sections) {
  const card = figma.createAutoLayout('VERTICAL', { name: sec.title, itemSpacing: 14, paddingTop: 32, paddingBottom: 32, paddingLeft: 40, paddingRight: 40, cornerRadius: 16 })
  card.fills = solid(C.white)
  frame.appendChild(card)
  card.layoutSizingHorizontal = 'FILL'
  card.appendChild(text(sec.title, 24, 'Semi Bold', C.text, 1200))
  const items = sec.items && sec.items.length ? sec.items : null
  if (!items) card.appendChild(text('None', 18, 'Regular', C.muted, 1200))
  for (const it of items || []) {
    const row = figma.createAutoLayout('HORIZONTAL', { name: 'Item', itemSpacing: 14 })
    row.fills = []
    card.appendChild(row)
    row.layoutSizingHorizontal = 'FILL'
    row.appendChild(text('•', 18, 'Semi Bold', C.coral))
    row.appendChild(text(it, 18, 'Regular', C.text, 1160))
  }
}

return { createdNodeIds: [frame.id], frameId: frame.id, pageId: page.id, sections: DATA.sections.length }
