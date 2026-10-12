# Phase 1: design Studio in Figma (plan)

File: (Studio's design file in Figma; link kept out of the repository) Right now it has one empty page and no tokens or styles.

## What the docs changed (checked 2026-10-12, Claude Code 2.1.296)
The designs only show things Studio can really draw:
- **Status line:** real, but a plugin can't install it automatically. A `/studio:setup` step will write it into your settings. It is plain text in colour, with no buttons. It works in the terminal only; the docs don't mention it for Desktop. Claude Code doesn't tell the status line the branch or the time of the last save point, so Studio works those out itself.
- **Band above the prompt:** real, built as a *mod* (a plugin that draws UI). It can show coloured text, boxes and simple buttons, in the terminal and the Desktop Code tab.
- **Desktop panel:** real, a mod *pane* (a side panel). Tabs aren't a built-in part, so the designs draw them as a row of buttons. "Preview" opens a localhost link; it can't open Desktop's own Browser pane directly. A pane can't choose its font, so in Desktop it uses the app's own font.
- **Colour theme:** real, and the plugin can ship it. It recolours Claude Code's text and accents but not the terminal background; the terminal app handles that later, in the install script. The feature is still marked "experimental".
- **VS Code:** none of the visuals appear there, only the voice and commands. The designs include a small "plain text fallback" note.

## Foundations: variables (built first, on the cover page)
- **Collection `color`, modes `Light` and `Dark`**
  - Primitives: paper, ink, clay (accent), sage (success), ochre (caution), rust (error, soft rather than alarm-red), dusk (info / plan), plus neutral steps.
  - Semantic tokens: `bg`, `surface`, `text`, `text-muted`, `accent`, `success`, `warning`, `error`, `info`, `border`. Each name lines up with a Claude Code theme token (`claude`, `text`, `subtle`, `success`, `error`, `warning`, `planMode`, `promptBorder`…), so Phase 2 can turn them straight into the theme file.
- **Collection `space` / `radius`:** 4, 8, 12, 16, 24, 32, 48.
- **Text styles:** Display, Heading, Body, Caption, plus Mono for terminal text.

## Reusable components
- **Status segment:** variants for project, exploration, save-point age and working memory.
- **Memory bar:** variants at 25, 50, 75 and 90% (calm → caution).
- **Journey chip:** variants Explore / Refine / Build × current / done / upcoming.
- **Button:** primary / secondary / quiet, with an optional hotkey digit (mod buttons can have number shortcuts).
- **Message bubble:** Claude / you / narration / error / teaching.
- **Glossary row:** friendly term → real term.

## Pages
1. **00 Cover & principles:** purpose, the four principles (calm, plain language, always safe to undo, teaches then steps back), the palette swatches in light and dark, and the type ramp.
2. **01 Terminal:** full terminal mock-ups in light and dark. They show:
   - the zsh prompt
   - the status line (project · exploration · "saved 12 min ago" · working-memory bar)
   - the band above the prompt (journey stage and "Claude is: reading 3 files…")
   - a short conversation

   Plus a callout for each piece explaining how it's built. **I stop here for your feedback.**
3. **02 Desktop panel:** the Code tab with the Studio pane beside the conversation. Tabs run along the top as a row of buttons (Journey · Glossary). It contains the journey map, the "what's happening now" narration, and the Save · Preview · Send to Figma buttons. The glossary tab is shown as a second frame.
4. **03 Conversation examples:** four cards: a normal reply, a narrated step, a calm error, and a teaching moment.
5. **04 Journeys:** three flow diagrams, built with Figma connectors and auto layout:
   - Claude Design → Claude Code → localhost prototype → Figma review
   - Figma frame → Claude Code → localhost prototype
   - Existing prototype → Figma → team

## How I'll work
- Build page by page, and show you a screenshot after each one.
- Nothing existing gets deleted. The only existing thing is the empty "Page 1", which I'll rename to "00 Cover & principles" rather than delete.
- If writing fails with a permission error, the file needs to move into the Acme organization (Full seat).
