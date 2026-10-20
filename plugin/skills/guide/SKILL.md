---
name: guide
description: Explain Studio in plain language: what it is, which Claude tool to use for what (Claude chat, Claude Design, Claude Code), what the band and panel show, each command, and the friendly words. Use when the designer types /guide, asks for help, asks what Studio is or how it works, or asks why they're using Claude Code or when to use Claude Design instead.
argument-hint: "[topic]"
---

# /guide: Studio, explained

If they named a topic ($ARGUMENTS), such as "save points", "panel", "/handover" or "which Claude", explain just that part in a few lines, then stop. For "which Claude" (or Claude Design, or why Claude Code), show the whole "Which Claude for what" section. Otherwise show the guide below, as written, and end with the closing line. Don't use em dashes.

## What Studio is

Studio makes Claude Code clearer and calmer for designers. You ask for changes in your own words, like "make the heading softer", and Claude says what it will do, does it one step at a time, shows what changed, and tells you how to go back.

## Which Claude for what

Claude comes in a few forms, and it's fair to wonder why a designer would use one built for code. Each is good at something different:

- **Claude (chat)**, for thinking it through: research, writing and checking copy, critique, summaries. It doesn't touch your files.
- **Claude Design**, for exploring ideas fast: wireframes, quick prototypes, decks and one-pagers, to try directions and get people aligned early. You'll find it in Claude itself.
- **Claude Code, where Studio lives** · *Recommended*. For real work: it works on the files on your computer, runs a private preview, and connects to Figma and your design system. That's what lets it check designs, write handovers developers can rely on, and turn a design into a working prototype.

| I want to… | Use |
|---|---|
| Think through a problem, write copy, summarise research | Claude (chat) |
| Try a few directions quickly, or show an early idea | Claude Design |
| Check a Figma flow against the design system, or hand it over to developers | Claude Code, with Studio · *Recommended* |
| Turn a design into a working prototype | Claude Code, with Studio · *Recommended* (you can start in Claude Design and bring it here) |

**Why Claude Code?** It sounds like a tool for developers, and it is one; that's the point. It works where developers work, so what you make arrives in a form they can use. Studio makes it clearer, calmer and safer: friendly words, a snapshot before every change, and nothing uploaded unless you ask.

**Working in Figma?** Claude Code connects to Figma directly, so it can read your designs and your design system and write handover pages into your file. Claude Design doesn't send work to Figma, so for a Figma-first team, Claude Code with Studio is the bridge.

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
| `/setup` | Get ready: check Figma, confirm your account, set up the project folder, and link your design system and Figma file |
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
