// Studio's project template, part 1: the pages, the canvas colour and the
// cover. (Figma's connection can't set the file's thumbnail, so the designer
// does that: right-click the Cover frame, Set as thumbnail.) Run it with use_figma in the project's own Figma
// file after filling in DATA (and nothing else). Safe to run again: pages that
// already exist are kept, and the cover is rebuilt in place.
// Layout: Figma page "Proposal · Project template" (112:7), at three times the
// mock-up's size.

const DATA = {
  title: '[SIGN-142] Faster sign-up',   // "[KEY] Title", or just the task's name without a story
  storyLink: '',                         // https link to the user story in Jira, or ''
  storyLinkLabel: 'Open in Jira ↗',      // "Open in Jira ↗" for Jira links
  designer: 'Sam Rivera',
  release: 'Release 4.2',                // or 'Not set yet'
  designSystem: 'Acme Design System',    // or 'N/A'
  status: 'In progress',
  updated: '27 Oct 2026',
  canvas: '#F5F5F5',                     // STUDIO_CANVAS_COLOR, else #F5F5F5
  logoKey: '',                           // the team logo component's key, or '' for no strip
}

const PAGES = ['Cover', 'User story', 'Concept', 'Final design', 'Designer notes']
const C = { text: '#40404A', muted: '#7E7E88', faint: '#9C9CA6', link: '#4F6D8F', card: '#F6F6F8', rule: '#E6E6EA', white: '#FFFFFF' }
const rgb = h => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 })
const solid = h => [{ type: 'SOLID', color: rgb(h) }]
const created = [], mutated = []

// 1. The pages, in order, before any pages already in the file. A new file's
// single empty "Page 1" becomes the Cover instead of staying as a spare page.
const root = figma.root
const byName = name => root.children.find(p => p.name === name)
if (!byName('Cover') && root.children.length === 1 && root.children[0].name === 'Page 1') {
  await root.children[0].loadAsync()
  if (root.children[0].children.length === 0) { root.children[0].name = 'Cover'; mutated.push(root.children[0].id) }
}
PAGES.forEach((name, i) => {
  let page = byName(name)
  if (!page) { page = figma.createPage(); page.name = name; created.push(page.id) }
  root.insertChild(i, page)
})

// 2. Every page's canvas in the team's colour (nothing on the pages moves).
for (const page of root.children) { page.backgrounds = solid(DATA.canvas); mutated.push(page.id) }

// 3. The cover.
const coverPage = byName('Cover')
await figma.setCurrentPageAsync(coverPage)
await Promise.all([['Inter', 'Regular'], ['Inter', 'Medium'], ['Inter', 'Semi Bold']].map(([family, style]) => figma.loadFontAsync({ family, style })))
// 2 : 1, the shape of Figma's file thumbnails. An existing Cover frame is
// emptied and reused, so it stays the file's thumbnail if it was set as one.
let cover = coverPage.children.find(n => n.name === 'Cover' && n.type === 'FRAME')
if (cover) { for (const child of [...cover.children]) child.remove(); mutated.push(cover.id) }
else { cover = figma.createFrame(); cover.name = 'Cover'; cover.x = 0; cover.y = 0; coverPage.appendChild(cover); created.push(cover.id) }
cover.resize(1920, 960)
cover.fills = solid(C.card)
cover.clipsContent = true

const text = (chars, size, style, color, width) => {
  const t = figma.createText()
  t.fontName = { family: 'Inter', style }
  t.fontSize = size
  t.characters = chars
  t.fills = solid(color)
  if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT' }
  return t
}

// The team's logo on a charcoal strip across the top, never recoloured.
if (DATA.logoKey) {
  const strip = figma.createFrame()
  strip.name = 'Team logo strip'
  strip.resize(1920, 216)
  strip.fills = solid(C.text)
  cover.appendChild(strip)
  try {
    const logo = (await figma.importComponentByKeyAsync(DATA.logoKey)).createInstance()
    strip.appendChild(logo)
    logo.rescale(96 / logo.height)
    logo.x = 120; logo.y = 60
  } catch (e) { strip.remove() }
}

const content = figma.createAutoLayout('VERTICAL', { name: 'Cover content', itemSpacing: 42 })
content.fills = []
cover.appendChild(content)
content.x = 120; content.y = DATA.logoKey ? 288 : 160
content.appendChild(text(DATA.title, 102, 'Semi Bold', C.text, 1680))
if (DATA.storyLink) {
  const link = text(DATA.storyLinkLabel, 39, 'Medium', C.link, 1680)
  link.hyperlink = { type: 'URL', value: DATA.storyLink }
  content.appendChild(link)
}
const details = figma.createAutoLayout('HORIZONTAL', { name: 'Details', itemSpacing: 30 })
details.fills = []
content.appendChild(details)
for (const [label, value] of [['Designer', DATA.designer], ['Release', DATA.release], ['Design system', DATA.designSystem], ['Status', DATA.status]]) {
  const box = figma.createAutoLayout('VERTICAL', { name: label, itemSpacing: 6, paddingTop: 24, paddingBottom: 24, paddingLeft: 36, paddingRight: 36, cornerRadius: 24 })
  box.fills = solid(C.white)
  details.appendChild(box)
  box.resize(397, box.height)
  box.counterAxisSizingMode = 'FIXED'
  box.primaryAxisSizingMode = 'AUTO'
  box.appendChild(text(label, 30, 'Medium', C.muted))
  box.appendChild(text(value, 42, 'Semi Bold', C.text, 325))
}
content.appendChild(text('Last updated ' + DATA.updated, 33, 'Regular', C.muted))

// A small "Set up with Studio" in the bottom right corner.
const studio = figma.createAutoLayout('HORIZONTAL', { name: 'Set up with Studio', itemSpacing: 18, counterAxisAlignItems: 'CENTER' })
studio.fills = []
cover.appendChild(studio)
const mark = figma.createNodeFromSvg('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><g fill="none" stroke="#40404A" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5V4.5A2.5 2.5 0 0 1 4.5 2H8.5"/><path d="M15.5 2H19.5A2.5 2.5 0 0 1 22 4.5V8.5"/><path d="M22 15.5V19.5A2.5 2.5 0 0 1 19.5 22H15.5"/><path d="M8.5 22H4.5A2.5 2.5 0 0 1 2 19.5V15.5"/></g><circle cx="12" cy="12" r="3.5" fill="#E07A6E"/></svg>')
mark.name = 'Studio logo'
studio.appendChild(mark)
studio.appendChild(text('Set up with Studio', 30, 'Medium', C.faint))
studio.x = 1920 - 60 - studio.width; studio.y = 960 - 48 - studio.height

return { createdNodeIds: created, mutatedNodeIds: mutated, coverId: cover.id, pages: root.children.map(p => p.name), logo: DATA.logoKey ? Boolean(cover.children.find(n => n.name === 'Team logo strip')) : 'none' }
