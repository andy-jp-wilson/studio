---
name: setup
description: Get a designer ready to work with Studio, one step at a time. Checks the Figma connection, confirms the Figma account, creates or prepares the project folder, links the design system file and the target Figma file, and remembers the answers. Use when the designer types /setup, is starting a new project, or asks how to get set up or whether everything is connected.
allowed-tools:
  - mcp__plugin_figma_figma__whoami
  - mcp__plugin_figma_figma__get_metadata
  - mcp__plugin_figma_figma__get_libraries
  - mcp__plugin_figma_figma__get_screenshot
---

# /setup: getting ready

Walk the person through seven steps, **one at a time**, in the Studio voice. Before each step say in one line what it's for. After each step show a tick and move on. Never rush several questions into one message.

Use the helper `studio-project` (already allowed) for all reading and writing of setup notes and folders. It never moves, overwrites or deletes anything.

## 0. Where things stand

Run `studio-project status`. It prints JSON with `project` (this folder's answers and `done` steps), `computer` (what's been confirmed on this computer) and `missing` (layout folders not here yet).

Also run `studio-team show` for the team's settings (lines like `STUDIO_DESIGN_SYSTEMS=…`, or `none`). They're set in step 1; use them where the steps below say so. If there are none, carry on: Studio works without them.

