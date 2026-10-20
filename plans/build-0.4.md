# Build plan: Studio 0.4, the redesign

Status: **approved** (20 October 2026). **B1 done** (0.3.11: logo, still stage-coloured dot, equal-width bars with a quarter-space gap, hint per step). **B2 built** (0.3.12), waiting for the user to try it in the app. Answer boxes stay plain (style A, chosen in the lab 2026-10-20). **B3 built** (0.3.16): `hooks/studio/figma.js`; the mod asks with `$.ui.ask` before the first change to each Figma file, refuses design system files, tells `guard-figma.sh allow` and approves in `tool.check` after a yes; Figma tool rows restyled at `ToolUse`. Tested in the app 2026-10-20: Studio's question appears in Claude Code's question dialog (pick an answer, then Submit), no "Allow?" prompt reported after a yes, and Figma steps show as "Working in Figma". Built only from Figma pages 15 (redesign proposal), 16 and 17 (logo), and what the Studio lab showed the Claude app can draw (`plans/ui-limits.md`). Nothing is built until approved.

## What's decided

- **Logo:** C3, rounded crop corners in charcoal with the coral dot (components `Studio logo / 16, 32, 96` on page 17). Shown in the band **before Claude starts any work**, as a still picture.
- **Once work starts:** a still ● dot, coloured by stage. Nothing moves.
  - waiting for a story: grey #9C9CA6
  - the brief (steps 1 to 3): dusk #4F6D8F
  - the design (steps 4 to 6): coral #E07A6E
  - ready for developers (steps 7 to 9): sage #5E7D5B
  - something needs you, at any step: ochre #B8862B (words #8E6516)
- The words beside the dot always say the same thing as its colour.
- Colour variables for all of these are in **Studio · Mist** in Figma.

## Phases

Each phase ends with you trying it in the app, and a pause.

### B1. The band and the hint

- The logo before any work; then the stage-coloured dot.
- A still progress bar made of ▬, in the stage's colour.
- The status as now ("Step 5 of 9 · The design · building screen 3 of 5"), with what needs you in ochre words.
- Stop while Claude works.
- **A hint under the prompt for each step** ("Paste a Jira story to start", "Answer the questions here or in the panel", …).

### B2. The panel

- **The story at the top:** its key and step in small type, the title large, the Confluence note, and the progress bar.
- **Sections as white cards.** What needs you is outlined in ochre, with ochre words, and comes first.
- **Links straight to each screen** in Figma ("Open ↗"); the story tool gains a link for each item.
- **Answer the questions in the panel** (a text box under each, and Send answers), as well as in the chat.
- **Requirements tick off** as Claude checks; anything that doesn't match links to its note in Figma.
- **The handover checklist** with what Claude can do next for each item.

### B3. Studio's own Figma question, and friendlier tool rows

- Before Claude's first step in each Figma file in a conversation, **Studio asks in plain words**, in Claude's question dialog ("Work in 'Studio setup test' in Figma? Claude will add …"). Yes lets Claude carry on in that file for the rest of the conversation, without the "Allow?" prompt.
- Design system files are still always refused (unchanged).
- **Figma steps in the conversation read as what they do:** "Working in Figma · Add the sign-up screens", not "plugin_figma_figma use_figma".

### B4. Tidy up

- Remove the Studio lab and `/studio-lab`.
- Tests for each part; Studio 0.4.0.
- Add the result to Figma as page 18 "As built · Studio 0.4", so the design matches what was built.

## Questions

1. **When work starts, the logo becomes the coloured ● dot** (as agreed). Alternatively, keep the logo's corners and colour only its dot by stage. That's possible with pictures (they don't move, but they can be swapped), though the lab saw one case where the app kept an old picture, so it would need a quick test.
2. **What needs you in the panel: an ochre outline and ochre words,** to match the band (the proposal on page 15 shows coral, from before the stage colours).
