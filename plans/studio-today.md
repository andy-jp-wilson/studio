# What Studio does today

## The core (agreed 20 October 2026, close; to refine)

> Studio lets a designer work with Claude in their Figma files: making and changing designs with their design system, checking them, and getting them ready for developers. It uses plain words, and nothing happens without your say-so. Code prototypes are an optional later step.

Why the rest felt off: most of Studio was built around files on the computer (save points, explorations, folders, previews), the way developers work, while a designer's work lives in Figma. Those file tools only matter later, for coded prototypes.

**Words:** designers already know **branches** from Figma, so Studio doesn't need "exploration" as a friendly word for them. (Part of reviewing the friendly words.)


A plain list of everything in Studio (version 0.2.28, 20 October 2026), for deciding what stays. Nothing new here.

**How to use it:** in the last column, write **keep**, **cut** or **not sure**. Add a note if something should stay but change.

**"Whose idea"** says where each thing came from: **brief** (your original kickoff brief), **you** (asked for along the way), or **Claude** (my suggestion, or something I added).

## 1. How Claude talks

| What it does | Where you see it | Whose idea | Your call |
|---|---|---|---|
| **The Studio voice.** Plain language; says what it'll do, does it step by step, shows what changed, says how to undo | Every reply | brief | |
| **Friendly words.** "Save point" for commit, "exploration" for branch, and so on | Every reply; `/glossary`; the panel's Glossary tab | brief | review the words |
| **Explaining technical words every time,** e.g. what "uploaded" means | Every reply | you | keep |
| **"I know this one" / "stop explaining words"** to switch explanations off | In the conversation | you | change: dismiss / don't show again, to hide for now or turn off |
| **A panel switch for word explanations** | Studio panel, bottom | Claude | replace with dismiss / don't show again |
| **No em dashes** | Everywhere | you | |
| **Calm error notes.** When something fails: what happened, that work is safe, what to do | When a step fails | brief | |

## 2. Keeping work safe

| What it does | Where you see it | Whose idea | Your call |
|---|---|---|---|
| **Automatic snapshots.** A hidden copy before Claude changes files | One line in Claude's reply | brief | |
| **"Go back."** Undo Claude's changes to files on your computer | Say "go back"; Menu | brief | keep, as undo |
| **Save points.** Named moments you can return to, offered only when there's something new | `/save`; the band's Save point button; Claude's last line | brief, changed by you | keep, needs tweaking |
| **Explorations.** Try an idea in a separate copy of the files | `/explore`; Menu | brief | not sure: unclear what it is |
| **Explorations put Figma work on its own page** | When exploring | Claude | not sure |
| **Local by default.** Nothing is uploaded unless you ask; uploads are checked and named; personal accounts flagged; a team list can block other places | When anything would be uploaded | you | |
| **Fewer permission questions.** Studio's own small helper programs don't ask for permission each time | Behind the scenes | Claude | |

## 3. Getting started

| What it does | Where you see it | Whose idea | Your call |
|---|---|---|---|
| **`/setup`, seven steps:** team settings, Figma connection, Figma account, project folder, design system, project's Figma file, summary | `/setup`; Menu | you | streamline; lean on Claude's chat to set up |
| **Team settings form:** load a team file (recommended) or type settings in; save a copy for the team | Studio panel, from `/setup` or `/team-settings` | you | streamline; lean on chat |
| **Folder and file pickers** in the form (the Mac's own windows) | Team settings form | you | goes with the form |
| **Project folder layout:** `prototype/` (with `assets/`), `handover/`, `README.md` | New projects | you | cut for now: no folder needed to work in Figma; later, for coded prototypes |
| **New Figma files** go in the team's project folder or your Drafts | `/setup`, step 6 | you | |
| **Team setup guide with checklists** | `plugin/team/studio-team-setup.md` | you | |
| **"Which Claude for what"** (chat, Claude Design, Claude Code), with Claude Code marked recommended | `/guide`; start of `/setup` | you | |
| **`/start`: where you left off** | `/start` | brief | doesn't make sense |
| **`/guide`: how Studio works** | `/guide`; Menu | brief | |
| **`/version`, the version number and "Update ready"** | `/version`; welcome; panel footer | you | |

## 4. The band (the strip above where you type)

| What it does | Whose idea | Your call |
|---|---|---|
| **Welcome** when a session opens: STUDIO lettering, tagline, where you left off, version | brief; summary and version from you | overhaul |
| **Journey stage: Explore, Refine, Build** (Studio guesses it; you can override it) | brief; you're unsure about it | doesn't make sense; rethink |
| **"Now":** what Claude is doing, in plain words | brief | overhaul |
| **Save status:** "✓ Saved 2m ago" or "Changes not saved yet" | you | overhaul |
| **Buttons:** Open in Figma or Preview, Save point (when needed), Stop (while Claude works), Menu | brief; Menu from Claude, agreed by you | overhaul: look, function and hierarchy |

## 5. The Studio panel (beside the conversation)

| What it does | Whose idea | Your call |
|---|---|---|
| **Journey tab:** your journey, what's happening now with a "Did you know?" note, everyday buttons, settings and version at the bottom | brief | overhaul |
| **Menu tab:** everything Studio does, grouped (Get ready, Work, Share, Help), with a line under each | you (a click-instead-of-commands menu); the separate tab is Claude's | overhaul |
| **Glossary tab** with search | brief | overhaul |
| **"Designs go to: Figma / Prototype" switch** | you (to be able to change it); placing it in the panel is Claude's | overhaul |
| **"Explain technical words: On / Off" switch** | Claude | replace with dismiss / don't show again |

## 6. Design work, Figma and prototypes

| What it does | Where you see it | Whose idea | Your call |
|---|---|---|---|
| **Figma by default:** asking Claude to design or build makes it in the project's Figma file, with the design system | Design requests | you | rethink (section 6) |
| **Code only for a prototype,** unless you switch the default | Design requests | you | rethink (section 6) |
| **A note to Claude before every reply** naming the project's Figma file and design system | Behind the scenes | Claude | rethink (section 6) |
| **`/preview`:** private preview of a prototype | `/preview`; band; Menu | brief | rethink (section 6) |
| **Send to Figma:** a picture of the prototype's screen into Figma | Panel, only with a prototype | brief | rethink (section 6) |
| **`/handover`:** one handover per project, with changelog, a Handover page in Figma and a developer handover (Figma link first) | `/handover`; Menu | you | rethink (section 6) |
| **`/handoff`:** share an exploration online for review | `/handoff`; Menu | brief | rethink (section 6) |

## 7. Other things in Studio

| What it does | Whose idea | Your call |
|---|---|---|
| **Studio colour themes** for the terminal (light and dark) | brief | |
| **The Studio designs in Figma** (pages 00 to 05), now out of date | brief | redo completely: requirements, journeys, wireframes, concepts, direction, visuals |
| **Plans and checklists** in the `plans` folder | Claude | |

## Not built yet (from the plan)

The design check in Figma, interaction notes, protecting design system files in Figma, Figma branches and templates, prototypes built from Figma frames, sharing Studio with other designers. These wait until we've agreed what Studio is.

**Your call (20 October):** review this too. The core of the project isn't quite there yet; get that right first, then the details.

## Notes

Anything else you'd like to say about how Studio feels or what it should be:

- **(20 October)** The whole plugin should be more UX and UI focused; right now it feels like a bit of extra text.

