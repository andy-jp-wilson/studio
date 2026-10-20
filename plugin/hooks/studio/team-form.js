// Studio: the team settings form, a pane opened by /setup (or /team-settings).
// Two ways in: load the team file someone shared (recommended), or type the
// settings in. Saving writes them on this computer only, through
// bin/studio-team; nothing is uploaded.
// Pure drawing: takes the element table, the form's state and its actions.

export const TEAM_PANE = 'studio-team'

export const EMPTY = { teamName: '', uploadPlaces: '', projectsFolder: '', figmaWritePlaces: '', designSystems: [] }

export const FIELDS = [
  { id: 'uploadPlaces', label: 'GitHub repository (optional)', placeholder: 'https://github.com/acme/design-work', hint: 'GitHub is a website where teams store and share project files. If your team uses it, paste the repository (or organisation) designers’ work may go to; Studio will never upload anywhere else. Leave it empty to keep all work on this computer.' },
  { id: 'projectsFolder', label: 'Projects folder on this computer (optional)', placeholder: '~/studio-projects', hint: 'A folder on each designer’s own computer where Studio makes new projects, so everyone’s projects are in the same, easy-to-find place. Leave it empty to use ~/studio-projects, or choose one below. You can also type one: ~ means your home folder, so ~/Documents/Design projects is a folder inside Documents.' },
  { id: 'figmaWritePlaces', label: 'Figma team folder (destination)', placeholder: 'https://www.figma.com/files/team/…/project/…', hint: 'The link to the Figma folder where Studio may create and change files, such as new project files and handover pages. Open the folder in Figma and copy the link from the address bar. Coming in a later version: Studio will then refuse to change files anywhere else.', figma: true },
]

// Settings as Studio stores them (bin/studio-team set KEY value).
export function toSettings(v) {
  const ds = (v.designSystems || [])
    .map(d => ({ name: clean(d.name), link: clean(d.link) }))
    .filter(d => d.name || d.link)
    .map(d => d.name + ' | ' + d.link).join('; ')
  return [
    ['STUDIO_ALLOWED_ORGS', clean(v.uploadPlaces).replace(/\s*,\s*/g, ',')],
    ['STUDIO_PROJECTS_FOLDER', clean(v.projectsFolder)],
    ['STUDIO_FIGMA_WRITE_PLACES', clean(v.figmaWritePlaces)],
    ['STUDIO_DESIGN_SYSTEMS', ds],
  ]
}

function clean(s) { return String(s || '').replace(/[|;]/g, ' ').replace(/\s+/g, ' ').trim() }

export function isSet(v) {
  return Boolean(v && (v.uploadPlaces || v.projectsFolder || v.figmaWritePlaces || (v.designSystems || []).length))
}

const heading = (Text, key, text) => Text({ key, bold: true, children: [text] })
const note = (Text, key, text, color = 'subtle') => Text({ key, color, wrap: 'wrap', children: [text] })
const gap = (Text, key) => Text({ key, children: [' '] })

function summary(el, v, prefix) {
  const { Box, Text } = el
  const rows = [
    ['GitHub repository', v.uploadPlaces], ['Projects folder', v.projectsFolder],
    ['Figma team folder', v.figmaWritePlaces],
    ['Design systems', (v.designSystems || []).map(d => d.name || d.link).join(', ')],
  ]
  return Box({ key: prefix + '-summary', flexDirection: 'column', borderStyle: 'round', paddingX: 1, children: rows.map(([k, val], i) =>
    Box({ key: prefix + '-row-' + i, flexDirection: 'row', columnGap: 1, children: [
      Text({ key: prefix + '-k-' + i, color: 'subtle', children: [(k + ':').padEnd(19)] }),
      Text({ key: prefix + '-v-' + i, color: val ? 'text' : 'inactive', wrap: 'wrap', children: [val || 'Not set'] }),
    ] })) })
}

