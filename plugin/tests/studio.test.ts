import { expect, test } from 'claude-code/testing'

const NOW = 1_800_000_000_000
const GIT: Record<string, string> = {
  'rev-parse --is-inside-work-tree': 'true',
  'rev-parse --show-toplevel': '/work/onboarding',
  'branch --show-current': 'bolder-button',
  'rev-parse --verify -q main': 'abc123',
  'rev-list --count main..HEAD': '2',
  'log -1 --format=%ct': String(Math.round(NOW / 1000) - 120),
  'log -1 --format=%s': 'Calmer sign-up',
  'branch --format=%(refname:short)': 'bolder-button\nmain',
  'status --porcelain': '',
}

const BAND = (columns: number, surface: 'terminal' | 'desktop' = 'terminal') => ({
  plugin: 'studio', component: 'AbovePrompt', requestId: 'above-prompt', surface,
  viewport: { columns, rows: 40 },
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: columns, scroll: { offset: 0, bodyRows: 10 }, view: {} },
}) as const

const PANE = (surface: 'terminal' | 'desktop' = 'desktop') => ({
  plugin: 'studio', component: 'Pane', requestId: 'studio', surface,
  viewport: { columns: 160, rows: 50 },
  props: { title: 'Studio', isFocused: true, bodyColumns: 48, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} },
}) as const

