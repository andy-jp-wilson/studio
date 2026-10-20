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

Walk the person through six steps, **one at a time**, in the Studio voice. Before each step say in one line what it's for. After each step show a tick and move on. Never rush several questions into one message.

Use the helper `studio-project` (already allowed) for all reading and writing of setup notes and folders. It never moves, overwrites or deletes anything.

## 0. Where things stand

Run `studio-project status`. It prints JSON with `project` (this folder's answers and `done` steps), `computer` (what's been confirmed on this computer) and `missing` (layout folders not here yet).

- If everything is done, say so with a short tick list and ask whether they want to **recheck** (run steps 1 and 2 again) or **change** an answer. Don't redo steps unasked.
- Otherwise say: "Setup has six short steps. You're on step N." Skip steps already done in this project, but always do step 1 (it's quick).

## 1. Figma connection

Say: "First, checking that Studio can reach Figma."

Call the Figma `whoami` tool.
- It works: "✓ Figma is connected." Run `studio-project done connection`.
- It fails, or there's no Figma tool: "Figma isn't connected yet." Then:
  1. Type `/mcp`
  2. Choose **figma**, then **Authenticate**, and sign in in the browser
  3. Come back and say "done"
  Wait for them, then try again. If the Figma plugin isn't installed at all, say Studio needs the official Figma plugin and that you can install it if they'd like (ask first).

## 2. The right Figma account

Show who's signed in, from `whoami`: name, email and the plans (teams or organisations) they belong to, e.g.
"Signed in as **Sam Rivera** (sam@company.com), on **Acme** and **Personal**."

- If `computer.figmaAccount` already names this same account, say "✓ Same Figma account as before." and move on.
- Otherwise ask: "Is this the account you use for work?"
  - Yes: `studio-project set figmaAccount "<name> (<email>)"`, then `studio-project done account`.
  - No: explain how to switch (in `/mcp`, choose figma, **Clear authentication**, then authenticate again with the work account), wait, and check again.

The person confirms; Studio doesn't enforce a particular account.

## 3. Project folder

Ask: "Do you want to start a **new project**, or set up **this folder** (<folder name>)?" If the current folder is the home folder, Desktop, Downloads or Documents itself, recommend a new project.

**New project**
1. Ask for a short name, e.g. "onboarding". Use lowercase and hyphens; turn spaces into hyphens.
2. Suggest a home for it: `~/Studio projects/` unless they say otherwise.
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

## 4. Design system file

Say: "Next, the design system your designs use."

If the `STUDIO_DESIGN_SYSTEM_URL` setting is present (`printenv STUDIO_DESIGN_SYSTEM_URL`), offer it: "Your team uses <name from link>. Use that?" Otherwise ask: "Does this project use a design system or component library? If so, paste the Figma link to its library file." Don't name or suggest any particular design system. If they don't have one, that's fine: say Studio will work without one, mark the step done and move on.

Check it:
- It must be a `figma.com/design/...` or `figma.com/file/...` link. Take the file key from it.
- Call the Figma `get_metadata` tool with that file key (no node id) to read its pages. If it fails, explain plainly (the link may be wrong, or this account can't open it) and ask for another link.
- Show the file name (from the link, as readable words) and its pages, and ask: "Is **<file name>** the design system this project uses?"
- Yes: `studio-project set designSystemUrl "<link>"`, `studio-project set designSystemName "<name>"`, `studio-project done designSystem`.

## 5. Target Figma file

Say: "Last Figma step: the file where this project's designs live."

Ask: "Paste a link to the file, or shall I **create a new one**?"

**A link**: check it as in step 4. Show the file name and its pages. If the first page has something on it, also show a small picture of it (Figma `get_screenshot` on that page's id; skip quietly if it fails). Ask: "Is this the right file?"

**Create a new one**: load the `figma:figma-create-new-file` skill first and follow it. Name the file after the project (e.g. "Onboarding"). Use `whoami`'s plans; if there's more than one, ask which team or organisation it belongs in. Creating a file is a change in Figma, so confirm before creating it. Then show the new file's link.

Then:
- `studio-project set targetFileUrl "<link>"`, `studio-project set targetFileName "<name>"`, `studio-project done targetFile`.
- If a design system was linked, call the Figma `get_libraries` tool on the target file. If the design system isn't among the libraries added to it, say so gently and explain how to turn it on in Figma: open the file, **Assets** panel, **Libraries** (the book icon), find the design system, **Add to file**. This is a tip, not a blocker.

## 6. Summary

Finish with a tick list, e.g.

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