function choose(el, f, a) {
  const { Box, Text, Button } = el
  const out = [
    note(Text, 'intro', 'Studio can use your team’s settings: your design systems, where projects go, and where work may be shared. Every one is optional, and they stay on this computer.'),
    gap(Text, 'g1'),
  ]
  if (isSet(f.current)) {
    out.push(heading(Text, 'h-current', 'Already saved here'), summary(el, f.current, 'cur'), gap(Text, 'g2'))
    out.push(Box({ key: 'keep-row', flexDirection: 'row', columnGap: 2, children: [
      Button({ key: 'keep', label: 'Keep these', hotkey: 'k', onPress: a.keep }),
      Button({ key: 'change', label: 'Change them', hotkey: 'c', dimColor: true, onPress: a.manual }),
    ] }), gap(Text, 'g3'))
  }
  out.push(heading(Text, 'h-how', isSet(f.current) ? 'Or start again' : 'How would you like to add them?'))
  out.push(Box({ key: 'how-load', flexDirection: 'column', borderStyle: 'round', paddingX: 1, children: [
    Box({ key: 'how-load-row', flexDirection: 'row', columnGap: 1, children: [
      Button({ key: 'load', label: 'Load a team file', hotkey: 'l', onPress: a.file }),
      Text({ key: 'rec', color: 'success', children: ['Recommended'] }),
    ] }),
    note(Text, 'load-note', 'Use the file the person who looks after your team shared. Nothing to type, and no links to get wrong.'),
  ] }))
  out.push(Box({ key: 'how-type', flexDirection: 'column', borderStyle: 'round', paddingX: 1, children: [
    Button({ key: 'type', label: 'Type them in', hotkey: 't', onPress: a.manual }),
    note(Text, 'type-note', 'Fill in each setting yourself, for example if you’re the first on your team.'),
  ] }))
  return out
}

function fileStep(el, f, a) {
  const { Box, Text, Button, Input } = el
  return [
    heading(Text, 'h-file', 'Load a team file'),
    note(Text, 'file-note', 'It ends in .studio-team.json. Choose it, or drag it into the box and press Enter.'),
    gap(Text, 'g1'),
    Button({ key: 'pick-file', label: 'Choose the file…', hotkey: 'c', onPress: a.pickFile }),
    Input({ key: 'file-path', label: 'Team file', placeholder: '~/Desktop/acme-design.studio-team.json', value: f.path, autoFocus: true, submitLabel: 'load', onInput: v => a.setPath(v), onSubmit: v => a.load(v) }),
    ...(f.error ? [note(Text, 'file-error', f.error, 'warning')] : []),
    gap(Text, 'g2'),
    Box({ key: 'file-buttons', flexDirection: 'row', columnGap: 2, children: [
      Button({ key: 'file-load', label: 'Load', hotkey: 'l', onPress: () => a.load(f.path) }),
      Button({ key: 'file-type', label: 'Type them in instead', hotkey: 't', dimColor: true, onPress: a.manual }),
      Button({ key: 'file-back', label: 'Back', hotkey: 'b', dimColor: true, onPress: a.back }),
    ] }),
  ]
}

