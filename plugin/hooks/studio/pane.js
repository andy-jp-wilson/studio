// Studio: the panel beside the conversation (Figma page 02).
// Tabs (Journey · Glossary) are buttons, because mods have no tab control.
// Pure drawing: takes the element table, Studio's state, the panel's own view
// state (tab, search) and the actions, and returns the panel's tree.
import { STAGES, GLYPH, COLOR, stageState, stageDetail, saveStatus, memoryBar } from './journey.js'
import { search } from './glossary.js'
import { noteFor } from './narrate.js'

const label = (Text, key, text) => Text({ key, color: 'subtle', bold: true, children: [text.toUpperCase()] })

function journeyTab(el, s, actions) {
  const { Box, Text, Button, Link } = el
  const out = []

  // Your journey
  out.push(label(Text, 'h-journey', 'Your journey'))
  for (const stage of STAGES) {
    const st = stageState(stage, s.stage)
    out.push(Box({
      key: 'step-' + stage, flexDirection: 'column', paddingLeft: 1,
      ...(st === 'current' ? { borderStyle: 'quote' } : {}),
      children: [
        Text({ key: 'step-title-' + stage, color: COLOR[st], bold: st === 'current', children: [GLYPH[st] + ' ' + stage] }),
        Text({ key: 'step-detail-' + stage, color: 'subtle', children: ['  ' + stageDetail(stage, s, st)] }),
      ],
    }))
  }
  out.push(Box({
    key: 'stage-set', flexDirection: 'row', columnGap: 1, children: [
      Text({ key: 'stage-set-label', color: 'subtle', children: [s.stageOverride ? 'You chose this stage.' : 'Studio guessed this stage.'] }),
      ...STAGES.filter(x => x !== s.stage).map(x => Button({ key: 'set-' + x, label: x, dimColor: true, onPress: () => actions.setStage(x) })),
      ...(s.stageOverride ? [Button({ key: 'set-auto', label: 'Let Studio guess', dimColor: true, onPress: () => actions.setStage(null) })] : []),
    ],
  }))

  // Happening now
  out.push(Text({ key: 'gap-1', children: [' '] }))
  out.push(label(Text, 'h-now', 'Happening now'))
  const headline = s.working
    ? 'Claude is ' + (s.current ? s.current.label.charAt(0).toLowerCase() + s.current.label.slice(1) : 'thinking') + '.'
    : s.steps.length ? 'Claude has finished. Here’s what it did.' : 'Nothing happening yet. Ask Claude for a change and it shows here.'
  const now = [Text({ key: 'now-headline', bold: true, color: 'text', children: [headline] })]
  const steps = s.todo && s.todo.items.length ? s.todo.items : s.steps
  steps.slice(-6).forEach((x, i) => {
    const g = x.status === 'done' ? '✓' : x.status === 'now' ? '●' : x.status === 'failed' ? '!' : '○'
    const c = x.status === 'done' ? 'success' : x.status === 'now' ? 'claude' : x.status === 'failed' ? 'warning' : 'inactive'
    now.push(Box({ key: 'now-step-' + i, flexDirection: 'row', columnGap: 1, children: [
      Text({ key: 'now-g-' + i, color: c, children: [g] }),
      Text({ key: 'now-t-' + i, color: x.status === 'upcoming' ? 'subtle' : 'text', wrap: 'wrap', children: [x.label] }),
    ] }))
  })
  const note = noteFor(s.memory >= 50 ? 'memory' : s.lastKind)
  if (note) now.push(Box({ key: 'tip', flexDirection: 'row', columnGap: 1, children: [
    Text({ key: 'tip-label', color: 'planMode', bold: true, children: ['Did you know?'] }),
    Text({ key: 'tip-text', color: 'text', wrap: 'wrap', children: [note] }),
  ] }))
  out.push(Box({ key: 'now-card', flexDirection: 'column', borderStyle: 'round', paddingX: 1, children: now }))

  // Everyday buttons; the full menu has its own tab.
  out.push(Text({ key: 'gap-2', children: [' '] }))
  const quick = []
  if (s.unsaved) quick.push(Button({ key: 'pane-save', label: 'Save point', hotkey: 's', onPress: actions.save }))
  if (s.figmaUrl) quick.push(Link({ key: 'figma-link', href: s.figmaUrl, label: 'Open in Figma' }))
  if (s.previewUrl) quick.push(Link({ key: 'preview-link', href: s.previewUrl, label: 'Open preview' }))
  else if (s.hasPrototype) quick.push(Button({ key: 'pane-preview', label: 'Preview', hotkey: 'p', onPress: actions.show }))
  if (s.hasPrototype || s.previewUrl) quick.push(Button({ key: 'pane-figma', label: 'Send to Figma', hotkey: 'f', onPress: actions.figma }))
  quick.push(Button({ key: 'to-menu', label: 'More in Menu', hotkey: 'm', dimColor: true, onPress: () => actions.tab('menu') }))
  out.push(Box({ key: 'quick', flexDirection: 'row', flexWrap: 'wrap', columnGap: 2, children: quick }))
  if (s.previewUrl) out.push(Text({ key: 'actions-note', color: 'subtle', children: ['Your private preview is running at ' + s.previewUrl] }))

  // Footer
  out.push(Text({ key: 'gap-3', children: [' '] }))
  const bar = memoryBar(s.memory)
  const where = s.isMain ? 'on the main design' : 'exploring ' + s.exploration
  const save = saveStatus(s)
  out.push(Box({ key: 'footer', flexDirection: 'row', children: [
    Text({ key: 'footer-where', color: 'subtle', children: [where + '  ·  '] }),
    Text({ key: 'footer-save', color: save ? save.color : 'subtle', children: [save ? save.text : 'No save points yet'] }),
  ] }))
  out.push(Box({ key: 'memory', flexDirection: 'row', columnGap: 1, children: [
    Text({ key: 'mem-label', color: 'subtle', children: ['working memory'] }),
    Text({ key: 'mem-filled', color: bar.color, children: [bar.filled] }),
    Text({ key: 'mem-empty', color: 'subtle', children: [bar.empty] }),
    Text({ key: 'mem-pct', color: bar.color, children: [bar.percent] }),
  ] }))
  out.push(Box({ key: 'designs', flexDirection: 'row', columnGap: 1, children: [
    Text({ key: 'designs-label', color: 'subtle', children: ['Designs go to'] }),
    Button({ key: 'pane-designs', label: s.designs === 'prototype' ? 'Prototype' : 'Figma', hotkey: 'd', onPress: actions.toggleDesigns }),
  ] }))
  out.push(Box({ key: 'words', flexDirection: 'row', columnGap: 1, children: [
    Text({ key: 'words-label', color: 'subtle', children: ['Explain technical words'] }),
    Button({ key: 'pane-words', label: s.explainWords === false ? 'Off' : 'On', hotkey: 'w', dimColor: s.explainWords === false, onPress: actions.toggleWords }),
  ] }))
  if (s.studioVersion) {
    out.push(Box({ key: 'version', flexDirection: 'row', children: [
      Text({ key: 'version-text', color: 'subtle', children: ['Studio v' + s.studioVersion] }),
      ...(s.studioUpdate ? [Text({ key: 'version-update', color: 'warning', children: [' · v' + s.studioUpdate + ' ready, type /version'] })] : []),
    ] }))
  }
  return out
}

