---
name: handover
description: Hand finished design work to the team. Each project has one handover, updated each time: a changelog (keeping earlier handovers), a Figma handover page in the project's Figma file, and a developer handover (review page with the Figma file link, screen pictures, and the prototype's HTML and CSS when there is one)
argument-hint: "[title]"
disable-model-invocation: true
allowed-tools:
  - Bash(studio-changelog)
  - Bash(studio-project status)
  - Bash(studio-capture:*)
  - Bash(studio-pack:*)
  - Bash(mkdir -p handover:*)
  - Bash(git status:*)
  - Bash(git rev-parse:*)
  - Bash(lsof -i:*)
  - Bash(curl -s:*)
  - Read(handover/**)
  - Write(handover/**)
  - Edit(handover/**)
---

# /handover: hand finished work to your team

A project has **one handover**, in its `handover/` folder and on one **Handover** page in its Figma file. Each `/handover` updates it to the latest design; earlier changelogs are kept.

`/handover` stays on this computer, apart from the Figma page, which is only written after the person says yes. It never pushes, uploads or shares anything else. Use friendly words, and don't use em dashes.

## 1. Check
- **Save points.** If this folder doesn't keep save points, offer `/start` and stop.
- **Unsaved changes** (`git status --short`). A handover covers save points only, so offer `/save` first.
- **What's new.** Run `studio-changelog`. If it reports `save-points: 0`, say there's nothing new since the last handover and stop.
- **The project's files.** Run `studio-project status`. From `project`, note `targetFileUrl` and `targetFileName` (the project's Figma file) and `designSystemName` and `designSystemUrl`.
- **An earlier handover.** If `handover/handover.json` exists, read its `title` and `date`.

## 2. Ask once
Suggest a title from the changes, or use $ARGUMENTS. Ask in one message:
- "Title: **Calmer sign-up**. Change it?"
- "Make: **both** the Figma handover page and the developer handover, or just one?"
- If there's an earlier handover: "This updates the project's handover (last updated 14 October, 'Calmer sign-up') to the latest design. Its changelog is kept."
- If the project has no Figma file linked: "This project doesn't have a Figma file linked yet. Paste its link, or run `/setup` first?"

## 3. Write the handover
Read the `studio-changelog` output and write, in design words (sizes, colours, spacing, wording, never code):
- **changes**, newest first. Each has:
  - `when`: as given
  - `title`: from the save point note, tidied
  - `detail`: e.g. "Continue: dark ink → clay accent, 34px → 40px tall"
  - `why`: one plain sentence; use the conversation if it explains why, otherwise infer gently
  - `files`
- **summary**: two sentences.
- **points**: three short cards, each with a `title` and a one-sentence `detail`.
- **screens**: the screens of the finished design. A screen is each HTML page, or each main route for an app. Each has a friendly `name`, the `page` path, and `file`: `screens/<n>.png`. Show only the final design; never include earlier versions.
- **components**: the design system components the screens use (e.g. "Text field", "Button / Primary"). The person can correct these.
- **figmaFileUrl** and **figmaFileName**: the project's Figma file (from step 1, or the link they gave).
- **designSystemName** and **designSystemLink**: from step 1. If no design system is connected, leave both empty; the handover then says "not connected yet" and suggests `/setup`.
- **figmaPageUrl**: leave empty for now; step 5 fills it.
- **packLink**: leave empty. It shows as a "to be added" placeholder.

Make the folder with `mkdir -p handover/screens` and write `handover/handover.json` (replacing the earlier one, after the person's yes in step 2). It contains:
- `title`, `slug`, `date`, `summary`
- `project`, `exploration`, `designer`, `savePoints` (all from `studio-changelog`)
- `points`, `screens`, `changes`, `components`
- `figmaFileUrl`, `figmaFileName`, `figmaPageUrl`
- `designSystemName`, `designSystemLink`, `packLink`

## 4. Pictures of the final screens
If the project has a prototype, make sure the private preview is running (as in `/preview`, reusing one that's already running). Then, for each screen:

```
studio-capture <preview url>/<page> handover/screens/<n>.png
```

If it prints `unavailable`, or there's no prototype, continue without pictures and say so in one line.

## 5. Figma handover page (if wanted)
1. Load the `figma:figma-use` skill first, as the Figma tools require.
2. Use the project's Figma file. If Figma isn't connected, say so in one line, suggest signing in through `/mcp`, and continue with the developer handover only.
3. Confirm:
   - If the file already has a page called **Handover**: "Studio will update the **Handover** page in **<file name>**, replacing what's on that page. Nothing else in the file changes. OK?"
   - Otherwise: "Studio will add a page called **Handover** to **<file name>**. OK?"
4. After a yes:
   - Read `figma-page.js` in this skill's folder.
   - Replace `__DATA__` with the handover.json contents.
   - Run it with `use_figma` on that file. It returns `pageId` and `screenFrames` (each with `nodeId` and `file`).
5. Place the pictures (if there are any):
   - Call `upload_assets` with that file key, `count` = number of pictures, `nodeIds` = the frame ids in the same order, and `currentPageId` = `pageId`.
   - Then post each picture to its upload URL: `curl -s -X POST -F "file=@<file>" <url>`
6. Take one screenshot of the page to check it, and fix anything clipped.
7. Set `figmaPageUrl` in `handover/handover.json` to the file link plus `?node-id=<pageId with : changed to ->`.

## 6. Developer handover
Run `studio-pack handover/handover.json`.

This builds or updates:
- `index.html`, the review page, with the Figma file link at the top
- `CHANGELOG.md`, this handover first, then earlier ones
- `prototype/`, a clean copy of the prototype, when the project has one
- a `.gitignore` that keeps the handover out of save points

It also removes pictures of screens no longer in the design, and marks the handover so the next one starts from here. If they didn't want a developer handover, still run it: the folder stays on their computer and the marker is needed.

## 7. Reply
Keep it short. Say:
- what was made or updated, and where:
  - `handover/index.html`, and how to open it
  - a link to the Figma handover page
  - the project's Figma file link, which developers will see at the top
- the save points covered
- the placeholders still to fill:
  - Developer handover link: to be added, once the team decides where handovers are shared
  - Design system: only if none is connected, "not connected yet; `/setup` can connect one"
- that the next `/handover` will update this one

If it's their first handover, add a one-line note on the difference from `/handoff`: `/handoff` shares online for review, while `/handover` hands finished work to the team.
