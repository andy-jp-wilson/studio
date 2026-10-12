# Phase 2: build the foundation (plan)

Checked against the Claude Code docs on 2026-10-12 (version 2.1.296).

## Where things live
```
studio/
  CLAUDE.md, plans/                 brief and plans (as now)
  .claude-plugin/marketplace.json   lets the Desktop app install Studio from this folder
  plugin/                           the Studio plugin itself
    .claude-plugin/plugin.json      name "studio", version, description
    output-styles/studio.md         Claude's voice
    skills/glossary/                friendly words and their real terms
    skills/start, save, show, explore, handoff/
    hooks/hooks.json + hooks/*.sh   safety: save points and calm errors
    themes/studio-light.json, studio-dark.json
  playground/onboarding/            a tiny practice project to test on (its own git repo)
```

## The six pieces

1. **Plugin skeleton.** A manifest plus the folders above, checked with `claude plugin validate --strict`.
2. **Studio voice** (`output-styles/studio.md`).
   - Turned on automatically while Studio is enabled (`force-for-plugin`).
   - Keeps Claude's normal coding skills (`keep-coding-instructions`).
   - Rules, taken from page 03:
     - say what you'll do, do it one short line per step, show what changed, offer the way back
     - confirm before anything that can't be undone
     - no em dashes
     - friendly words first
3. **Glossary skill.** These seven pairs from the Desktop panel's glossary:
   - project → repository (repo)
   - exploration → branch
   - save point → commit
   - handoff for review → pull request
   - working memory → context window
   - workspace → terminal
   - private preview → localhost

   Claude uses the friendly word and adds the real term in brackets the first time it comes up. The full fading teaching system is a later phase.
4. **Commands.** These are typed as `/start` etc.; `/studio:start` also works. None of these names clash with Claude Code's own commands.
   - `/start`: opens the project and summarises where you left off: current exploration, recent save points, and unsaved changes. If the folder isn't set up for save points yet, it offers to do that.
   - `/save [note]`: makes a save point now and lists what it includes.
   - `/show`: starts your private preview and gives you the link.
   - `/explore [name]`: starts a new exploration from a save point. With no name, it lists your explorations and lets you switch.
   - `/handoff`: writes a plain summary of what changed and opens a handoff for review. It always asks first, because it shares work outside your computer.
5. **Safety hooks.** Hooks are small scripts Claude Code runs automatically at set moments.
   - **Automatic save point:** before Claude's first file change in each request, Studio quietly snapshots your work. This covers edits by Claude and by commands, and works in the terminal and Desktop. If the folder isn't set up for save points, it skips and says so once.
   - **Calm errors:** when a step fails, a hook reads the error and gives Claude a plain explanation for common cases: address already in use, file not found, missing tool, permission problem, network problem, and a clash between two explorations. Claude then explains in the calm style from page 03. The original technical error is still recorded underneath; Claude Code doesn't let a plugin hide it.
6. **Colour theme.** Light and dark themes, made from the Figma variables. For example clay → `claude`, sage → `success`, rust → `error`, dusk → `planMode`, and paper and ink → text and borders. They appear in `/theme`. They only affect the terminal; the docs don't mention themes in Desktop.

## Testing
- **Terminal:** `claude --plugin-dir ./plugin` inside `playground/onboarding`. I'll try every command and hook, then `/reload-plugins` after each change.
- **Desktop Code tab:** I add this folder as a local plugin source and install Studio, then you open the playground in Desktop and try the same steps. I'll write a short checklist for you.
- **Results:** I'll report every difference between the two plainly. Known in advance:
  - themes are terminal only
  - Claude Code's built-in rewind (Esc Esc) isn't documented for Desktop, which is one reason Studio makes its own save points

## Not in Phase 2
The status line setup, the band and panel mods, the Figma commands (`/from-figma` etc.), the fading teaching system, and the install script.
