---
name: setup
description: Get a designer ready to work with Studio in a short chat. Checks Figma is connected and it's the right account, then asks which design system and which Figma file the project uses, and remembers the answers. Use when the designer types /setup, is starting a new project, or asks how to get set up or whether everything is connected.
allowed-tools:
  - mcp__plugin_figma_figma__whoami
  - mcp__plugin_figma_figma__get_metadata
  - mcp__plugin_figma_figma__get_libraries
  - mcp__plugin_figma_figma__get_screenshot
---

# /setup: getting ready

A short chat, not a form: four questions, **one at a time**, in the Studio voice. Before each, say in one line what it's for; after each, show a tick and move on. Use Claude Code's question buttons where there are a few clear choices.

**Figma tools.** Figma may be connected through the Figma plugin or through Claude's own Figma connector; use whichever has the tools (`whoami`, `get_metadata`, `get_libraries`, `get_screenshot`, `create_new_file`). If the Figma plugin's tools are the ones connected and it offers `create_session`, call it with the file key before that file's other tools, as its instructions say.

Use the helper `studio-project` (already allowed) to read and remember answers. It keeps them in `.studio/project.json` (a hidden folder where Studio keeps its notes about this project) in the folder Claude Code is open in, and never moves, overwrites or deletes anything. No folder layout is needed: the work lives in Figma.

## Where things stand

Run `studio-project status` and `studio-team show` (the team's settings as KEY=value lines, or `none`: `STUDIO_DESIGN_SYSTEMS=Name | link; …`, `STUDIO_TEAM_LOGO=<Figma link>`, `STUDIO_CANVAS_COLOR=#RRGGBB`).

- If everything is done, show a short tick list and ask whether they want to **recheck** Figma or **change** an answer. Don't redo steps unasked.
- If nothing is done on this computer yet (`computer` is empty), start with a short welcome, three lines at most: "Studio works inside Claude Code, the version of Claude that connects to Figma and your design system. That's what lets it build your designs in Figma from a user story, check them and get them ready for developers. For quick idea exploration, Claude Design is great too; `/guide which Claude` explains when to use which."
- Then say: "Four quick questions." Skip any already answered for this project, but always check Figma is connected (it's quick).

## 1. Is Figma connected?

Call the Figma `whoami` tool.
- It works: "✓ Figma is connected." Run `studio-project done connection`.
- It fails, or there's no Figma tool: "Figma isn't connected yet." Then:
  1. Type `/mcp`
  2. Choose **figma**, then **Authenticate**, and sign in in the browser
  3. Come back and say "done"
  Wait, then try again. If the Figma plugin isn't installed at all, say Studio needs the official Figma plugin and offer to install it (ask first).

## 2. Is it the right account?

Show who's signed in, from `whoami`: name, email and the teams or organisations they belong to, e.g. "Signed in as **Sam Rivera** (sam@company.com), on **Acme** and **Personal**."

- If `computer.figmaAccount` already names this account: "✓ Same Figma account as before."
- Otherwise ask: "Is this the account you use for work?"
  - Yes: `studio-project set figmaAccount "<name> (<email>)"`, then `studio-project done account`.
  - No: explain how to switch (in `/mcp`, choose figma, **Clear authentication**, then authenticate again with the work account), wait, and check again.

## 3. Which design system?

If the team has a design systems list:
- One: "Your team uses **<name>**. Is that the one for this project?"
- Several: "Which design system is this project using?" with each by name as a choice (a team may have a newer one and an older one still in use). They can also say none, or paste a different link.

If there's no list, ask whether someone on the team shared a **team file** (a small file ending in `.studio-team.json`); that's the recommended way. If they drag one in, run `studio-team read <path>`. It prints one line per setting in the file. Show what's in it in plain words (the design systems by name, "your team's logo for project covers", "page canvas colour #F5F5F5") and ask once before saving them for every project on this computer, then run `studio-team set <KEY> "<value>"` for each line (Claude Code asks them to allow it). Otherwise ask: "Does this project use a design system or component library? If so, paste the Figma link to its library file." Don't name or suggest any particular one. No design system is fine: say Studio works without one, and move on.

Check the link: it must be a `figma.com/design/…` or `figma.com/file/…` link. Call `get_metadata` with its file key (no node id) to read its pages; if that fails, explain plainly (the link may be wrong, or this account can't open it) and ask for another. Show the file name and pages and ask "Is **<name>** the design system this project uses?" (skip that question for one picked from the team's list, but still read it, so a broken link is caught).

Then `studio-project set designSystemUrl "<link>"`, `studio-project set designSystemName "<name>"`, `studio-project done designSystem`. Studio will never change this file.

### Team extras (once per computer)

Only if neither the team file nor `studio-team show` has them, and only after the design system. Say it's for every project on this computer, and optional:

- **Team logo:** "Does your team have a logo for project covers? Studio puts it on a dark strip at the top of each project's cover, and never recolours it. Paste the Figma link to the logo component (right-click it in Figma, **Copy link to selection**), or skip." Check it with `get_metadata` (its file key and node id); if it isn't a component, say so and ask again. Then `studio-team set STUDIO_TEAM_LOGO "<link>"`, keeping its `node-id`.
- **Page canvas colour:** "Studio sets every page's canvas (the background behind the frames) to **#F5F5F5**. Keep that, or use another colour?" Use question buttons. Only for another colour, `studio-team set STUDIO_CANVAS_COLOR "#RRGGBB"`.

If they skip, move on; nothing else depends on it. Offer to save a team file afterwards if they're the first on their team (`studio-team export`).

## 4. Which Figma file?

Say: "Last one: the Figma file where this project's designs live. It's normally one file with several pages."

Offer:
- **A file that already exists:** paste its link. Check it as in step 3, and if its first page has something on it, show a small picture (`get_screenshot` on that page; skip quietly if it fails). Ask "Is this the right file?"
- **A new file in your Drafts:** load the `figma:figma-create-new-file` skill first and follow it; name it after the project (e.g. "Onboarding"). Their choice is their yes. It can be moved into a team project in Figma later.

Then `studio-project set targetFileUrl "<link>"`, `studio-project set targetFileName "<name>"`, `studio-project done targetFile`.

If a design system was chosen, call `get_libraries` on the file. If the design system isn't added to it, say so gently and explain how to turn it on in Figma: open the file, **Assets** panel, **Libraries** (the book icon), find the design system, **Add to file**. A tip, not a blocker.

## Done

Finish with a tick list, e.g.

✓ Figma connected
✓ Account: Sam Rivera (sam@company.com)
✓ Design system: Acme Design System
✓ Figma file: Onboarding

Studio remembers these on this computer; nothing was uploaded (sent anywhere online), apart from the new Figma file if one was made.

Then the next step: "Paste a user story whenever you're ready, and I'll play the brief back. Adding its Confluence technical design is optional, but encouraged."

## Rules

- One question at a time; wait for answers.
- When saving a Figma link, keep it up to the file name and drop anything from `?` onwards, except the team logo's link, which keeps its `node-id`.
- Plain words; no em dashes; no raw helper output or tool errors.
- Ask before creating anything in Figma, and before installing anything.
- Never upload anything, and never change the design system file.
