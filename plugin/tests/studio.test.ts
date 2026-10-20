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
  const calls = { commands: [] as string[], prompts: [] as string[], aborts: [] as string[], store: new Map<string, unknown>(), spinner: [] as any[], team: [] as string[][], words: [] as string[][], wordsOff: false, designs: 'figma', opened: [] as any[], closed: [] as string[], tools: [] as string[], registered: [] as string[], hints: [] as any[] }
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
  on('session.id', () => ({ value: 'sess-1' }))
  on('tool.register', ($: any, e: any) => { calls.tools.push(e.name); return { value: { tool: 'mcp__studio__' + e.name } } })
  on('clock.every', () => ({ value: {} }))
  on('ui.open', ($: any, e: any) => { calls.opened.push(e); return { value: { isPlaced: true } } })
  on('command.register', ($: any, e: any) => { calls.registered.push(e.name); return { value: undefined } })
  on('store.get', ($: any, e: any) => ({ value: calls.store.get(e.key) }))
  on('store.set', ($: any, e: any) => { calls.store.set(e.key, e.value); return { value: undefined } })
  on('store.delete', ($: any, e: any) => { calls.store.delete(e.key); return { value: undefined } })
  on('command.run', ($: any, e: any) => { calls.commands.push(e.command); return {} })
  on('prompt.submit', ($: any, e: any) => { calls.prompts.push(e.text); return { text: e.text } })
  on('ui.toast', () => ({ value: undefined }))
  on('ui.close', ($: any, e: any) => { calls.closed.push(e.id); return { value: undefined } })
  on('turn.abort', ($: any, e: any) => { calls.aborts.push(e.turnId); return { value: undefined } })
  on('turn.start', ($: any, e: any) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
  on('tool.call', () => ({ result: 'ok' }))
  on('ui.render', ($: any, e: any) => { if (e.component === 'Spinner') calls.spinner.push(e.props); if (e.component === 'PromptHint') calls.hints.push(e.props); return { type: 'Text', props: {}, children: ['drawn by Claude Code'] } })
  return calls
}

const NOTES = JSON.stringify({ targetFileUrl: 'https://www.figma.com/design/abc/Onboarding', targetFileName: 'Onboarding', designSystemName: 'Acme DS', designSystemUrl: 'https://www.figma.com/design/ds/Acme' })

const start = ($: any) => $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work/onboarding' })
test('the working line uses the plain wording', async ($, on) => {
  const calls = setup(on)
  await start($)
  await $.turn.start({ turnId: 't1' })
  await $.tool.call({ tool: 'mcp__plugin_figma_figma__use_figma', fileKey: 'abc', code: '' })
  await $.ui.mount({ plugin: 'studio', component: 'Spinner', requestId: 'main', surface: 'terminal', viewport: { columns: 100, rows: 30 },
    props: { word: 'Sauteing', message: null, suffix: '…', mode: 'tool-use' } } as any)
  expect(calls.spinner.at(-1).message).toBe('Working in Figma')
})

const COMPOSE = { model: 'claude-opus-5-5', promptModel: 'claude-opus-5-5', surfaces: ['desktop'], tools: [], outputStyle: null, traits: [], sections: [] }

test('design work defaults to Figma: Claude is told the project file', async ($, on) => {
  setup(on, { 'project-notes': NOTES })
  on('prompt.compose', () => ({ sections: [{ id: 'intro', text: 'x', scope: 'shared' }] }))
  await start($)
  const r: any = await $.prompt.compose(COMPOSE)
  const note = r.sections.find((x: any) => x.id === 'studio:project').text
  expect(note).toMatch(/happens in Figma, in "Onboarding" \(https:\/\/www\.figma\.com\/design\/abc\/Onboarding\)/)
  expect(note).toMatch(/Acme DS/)
  expect(note).toMatch(/Only make HTML or CSS files if the person asks for a coded prototype/)
})

test('without Studio notes, Claude is told to offer /setup and not to make HTML unasked', async ($, on) => {
  setup(on)
  on('prompt.compose', () => ({ sections: [] }))
  await start($)
  const r: any = await $.prompt.compose(COMPOSE)
  expect(r.sections.find((x: any) => x.id === 'studio:project').text).toMatch(/hasn’t been set up yet.*offer \/setup.*Only make HTML or CSS files if they ask for a coded prototype/)
})