// Stubs every Claude Code answer the mod needs, and records what it asked for.
function setup(on: any, git: Record<string, string> = {}) {
  const map = { ...GIT, ...git }
  const calls = { commands: [] as string[], prompts: [] as string[], aborts: [] as string[], store: new Map<string, unknown>(), spinner: [] as any[], team: [] as string[][], words: [] as string[][], wordsOff: false, designs: 'figma' }
  on('session.start', () => ({ cwd: '/work/onboarding' }))
  on('session.cwd', () => ({ value: '/work/onboarding' }))
  on('session.usage', () => ({ value: { startedAt: 0, context: { tokens: 1, window: 2, percent: 42 }, rateLimits: [], cost: 0 } }))
  on('process.run', ($: any, e: any) => {
    const [bin, ...rest] = e.argv
    if (String(bin).endsWith('/bin/studio-prefs')) {
      if (rest[0] === 'designs') calls.designs = rest[1]
      return { value: { exitCode: 0, stdout: rest[0] === 'show' ? `designs: ${calls.designs}\n` : 'ok\n', stderr: '' } }
    }
    if (String(bin).endsWith('/bin/studio-words')) {
      calls.words.push(rest)
      if (rest[0] === 'off') calls.wordsOff = true
      if (rest[0] === 'on') calls.wordsOff = false
      return { value: { exitCode: 0, stdout: rest[0] === 'show' ? `explain: ${calls.wordsOff ? 'off' : 'on'}\nknown: ${map['words-known'] ?? ''}\n` : 'ok\n', stderr: '' } }
    }
    if (String(bin).endsWith('/bin/studio-team')) {
      calls.team.push(rest)
      const ok = (stdout: string) => ({ value: { exitCode: 0, stdout: stdout + '\n', stderr: '' } })
      if (rest[0] === 'json') return ok(map['team-json'] ?? '{"teamName":"","uploadPlaces":"","projectsFolder":"","figmaWritePlaces":"","designSystems":[]}')
      if (rest[0] === 'read') return ok(map['team-read'] ?? 'not-a-team-file')
      if (rest[0] === 'set') return ok((rest[2] ? 'set ' : 'removed ') + rest[1])
      if (rest[0] === 'export') return ok('saved /Users/sam/Desktop/acme-design.studio-team.json')
      if (rest[0] === 'pick-folder') return ok(map['team-pick-folder'] ?? 'cancelled')
      if (rest[0] === 'pick-file') return ok(map['team-pick-file'] ?? 'cancelled')
      return ok('')
    }
    if (String(bin).endsWith('/bin/studio-version')) {
      const line = map['studio-version']
      return { value: line === undefined ? { exitCode: 1, stdout: '', stderr: '' } : { exitCode: 0, stdout: line + '\n', stderr: '' } }
    }
    if (bin === 'lsof') return { value: { exitCode: 0, stdout: 'p123\nn*:4321\n', stderr: '' } }
    const out = map[rest.join(' ')]
    return { value: out === undefined ? { exitCode: 1, stdout: '', stderr: '' } : { exitCode: 0, stdout: out + '\n', stderr: '' } }
  })
  on('fs.read', ($: any, e: any) => {
    if (map['version'] && String(e.path).endsWith('/.claude-plugin/plugin.json')) return { value: JSON.stringify({ name: 'studio', version: map['version'] }) }
    if (map['project-notes'] && String(e.path).endsWith('/.studio/project.json')) return { value: map['project-notes'] }
    return { deny: 'missing' }
  })
  on('clock.now', () => ({ value: NOW }))
  on('clock.every', () => ({ value: {} }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('command.register', () => ({ value: undefined }))
  on('store.get', ($: any, e: any) => ({ value: calls.store.get(e.key) }))
  on('store.set', ($: any, e: any) => { calls.store.set(e.key, e.value); return { value: undefined } })
  on('store.delete', ($: any, e: any) => { calls.store.delete(e.key); return { value: undefined } })
  on('command.run', ($: any, e: any) => { calls.commands.push(e.command); return {} })
  on('prompt.submit', ($: any, e: any) => { calls.prompts.push(e.text); return { text: e.text } })
  on('ui.toast', () => ({ value: undefined }))
  on('turn.abort', ($: any, e: any) => { calls.aborts.push(e.turnId); return { value: undefined } })
  on('turn.start', ($: any, e: any) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('tool.call', () => ({ result: 'ok' }))
  on('ui.render', ($: any, e: any) => { if (e.component === 'Spinner') calls.spinner.push(e.props); return { type: 'Text', props: {}, children: ['drawn by Claude Code'] } })
  return calls
}

const TEAM = (surface: 'terminal' | 'desktop' = 'desktop') => ({
  plugin: 'studio', component: 'Pane', requestId: 'studio-team', surface,
  viewport: { columns: 160, rows: 60 },
  props: { title: 'Team settings', isFocused: true, bodyColumns: 56, placement: 'dock', scroll: { offset: 0, bodyRows: 56 }, view: {} },
}) as const
const TEAM_FILE = JSON.stringify({ teamName: 'Acme Design', uploadPlaces: 'acme', projectsFolder: '', figmaWritePlaces: '',
  designSystems: [{ name: 'Acme DS', link: 'https://www.figma.com/design/aaa/Acme' }, { name: 'Acme Classic', link: 'https://www.figma.com/design/bbb/Classic' }] })

const start = ($: any) => $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work/onboarding' })
// One finished request, so the band shows the journey rather than the welcome.
const pastWelcome = async ($: any) => {
  await start($)
  await $.turn.start({ turnId: 't0' })
  await $.turn.complete({ turnId: 't0', answer: '', durationMs: 1, isAborted: false, usage: null })
}
const UNSAVED = { 'status --porcelain': ' M styles.css' }

test('a new session opens with the Studio welcome', async ($, on) => {
  setup(on)
  await start($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: '███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Clearer, calmer Claude Code for designers · /guide' })).toBeDefined()
  expect(await ui.find({ key: 'band-preview' })).toBeDefined()
  await ui.unmount()
  const small = await $.ui.mount(BAND(50))
  expect(await small.find({ type: 'Text', text: 'Studio' })).toBeDefined()
  expect(await small.find({ type: 'Text', text: '███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ' })).toBeUndefined()
  await small.unmount()
  await $.turn.start({ turnId: 't1' })
  const after = await $.ui.mount(BAND(120))
  expect(await after.find({ type: 'Text', text: 'Clearer, calmer Claude Code for designers · /guide' })).toBeUndefined()
})

test('the welcome shows where you left off, without typing /start', async ($, on) => {
  setup(on, { 'status --porcelain': ' M styles.css\n M SignUpScreen.tsx' })
  await start($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'onboarding' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'exploring ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'bolder-button' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '“Calmer sign-up”' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: ', 2m ago' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '2 files not saved yet' })).toBeDefined()
  await ui.unmount()
  const small = await $.ui.mount(BAND(50))
  expect(await small.find({ type: 'Text', text: 'onboarding · bolder-button · not saved yet · /guide' })).toBeDefined()
  await small.unmount()
})

test('on the main design with everything saved', async ($, on) => {
  setup(on, { 'branch --show-current': 'main' })
  await start($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'main design' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'everything saved' })).toBeDefined()
  await ui.unmount()
})