- If everything is done, say so with a short tick list and ask whether they want to **recheck** (the team settings, Figma connection and account again) or **change** an answer. Don't redo steps unasked.
- If nothing is done yet on this computer (`computer` is empty), start with a short welcome, three lines at most: "Studio works inside Claude Code, the version of Claude that works with real files on your computer and connects to Figma and your design system. That's what lets it check your designs and hand them over to developers. For quick idea exploration, Claude Design is great too; `/guide which Claude` explains when to use which."
- Then say: "Setup has seven short steps. You're on step N." Skip steps already done in this project, but always do the Figma connection check (it's quick).

## 1. Team settings

Say: "First, your team's settings: your design systems, where projects go, and where work may be shared. All optional."

- **Already set** (`studio-team show` listed some): show them as a short list in plain words and ask "Keep these, or change them?" Keep: a tick, move on. Change: open the form, below.
- **Not set:** open the form.

**Opening the form:** run `studio-team form`. It opens the **Team settings** form in the Studio panel. Say: "I've opened the team settings form in the Studio panel. If someone on your team shared a team file, choose **Load a team file** (recommended); otherwise choose **Type them in**." Then wait. When a message says the settings were saved or kept, run `studio-team show`, show a tick, and move on.

**Without the panel** (for example in VS Code), or if they'd rather do it here:
- Ask whether they have a team file (recommended). If so, they drag it into the conversation; run `studio-team read <path>`, show what's in it in plain words, and ask before saving.
- Otherwise ask for each setting in turn, each optional: GitHub repository (or organisation) work may be uploaded to, with a one-line explanation of GitHub, projects folder on this computer, Figma team folder (destination), as a Figma link (recorded, not enforced yet), and each design system's name and Figma link.
- Save each with `studio-team set <KEY> "<value>"` (keys: `STUDIO_ALLOWED_ORGS`, `STUDIO_PROJECTS_FOLDER`, `STUDIO_FIGMA_WRITE_PLACES`, `STUDIO_DESIGN_SYSTEMS` as `Name | link` joined with `; `).

No team settings at all is fine: say Studio works without them, and move on. They're saved on this computer only; nothing is uploaded.

## 2. Figma connection

Say: "Next, checking that Studio can reach Figma."

Call the Figma `whoami` tool.
- It works: "✓ Figma is connected." Run `studio-project done connection`.
- It fails, or there's no Figma tool: "Figma isn't connected yet." Then:
  1. Type `/mcp`
  2. Choose **figma**, then **Authenticate**, and sign in in the browser
  3. Come back and say "done"
  Wait for them, then try again. If the Figma plugin isn't installed at all, say Studio needs the official Figma plugin and that you can install it if they'd like (ask first).

## 3. The right Figma account

Show who's signed in, from `whoami`: name, email and the plans (teams or organisations) they belong to, e.g.
"Signed in as **Sam Rivera** (sam@company.com), on **Acme** and **Personal**."

- If `computer.figmaAccount` already names this same account, say "✓ Same Figma account as before." and move on.
- Otherwise ask: "Is this the account you use for work?"
  - Yes: `studio-project set figmaAccount "<name> (<email>)"`, then `studio-project done account`.
  - No: explain how to switch (in `/mcp`, choose figma, **Clear authentication**, then authenticate again with the work account), wait, and check again.

The person confirms; Studio doesn't enforce a particular account.

## 4. Project folder

Ask: "Do you want to start a **new project**, or set up **this folder** (<folder name>)?" If the current folder is the home folder, Desktop, Downloads or Documents itself, recommend a new project.

**New project**
1. Ask for a short name, e.g. "onboarding". Use lowercase and hyphens; turn spaces into hyphens.
2. Suggest a home for it: `STUDIO_PROJECTS_FOLDER` if the team set one, otherwise `~/Studio projects/`, unless they say otherwise.
3. Explain the layout in one short list, and ask if they'd like it (they can say no and keep their own):
   - `prototype/`: the prototype's code, the screens you preview
   - `prototype/assets/`: images, icons and fonts
   - `handover/`: the project's handover for developers, made by `/handover`
   - `README.md`: what the project is, with links to its Figma file and design system
4. Run `studio-project new "<parent>" "<name>"`. `exists` means a folder with that name is already there: don't touch it; offer a different name or to set that folder up instead.
5. From now on, pass the new folder as the last argument to every `studio-project set` and `done` call.
6. `studio-project done folder <new folder>`.

**This folder**
- If `missing` is empty: "✓ This folder already has the Studio layout."
- Otherwise list what would be added (nothing is moved or replaced) and ask. If yes, run `studio-project layout`. If no, that's fine; carry on.
- `studio-project done folder`.

## 5. Design system file

Say: "Next, the design system your designs use."

If the team set `STUDIO_DESIGN_SYSTEMS` (entries `Name | link`, separated by `;`):
- One design system: "Your team uses **<name>**. Is that the one for this project?"
- More than one: "Which design system is this project using?" and list them by name (a team may have a newer one and an older one still in use). They can also say none, or paste a different link.

Otherwise ask: "Does this project use a design system or component library? If so, paste the Figma link to its library file." Don't name or suggest any particular design system. If they don't have one, that's fine: say Studio will work without one, mark the step done and move on.

Check it:
- It must be a `figma.com/design/...` or `figma.com/file/...` link. Take the file key from it.
- Call the Figma `get_metadata` tool with that file key (no node id) to read its pages. If it fails, explain plainly (the link may be wrong, or this account can't open it) and ask for another link.
- Show the file name (from the link, as readable words) and its pages, and ask: "Is **<file name>** the design system this project uses?"
- For one picked from the team's list, use the team's name for it and skip that question; still read its pages, so a broken link is caught.
- Yes: `studio-project set designSystemUrl "<link>"`, `studio-project set designSystemName "<name>"`, `studio-project done designSystem`.

## 6. Target Figma file

Say: "Last Figma step: the file where this project's designs live."

Ask: "Paste a link to the file, or shall I **create a new one**?"

**A link**: check it as in step 5. Show the file name and its pages. If the first page has something on it, also show a small picture of it (Figma `get_screenshot` on that page's id; skip quietly if it fails). Ask: "Is this the right file?"

**Create a new one**: load the `figma:figma-create-new-file` skill first and follow it. Name the file after the project (e.g. "Onboarding"). If the team set a Figma team folder (`STUDIO_FIGMA_WRITE_PLACES`, a link like `figma.com/files/…/project/<id>`), create it in that folder (its project id). Otherwise use `whoami`'s plans; if there's more than one, ask which team or organisation it belongs in. Creating a file is a change in Figma, so confirm before creating it. Then show the new file's link.

Then:
- `studio-project set targetFileUrl "<link>"`, `studio-project set targetFileName "<name>"`, `studio-project done targetFile`.
- If a design system was linked, call the Figma `get_libraries` tool on the target file. If the design system isn't among the libraries added to it, say so gently and explain how to turn it on in Figma: open the file, **Assets** panel, **Libraries** (the book icon), find the design system, **Add to file**. This is a tip, not a blocker.

## 7. Summary

Finish with a tick list, e.g.

✓ Team settings: Acme Design System, design work in acme/design-work
✓ Figma connected
✓ Account: Sam Rivera (sam@company.com)
✓ Project: onboarding, with the Studio layout
✓ Design system: Acme Design System
✓ Figma file: Onboarding

Studio remembers these in the project's `.studio` folder, and the README now links to both Figma files. Nothing was uploaded.

Then the next step:
- If a **new folder** was made: it needs to be opened before Studio can work in it. In the Claude app: start a **New** session and choose the folder. In the terminal: `cd` into it and start `claude`. Then `/start` sets up save points there.
- Otherwise suggest `/start` or `/preview`.

## Rules

- One step at a time; wait for answers.
- When saving a Figma link, keep it up to the file name and drop anything from `?` onwards.
- Friendly words; no em dashes; no raw helper output or tool errors.
- Ask before creating anything in Figma, and before installing anything.
- Never upload anything; setup stays on this computer (apart from a new Figma file, after a yes).
