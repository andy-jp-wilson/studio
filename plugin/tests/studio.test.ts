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
  const calls = { commands: [] as string[], prompts: [] as string[], aborts: [] as string[], store: new Map<string, unknown>(), spinner: [] as any[] }
  on('session.start', () => ({ cwd: '/work/onboarding' }))
  on('session.cwd', () => ({ value: '/work/onboarding' }))
  on('session.usage', () => ({ value: { startedAt: 0, context: { tokens: 1, window: 2, percent: 42 }, rateLimits: [], cost: 0 } }))
  on('process.run', ($: any, e: any) => {
    const [bin, ...rest] = e.argv
    if (bin === 'lsof') return { value: { exitCode: 0, stdout: 'p123\nn*:4321\n', stderr: '' } }
    const out = map[rest.join(' ')]
    return { value: out === undefined ? { exitCode: 1, stdout: '', stderr: '' } : { exitCode: 0, stdout: out + '\n', stderr: '' } }
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
  on('turn.abort', ($: any, e: any) => { calls.aborts.push(e.turnId); return { value: undefined } })
  on('turn.start', ($: any, e: any) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('tool.call', () => ({ result: 'ok' }))
  on('ui.render', ($: any, e: any) => { if (e.component === 'Spinner') calls.spinner.push(e.props); return { type: 'Text', props: {}, children: ['drawn by Claude Code'] } })
  return calls
}

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
  expect(await ui.find({ type: 'Text', text: 'Calm Claude Code for designers · /guide' })).toBeDefined()
  expect(await ui.find({ key: 'band-preview' })).toBeDefined()
  await ui.unmount()
  const small = await $.ui.mount(BAND(50))
  expect(await small.find({ type: 'Text', text: 'Studio' })).toBeDefined()
  expect(await small.find({ type: 'Text', text: '███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ ' })).toBeUndefined()
  await small.unmount()
  await $.turn.start({ turnId: 't1' })
  const after = await $.ui.mount(BAND(120))
  expect(await after.find({ type: 'Text', text: 'Calm Claude Code for designers · /guide' })).toBeUndefined()
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

test('on the main version with everything saved', async ($, on) => {
  setup(on, { 'branch --show-current': 'main' })
  await start($)
  const ui = await $.ui.mount(BAND(120))
  expect(await ui.find({ type: 'Text', text: 'main version' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'everything saved' })).toBeDefined()
  await ui.unmount()
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
