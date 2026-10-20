// Studio mod: the band above the prompt and the Studio panel.
// Design: Figma pages 01 (band) and 02 (panel). Plan: plans/phase-3-band-and-panel.md.
// Works in the terminal and the Desktop Code tab; nothing draws in VS Code.
import { describe } from './studio/narrate.js'
import { guessStage } from './studio/journey.js'
import { drawBand } from './studio/band.js'
import { drawPane } from './studio/pane.js'
import { TEAM_PANE, EMPTY, drawTeamForm, toSettings } from './studio/team-form.js'

const PANE = 'studio'
const PREVIEW_PORTS = [4321, 5173, 3000, 8080, 8000, 4173, 5000]
const FIGMA_REQUEST = 'Send the current screen to Figma: take a picture of my private preview and add it to a Figma file I choose. Ask me which file, and confirm before writing anything.'

// What Studio knows about the project (refreshed from git).
let project = { project: '', exploration: '', isMain: true, ownSavePoints: 0, explorations: 0, lastSaveAt: 0, handedOver: false, handoverLabel: '', previewUrl: '', root: '', hasSavePoints: false, unsaved: false, unsavedCount: 0, lastSaveNote: '' }
// What Claude is doing in this request.
let live = { working: false, turnId: '', current: null, steps: [], todo: null, lastKind: null }
let memory = 0
// The welcome, with where you left off, shows in the band until the first
// request of a session.
let welcome = true
let stageOverride = null
// Which Studio is running, and whether a newer one is ready (bin/studio-version).
let studio = { version: '', update: '' }
let view = { tab: 'journey', query: '' }
let refreshing = null

async function git($, args) {
  try {
    const r = await $.process.run(['git', ...args], { timeoutMs: 5000 })
    return r.exitCode === 0 ? r.stdout.trim() : null
  } catch { return null }
}

async function refresh($) {
  if (refreshing) return refreshing
  refreshing = (async () => {
    const cwd = await $.session.cwd()
    const folder = String(cwd).split('/').filter(Boolean).pop() || 'project'
    const next = { ...project, project: folder, previewUrl: await findPreview($) }
    if ((await git($, ['rev-parse', '--is-inside-work-tree'])) !== 'true') {
      project = { ...next, hasSavePoints: false, unsaved: false, unsavedCount: 0, lastSaveNote: '', isMain: true, exploration: '', ownSavePoints: 0, lastSaveAt: 0, handedOver: false, root: cwd }
      return
    }
    const root = (await git($, ['rev-parse', '--show-toplevel'])) || cwd
    const branch = (await git($, ['branch', '--show-current'])) || ''
    const main = (await git($, ['rev-parse', '--verify', '-q', 'main'])) ? 'main' : ((await git($, ['rev-parse', '--verify', '-q', 'master'])) ? 'master' : '')
    const isMain = !branch || branch === main
    const own = !isMain && main ? Number(await git($, ['rev-list', '--count', main + '..HEAD'])) || 0 : 0
    const status = (await git($, ['status', '--porcelain'])) || ''
    const unsavedCount = status.split('\n').filter(Boolean).length
    const unsaved = unsavedCount > 0
    const last = Number(await git($, ['log', '-1', '--format=%ct'])) || 0
    const lastSaveNote = (await git($, ['log', '-1', '--format=%s'])) || ''
    const branches = ((await git($, ['branch', '--format=%(refname:short)'])) || '').split('\n').filter(b => b && b !== main)
    let handedOver = false, handoverLabel = ''
    const h = await git($, ['for-each-ref', 'refs/studio/handovers', '--sort=-creatordate', '--count=1', '--format=%(objectname)|%(creatordate:format:%d %b)'])
    if (h && !isMain) {
      const [obj, when] = h.split('|')
      const onThis = (await git($, ['merge-base', '--is-ancestor', obj, 'HEAD'])) !== null
      const onMain = main ? (await git($, ['merge-base', '--is-ancestor', obj, main])) !== null : false
      if (onThis && !onMain) { handedOver = true; handoverLabel = String(when).replace(/^0/, '') }
    }
    project = { ...next, root, hasSavePoints: true, unsaved, unsavedCount, lastSaveNote, exploration: branch || main, isMain, ownSavePoints: own, explorations: branches.length, lastSaveAt: last * 1000, handedOver, handoverLabel }
    try {
      const saved = await $.store.get('stage:' + root)
      stageOverride = typeof saved === 'string' ? saved : null
    } catch { stageOverride = null }
  })().finally(() => { refreshing = null })
  return refreshing
}

async function checkVersion($) {
  try {
    const manifest = JSON.parse(await $.fs.read($.plugin.root + '/.claude-plugin/plugin.json'))
    studio = { ...studio, version: String(manifest.version || '') }
  } catch {}
  try {
    const r = await $.process.run([$.plugin.root + '/bin/studio-version', '--no-fetch'], { timeoutMs: 8000 })
    const [status, , latest] = String(r.stdout || '').trim().split(' ')
    studio = { ...studio, update: status === 'update-available' && latest ? latest : '' }
  } catch {}
}