function menuTab(el, s, actions) {
  const { Box, Text, Button, Link } = el
  const prototypeish = s.hasPrototype || s.previewUrl
  const run = name => () => actions.run(name)
  // Each item: its button or link, with one short line saying what it does.
  const item = (control, about) => Box({ key: 'item-' + control.props.key, flexDirection: 'column', children: [
    control,
    Text({ key: 'about-' + control.props.key, color: 'subtle', wrap: 'wrap', children: [about] }),
  ] })
  const group = (key, title, items) => items.length ? [
    Text({ key: 'g-' + key, color: 'claude', bold: true, children: [title.toUpperCase()] }),
    Box({ key: 'col-' + key, flexDirection: 'column', rowGap: 1, children: items }),
  ] : []
  const work = []
  if (s.unsaved) work.push(item(Button({ key: 'menu-save', label: 'Save point', hotkey: 's', onPress: actions.save }), 'Keep your work as it is now, with a name, so you can always come back to it.'))
  work.push(item(Button({ key: 'menu-explore', label: 'Try an idea', hotkey: 'i', onPress: run('explore') }), 'Start an exploration: try something without touching the main design.'))
  work.push(item(Button({ key: 'menu-go-back', label: 'Go back', hotkey: 'b', onPress: run('go-back') }), 'Undo Claude’s recent changes to files on this computer. For Figma, use Figma’s undo or version history.'))
  if (s.figmaUrl) work.push(item(Link({ key: 'menu-figma-link', href: s.figmaUrl, label: 'Open in Figma' }), 'Open this project’s Figma file.'))
  if (s.previewUrl) work.push(item(Link({ key: 'menu-preview-link', href: s.previewUrl, label: 'Open preview' }), 'Open your prototype in a private website only you can see.'))
  else if (prototypeish) work.push(item(Button({ key: 'menu-preview', label: 'Preview', hotkey: 'p', onPress: actions.show }), 'Start a private preview of your prototype, a website only you can see.'))
  if (prototypeish) work.push(item(Button({ key: 'menu-send-figma', label: 'Send to Figma', hotkey: 'f', onPress: actions.figma }), 'Put a picture of the prototype’s current screen into Figma, after asking.'))
  const menu = [
    ...group('ready', 'Get ready', [
      item(Button({ key: 'menu-setup', label: 'Setup', hotkey: 'u', onPress: run('setup') }), 'Check Figma, set up this project, and link its design system and Figma file.'),
      item(Button({ key: 'menu-team', label: 'Team settings', hotkey: 't', onPress: run('team-settings') }), 'Your team’s design systems, projects folder, Figma folder and where work may be shared.'),
    ]),
    ...group('work', 'Work', work),
    ...group('share', 'Share', [
      item(Button({ key: 'menu-handover', label: 'Hand over to the team', hotkey: 'o', onPress: run('handover') }), 'Make or update the project’s handover for developers: changelog, Figma page and specs.'),
      item(Button({ key: 'menu-handoff', label: 'Share for review', hotkey: 'r', onPress: run('handoff') }), 'Share an exploration online for review. Always asks before anything leaves this computer.'),
    ]),
    ...group('help', 'Help', [
      item(Button({ key: 'menu-guide', label: 'Guide', onPress: actions.guide }), 'How Studio works, and which Claude to use for what.'),
      item(Button({ key: 'menu-glossary', label: 'Glossary', onPress: () => actions.tab('glossary') }), 'The friendly words, and the technical ones behind them.'),
      item(Button({ key: 'menu-version', label: 'Studio version', hotkey: 'v', onPress: run('version') }), 'Which Studio you have, and whether there’s a newer one.'),
    ]),
  ]
  return [label(Text, 'h-menu', 'Menu'), Text({ key: 'menu-note', color: 'subtle', wrap: 'wrap', children: ['Everything Studio does, by what you’re doing. The / commands still work too.'] }), ...menu]
}

