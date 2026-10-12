# Phase 3: the Studio band and panel (plan)

Checked against the Claude Code mods docs on 2026-10-12 (version 2.1.296). Both pieces are **mods**: code in the plugin that draws on screen. They work in the terminal and the Desktop Code tab. In VS Code nothing draws, but everything else keeps working.

## How it fits together
- One mod module, `plugin/hooks/studio.js`, plus small helper files: journey state, narration, band, panel, glossary. It's listed in the existing `hooks/hooks.json` under `modules`, beside the safety hooks, which stay as they are.
- **What Studio keeps track of:**
  - **Project facts**, checked with git when the session starts, after each request, and every 30 seconds:
    - the exploration
    - the save points on it and when you last saved
    - whether a handover exists
    - whether the private preview is running
  - **Live facts:**
    - what Claude is doing right now, from each step it takes
    - its step list when it makes one ("step 2 of 3")
    - working memory, from Claude Code's own usage figure

## The journey stage (Explore → Refine → Build)
Studio guesses the stage, and you can change it by pressing a stage. Studio remembers your choice for each project.
- **Explore:** you're on the main version, or on an exploration with no save points of its own yet.
- **Refine:** the exploration has its own save points.
- **Build:** a handover has been made for this exploration, or you chose Build.

## 1. The band above the prompt (terminal and Desktop; design: page 01)
```
✓ Explore ─ ● Refine ─ ○ Build    Now  editing the sign-up screen, step 2 of 3    [1 Show] [2 Save] [3 Stop]
```
- **Journey:** the three stages, using the chip styles from page 01.
- **Now:**
  - What Claude is doing, in plain words: "reading styles.css", "editing the sign-up screen", "making a save point", "working in Figma", "looking through files".
  - When Claude is idle, it says "Ready when you are".
- **Buttons:**
  - **1 Show:** opens the private preview.
  - **2 Save:** makes a save point.
  - **3 Stop:** appears only while Claude is working, and stops it. Claude Code can stop a request, not pause it, so this button is "Stop" rather than the "Pause" in the design.
  - **Hotkeys:** typing the digit alone in an empty prompt also presses the button.
- **Working line:** Claude's own working line gets the same plain wording, e.g. "Editing styles.css…".
- **Narrow screens:** on a narrow screen, the band drops the "Now" text first, then the stage names.
- **Survey:** it steps aside when Claude Code shows its own survey.

## 2. The Studio panel (Desktop beside the conversation; terminal sidebar when wide; design: page 02)
- **Opening:** it opens by itself when a session starts. In the terminal that only happens if the window is wide enough (144 columns); otherwise type `/panel`. Esc or Ctrl+X X closes it, and `/panel` opens it again.
- **Tabs:** Journey and Glossary, drawn as two buttons.
- **The Journey tab:**
  - **Your journey:** the three stages, each with a plain detail line, e.g. "Tried 3 explorations", "4 save points on fewer-steps", "Handed over 12 Oct".
  - **Happening now:**
    - a one-line headline, e.g. "Claude is editing the sign-up screen"
    - a checklist of this request's steps (✓ done, ● now, ○ next); it uses Claude's step list when there is one, otherwise its recent actions
  - **Did you know?:** one real term linked to what just happened, e.g. after a save point: "Developers call a save point a commit."
  - **Actions:**
    - **Preview:** when the preview is running, this is a link to it; otherwise it starts it.
    - **Save.**
    - **Send to Figma** (see question 2).
  - **Footer:** exploration · "saved 2m ago" · working-memory bar.
- **The Glossary tab:**
  - a search box
  - the seven friendly words, each with its real term and a plain sentence
- **Font and colour:** the panel uses the Desktop app's own font. Colours use theme names, so in the terminal they follow the Studio theme.

## Testing
- `claude plugin validate --strict`.
- **Automatic tests** (`claude plugin test`). They draw the band and panel in different states (idle, working, narrow, each tab) and check the text and buttons, including that pressing Save runs `/save`.
- **Looking at it:** I can't see an interactive terminal or the Desktop app myself, so your eyes are the final check. I'll write a short checklist for the terminal and Desktop.

## Known limits
- No band or panel in VS Code.
- The docs don't say where Desktop places a mod's panel or how wide it is. We'll find out when you try it.
- "Step 2 of 3" only appears when Claude makes a step list for the request.
