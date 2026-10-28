// Studio: Figma in plain words. Which Figma
// steps can change a file, the file keys in Figma links, and what each Figma
// step is called in the conversation. Pure helpers.

// Figma steps that can change a file, from either Figma connection.
export const FIGMA_WRITE = /^mcp__.*__(use_figma|generate_figma_design|upload_assets|send_code_to_figma|add_code_connect_map|send_code_connect_mappings)$/

// The file keys in Figma links: figma.com/design/<key>/… or …/branch/<branch key>/…
export function keysIn(text) {
  const out = []
  for (const m of String(text || '').matchAll(/figma\.com\/(?:design|file|board|slides|proto)\/([A-Za-z0-9]+)(?:\/branch\/([A-Za-z0-9]+))?/g)) {
    out.push(m[1]); if (m[2]) out.push(m[2])
  }
  return out
}

// The design systems the team listed (STUDIO_DESIGN_SYSTEMS, "Name | link; …"),
// plus the project's own, as { key: name }.
export function designSystemKeys(listed, projectUrl, projectName) {
  const map = {}
  for (const entry of String(listed || '').split(';')) {
    const [name, link] = entry.split('|').map(x => (x || '').trim())
    for (const k of keysIn(link)) map[k] = name || 'the design system'
  }
  for (const k of keysIn(projectUrl)) map[k] = projectName || 'the design system'
  return map
}

// Studio's own question before the first Figma step in a file.
export function figmaQuestion({ fileName, isProject, description }) {
  const where = isProject ? '“' + (fileName || 'this project’s Figma file') + '”' : 'a Figma file that isn’t this project’s own'
  const what = description ? ' Claude says it will: ' + String(description).replace(/\s+/g, ' ').trim().slice(0, 160).replace(/\.?$/, '.') : ''
  return 'Work in ' + where + ' in Figma?' + what + ' Saying yes lets Claude carry on in this file for the rest of the conversation. You can undo in Figma.'
}
export const FIGMA_YES = 'Yes, go ahead'
export const FIGMA_NO = 'No, not now'

// What each Figma step is called in the conversation.
const NAMES = {
  use_figma: 'Working in Figma',
  generate_figma_design: 'Capturing a screen into Figma',
  upload_assets: 'Adding images to Figma',
  send_code_to_figma: 'Sending a prototype to Figma',
  get_metadata: 'Looking at the Figma file',
  get_screenshot: 'Taking a picture of a frame',
  get_design_context: 'Reading a design in Figma',
  get_variable_defs: 'Reading the design’s colours and sizes',
  search_design_system: 'Searching the design system',
  get_libraries: 'Checking the file’s libraries',
  create_new_file: 'Making a new Figma file',
  create_session: 'Opening the Figma file',
  whoami: 'Checking your Figma account',
}
export function friendlyFigma(tool, input) {
  const m = String(tool || '').match(/^mcp__.*__([a-z_]+)$/)
  if (!m || !/figma/i.test(tool)) return null
  const label = NAMES[m[1]]
  if (!label) return null
  const i = input || {}
  const q = Array.isArray(i.queries) ? i.queries.map(x => x && x.query).filter(Boolean).join(', ') : ''
  const detail = i.description || (q ? 'for ' + q : '') || i.fileName || ''
  return { label, detail: String(detail).replace(/\s+/g, ' ').trim().slice(0, 120) }
}
