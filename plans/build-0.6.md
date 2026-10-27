# Build plan: Studio 0.6, project template, designer notes and pick-up

Status: **draft for the user's approval** (27 October 2026). Built only from the Figma proposals **Proposal · Team notes and pick-up** (`107:7`) and **Proposal · Project template** (`112:7`), and the decisions in CLAUDE.md. Nothing is built until approved.

## What it does

- **A project template**, offered at the start and optional, like pasting a Jira story: five pages in the project's Figma file, the cover as the file's thumbnail, and every page's canvas in the team's canvas colour (#F5F5F5 by default).
- **Designer notes**, one page per project, kept up to date by Claude when you ask, so a colleague (or cover for annual leave) can pick the project up.
- **Pick-up:** "pick up SIGN-142" reads the designer notes and carries on from them.
- **The story links to Jira** in the panel ("Open in Jira ↗").

Everything that changes Figma still goes through Studio's protections: Studio asks before the first change to a file in a conversation, never touches design system files, and keeps Jira and Confluence read only.

## Phases

Each ends with you trying it in the app, and a pause.

### T1. Team settings and the Jira link

- Two new **team settings**, saved with the design systems list and in the team file:
  - **Team logo:** a link to the logo in Figma (a component in the team's library). Shown on a charcoal strip at the top of the cover, never recoloured. Optional: without one, the cover has no strip.
  - **Canvas colour:** #F5F5F5 unless the team chooses another.
- `/setup` asks for them once, or reads them from a team file.
- The story card gains the **Jira link**, and the panel shows **Open in Jira ↗** under the story title.

### T2. The project template

- Offered when a project starts (after a Jira story is pasted, or when you describe new work in a file with no template yet), and any time you ask ("set up the project template").
- Studio's question says what will happen before anything changes. On yes, Claude:
  - adds the pages **Cover, User story, Concept, Final design, Designer notes**, in that order, before any pages already in the file (which stay as they are)
  - sets **every page's canvas** to the team's canvas colour
  - builds the **cover**: the team logo strip, "[KEY] Title", the Jira link, **Designer** (your Figma name), **Release** (the story's fix version in Jira, read only, which you confirm; asked for if there's no story), **Design system** (the project's, or N/A), **Status**, last updated, and a small "Set up with Studio" in the corner
  - makes the cover the **file's thumbnail**
  - writes the **User story** page from the story, in plain words and with nothing invented: the story, what the design needs to do, the paths, answered questions, and what's not in it
- Concept and Final design stay empty; concepting and visual design work go there.
- On an existing file, "use the template's canvas colour" fixes just the canvas on every page.

### T3. Designer notes and pick-up

- **Leaving notes:** "leave notes for the team" updates the Designer notes page: stage, status, last updated by whom, decisions, open questions, what's next, key frames and history. Studio also offers it when you change the status to Feedback or Ready for dev. It asks every time.
- The cover's Status and last updated date are updated with it, so the thumbnail stays current.
- **Picking up:** a colleague says "pick up SIGN-142" (with the Figma file). Claude reads the Designer notes and the User story page, without changing anything, fills in the panel (a "Picked up from designer notes" card, open questions, what's next), and plays back where things are.

### T4. Words and tidy up

- Claude's instructions, `/guide` and `/glossary` (Project template, Designer notes, Pick up).
- Tests; Studio 0.6.0; the as-built page in Figma updated.

## Questions

1. **Cover size:** 1920 × 1200 (the mock-up's proportions, which suit Figma's thumbnails). Fine?
2. **Template pages go first,** before any existing pages, so the cover is the first thing in the file. Fine, or keep existing pages first?
