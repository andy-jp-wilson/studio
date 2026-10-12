# Studio — project brief

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
- **Phase 1 plan:** `plans/phase-1-figma.md`.

## Platform facts (from the docs, checked 2026-10-12 on Claude Code 2.1.296)
- The band above the prompt and the Desktop panel are **mods**. A mod's `hooks/hooks.json` lists `"modules"`, and each module exports `register(on)`. Mods need CLI v2.1.287+ and draw in the terminal and the Desktop Code tab, not in VS Code.
- A plugin can't set the main `statusLine`. A setup skill writes it to the user's settings instead. The status line gets no branch or last-commit field, so the script runs `git` itself.
- A plugin can ship a theme via `themes/<slug>.json` (`experimental.themes`). It is terminal only and can't set the terminal background.
- The output style lives at `output-styles/<name>.md` and can be forced on with `force-for-plugin`.
- Panes have no tab widget (use button rows), can't open Desktop's Browser pane (use a localhost Link), and can only show `Svg` in Desktop.

## Progress
- Phase 0 (connect Figma): done 2026-10-12. Signed in and the design file is readable: one empty page, "Page 1" (`0:1`).
- Phase 1 (design in Figma): all five pages built 2026-10-12. Waiting for final approval before Phase 2. Node IDs are in `plans/figma-ledger.json`.
