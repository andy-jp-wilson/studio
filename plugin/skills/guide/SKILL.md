---
name: guide
description: Explain Studio in plain language: what it is, what the band and panel show, each command, and the friendly words. Use when the designer types /guide, asks for help, or asks what Studio is or how it works.
argument-hint: "[topic]"
---

# /guide: Studio, explained

If they named a topic ($ARGUMENTS), such as "save points", "panel" or "/handover", explain just that part in a few lines, then stop. Otherwise show the guide below, as written, and end with the closing line. Don't use em dashes.

## What Studio is

Studio makes Claude Code calmer for designers. You ask for changes in your own words, like "make the heading softer", and Claude says what it will do, does it one step at a time, shows what changed, and tells you how to go back.

## Your work is always safe

- **Snapshots, automatic.** Before Claude changes any file, Studio quietly keeps a copy. Say "go back" any time to return to before a change.
- **Save points, when you choose.** A save point is a moment you name and keep, like "Bolder Continue button". When there's something new worth keeping, the band shows **Changes not saved yet** and a **Save point** button, and Claude offers to save. Otherwise it shows when you last saved.

## The band above where you type

- **Your journey:** Explore (trying ideas), Refine (polishing one), Build (handed over to the team).
- **Now:** what Claude is doing, in plain words.
- **Buttons:** 1 Preview, 2 Save point (only when needed), 3 Stop (while Claude works). Click, or type the number alone in an empty prompt.

## The Studio panel

Beside the conversation in Desktop, or at the side of a wide terminal (type `/panel` to open it). It shows your journey, what's happening now with a "Did you know?" note, Preview, Save point and Send to Figma buttons, and a Glossary tab.

## Commands

| Command | What it does |
|---|---|
| `/start` | Where you left off, and what to do next |
| `/preview` | Open your private preview, the design running on your computer |
| `/save` | Make a save point now |
| `/explore` | Try an idea safely in a new exploration |
| `/handover` | Hand finished work to your team: changelog, Figma page, developer pack |
| `/handoff` | Share an exploration online for review |
| `/glossary` | The friendly words and what they mean |
| `/panel` | Open the Studio panel |
| `/version` | Which Studio you have, and update it if there's a newer one |
| `/guide` | This guide |

## Where your work lives

Your work stays on this computer. Save points are kept here too; nothing is uploaded unless you ask. When you do (for example with `/handoff`), Studio checks where it's going first, names it, and tells you if it's a personal GitHub account. If your team has listed its GitHub, Studio only uploads there.

## Friendly words

Studio uses friendly words for technical ones: a **save point** is a commit, an **exploration** is a branch, your **private preview** is localhost. `/glossary` has them all.

---

Closing line: "You never need a command; just ask me in your own words. Try `/guide save points` to learn about one part."
