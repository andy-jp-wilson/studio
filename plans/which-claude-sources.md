# Which Claude for what: sources

The plain-language guidance lives in `plugin/skills/guide/SKILL.md` ("Which Claude for what") and in the welcome at the start of `/setup`. It deliberately leaves out plans, prices and dates, because they change often. This note keeps the facts behind it, so they can be rechecked before Studio is shared (Phase G).

Checked 2026-10-20, official Anthropic sources only.

## Claude Design
- Launched 17 April 2026 (Anthropic Labs, research preview). Makes designs, prototypes, slides and one-pagers, wireframes and code-powered prototypes; for designers and non-designers. https://www.anthropic.com/news/claude-design-anthropic-labs
- Now part of Claude: ask in any chat (or Output > Design), the Artifacts tab, `/design` in Claude Code, and the mobile apps. https://support.claude.com/en/articles/14604416-get-started-with-claude-design
- **The standalone claude.ai/design closes on 14 December 2026**; design systems and projects should be moved to Claude before then. Migration: https://support.claude.com/en/articles/17440474-migrate-from-standalone-claude-design-to-claude
- Exports: .zip, HTML, PDF, PPTX, Google Slides; sends to Canva, Adobe, Miro, Lovable, v0, Vercel and others; hands off to Claude Code. **Figma is not listed as an export target.** (same support article)
- Limits: shares one usage pool with the rest of Claude, including Claude Code; no version history yet; editing together isn't reliable. (same support article)
- Plans: **the sources disagree.** The 16 September 2026 release notes say every plan including Free (https://support.claude.com/en/articles/12138966-release-notes); the product page says Enterprise turns on 15 October 2026, except HIPAA-enabled organisations (https://claude.com/product/design). Older pages say paid plans only (https://claude.com/blog/claude-design-stays-on-brand-for-daily-work, https://code.claude.com/docs/en/whats-new/2026-w34).

## Claude (chat)
- Artifacts: designs, decks, docs and small tools beside the chat, editable and shareable (Team and Enterprise share inside the organisation only). https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them
- Connectors to outside services need a paid plan. https://www.anthropic.com/news/connectors-directory

## Claude Code
- Reads files, edits them and runs commands; in the terminal, VS Code and JetBrains, the desktop app's Code tab (paid subscription) and the web. https://code.claude.com/docs/en/overview
- In the desktop app it runs the local preview in a Browser pane and checks its own changes. https://code.claude.com/docs/en/desktop
- `/design` (research preview, August 2026) and `/design-sync` (brings in a design system, suited to React component libraries). https://code.claude.com/docs/en/whats-new/2026-w34, https://claude.com/product/design

## Anthropic's suggested workflow
- Claude Design for early ideas and alignment; hand to Claude Code when it's ready to become software, "which continues from your existing work rather than starting over from a screenshot". https://claude.com/blog/how-the-product-designer-who-built-claude-design-uses-it-to-explore-ideas-before-building-them
- None of these pages mention Figma.

## Figma
- The Figma connector is built by Figma and Anthropic-verified; remote server https://mcp.figma.com/mcp; reads Design and Make files, variables and components, Code Connect, and creates FigJam diagrams. https://claude.com/marketplace/connectors/figma
- Figma's Claude Code plugin adds `/implement-design`, `/create-design-system-rules`, `/code-connect-components`. https://claude.com/marketplace/plugins/figma
- The connector listing doesn't mention writing to Figma Design files, but Studio has written to the canvas through it in practice (Phase 1 and `/handover`, 2026-10-12).

## Worth considering later
- **Claude Design's design systems** and **`/design-sync`** could be one of the "forms" a team's design system comes in (Phase B).
- Studio could offer "bring it here" for work started in Claude Design (the parked `/from-design`).
- **The 14 December 2026 closure** of standalone Claude Design: if the team uses it, they'll need to move before then.
