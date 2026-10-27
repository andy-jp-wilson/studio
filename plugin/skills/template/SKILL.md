---
name: template
description: Set up Studio's project template in the project's Figma file, so every project is structured the same way. It adds the pages Cover, User story, Concept, Final design and Designer notes, sets every page's canvas to the team's colour, builds the cover (for the file's thumbnail) and writes the User story page. Use when Studio's project note says to offer it, when the designer asks to "set up the project template", or when they ask to "use the template's canvas colour" on an existing file.
---

# The project template

Optional, like pasting a user story. Offer it **once per project**: at the end of the brief (after choosing where the work goes), or when design work starts in a file that doesn't have it. If Studio's project note says it's done or skipped, don't offer it again unless the designer asks.

Read the two scripts in this folder, `build-template.js` and `story-page.js`. Run each with `use_figma` exactly as written, changing **only its `DATA` block**. Follow the `figma:figma-use` skill's rules, and give each step a plain `description` ("Set up the project template", "Write the User story page").

## 1. Look first (changes nothing)

Name the project's Figma file in one line, then read its pages with `get_metadata` (no node id). If it already has a **Cover** page, say the template is already there and offer to refresh the cover instead (script 1 again; pages that exist are kept).

## 2. Gather the cover details

- **Title:** "[KEY] Title" from the user story, e.g. "[SIGN-142] Faster sign-up". Without a story, the task's short name.
- **Jira link:** the story's https link, labelled "Open in Jira ↗". None without a story.
- **Designer:** their Figma name from `whoami`. Write "Last, First" as "First Last".
- **Release:** the story's fix version in Jira, read only (`getJiraIssue`). Never change anything in Jira. If there's none, or no story, ask; "Not set yet" is fine.
- **Design system:** the project's, from Studio's project note, or "N/A".
- **Status:** the project status Studio shows (In progress unless the designer changed it).
- **Last updated:** today, e.g. "27 Oct 2026".
- **Canvas:** `STUDIO_CANVAS_COLOR` from `studio-team show`, else #F5F5F5.
- **Team logo:** if `STUDIO_TEAM_LOGO` is set, read the logo's name with `get_metadata` (its file key and node id; read only, never change that file). Then find its key with `search_design_system` in the **project's** file (a component query with the logo's name) and use the matching component's key. If it isn't found, the logo's library isn't added to this file yet: build the cover without the strip, and tell them how to add it (in Figma, **Assets** panel, **Libraries**, find it, **Add to file**), then say "refresh the cover". No setting means no strip.

## 3. Say what will happen, and wait for a yes

One short message, e.g.:

"I'll set up the project template in **Onboarding**:
- add five pages at the start: Cover, User story, Concept, Final design, Designer notes (your other pages stay as they are)
- set every page's canvas to #F5F5F5 (nothing on the pages moves)
- build the cover with [SIGN-142] Faster sign-up, the Jira link, Sam Rivera, Release 4.2, Acme Design System and In progress
- write the User story page from the story
Shall I go ahead?"

Use question buttons (Set it up / Not now). Studio then asks its own question before the first change to the file; that's expected.

- **Not now:** `studio-project set template skipped`, and carry on. Don't offer it again unless they ask.

## 4. Build it

1. **Script 1** (`build-template.js`) with the cover details.
2. **Script 2** (`story-page.js`): the story distilled for design, in plain words and with **nothing invented**. Sections: The story (the "As a … I want … so …" line), What the design needs to do (the requirements and acceptance criteria, as design needs), Paths (every path the story describes, and none it doesn't), Answered questions (with the designer's answers), Open questions, Not in this story (only what the story or the designer said is out). Leave a section's items empty if there's nothing for it. Without a story, skip script 2 and leave the page empty.
3. Check the cover with `get_screenshot` and fix anything that's off.
4. `studio-project set template done`.

Then reply with what changed, in design terms, with links to the Cover and User story pages. Ask them to make the cover the file's thumbnail, since Claude can't: in Figma, right-click the **Cover** frame and choose **Set as thumbnail**. Concept and Final design stay empty; concepting and visual design work go there. Offer the way back: Figma's own undo and version history.

When the designer answers more questions later, offer to update the User story page (script 2 again).

## Just the canvas colour

For "use the template's canvas colour" on an existing file: say it sets every page's canvas to the colour (nothing on the pages moves), wait for a yes, then run only this with `use_figma`:

```js
const hex = '#F5F5F5' // the team's canvas colour
const color = { r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 }
for (const page of figma.root.children) page.backgrounds = [{ type: 'SOLID', color }]
return { mutatedNodeIds: figma.root.children.map(p => p.id) }
```

## Rules

- Only the project's own Figma file; never the design system's or the logo's file.
- Pages already in the file stay as they are; only a new file's single empty "Page 1" becomes the Cover.
- Jira and Confluence are read only, always.
- No em dashes in anything written to Figma.