test('before any work, the band shows the logo and how to start', async ($, on) => {
  setup(on)
  await start($)
  const app = await $.ui.mount(BAND(120, 'desktop'))
  expect(await app.find({ type: 'Svg' })).toBeDefined()
  expect(await app.find({ type: 'Text', text: 'studio' })).toBeDefined()
  expect(await app.find({ type: 'Text', text: 'Paste a Jira story to start' })).toBeDefined()
  expect(await app.find({ type: 'Text', text: '▬' })).toBeUndefined()
  for (const gone of ['band-preview', 'band-save', 'band-menu', 'studio-welcome', 'band-stop']) expect(await app.find({ key: gone })).toBeUndefined()
  await app.unmount()
  // The terminal has no pictures, so the logo is a coral dot there
  const term = await $.ui.mount(BAND(120, 'terminal'))
  expect(await term.find({ type: 'Svg' })).toBeUndefined()
  expect(await term.find({ type: 'Text', text: '●' })).toBeDefined()
})

test('once work starts, the dot and progress take the stage colour, or ochre when something needs you', async ($, on) => {
  setup(on)
  await start($)
  await $.tool.call({ tool: 'mcp__studio__story', story: { key: 'SIGN-142', title: 'Faster sign-up' }, step: 5, status: 'building screen 3 of 5' })
  let band = await $.ui.mount(BAND(120, 'desktop'))
  expect(await band.find({ type: 'Svg' })).toBeUndefined()
  expect((await band.find({ type: 'Text', text: '●' }) as any)?.props.color).toBe('#E07A6E')
  const bars: any[] = await band.findAll({ type: 'Text', text: '▬' }) as any
  // nine equal steps: five done or current in coral, four still to do in grey
  expect(bars.map(b => b.props.color)).toEqual(['#E07A6E', '#E07A6E', '#E07A6E', '#E07A6E', '#E07A6E', '#D6D6DC', '#D6D6DC', '#D6D6DC', '#D6D6DC'])
  expect(await band.find({ type: 'Text', text: 'The design' })).toBeDefined()
  await band.unmount()
  await $.tool.call({ tool: 'mcp__studio__story', step: 2, needs: '3 questions for you' })
  band = await $.ui.mount(BAND(120, 'desktop'))
  expect((await band.find({ type: 'Text', text: '●' }) as any)?.props.color).toBe('#B8862B')
  expect((await band.find({ type: 'Text', text: '3 questions for you' }) as any)?.props.color).toBe('#8E6516')
  await band.unmount()
  await $.tool.call({ tool: 'mcp__studio__story', step: 8, needs: '' })
  band = await $.ui.mount(BAND(120, 'desktop'))
  expect((await band.find({ type: 'Text', text: '●' }) as any)?.props.color).toBe('#5E7D5B')
})

test('the hint under the prompt follows the step, and steps aside while typing', async ($, on) => {
  const calls = setup(on)
  const seen = calls.hints
  await start($)
  const HINT = (isDraft: boolean) => ({ plugin: 'studio', component: 'PromptHint', requestId: 'hint', surface: 'desktop', viewport: { columns: 120, rows: 40 }, props: { isDraft, isWorking: false, hint: 'Claude’s own hint' } }) as any
  await (await $.ui.mount(HINT(false))).unmount()
  expect(seen.at(-1).hint).toBe('Paste a Jira story to start. Adding its Confluence technical design helps.')
  await $.tool.call({ tool: 'mcp__studio__story', story: { key: 'SIGN-142', title: 'Faster sign-up' }, step: 2 })
  await (await $.ui.mount(HINT(false))).unmount()
  expect(seen.at(-1).hint).toBe('Answer the questions here or in the panel.')
  await (await $.ui.mount(HINT(true))).unmount()
  expect(seen.at(-1).hint).toBe('Claude’s own hint')
})

test('while Claude works, the band offers Stop, and Stop stops the turn', async ($, on) => {
  const calls = setup(on)
  await start($)
  await $.turn.start({ turnId: 't1' })
  const ui = await $.ui.mount(BAND(120))
  await ui.press({ key: 'band-stop' })
  expect(calls.aborts).toEqual(['t1'])
  await ui.unmount()
  await $.turn.complete({ turnId: 't1', answer: '', durationMs: 1, isAborted: true, usage: null })
  const after = await $.ui.mount(BAND(120))
  expect(await after.find({ key: 'band-stop' })).toBeUndefined()
})