async function findPreview($) {
  try {
    const r = await $.process.run(['lsof', '-nP', '-iTCP', '-sTCP:LISTEN', '-Fn'], { timeoutMs: 3000 })
    const ports = new Set((r.stdout.match(/:(\d+)\n/g) || []).map(m => Number(m.slice(1, -1))))
    const port = PREVIEW_PORTS.find(p => ports.has(p))
    return port ? 'http://localhost:' + port : ''
  } catch { return '' }
}

function state(now) {
  return { ...project, ...live, memory, welcome, studioVersion: studio.version, studioUpdate: studio.update, stageOverride, stage: stageOverride || guessStage(project), now }
}

// The team settings form (studio/team-form.js).
const blankTeam = () => ({ step: 'choose', current: { ...EMPTY }, values: { ...EMPTY }, path: '', error: '', loadedFrom: '', exported: '', saving: false, fromSetup: false })
let team = blankTeam()
const copy = v => ({ ...EMPTY, ...v, designSystems: (v.designSystems || []).map(d => ({ name: d.name || '', link: d.link || '' })) })

async function teamBin($, args) {
  const r = await $.process.run([$.plugin.root + '/bin/studio-team', ...args], { timeoutMs: 8000 })
  return { ok: r.exitCode === 0, out: String(r.stdout || '').trim() }
}

async function openTeam($, fromSetup) {
  let current = { ...EMPTY }
  try { const r = await teamBin($, ['json']); if (r.ok) current = copy(JSON.parse(r.out)) } catch {}
  team = { ...blankTeam(), current, values: copy(current), fromSetup }
  try { await $.ui.open({ id: TEAM_PANE, title: 'Team settings', focus: true }) } catch {}
  $.ui.invalidate('ui.render')
}

