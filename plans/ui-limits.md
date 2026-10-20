# What Studio's UI can and can't do (researched 20 October 2026)

From the Claude Code docs (code.claude.com/docs/en/plugins/mods/…, plugins/components, permissions, mcp, statusline, desktop), the official mod type declarations, the official sample mods and a few public mods. "Untested in the app" means the docs allow it but don't say how the Claude app's Code tab draws it.

## Where Studio can draw

| Place | Studio today | Possible |
|---|---|---|
| The band above the prompt | Status | Yes, terminal and app |
| A panel (pane) | The story | Yes; several panels, each with a tab |
| Claude's tool rows in the conversation ("plugin_figma_figma use_figma") | Not touched | **Yes, can be restyled**, e.g. "Working in Figma · Reading page 13" |
| Claude's question dialog (the quick-reply buttons) | Not touched | **Yes, can be restyled** |
| The working line (spinner) | Plain words | Yes |
| The hint line under the prompt | Not used | Yes, e.g. "Paste a Jira story to start" |
| Prompt suggestions | Not used | Yes, rows under Claude Code's own |
| A status line under the prompt, toasts | Not used | Yes (untested in the app) |
| Studio's own question, in Claude's question dialog | Not used | **Yes ($.ui.ask)**, e.g. before a Figma change |
| The permission ("Allow?") prompt | Message only | **No**: its look and options can't be changed |
| Claude Code's welcome box, the app's sidebar, Browser, diff and file panes | — | No |
| The main status line | — | No (a plugin can't set it) |
| HTML, web pages, artifacts inside Claude Code | — | No |

## Building blocks

- **Elements:** Box, Text, Button (with a one-key shortcut), Link (https or localhost), Markdown, Code, Input (a text box), Select (a choice list), Svg pictures (app and VS Code only), Client (a region for animation and pointer input, app only, unclear). Image and Raster are terminal only.
- **No** checkboxes, tab widgets, dividers or icons as elements: tabs are rows of buttons, icons are characters or Svg.
- **Text:** colour, background, bold, italic, underline, strikethrough, dim. **`size` (caption, footnote, body, heading, title) and `weight` (regular to bold) exist**, ignored in the terminal; **untested in the app**.
- **Boxes:** flex layout, padding and gaps in steps, width and height, background, border colour, 10 border styles. No one-sided borders (except a bar down the left, "quote"), no pixel corner radius, no opacity. Hover styles exist; when they trigger is undocumented.
- **No** custom typefaces; only "the app's monospaced typeface".

## What we got wrong or haven't tested

- **Type size and weight** may work in the app; we assumed not.
- **Svg** is documented for the app, including the band; ours didn't draw there, possibly a size or layout problem.
- **Raw hex colours** aren't documented (named and theme colours are), though ours work in the app.
- **The grey box** around the band in the app is our observation; the docs don't mention it, and nothing documented removes it.
- Panel placement, toasts, status line, Link clicks and borders in the app: untested.
