---
name: handover
description: Hand finished design work to the team. Makes a changelog of every save point since the last handover, then a Figma handover page and/or a developer pack (review page, screen pictures, prototype HTML and CSS). Uploads nothing. Different from /handoff, which shares online for review.
argument-hint: "[title]"
disable-model-invocation: true
allowed-tools:
  - Bash(studio-changelog)
  - Bash(studio-capture:*)
  - Bash(studio-pack:*)
  - Bash(mkdir -p handover/:*)
  - Bash(git status:*)
  - Bash(git rev-parse:*)
  - Bash(lsof -i:*)
  - Bash(curl -s:*)
  - Write(handover/**)
---

# /handover: hand finished work to your team

`/handover` stays on this computer, apart from the Figma page, which is only written after the person says yes. It never pushes, uploads or shares anything else. Use friendly words, and don't use em dashes.

## 1. Check
- **Save points.** If this folder doesn't keep save points, offer `/start` and stop.
- **Unsaved changes** (`git status --short`). A handover covers save points only, so offer `/save` first.
- **What's new.** Run `studio-changelog`. If it reports `save-points: 0`, say there's nothing new since the last handover and stop.

## 2. Ask once
Suggest a title from the changes, or use $ARGUMENTS. Ask in one message:
- "Title: **Calmer sign-up**. Change it?"
- "Make: **both** a Figma handover page and a developer pack, or just one?"

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
- **components**: the Acme Design System components the screens use (e.g. "Text field", "Button / Primary"). The person can correct these.
- **packLink** and **acmeLink**: leave both empty. They show as "to be added" placeholders.

Make the folder `handover/<YYYY-MM-DD>-<slug>/` and write `handover.json` into it. It contains:
- `title`, `slug`, `date`, `summary`
- `project`, `exploration`, `designer`, `savePoints` (all from `studio-changelog`)
- `points`, `screens`, `changes`, `components`
- `packLink`, `acmeLink`

## 4. Pictures of the final screens
Make sure the private preview is running (as in `/preview`, reusing one that's already running). Then, for each screen:

```
studio-capture <preview url>/<page> handover/<folder>/screens/<n>.png
```

If it prints `unavailable`, continue without pictures and say so in one line. The review page then shows the live prototype instead.

## 5. Developer pack
Run `studio-pack handover/<folder>/handover.json`.

This builds the pack:
- `index.html`, the review page
- `CHANGELOG.md`
- `prototype/`, a clean copy of the prototype
- a `.gitignore` that keeps the pack out of save points

It also marks the handover, so the next one starts from here. If they didn't want a developer pack, still run it: the folder stays on their computer and the marker is needed.

## 6. Figma handover page (if wanted)
1. Load the `figma:figma-use` skill first, as the Figma tools require.
2. Ask which Figma file to add it to (a link). If Figma isn't connected, say so in one line, suggest signing in through `/mcp`, and finish with the developer pack only.
3. Confirm: "Studio will add a new page called **Handover · <date> · <title>** to that file. OK?"
4. After a yes:
   - Read `figma-page.js` in this skill's folder.
   - Replace `__DATA__` with the handover.json contents.
   - Run it with `use_figma` on that file. It returns `pageId` and `screenFrames` (each with `nodeId` and `file`).
5. Place the pictures:
   - Call `upload_assets` with that file key, `count` = number of pictures, `nodeIds` = the frame ids in the same order, and `currentPageId` = `pageId`.
   - Then post each picture to its upload URL: `curl -s -X POST -F "file=@<file>" <url>`
6. Take one screenshot of the page to check it, and fix anything clipped.

## 7. Reply
Keep it short. Say:
- what was made, and where:
  - the folder path, and how to open `index.html`
  - a link to the Figma page
- the save points covered
- the two placeholders still to fill:
  - Developer pack link: to be added, once the team decides where packs are uploaded
  - Acme Design System link: to be added
- that the next `/handover` will start from here

If it's their first handover, add a one-line note on the difference from `/handoff`: `/handoff` shares online for review, while `/handover` hands finished work to the team.