test('the app draws the STUDIO pixel lettering as a picture; the terminal keeps the big one', async ($, on) => {
  setup(on)
  await start($)
  const app = await $.ui.mount(BAND(120, 'desktop'))
  expect(await app.find({ type: 'Svg' })).toBeDefined()
  expect(await app.find({ type: 'Text', text: '███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ' })).toBeUndefined()
  expect(await app.find({ type: 'Text', text: 'Clearer, calmer Claude Code for designers · /guide' })).toBeDefined()
  await app.unmount()
  const term = await $.ui.mount(BAND(120, 'terminal'))
  expect(await term.find({ type: 'Svg' })).toBeUndefined()
  expect(await term.find({ type: 'Text', text: '███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ' })).toBeDefined()
  await term.unmount()
})

test('the welcome and panel show the Studio version; an update shows a note', async ($, on) => {
  setup(on, { 'version': '0.2.2', 'studio-version': 'up-to-date 0.2.2' })
  await start($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'Clearer, calmer Claude Code for designers · v0.2.2 · /guide' })).toBeDefined()
  expect(await ui.find({ key: 'welcome-update' })).toBeUndefined()
  await ui.unmount()
  const pane = await $.ui.mount(PANE())
  expect(await pane.find({ type: 'Text', text: 'Studio v0.2.2' })).toBeDefined()
  await pane.unmount()
})

test('when a newer Studio is ready, the welcome and panel say so', async ($, on) => {
  setup(on, { 'version': '0.2.2', 'studio-version': 'update-available 0.2.2 0.2.3' })
  await start($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'Update ready · /version' })).toBeDefined()
  await ui.unmount()
  const pane = await $.ui.mount(PANE())
  expect(await pane.find({ type: 'Text', text: ' · v0.2.3 ready, type /version' })).toBeDefined()
  await pane.unmount()
})

test('a folder without save points says so in the welcome', async ($, on) => {
  setup(on, { 'rev-parse --is-inside-work-tree': 'false' })
  await start($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'Save points aren’t set up here yet; /start can set them up' })).toBeDefined()
  await ui.unmount()
})

test('the band shows the journey, ready text, when you last saved and Preview when idle', async ($, on) => {
  setup(on)
  await pastWelcome($)
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount(BAND(120, surface))
    expect(await ui.find({ type: 'Text', text: '✓ Explore' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '● Refine' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '○ Build' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Ready when you are' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '✓ Saved 2m ago' })).toBeDefined()
    expect(await ui.find({ key: 'band-preview' })).toBeDefined()
    expect(await ui.find({ key: 'band-save' })).toBeUndefined()
    expect(await ui.find({ key: 'band-stop' })).toBeUndefined()
    await ui.unmount()
  }
})

test('while Claude works, the band says what it is doing and offers Stop', async ($, on) => {
  const calls = setup(on)
  await start($)
  await $.turn.start({ turnId: 't1' })
  await $.tool.call({ tool: 'Edit', file_path: '/work/onboarding/styles.css', old_string: 'a', new_string: 'b' })
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'Editing styles.css' })).toBeDefined()
  await ui.press({ key: 'band-stop' })
  expect(calls.aborts).toEqual(['t1'])
})

test('a step list adds "step 2 of 3"', async ($, on) => {
  setup(on)
  await start($)
  await $.turn.start({ turnId: 't1' })
  await $.tool.call({ tool: 'TodoWrite', todos: [
    { content: 'Soften the heading', activeForm: 'Softening the heading', status: 'completed' },
    { content: 'Add space above Continue', activeForm: 'Adding space above Continue', status: 'in_progress' },
    { content: 'Quiet the helper text', activeForm: 'Quieting the helper text', status: 'pending' },
  ] })
  await $.tool.call({ tool: 'Read', file_path: '/work/onboarding/styles.css' })
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'Reading styles.css, step 2 of 3' })).toBeDefined()
})

test('with new changes, the band says so and Save point appears; buttons run /preview and /save', async ($, on) => {
  const calls = setup(on, UNSAVED)
  await pastWelcome($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'Changes not saved yet' })).toBeDefined()
  await ui.press({ key: 'band-preview' })
  await ui.press({ key: 'band-save' })
  expect(calls.commands).toEqual(['preview', 'save'])
})

test('a narrow band drops the Now text and stage names, keeping buttons', async ($, on) => {
  setup(on, UNSAVED)
  await pastWelcome($)
  const ui = await $.ui.mount(BAND(50))
  expect(await ui.find({ type: 'Text', text: 'Ready when you are' })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: '●' })).toBeDefined()
  expect(await ui.find({ key: 'band-save' })).toBeDefined()
})

