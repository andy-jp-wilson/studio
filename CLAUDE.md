# Studio: project brief

Studio is a Claude Code plugin that makes Claude Code simpler, calmer and more teaching-friendly for designers. Terminal first, and fully working in the Claude Desktop app's Code tab. The full brief is in `studio-kickoff-prompt.md`.

## Working with the user
- The user is a designer, not an engineer. Use plain language and define any jargon the first time it appears.
- Plan each phase and get approval before starting it. Pause at the end of every phase.
- Never delete or overwrite anything without asking.
- If a feature doesn't exist or works differently from the brief, say so plainly and suggest the closest alternative.

## Decisions
- **Project folder:** `~/code/projects/studio/` (2026-10-12).
- **Figma connection:** the official `figma@claude-plugins-official` plugin (already installed at user scope). It uses the remote MCP server at `https://mcp.figma.com/mcp`, which is required for writing to the canvas.
- **Figma design file:** (Studio's design file in Figma; link kept out of the repository) (file key `<design-file-key>`).

- **Palette:** "Paper & clay" (2026-10-12).
  - Light: bg #F7F4EE · text #2A2723 · accent clay #C2643D · success sage #5E7D5B · warning ochre #B8862B · error rust #B4523F · info dusk #4F6D8F
  - Dark: bg #1A1917 · text #ECE7DE · accent #E08A62 · success #8FB08A · warning #D9AE5B · error #E0846F · info #8FAED0
- **Fonts:** Inter (UI/body), JetBrains Mono (terminal), Instrument Serif (display, cover only).
- **Example content uses product-design language** (2026-10-12). The running example is an app's *onboarding* flow, an exploration called *fewer-steps*, and the *sign-up screen*. Avoid website-marketing terms like "landing page" or "hero". Status-line pieces carry short labels ("project", "exploring") so they explain themselves.
- **No em dashes in copy** (2026-10-12). Use a comma or semicolon instead. This applies to Figma text and, in Phase 2, the output style and every UI string.
- **Phase 2 decisions** (2026-10-12):
  - Automatic save points are *hidden snapshots*: commits stored under `refs/studio/snapshots/*` that leave the branch, history and index untouched. Only `/save` makes visible commits.
  - Studio is installed at user scope from the local marketplace in this folder, so it can be tested in Desktop.
  - This folder is a git repo (local only; identity set repo-locally). `playground/` is git-ignored and has its own repo.
  - There's no `/undo` command, because the built-in `/rewind` already uses `/undo` as an alias. A model-invoked `go-back` skill restores snapshots instead.
- **Two kinds of handoff** (2026-10-12):
  - `/handoff` stays as the git pull request ("share online for review").
  - The new `/handover` makes a local team handover: a changelog (always), a Figma handover page (Studio default template, page 05), and a developer pack (HTML + CSS folder with a review page). Plan: `plans/handover-plan.md`.
  - Handovers show only the final design, never before and after. Specs are a fixed reference to the **Acme Design System** (link still to be added), not repeated values.
- **Phase 3 decisions** (2026-10-12): the band and panel are mods (plan: `plans/phase-3-band-and-panel.md`). Studio guesses the journey stage (Explore on main or an exploration with no save points of its own, Refine once it has some, Build after a handover) and the person can override it per project. The panel's Send to Figma asks Claude to capture the current screen into a Figma file the person picks, after confirming. The band's Pause becomes Stop (`$.turn.abort`), since Claude Code can't pause.
- **Band changes after first look** (2026-10-12): Show is now **Preview**, and the command is **`/preview`** (was `/show`; no built-in clash). Save points are offered only when needed: the band and panel show "✓ Saved 2m ago" or "Changes not saved yet", and the **Save point** button appears only with unsaved changes; Claude ends a reply that changed files with one save-point offer. Help is **`/guide`** (Claude Code's own `/help` can't be taken). A session opens with a **welcome in the band** (big STUDIO block wordmark, tagline, tip) until the first request, since plugins can't change Claude Code's own welcome box.
- **Where you left off, in the welcome** (2026-10-14): instead of auto-running `/start` (Claude can't speak first in a session), the welcome shows a two-line summary under the wordmark: project, exploration, last save point and how many files aren't saved yet. Small bands show it on one line. `/start` stays for the full summary and next steps.
- **App lettering and "main design"** (2026-10-14): the Desktop app's welcome uses a smaller 3-row STUDIO (`SMALL_WORDMARK` in `band.js`, chosen by `e.surface === 'desktop'`); the terminal keeps the big 6-row one. The main branch is called **the main design** everywhere (was "main version"), and it's in both glossaries and the output style's word list.
- **Phase 2 plan:** `plans/phase-2-foundation.md`.
- **Phase 1 plan:** `plans/phase-1-figma.md`.

## Platform facts (from the docs, checked 2026-10-12 on Claude Code 2.1.296)
- The band above the prompt and the Desktop panel are **mods**. A mod's `hooks/hooks.json` lists `"modules"`, and each module exports `register(on)`. Mods need CLI v2.1.287+ and draw in the terminal and the Desktop Code tab, not in VS Code.
- A plugin can't set the main `statusLine`. A setup skill writes it to the user's settings instead. The status line gets no branch or last-commit field, so the script runs `git` itself.
- A plugin can ship a theme via `themes/<slug>.json` (`experimental.themes`). It is terminal only and can't set the terminal background.
- The output style lives at `output-styles/<name>.md` and can be forced on with `force-for-plugin`.
- Skill `allowed-tools` only last for the turn in which the skill starts, so a command that asks the person a question loses them on the next turn. `hooks/allow-studio-tools.sh` pre-approves plain calls to Studio's own `bin/` helpers instead.
- Headless Chrome won't lay a window out narrower than about 500px. `studio-capture` centres the screen in a frame of the exact size, then trims the picture with `sips`.
- In tests, a `Link`'s `key` isn't kept on the terminal surface, so find links by `type: 'Link'`. A `$.clock.every` stub must return plain data (`{ value: {} }`).
- The installed Studio is a **copy** in `~/.claude/plugins/cache/studio-local/studio/<version>/`, not the project folder. After changing `plugin/`, raise the version in `plugin/.claude-plugin/plugin.json`, then run `claude plugin marketplace update studio-local` and `claude plugin update studio@studio-local`, and restart the app. Tests with `--plugin-dir` don't use the installed copy. (Found 2026-10-14: the app was still on the 2026-10-12 copy, with no band or panel.)
- Mod Button hotkeys must be one digit or lowercase letter. No render site exists for Claude Code's welcome box; `/help` stays the built-in one (a plugin skill would be `/studio:help`).
- Panes have no tab widget (use button rows), can't open Desktop's Browser pane (use a localhost Link), and can only show `Svg` in Desktop.

## Progress
- Phase 0 (connect Figma): done 2026-10-12. Signed in and the design file is readable: one empty page, "Page 1" (`0:1`).
- Phase 1 (design in Figma): done 2026-10-12, all five pages approved.
- Phase 2 (foundation): built 2026-10-12 in `plugin/`. Terminal tests passed via `claude -p --plugin-dir` in `playground/onboarding`. Desktop checklist steps 1 to 8 and 10 passed (2026-10-12).
- `/handover` built 2026-10-12. Changelog, developer pack and Figma page were each tested in the practice project; the Figma page was tested directly from this session, because `claude -p` subprocesses couldn't reach Figma. Next: the user tries `/handover` in Desktop.
- Phase 3 (band and panel mod) built 2026-10-12 in `plugin/hooks/studio.js` and `plugin/hooks/studio/*`. 10 automatic tests pass (`claude plugin test` in `plugin/`), and a real session loaded it with no errors. After the user's first look: Preview, save status, `/guide` and the welcome added (11 tests pass). 2026-10-14: where-you-left-off summary added to the welcome (14 tests pass). Smaller app lettering and "main design" added (15 tests pass). Next: the user checks it visually with `plans/phase-3-test-checklist.md`.
