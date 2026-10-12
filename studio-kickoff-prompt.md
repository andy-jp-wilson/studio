# Studio — kickoff prompt for Claude Code

> How to use: create an empty folder (e.g. `~/design/studio`), open a terminal there, run `claude`, press Shift+Tab until you're in **Plan** mode, then paste everything below the line.

---

## Who I am and what we're building

I'm a designer, not an engineer. Explain what you're doing in plain language as you go, avoid jargon (or define it the first time you use it), and pause for my approval at the end of every phase. Treat this session as a live example of the experience we're building: calm, clear, and teaching as it goes.

We're building **Studio**: a Claude Code plugin that makes Claude Code simpler, more beautiful, and more comforting for designers, and teaches them how AI-assisted design work happens. It must work in the **terminal first**, and fully in the **Claude Desktop app's Code tab** as well. One plugin, adapting to where it runs.

Before you build anything, read the current Claude Code docs rather than relying on memory, because features change often. Start at https://code.claude.com/docs/llms.txt and read the pages on plugins, plugin components, mods, output styles, hooks, skills, status line, MCP, and the Desktop app.

## Phase 0 — Connect Figma

1. Check whether a Figma MCP server is already connected (`claude mcp list`).
2. If not, install Figma's official plugin: `claude plugin install figma@claude-plugins-official`. If that isn't available, add the remote server instead: `claude mcp add --transport http figma https://mcp.figma.com/mcp`. Use the **remote** server, because writing to the canvas only works there.
3. Walk me through signing in (via `/mcp`).
4. Confirm it works by reading this file: (Studio's design file in Figma; link kept out of the repository) (file key `<design-file-key>`). The first page is currently empty.
5. Load any Figma skills the plugin provides (e.g. for writing to the canvas) before creating designs.

As you go, explain in one or two sentences each: what an MCP server is, why Figma needs one, and what the sign-in step grants.

## Phase 1 — Design Studio in Figma (before writing any code)

Create the designs in the Figma file above. Organise it into clearly named pages:

- **00 Cover & principles** — Studio's purpose and design principles: calm, plain language, always safe to undo, teaches then steps back.
- **01 Terminal** — the full terminal look: colour palette (light and dark), font pairing, the zsh prompt, the custom status line (project name · current exploration · time since last save point · Claude's working-memory bar), and the band above the prompt showing the journey stage and what Claude is doing right now.
- **02 Desktop panel** — the Studio panel beside the conversation in the Desktop Code tab: journey map (Explore · Refine · Build), "what's happening now" narration, buttons (Save · Preview · Send to Figma), and a glossary tab.
- **03 Conversation examples** — how Claude sounds in the Studio voice: a normal reply, a step being narrated, a calm error message, a teaching moment that introduces one real term.
- **04 Journeys** — the three guided flows as simple flow diagrams: Claude Design → Claude Code → localhost prototype → Figma review; Figma frame → Claude Code → localhost prototype; existing prototype → Figma → team.

Use real Figma structure: auto layout, colour and type variables (so the palette becomes design tokens the code can reuse later), and components for repeated pieces like buttons and status segments. Show me a screenshot of each page as you finish it, and stop for feedback after page 01.

## Phase 2 — Build the foundation

Only after I've approved the designs:

1. **Plugin skeleton** — the `.claude-plugin/plugin.json` manifest and folder structure, testable locally with `--plugin-dir`.
2. **Studio output style** — Claude's voice: uses the glossary, says what it's about to do before doing it, summarises visually and briefly, confirms before anything irreversible.
3. **Glossary skill** — repo → project, branch → exploration, commit → save point, pull request → handoff for review, context window → Claude's working memory, terminal → workspace, localhost → a private website on your computer. Over time, introduce the real term alongside the friendly one.
4. **Core commands** — `/start` (open a project and summarise where I left off), `/save`, `/show`, `/explore`, `/handoff`.
5. **Safety hooks** — an automatic save point before Claude changes files, and error messages translated into a calm sentence saying what happened and what to do next.
6. **Colour theme** — a Claude Code theme built from the palette variables in Figma.

Test each piece in the terminal, then in the Desktop Code tab, and tell me anything that behaves differently between them.

## Later phases (plan only for now, don't build yet)

- Install script for the terminal look (terminal app, font, theme, zsh prompt) plus the status line.
- Mods for the terminal band and the Desktop panel, matching the Figma designs. Mods need a recent Claude Code version; check the docs. Fall back to plain text where a mod can't draw, such as VS Code.
- Design workflow commands: `/connect-figma` (guided, asks first whether it's needed), `/from-design` (Claude Design handoff), `/from-figma`, `/prototype` (localhost, using the Desktop Browser pane when available), `/to-figma`.
- Teaching system: narration levels that fade (guided → coached → independent), `/explain`, `/learn`.

## Ground rules

- Plan first, then act. Show me the plan for each phase before starting it.
- Never delete or overwrite anything without asking.
- If a feature in this prompt doesn't exist or works differently from what I've described, say so plainly and suggest the closest alternative. Don't fake it.
- Keep a `CLAUDE.md` project brief up to date with the decisions we make, so future sessions remember them.