function teamActions($) {
  const redraw = () => $.ui.invalidate('ui.render')
  const tell = text => { if (team.fromSetup) $.prompt.submit({ text }).catch(() => {}) }
  return {
    file: () => { team = { ...team, step: 'file', error: '' }; redraw() },
    manual: () => { team = { ...team, step: 'edit', error: '', loadedFrom: '', values: copy(team.step === 'saved' ? team.values : team.current) }; redraw() },
    back: () => { team = { ...team, step: 'choose', error: '' }; redraw() },
    setPath: v => { team = { ...team, path: String(v || ''), error: '' } },
    load: async v => {
      const path = String(v || team.path || '').trim().replace(/^['"]|['"]$/g, '').replace(/\\ /g, ' ')
      if (!path) { team = { ...team, error: 'Drag the team file into the box, or paste where it is.' }; return redraw() }
      try {
        const r = await teamBin($, ['read', path])
        if (!r.ok || r.out === 'not-a-team-file') { team = { ...team, path, error: 'That isn’t a Studio team file, or it can’t be opened. Check the file, or type the settings in instead.' }; return redraw() }
        team = { ...team, path, step: 'edit', error: '', loadedFrom: path.split('/').pop(), values: copy(JSON.parse(r.out)) }
      } catch { team = { ...team, path, error: 'That file couldn’t be read. Check it, or type the settings in instead.' } }
      redraw()
    },
    setField: (id, v) => { team = { ...team, values: { ...team.values, [id]: String(v || '') } }; if (id === 'figmaWritePlaces') redraw() },
    setDs: (i, k, v) => {
      const ds = team.values.designSystems.length ? [...team.values.designSystems] : [{ name: '', link: '' }]
      ds[i] = { ...ds[i], [k]: String(v || '') }
      team = { ...team, values: { ...team.values, designSystems: ds } }
      if (k === 'link') redraw()
    },
    addDs: () => {
      const ds = team.values.designSystems.length ? team.values.designSystems : [{ name: '', link: '' }]
      team = { ...team, values: { ...team.values, designSystems: [...ds, { name: '', link: '' }] } }; redraw()
    },
    removeDs: i => { team = { ...team, values: { ...team.values, designSystems: team.values.designSystems.filter((_, j) => j !== i) } }; redraw() },
    keep: () => { tell('The person kept the team settings already saved on this computer. Carry on with /setup.'); team = { ...team, step: 'saved', values: copy(team.current) }; redraw() },
    save: async () => {
      team = { ...team, saving: true, error: '' }; redraw()
      try {
        for (const [key, value] of toSettings(team.values)) {
          const r = await teamBin($, ['set', key, value])
          if (!r.ok) throw new Error(r.out)
        }
        const values = copy({ ...team.values, designSystems: team.values.designSystems.filter(d => d.name || d.link) })
        team = { ...team, saving: false, step: 'saved', current: values, values }
        const names = values.designSystems.map(d => d.name || d.link).join(', ')
        tell('The person saved their team settings in the Studio form' + (names ? ', with design systems: ' + names : '') + '. Carry on with /setup.')
      } catch {
        team = { ...team, saving: false, error: 'The settings couldn’t be saved. Nothing has changed; try again.' }
      }
      redraw()
    },
    exportFile: async () => {
      try {
        const r = await teamBin($, ['export'])
        team = { ...team, exported: r.ok && r.out.startsWith('saved ') ? r.out.slice(6) : '' }
        if (!team.exported) team = { ...team, error: 'The team file couldn’t be saved. Try again.' }
      } catch { team = { ...team, error: 'The team file couldn’t be saved. Try again.' } }
      redraw()
    },
  }
}

function actionsFor($) {
  const run = name => {
    $.command.run({ command: name }).catch(() => $.prompt.submit({ text: '/' + name, asUser: true }).catch(() => {}))
  }
  return {
    show: () => run('preview'),
    save: () => run('save'),
    guide: () => run('guide'),
    figma: () => { $.prompt.submit({ text: FIGMA_REQUEST, asUser: true }).catch(() => {}) },
    stop: () => { if (live.turnId) $.turn.abort({ turnId: live.turnId }).catch(() => {}) },
    setStage: async stage => {
      stageOverride = stage
      try {
        if (stage) await $.store.set('stage:' + project.root, stage)
        else await $.store.delete('stage:' + project.root)
      } catch {}
      $.ui.invalidate('ui.render')
    },
    tab: t => { view = { ...view, tab: t }; $.ui.invalidate('ui.render') },
    search: q => { view = { ...view, query: String(q || '') }; $.ui.invalidate('ui.render') },
  }
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    await refresh($)
    checkVersion($).then(() => $.ui.invalidate('ui.render')).catch(() => {})
    try { await $.clock.every(30000, async () => { await refresh($); $.ui.invalidate('ui.render') }) } catch {}
    try { await $.ui.open({ id: PANE, title: 'Studio' }) } catch {}
    try { await $.command.register({ name: 'panel', description: 'Open the Studio panel', immediate: true }) } catch {}
    try { await $.command.register({ name: 'team-settings', description: 'Your team’s Studio settings: load a team file or type them in', immediate: true }) } catch {}
    return next(e)
  })

  on('command.run', { command: 'panel' }, async ($) => {
    await $.ui.open({ id: PANE, title: 'Studio', focus: true })
    return {}
  })

  on('command.run', { command: 'team-settings' }, async ($) => {
    await openTeam($, false)
    return {}
  })

  on('turn.start', async ($, e, next) => {
    welcome = false
    live = { ...live, working: true, turnId: e.turnId, current: null, steps: [], todo: null }
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const steps = live.steps.map(x => x.status === 'now' ? { ...x, status: 'done' } : x)
    live = { ...live, working: false, current: null, steps }
    await refresh($)
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('tool.call', async ($, e, next) => {
    if (e.agentId) return next(e)
    if (e.tool === 'TodoWrite' && Array.isArray(e.todos)) {
      const items = e.todos.map(t => ({ label: t.status === 'in_progress' ? (t.activeForm || t.content) : t.content, status: t.status === 'completed' ? 'done' : t.status === 'in_progress' ? 'now' : 'upcoming' }))
      const cur = e.todos.findIndex(t => t.status === 'in_progress')
      live = { ...live, todo: { items, total: items.length, current: cur >= 0 ? cur + 1 : items.filter(i => i.status === 'done').length } }
      $.ui.invalidate('ui.render')
      return next(e)
    }
    // /setup asks for the team form by running `studio-team form`.
    if (e.tool === 'Bash' && String(e.command || '').trim() === 'studio-team form') {
      const result = await next(e)
      await openTeam($, true)
      return result
    }
    const d = describe(e)
    if (!d) return next(e)
    const step = { label: d.label, status: 'now' }
    live = { ...live, current: d, lastKind: d.kind, steps: [...live.steps, step].slice(-12) }
    $.ui.invalidate('ui.render')
    const result = await next(e)
    step.status = result && (result.isError || result.deny) ? 'failed' : 'done'
    if (['save', 'exploration', 'snapshot', 'handover', 'preview'].includes(d.kind)) await refresh($)
    $.ui.invalidate('ui.render')
    return result
  }).catch(async ($, e, next) => next(e)) // Studio only narrates: if this hook fails, the step runs as normal

  on('session.measure', async ($, e, next) => {
    try { memory = (await $.session.usage()).context.percent || 0 } catch {}
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const el = $.ui.resolve(e)
    const band = drawBand(el, { ...state(await $.clock.now()), surface: e.surface }, actionsFor($), e.props.bodyColumns, e.props.maxRows)
    const rest = await next(e)
    return rest ? el.Box({ key: 'studio-band-wrap', flexDirection: 'column', children: [band, rest] }) : band
  })

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== PANE) return next(e)
    const el = $.ui.resolve(e)
    return drawPane(el, state(await $.clock.now()), view, actionsFor($), e.props.bodyColumns)
  })

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== TEAM_PANE) return next(e)
    return drawTeamForm($.ui.resolve(e), team, teamActions($), e.props.bodyColumns)
  })

  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (!live.working || !live.current) return next(e)
    return next({ ...e, props: { ...e.props, message: live.current.label } })
  })
}
