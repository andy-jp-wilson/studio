// Keeps the cover current when the Designer notes change: its Status and
// "Last updated" date. Run it with use_figma in the project's own Figma file
// after filling in DATA (and nothing else). Changes nothing else; does nothing
// if the file has no template cover.

const DATA = {
  status: 'Feedback',
  updated: '27 Oct 2026',
}

const page = figma.root.children.find(p => p.name === 'Cover')
if (!page) return { skipped: 'no Cover page' }
await figma.setCurrentPageAsync(page)
const cover = page.children.find(n => n.name === 'Cover' && n.type === 'FRAME')
if (!cover) return { skipped: 'no Cover frame' }
const mutated = []
const set = async (t, chars) => {
  await Promise.all(t.getStyledTextSegments(['fontName']).map(s => figma.loadFontAsync(s.fontName)))
  t.characters = chars
  t.name = chars
  mutated.push(t.id)
}
const status = cover.findOne(n => n.type === 'FRAME' && n.name === 'Status')
const value = status && status.findAll(n => n.type === 'TEXT')[1]
if (value) await set(value, DATA.status)
const date = cover.findOne(n => n.type === 'TEXT' && n.characters.startsWith('Last updated'))
if (date) await set(date, 'Last updated ' + DATA.updated)
return { mutatedNodeIds: mutated }
