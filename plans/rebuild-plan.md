# Rebuilding Studio to match the approved design

Status: **approved** (2026-10-20). **R1 done** (0.2.33). **R2 done** (0.2.36). **R3 done** (0.2.38, tested with SIGN-142). **R4 built** (0.2.39): `hooks/guard-figma.sh`.

## Where we are (for the next session)

- **Figma after the build** (2026-10-20): the app limits how closely Studio can match page 13 (the app draws the band and panel boxes and header; no one-sided lines, no Svg in the band, one type size). Don't redesign page 13 now. Once the rebuild is finished, add the final results to Figma as a new design page, so the design matches what was built.

- **R1 (band) is built and in the app,** after three rounds of fixes from the user's screenshots:
  - The dot is a coral ● character; the band can't draw Svg pictures.
  - The top line was removed: one-sided borders aren't possible, and drawn line characters didn't match the design.
  - Studio sets no background in the band: the app draws its own rounded grey box around it, and a second colour never lined up.
- **Lesson:** the Desktop band is the app's box; Studio controls only what's inside. Check limits like this in the app early, before matching a Figma design exactly.
- **Next, R2:** the story card (Claude updates it through a helper; kept by Claude Code itself, so no project folder is needed) and the panel rebuilt to follow the story, in Mist, as on Figma page 13. Remove the panel's Journey, Menu and Glossary tabs and its switches. Try it in the app early, with screenshots.


Built from what's agreed: the core and jobs (`plans/core-jobs.md`), the requirements and journey (`plans/requirements-and-journey.md`), your keep/cut calls (`plans/studio-today.md`), and the approved visuals (Figma page 13, D5 Mist). Nothing new is added; anything unclear is a question at the end.

## What the rebuilt Studio is

When a designer pastes a Jira story, Claude follows the nine-step journey. Studio shows where they are:

- **The band** (above where you type): status only. "studio · Step 5 of 9 · The design · building screen 3 of 6". The last part is in coral text when something needs you (no tint behind it, 2026-10-20). Stop appears only while Claude is building.
- **The panel** (beside the conversation): follows the story. The story, then whatever matters at this step: questions for you, requirements, paths, needs you, changes, notes in Figma, the handover checklist.
- **Claude's conversation and quick replies** stay Claude's own.
- **The look:** D5 Mist, the colours from the Figma variables, and the Studio mark (a picture, in the app).

## How it works underneath (plain version)

- **Studio keeps a small "story card" for the session:** the story, requirements, paths, questions, the current step and what needs you. Claude updates it as it works, through a small Studio helper, and the band and panel draw from it.
- **No project folder is needed.** The card is kept by Claude Code itself, not in a folder, so a designer can work in Figma without setting anything up on their computer.
- **Quick replies** use Claude Code's own question buttons.

## Phases

Each phase ends with you trying it in the app, and a pause.

### R1. The look and the band

- The band rebuilt as status only, in D5 Mist, with the Studio mark.
- The three band states: status, needs you, building (with Stop).
- Remove from the band: the welcome lettering, the journey stages (Explore, Refine, Build), save status, Preview and Menu buttons.

### R2. The story card and the panel

- The story card, and the helper Claude uses to update it.
- The panel rebuilt to follow the story, in D5 Mist: the story, then sections per step, with "needs you" on the tint.
- Remove from the panel: the Journey, Menu and Glossary tabs, the "Designs go to" and "Explain technical words" switches.

### R3. The journey in Claude's instructions

- The Studio voice updated to follow the nine steps when a Jira story is pasted: play the brief back, ask where and how (asking each time about a Figma branch), say first and wait for a yes, build with the design system only, change once across every screen, check and leave notes in Figma, make interactions clear, and the handover checklist.
- Word explanations become **dismiss / don't show again**, as you asked, in place of the switch.

### R4. Protections that are enforced

- **The design system file can't be changed:** Studio checks every Figma action and refuses any change aimed at the project's design system file.
- **Only the project's Figma file is changed,** and Claude asks before the first change in a conversation.
- The upload check (local by default) stays as it is.
- Jira and Confluence read-only: still parked; the rule stays in Claude's instructions until then.

### R5. Setup through the conversation, and tidying up

- Setup becomes a short conversation instead of seven steps and a form: is Figma connected, is this the right account, which design system, which Figma file. Claude asks, Studio remembers.
- Remove what you marked cut or unclear: project folder layout, the team settings form, `/start`, explorations, the panel menu.
- Keep: undo ("go back"), the upload check, `/guide` (updated), `/glossary`.
- Tests for each phase, and Studio version 0.3.0.

## Decided (2026-10-20)

1. **Save points: removed** from the band, panel, Claude's replies and commands (`/save` goes). The automatic snapshots stay, quietly, so "go back" still undoes changes to files.
2. **`/handover` and `/handoff`: removed** for now. Step 9's checklist covers getting ready in Figma; the developer handover is rebuilt later with developers' input.
3. **`/preview`: removed** until coded prototypes are worked on properly.
4. **Team settings: keep only the design systems list,** asked for in setup or loaded from a team file. The projects folder, GitHub and Figma folder settings go from the form.