test('the working line uses the plain wording', async ($, on) => {
  const calls = setup(on)
  await start($)
  await $.turn.start({ turnId: 't1' })
  await $.tool.call({ tool: 'Bash', command: 'git commit -m "Calmer heading"' })
  await $.ui.mount({ plugin: 'studio', component: 'Spinner', requestId: 'main', surface: 'terminal', viewport: { columns: 100, rows: 30 },
    props: { word: 'Sauteing', message: null, suffix: '…', mode: 'tool-use' } } as any)
  expect(calls.spinner.at(-1).message).toBe('Making a save point')
})

test('the panel journey tab shows stages, happening now, actions and footer', async ($, on) => {
  setup(on)
  await start($)
  await $.turn.start({ turnId: 't1' })
  await $.tool.call({ tool: 'Bash', command: 'git commit -m "x"' })
  await $.turn.complete({ turnId: 't1', answer: 'Done', durationMs: 10, isAborted: false, usage: null })
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount(PANE(surface))
    const wanted: [string, any][] = [
      ['journey label', { type: 'Text', text: 'YOUR JOURNEY' }],
      ['refine detail', { type: 'Text', text: '  2 save points on bolder-button' }],
      ['save step', { type: 'Text', text: 'Making a save point' }],
      ['did you know', { type: 'Text', text: 'Developers call a save point a “commit”.' }],
      ['preview link', { type: 'Link', text: 'Open preview' }],
      ['footer', { type: 'Text', text: 'exploring bolder-button  ·  ' }],
      ['save status', { type: 'Text', text: '✓ Saved 2m ago' }],
    ]
    const missing: string[] = []
    for (const [name, q] of wanted) if (!(await ui.find(q))) missing.push(surface + ': ' + name)
    expect(missing).toEqual([])
    expect(await ui.find({ key: 'pane-save' })).toBeUndefined()
    await ui.unmount()
  }
})

test('pressing a stage remembers your choice for this project', async ($, on) => {
  const calls = setup(on)
  await start($)
  const ui = await $.ui.mount(PANE())
  await ui.press({ key: 'set-Build' })
  expect(calls.store.get('stage:/work/onboarding')).toBe('Build')
  expect(await ui.find({ type: 'Text', text: '● Build' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'You chose this stage.' })).toBeDefined()
  await ui.press({ key: 'set-auto' })
  expect(calls.store.has('stage:/work/onboarding')).toBe(false)
})

