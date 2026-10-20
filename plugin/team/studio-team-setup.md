# Setting Studio up for your team

Studio works for one designer on their own. A team only needs to share one thing, the list of design systems it uses, so everyone chooses from the same list.

## The team setting

| Setting | What it does |
|---|---|
| Design systems | Every design system your team uses, each with its Figma library link. Designers choose one for each project during `/setup`, and Studio never changes those files. |

It's saved on each designer's computer, in Claude Code's own settings. Nothing is uploaded, so nothing is sent to GitHub or anywhere online.

## How it works

1. **One person adds the design systems.** They run `/setup` in Studio and, at "Which design system?", paste each design system's Figma link. Claude saves the list (Claude Code asks them to allow it).
2. **They save a copy for the team.** They ask Claude to "save a team file". It runs `studio-team export`, which makes `team.studio-team.json` on their Desktop.
3. **They share the file** with the team, however the team usually shares files.
4. **Each designer drags it in** during `/setup`, at "Which design system?", and allows Claude to save it.

## For a team admin (optional)

Studio's upload check can be limited to the team's own GitHub: set `STUDIO_ALLOWED_ORGS` (for example `"acme"` or `"acme/design-work"`) in Claude Code's settings `env`, ideally in company-managed settings so it can't be removed. Without it, Studio asks before every upload.

## Checklists

### For the person setting up the team

- [ ] Studio is installed on your computer
- [ ] You have the Figma library link for each design system your team uses
- [ ] You've run `/setup` and added the design systems
- [ ] You've asked Claude to save a team file and found it on your Desktop
- [ ] You've shared the file with your designers, along with this guide

### For each designer

- [ ] Studio is installed on your computer
- [ ] You have the team file from your team
- [ ] You've opened the Claude app, gone to the **Code** tab, and run `/setup`
- [ ] At "Which design system?", you dragged the team file in and allowed it to be saved
- [ ] You've finished the rest of `/setup`: Figma, your account, the design system and the Figma file
