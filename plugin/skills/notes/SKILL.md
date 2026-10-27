---
name: notes
description: Leave notes for the team on the project's Designer notes page in Figma (where it stands, decisions, open questions, what's next, key frames, history), so a colleague or cover for annual leave can pick it up; and pick a project up from someone else's notes. Use when the designer says "leave notes for the team", is going on leave or handing over, when Studio suggests it after a status change, or when they say "pick up SIGN-142" (or another story) with its Figma file.
---

# Designer notes and pick-up

The team works in Figma and has no shared place for files yet, so the project's own Figma file is where work is passed on. Everything here stays in that file; Figma's version history keeps every earlier version of the notes.

The scripts in this folder are run with `use_figma` exactly as written, changing **only their `DATA` block**. Follow the `figma:figma-use` skill's rules, and give each step a plain `description` ("Update the Designer notes", "Update the cover's status").

## Leaving notes

Only when the designer asks, or says yes when Studio or you offer it (Studio offers when the status becomes Feedback or Ready for dev; you can offer before they go on leave if they mention it). **Ask every time**; never update the notes on your own.

1. **Read what's there** (changes nothing): name the project's Figma file, list its pages with `get_metadata` (no node id), then read the **Designer notes** page with `get_metadata` on its id. Every text layer is named after what it says, so the names are the notes. If there's no Designer notes page, offer the project template (the `template` skill) or, with a yes, just a page called "Designer notes".
2. **Gather,** in plain words and short:
   - **Title:** "KEY · Title", or the task's name without a story. **Links:** the story's Jira link ("Open in Jira ↗"), and its Confluence technical design if there is one ("Technical design in Confluence ↗").
   - **Stage** and **status:** what Studio shows (the status is the designer's).
   - **Last updated:** the designer's Figma name (from `whoami`, "Last, First" as "First Last") and today, e.g. "Sam Rivera · 27 Oct 2026".
   - **Decisions:** what's been decided (answered questions, choices made), each with who and when in its `sub`. Keep the ones already on the page.
   - **Open questions:** anything still unanswered, with where it came from.
   - **What's next:** one to three steps.
   - **Key frames:** the main screens, with a `url` to the frame in Figma and the page in `sub`.
   - **History:** add one line on top, "27 Oct · Sam · Visual design shared for feedback"; keep the earlier lines.
   Copy nothing from Jira or Confluence beyond the story's key, title and links, and invent nothing.
3. **Ask,** with question buttons: "Update the Designer notes page in **<file>**? I'll add today's decisions, the open questions and what's next, and update the cover's status and date. Nothing else in the file changes." (Yes, update the notes / Not now.) If Studio just asked "Update the Designer notes…?" and they said yes, that's their yes; don't ask again.
4. **Write:** `designer-notes.js`, then `cover-status.js` (it does nothing if there's no template cover). Check the notes with `get_screenshot`.
5. **Reply** in one or two lines: what the notes now say (stage, status, how many decisions and open questions, what's next), that anyone can read them in Figma and their Studio can pick up from them, and a link to the page. Offer the way back: Figma's own undo and version history.

## Picking up

When someone says "pick up SIGN-142" (with the Figma file's link, or the project's file from Studio's project note):

1. **Read only.** Name the file, list its pages with `get_metadata`, then read the **Designer notes** and **User story** pages with `get_metadata` on their ids. Never use `use_figma` to read: it would ask to change the file. If there are no Designer notes, say so plainly and offer to play the brief back from the User story page, or from the story in Jira (read only).
2. **Fill in the panel** with the story tool: `clear: true`, the story's key, title and Jira `link`, the `stage` from the notes, and these sections:
   - "Picked up from designer notes": one item, "Last updated by Sam Rivera", `sub` "27 Oct 2026 · 3 decisions · 1 open question", `link` to the Designer notes page (`linkLabel: "Open"`)
   - the open questions, as a `needs: true`, `ask: true` section titled e.g. "1 open question" (each `need`, where it came from in `sub`), if there are any
   - "What's next", each step `todo`
   The project status is the new designer's to set: if the notes' status isn't In progress, send `suggestStatus` with it and `suggestReason` "The designer notes say <status>."
3. **Play back** where it's at, briefly: "Picked up from Sam's notes (27 Oct):" then the stage and status, the decisions in a few words, the open questions and what's next. End with one question, e.g. "Would you like to answer the open question, or wait for feedback?"
4. Carry on with the stage as usual. Changing anything in the file is a separate step: say what you'll change and wait for a yes, as always.

## Rules

- Only the project's own Figma file (or the one they named for pick-up); never a design system file.
- Jira and Confluence are read only, always.
- Plain words, no em dashes, nothing invented.