test('the glossary tab lists words and searches them', async ($, on) => {
  setup(on)
  await start($)
  const ui = await $.ui.mount(PANE())
  await ui.press({ key: 'tab-glossary' })
  expect(await ui.find({ type: 'Text', text: 'commit' })).toBeDefined()
  await ui.input({ key: 'search', text: 'branch' })
  expect(await ui.find({ type: 'Text', text: 'Exploration' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Save point' })).toBeUndefined()
})

test('Send to Figma asks Claude, Guide and Save point run commands, and /panel opens the panel', async ($, on) => {
  const calls = setup(on, UNSAVED)
  await start($)
  const ui = await $.ui.mount(PANE())
  await ui.press({ key: 'pane-figma' })
  expect(calls.prompts.at(-1)).toMatch(/Figma/)
  await ui.press({ key: 'pane-guide' })
  await ui.press({ key: 'pane-save' })
  expect(calls.commands).toEqual(['guide', 'save'])
  expect(await ui.find({ type: 'Text', text: 'Changes not saved yet' })).toBeDefined()
  const answer = await $.command.run({ command: 'panel', args: '' })
  expect(answer).toEqual({})
})

test('the team form offers a team file (recommended) or typing, and typing saves only on this computer', async ($, on) => {
  const calls = setup(on)
  await start($)
  expect(await $.command.run({ command: 'team-settings', args: '' })).toEqual({})
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount(TEAM(surface))
    expect(await ui.find({ key: 'load' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Recommended' })).toBeDefined()
    expect(await ui.find({ key: 'type' })).toBeDefined()
    await ui.unmount()
  }
  const ui = await $.ui.mount(TEAM())
  await ui.press({ key: 'type' })
  await ui.input({ key: 'f-uploadPlaces', text: 'acme, acme-labs' })
  await ui.input({ key: 'f-figmaWritePlaces', text: 'Product Design' })
  expect(await ui.find({ type: 'Text', text: 'This doesn’t look like a Figma link yet.' })).toBeDefined()
  await ui.input({ key: 'f-figmaWritePlaces', text: 'https://www.figma.com/files/team/1/project/2' })
  expect(await ui.find({ type: 'Text', text: 'This doesn’t look like a Figma link yet.' })).toBeUndefined()
  await ui.input({ key: 'ds-name-0', text: 'Acme DS' })
  await ui.input({ key: 'ds-link-0', text: 'not a link' })
  expect(await ui.find({ type: 'Text', text: 'This doesn’t look like a Figma link yet.' })).toBeDefined()
  await ui.input({ key: 'ds-link-0', text: 'https://www.figma.com/design/aaa/Acme' })
  await ui.press({ key: 'save' })
  const sets = calls.team.filter(c => c[0] === 'set')
  expect(sets.find(c => c[1] === 'STUDIO_TEAM_NAME')).toBeUndefined()
  expect(sets).toContainEqual(['set', 'STUDIO_ALLOWED_ORGS', 'acme,acme-labs'])
  expect(sets).toContainEqual(['set', 'STUDIO_DESIGN_SYSTEMS', 'Acme DS | https://www.figma.com/design/aaa/Acme'])
  expect(await ui.find({ type: 'Text', text: '✓ Team settings saved on this computer' })).toBeDefined()
  expect(calls.prompts.at(-1)).toMatch(/saved their team settings/)
  await ui.press({ key: 'export' })
  expect(await ui.find({ type: 'Text', text: '✓ Team file saved: /Users/sam/Desktop/acme-design.studio-team.json' })).toBeDefined()
})

test('loading a team file fills the form for checking; a wrong file says so', async ($, on) => {
  setup(on, { 'team-read': TEAM_FILE })
  await start($)
  await $.command.run({ command: 'team-settings', args: '' })
  const ui = await $.ui.mount(TEAM())
  await ui.press({ key: 'load' })
  await ui.input({ key: 'file-path', text: '~/Desktop/acme-design.studio-team.json' })
  expect(await ui.find({ type: 'Text', text: 'Check your team’s settings' })).toBeDefined()
  expect(await ui.find({ key: 'ds-name-1' })).toBeDefined()
})

test('a file that isn’t a team file is refused calmly', async ($, on) => {
  setup(on)
  await start($)
  await $.command.run({ command: 'team-settings', args: '' })
  const ui = await $.ui.mount(TEAM())
  await ui.press({ key: 'load' })
  await ui.input({ key: 'file-path', text: '/Users/sam/Desktop/notes.txt' })
  expect(await ui.find({ type: 'Text', text: 'That isn’t a Studio team file, or it can’t be opened. Check the file, or type the settings in instead.' })).toBeDefined()
})

test('/setup opens the form by running studio-team form, and saving tells Claude to carry on', async ($, on) => {
  const calls = setup(on, { 'team-read': TEAM_FILE })
  await start($)
  await $.tool.call({ tool: 'Bash', command: 'studio-team form' })
  const ui = await $.ui.mount(TEAM())
  await ui.press({ key: 'load' })
  await ui.input({ key: 'file-path', text: '~/Desktop/acme-design.studio-team.json' })
  await ui.press({ key: 'save' })
  expect(calls.prompts.at(-1)).toMatch(/saved their team settings.*Acme DS, Acme Classic.*carry on with it/)
})

test('Choose a folder and Choose the file use the Mac pickers', async ($, on) => {
  const calls = setup(on, { 'team-pick-folder': '~/Documents/Design projects', 'team-pick-file': '~/Desktop/acme.studio-team.json', 'team-read': TEAM_FILE })
  await start($)
  await $.command.run({ command: 'team-settings', args: '' })
  const ui = await $.ui.mount(TEAM())
  await ui.press({ key: 'type' })
  await ui.press({ key: 'pick-folder' })
  await ui.press({ key: 'save' })
  expect(calls.team.filter(c => c[0] === 'set')).toContainEqual(['set', 'STUDIO_PROJECTS_FOLDER', '~/Documents/Design projects'])
  await ui.press({ key: 'saved-change' })
  await ui.press({ key: 'edit-back' })
  await ui.press({ key: 'load' })
  await ui.press({ key: 'pick-file' })
  expect(calls.team).toContainEqual(['read', '~/Desktop/acme.studio-team.json'])
  expect(await ui.find({ type: 'Text', text: 'Check your team’s settings' })).toBeDefined()
})

test('cancelling the picker changes nothing', async ($, on) => {
  setup(on)
  await start($)
  await $.command.run({ command: 'team-settings', args: '' })
  const ui = await $.ui.mount(TEAM())
  await ui.press({ key: 'load' })
  await ui.press({ key: 'pick-file' })
  expect(await ui.find({ key: 'file-path' })).toBeDefined()
})

const COMPOSE = { model: 'claude-opus-5-5', promptModel: 'claude-opus-5-5', surfaces: ['desktop'], tools: [], outputStyle: null, traits: [], sections: [] }

test('the panel switches word explanations off and on, and Claude is told before each reply', async ($, on) => {
  const calls = setup(on, { 'words-known': '.gitignore' })
  let note = ''
  on('prompt.compose', ($: any, e: any) => ({ sections: [{ id: 'intro', text: 'x', scope: 'shared' }] }))
  await start($)
  const ui = await $.ui.mount(PANE())
  expect(await ui.find({ key: 'pane-words' })).toBeDefined()
  let r: any = await $.prompt.compose(COMPOSE)
  note = r.sections.find((x: any) => x.id === 'studio:words').text
  expect(note).toMatch(/ON/)
  expect(note).toMatch(/\.gitignore/)
  await ui.press({ key: 'pane-words' })
  expect(calls.words).toContainEqual(['off'])
  r = await $.prompt.compose(COMPOSE)
  expect(r.sections.find((x: any) => x.id === 'studio:words').text).toMatch(/OFF/)
  await ui.press({ key: 'pane-words' })
  expect(calls.words).toContainEqual(['on'])
})

const NOTES = JSON.stringify({ targetFileUrl: 'https://www.figma.com/design/abc/Onboarding', targetFileName: 'Onboarding', designSystemName: 'Acme DS', designSystemUrl: 'https://www.figma.com/design/ds/Acme' })

test('design work defaults to Figma: Claude is told the project file, and the band links to it', async ($, on) => {
  setup(on, { 'project-notes': NOTES })
  on('prompt.compose', () => ({ sections: [{ id: 'intro', text: 'x', scope: 'shared' }] }))
  await start($)
  const r: any = await $.prompt.compose(COMPOSE)
  const note = r.sections.find((x: any) => x.id === 'studio:project').text
  expect(note).toMatch(/happens in Figma, in "Onboarding" \(https:\/\/www\.figma\.com\/design\/abc\/Onboarding\)/)
  expect(note).toMatch(/Acme DS/)
  expect(note).toMatch(/only make HTML or CSS files if the person asks for a prototype/)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Link' })).toBeDefined()
  expect(await ui.find({ key: 'band-preview' })).toBeUndefined()
})

test('with a prototype, Claude knows about it and the band offers Preview', async ($, on) => {
  setup(on, { 'project-notes': NOTES, '/work/onboarding/prototype -type f ! -name .DS_Store -print -quit': '/work/onboarding/prototype/index.html' })
  on('prompt.compose', () => ({ sections: [] }))
  await start($)
  const r: any = await $.prompt.compose(COMPOSE)
  expect(r.sections.find((x: any) => x.id === 'studio:project').text).toMatch(/also has a prototype/)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ key: 'band-preview' })).toBeDefined()
})

test('without Studio notes, Claude is told to offer /setup and not to make HTML unasked', async ($, on) => {
  setup(on)
  on('prompt.compose', () => ({ sections: [] }))
  await start($)
  const r: any = await $.prompt.compose(COMPOSE)
  expect(r.sections.find((x: any) => x.id === 'studio:project').text).toMatch(/hasn’t been set up with \/setup.*Only make HTML or CSS files if they ask for a prototype/)
})

test('Designs go to: Figma by default, and the panel can make prototypes the default', async ($, on) => {
  const calls = setup(on, { 'project-notes': NOTES })
  on('prompt.compose', () => ({ sections: [] }))
  await start($)
  const pane = await $.ui.mount(PANE())
  expect(await pane.find({ key: 'pane-designs' })).toBeDefined()
  let r: any = await $.prompt.compose(COMPOSE)
  expect(r.sections.find((x: any) => x.id === 'studio:project').text).toMatch(/happens in Figma/)
  await pane.press({ key: 'pane-designs' })
  expect(calls.designs).toBe('prototype')
  r = await $.prompt.compose(COMPOSE)
  const note = r.sections.find((x: any) => x.id === 'studio:project').text
  expect(note).toMatch(/made prototypes their default/)
  expect(note).toMatch(/Work in Figma only when they ask or it’s needed/)
  const band = await $.ui.mount(BAND(120))
  expect(await band.find({ key: 'band-preview' })).toBeDefined()
  await pane.press({ key: 'pane-designs' })
  expect(calls.designs).toBe('figma')
})
