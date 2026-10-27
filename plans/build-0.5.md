# Build plan: Studio 0.5, stages and project status

Status: **approved** (27 October 2026). **S1 built** (0.4.14): the card holds `stage` (brief, concepting, visual, review; an old `step` is still understood), Studio keeps `projectStatus` (starts In progress; Claude can't set it), `suggestStatus` asks the designer with `$.ui.ask`; **S2 built** (0.4.15): the band shows the dot in the status colour, four stage segments, "stage · status" and needs-you in ochre, with no step numbers; one hint per stage (or "Claude is waiting for you" / "Claude is working"). **S3 built** (0.4.16): the panel's top shows the key and title, a status dropdown (Select) with the status dot, the four stage segments and the stage line; a Stages card (done, current, to come); a Needs you card when Claude is waiting and no section already says so. No step numbers. Checklist ticks are sage. Built only from Figma page **04 Stages and status · proposal** (`100:7`) and the decisions in CLAUDE.md. Nothing is built until approved.

## What changes

- **Nine numbered steps become four stages:** The brief, Concepting, Visual design, Review. Claude still follows the same moments inside each stage (play the brief back, say first and wait for a yes, check against the story).
- **A project status, set by the designer:** Not started, In progress, Feedback (shared with stakeholders or the team), Ready for dev.
- **Needs you** (Claude waiting for an answer or a yes) stays separate: ochre words in the band, an ochre card in the panel.
- **No step numbers and no progress detail** anywhere.

## Phases

Each ends with you trying it in the app, and a pause.

### S1. The story card

- The card holds the **stage** instead of a step number, and **needs you** as now.
- The **status** is kept by Studio, not by Claude. It starts as In progress when work begins.
- When Claude wants the status changed (you said "mark it as out for feedback", or the handover checklist is all ticked), it asks Studio, and Studio puts a **one-click question** to you ("Mark SIGN-142 as Ready for dev?" Yes / Not yet). Claude can never change it on its own.

### S2. The band and the hint

- The dot in the **status colour** (grey, coral, dusk blue, sage), then "stage · status", then any needs-you words in ochre.
- **Four segments:** finished stages grey, the current one charcoal, later ones light.
- One hint per stage under the prompt.

### S3. The panel

- Under the story title, a **status dropdown** (the four statuses, each with its dot). Choosing one changes it straight away.
- A **Stages** card: done, current, still to come.
- A **Needs you** card, outlined in ochre, when Claude is waiting for you.
- The other cards (questions, screens, where, requirements, checklist) stay as they are.

### S4. Words and tidy up

- Claude's instructions: the four stages, the moments inside them, never setting the status itself, and the two suggestion moments.
- `/guide`, `/glossary` and the welcome's three steps updated to match.
- Tests; Studio 0.5.0; Figma page 03 updated to the new as built.

## Not changing

- How Studio asks before Figma changes, refuses design system files, keeps Jira and Confluence read only, and uploads only when asked.