const COMPOSE2 = { model: 'claude-opus-5-5', promptModel: 'claude-opus-5-5', surfaces: ['desktop'], tools: [], outputStyle: null, traits: [], sections: [] }

test('Studio gives Claude a story tool, and the panel starts with “Start with a story”', async ($, on) => {
  const calls = setup(on, { 'project-notes': NOTES })
  await start($)
  expect(calls.tools).toContain('story')
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount(PANE(surface))
    expect(await ui.find({ type: 'Text', text: 'Start with a story' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Acme DS' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Design system · never changed by Studio' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Onboarding' })).toBeDefined()
    expect(await ui.find({ type: 'Link' })).toBeDefined()
    for (const gone of ['tab-journey', 'tab-menu', 'tab-glossary', 'pane-designs', 'pane-words']) expect(await ui.find({ key: gone })).toBeUndefined()
    await ui.unmount()
  }
})

test('Claude’s story updates fill the panel: the story, its progress, and what needs you first in ochre', async ($, on) => {
  setup(on)
  await start($)
  const r: any = await $.tool.call({ tool: 'mcp__studio__story', story: { key: 'SIGN-142', title: 'Faster sign-up', hasDesignDoc: true }, step: 2, status: 'playing the brief back', needs: '2 questions for you',
    sections: [{ title: 'Requirements', items: [{ text: 'Email field with validation', state: 'todo' }] }, { title: 'Questions for you', needs: true, ask: true, items: [{ text: '1. What counts as a valid email?', state: 'need', placeholder: 'Format only, or more?' }] }] })
  expect(String(r.result)).toMatch(/step 2 of 9.*2 questions for you/)
  const band = await $.ui.mount(BAND(120))
  expect(await band.find({ type: 'Text', text: '2 questions for you' })).toBeDefined()
  await band.unmount()
  const pane = await $.ui.mount(PANE())
  expect(await pane.find({ type: 'Text', text: 'SIGN-142 · Jira story · step 2 of 9' })).toBeDefined()
  expect((await pane.find({ type: 'Text', text: 'Faster sign-up' }) as any)?.props.size).toBe('title')
  expect(await pane.find({ type: 'Text', text: 'Technical design in Confluence' })).toBeDefined()
  expect((await pane.find({ type: 'Text', text: 'Questions for you' }) as any)?.props.color).toBe('#8E6516')
  expect(await pane.find({ type: 'Text', text: 'Start with a story' })).toBeUndefined()
  // What needs you comes before Requirements
  const texts: any[] = await pane.findAll({ type: 'Text' }) as any
  const order = texts.map(t => t.text)
  expect(order.indexOf('Questions for you')).toBeLessThan(order.indexOf('Requirements'))
  await pane.unmount()
  // Later: fields left out stay
  await $.tool.call({ tool: 'mcp__studio__story', step: 5, status: 'building screen 3 of 6', needs: '' })
  const pane2 = await $.ui.mount(PANE())
  expect(await pane2.find({ type: 'Text', text: 'Faster sign-up' })).toBeDefined()
  expect(await pane2.find({ type: 'Text', text: 'The design · building screen 3 of 6' })).toBeDefined()
})

test('questions can be answered in the panel, and the answers go to Claude as the designer’s message', async ($, on) => {
  const calls = setup(on)
  await start($)
  await $.tool.call({ tool: 'mcp__studio__story', story: { key: 'SIGN-142', title: 'Faster sign-up' }, step: 2, needs: '2 questions for you',
    sections: [{ title: 'Questions for you', needs: true, ask: true, items: [{ text: 'What counts as a valid email?', state: 'need' }, { text: 'Can people resend the email?', state: 'need' }] }] })
  const pane = await $.ui.mount(PANE())
  await pane.input({ key: 'sec-0-i0-answer', text: 'Format only' })
  await pane.input({ key: 'sec-0-i1-answer', text: 'Yes' })
  await pane.press({ key: 'sec-0-send-btn' })
  expect(calls.prompts.at(-1)).toBe('My answers:\n1. What counts as a valid email? Format only\n2. Can people resend the email? Yes')
})

test('items can link to their frame in Figma, and checklist items can ask Claude for the next step', async ($, on) => {
  const calls = setup(on)
  await start($)
  await $.tool.call({ tool: 'mcp__studio__story', story: { key: 'SIGN-142', title: 'Faster sign-up' }, step: 9, sections: [
    { title: 'Screens', items: [{ text: 'Sign up', state: 'done', link: 'https://www.figma.com/design/abc/File?node-id=5-1382' }, { text: 'Not a real link', state: 'done', link: 'javascript:alert(1)' }] },
    { title: 'Handover checklist', checklist: true, items: [{ text: 'Presentation for stakeholders', state: 'todo', action: 'Mock up the presentation for stakeholders in Figma', actionLabel: 'Start' }] },
  ] })
  const pane = await $.ui.mount(PANE())
  const links: any[] = await pane.findAll({ type: 'Link' }) as any
  expect(links.length).toBe(1)
  expect(await pane.find({ type: 'Text', text: '☐' })).toBeDefined()
  await pane.press({ key: 'sec-1-i0-act' })
  expect(calls.prompts.at(-1)).toBe('Mock up the presentation for stakeholders in Figma')
})

test('the story card is kept by Claude Code, so it comes back after a reload', async ($, on) => {
  const calls = setup(on)
  await start($)
  await $.tool.call({ tool: 'mcp__studio__story', story: { key: 'SIGN-142', title: 'Faster sign-up' }, step: 3 })
  expect(calls.store.get('story:sess-1')).toMatchObject({ step: 3, story: { key: 'SIGN-142' } })
})

test('clear starts a new story', async ($, on) => {
  setup(on)
  await start($)
  await $.tool.call({ tool: 'mcp__studio__story', story: { key: 'SIGN-142', title: 'Faster sign-up', hasDesignDoc: true }, step: 6 })
  await $.tool.call({ tool: 'mcp__studio__story', clear: true, story: { key: 'SET-9', title: 'Settings' }, step: 1 })
  const pane = await $.ui.mount(PANE())
  expect(await pane.find({ type: 'Text', text: 'Settings' })).toBeDefined()
  expect(await pane.find({ type: 'Text', text: 'No technical design yet · optional, but encouraged' })).toBeDefined()
})

test('Claude is still told the word and project notes before each reply', async ($, on) => {
  setup(on, { 'project-notes': NOTES })
  on('prompt.compose', () => ({ sections: [] }))
  await start($)
  const r: any = await $.prompt.compose(COMPOSE2)
  const ids = r.sections.map((x: any) => x.id)
  expect(ids).toEqual(expect.arrayContaining(['studio:words', 'studio:project']))
})

test('only /panel is registered as a command; the cut commands are gone', async ($, on) => {
  const calls = setup(on)
  await start($)
  expect(calls.registered).toEqual(['panel', 'studio-lab']) // studio-lab is temporary
})

test('“don’t show again” takes effect before the next reply', async ($, on) => {
  const calls = setup(on)
  on('prompt.compose', () => ({ sections: [] }))
  await start($)
  calls.wordsOff = true // what studio-words off records
  await $.tool.call({ tool: 'Bash', command: 'studio-words off' })
  const r: any = await $.prompt.compose(COMPOSE2)
  expect(r.sections.find((x: any) => x.id === 'studio:words').text).toMatch(/OFF: the person said "don’t show again"/)
})

const LAB = (surface: 'terminal' | 'desktop' = 'desktop') => ({
  plugin: 'studio', component: 'Pane', requestId: 'studio-lab', surface,
  viewport: { columns: 160, rows: 50 },
  props: { title: 'Studio lab', isFocused: true, bodyColumns: 60, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} },
}) as const

test('the Studio lab draws every page in the app', async ($, on) => {
  setup(on)
  on('session.version', () => ({ value: '2.1.300' }))
  await start($)
  await $.command.run({ command: 'studio-lab', args: '' })
  const firsts: Record<string, string> = { '1': 'Size caption: Faster sign-up', '2': 'Hex text #E07A6E', '3': 'borderStyle round', '4': '8 × 16', '5': 'Nothing pressed yet', '6': 'padding md on a white box', '7': 'Nothing pressed yet', '8': 'Hover over me: I should turn pale coral', '9': 'Show test dots in the band', 'm': 'A · pulse, redrawn by Studio', 'p': 'Bars · in the band now' }
  for (const k of Object.keys(firsts)) {
    const ui = await $.ui.mount(LAB('desktop'))
    await ui.press({ key: 'lab-tab-' + k })
    await ui.unmount()
    const again = await $.ui.mount(LAB('desktop'))
    const found = await again.find({ type: 'Text', text: firsts[k] }) ?? await again.find({ key: 'band-svg' })
    expect(found).toBeDefined()
    await again.unmount()
  }
})