function edit(el, f, a) {
  const { Box, Text, Button, Input } = el
  const v = f.values
  const out = [
    heading(Text, 'h-edit', f.loadedFrom ? 'Check your team’s settings' : 'Your team’s settings'),
    note(Text, 'edit-note', f.loadedFrom ? 'Loaded from ' + f.loadedFrom + '. Change anything that’s wrong, then save.' : 'Leave anything that doesn’t apply empty; Studio works without it.'),
    gap(Text, 'g1'),
  ]
  FIELDS.forEach(fd => {
    out.push(Input({ key: 'f-' + fd.id, label: fd.label, placeholder: fd.placeholder, value: v[fd.id], onInput: x => a.setField(fd.id, x), onSubmit: x => a.setField(fd.id, x) }))
    if (fd.id === 'projectsFolder') out.push(Button({ key: 'pick-folder', label: 'Choose a folder…', hotkey: 'f', dimColor: true, onPress: a.pickFolder }))
    if (fd.figma && v[fd.id] && !/figma\.com\//.test(v[fd.id])) out.push(note(Text, 'bad-' + fd.id, 'This doesn’t look like a Figma link yet.', 'warning'))
    out.push(note(Text, 'hint-' + fd.id, fd.hint))
  })
  out.push(gap(Text, 'g2'), heading(Text, 'h-ds', 'Design systems'),
    note(Text, 'ds-note', 'Every design system your team still uses, for example a newer one and an older one. Designers choose one for each project.'))
  ;(v.designSystems.length ? v.designSystems : [{ name: '', link: '' }]).forEach((d, i) => {
    const bad = d.link && !/figma\.com\//.test(d.link)
    out.push(Box({ key: 'ds-' + i, flexDirection: 'column', borderStyle: 'round', paddingX: 1, children: [
      Input({ key: 'ds-name-' + i, label: 'Name', placeholder: 'Acme Design System', value: d.name, onInput: x => a.setDs(i, 'name', x), onSubmit: x => a.setDs(i, 'name', x) }),
      Input({ key: 'ds-link-' + i, label: 'Figma link', placeholder: 'https://www.figma.com/design/…', value: d.link, onInput: x => a.setDs(i, 'link', x), onSubmit: x => a.setDs(i, 'link', x) }),
      ...(bad ? [note(Text, 'ds-bad-' + i, 'This doesn’t look like a Figma link yet.', 'warning')] : []),
      Button({ key: 'ds-remove-' + i, label: 'Remove', dimColor: true, onPress: () => a.removeDs(i) }),
    ] }))
  })
  out.push(Button({ key: 'ds-add', label: '+ Add a design system', hotkey: 'a', dimColor: true, onPress: a.addDs }))
  out.push(gap(Text, 'g3'))
  if (f.error) out.push(note(Text, 'save-error', f.error, 'warning'))
  out.push(Box({ key: 'edit-buttons', flexDirection: 'row', columnGap: 2, children: [
    Button({ key: 'save', label: f.saving ? 'Saving…' : 'Save', hotkey: 's', onPress: a.save }),
    Button({ key: 'edit-back', label: 'Back', hotkey: 'b', dimColor: true, onPress: a.back }),
  ] }))
  out.push(note(Text, 'stays', 'Saved on this computer only. Nothing is uploaded.'))
  return out
}

function saved(el, f, a) {
  const { Box, Text, Button } = el
  const out = [
    Text({ key: 'saved-tick', color: 'success', bold: true, children: ['✓ Team settings saved on this computer'] }),
    gap(Text, 'g1'),
    summary(el, f.values, 'saved'),
    gap(Text, 'g2'),
    note(Text, 'restart', 'Studio uses them straight away in /setup. Restart the Claude app before uploading anything, so the upload check uses them too.'),
    gap(Text, 'g3'),
  ]
  if (f.exported) out.push(Text({ key: 'exported', color: 'success', wrap: 'wrap', children: ['✓ Team file saved: ' + f.exported] }), note(Text, 'exported-note', 'Share it with your designers however your team shares files. They choose “Load a team file” in /setup.'), gap(Text, 'g4'))
  out.push(Box({ key: 'saved-buttons', flexDirection: 'row', columnGap: 2, children: [
    Button({ key: 'export', label: 'Save a copy for the team', hotkey: 'e', onPress: a.exportFile }),
    Button({ key: 'saved-change', label: 'Change', hotkey: 'c', dimColor: true, onPress: a.manual }),
  ] }))
  return out
}

export function drawTeamForm(el, f, a, columns) {
  const { Box, Text } = el
  const body = f.step === 'file' ? fileStep(el, f, a) : f.step === 'edit' ? edit(el, f, a) : f.step === 'saved' ? saved(el, f, a) : choose(el, f, a)
  return Box({ key: 'team-form', flexDirection: 'column', width: columns, children: [
    Text({ key: 'team-eyebrow', color: 'claude', bold: true, children: ['STUDIO · TEAM SETTINGS'] }),
    gap(Text, 'top-gap'),
    ...body,
  ] })
}