function glossaryTab(el, view, actions) {
  const { Box, Text, Input } = el
  const out = [label(Text, 'h-words', 'Words, in plain language'),
    Input({ key: 'search', placeholder: 'Look up a word…', value: view.query, onInput: v => actions.search(v), onSubmit: v => actions.search(v) })]
  const rows = search(view.query)
  if (!rows.length) out.push(Text({ key: 'no-match', color: 'subtle', children: ['No words match “' + view.query + '”.'] }))
  rows.forEach((g, i) => out.push(Box({ key: 'word-' + i, flexDirection: 'column', borderStyle: 'round', paddingX: 1, children: [
    Box({ key: 'word-top-' + i, flexDirection: 'row', columnGap: 1, children: [
      Text({ key: 'word-f-' + i, bold: true, color: 'text', children: [g.friendly] }),
      Text({ key: 'word-arrow-' + i, color: 'subtle', children: ['→'] }),
      Text({ key: 'word-r-' + i, color: 'claude', children: [g.real] }),
    ] }),
    Text({ key: 'word-m-' + i, color: 'subtle', wrap: 'wrap', children: [g.meaning] }),
  ] })))
  return out
}

export function drawPane(el, s, view, actions, columns) {
  const { Box, Text, Button } = el
  const tabs = Box({ key: 'tabs', flexDirection: 'row', columnGap: 2, children: [
    Text({ key: 'title', bold: true, color: 'text', children: ['Studio'] }),
    Button({ key: 'tab-journey', label: 'Journey', hotkey: 'j', dimColor: view.tab !== 'journey', onPress: () => actions.tab('journey') }),
    Button({ key: 'tab-menu', label: 'Menu', hotkey: 'n', dimColor: view.tab !== 'menu', onPress: () => actions.tab('menu') }),
    Button({ key: 'tab-glossary', label: 'Glossary', hotkey: 'g', dimColor: view.tab !== 'glossary', onPress: () => actions.tab('glossary') }),
    Button({ key: 'pane-guide', label: 'Guide', hotkey: 'h', dimColor: true, onPress: actions.guide }),
  ] })
  const body = view.tab === 'glossary' ? glossaryTab(el, view, actions) : view.tab === 'menu' ? menuTab(el, s, actions) : journeyTab(el, s, actions)
  return Box({ key: 'studio-pane', flexDirection: 'column', rowGap: 1, width: Math.max(20, columns), children: [tabs, ...body] })
}
