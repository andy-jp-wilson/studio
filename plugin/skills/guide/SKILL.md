---
name: guide
description: Explain Studio in plain language: what it is, the four stages from a user story to handover and the project status, what the band and panel show, how Studio keeps work safe, which Claude tool to use for what (Claude chat, Claude Design, Claude Code), and the commands. Use when the designer types /guide, asks for help, asks what Studio is or how it works, or asks why they're using Claude Code or when to use Claude Design instead.
argument-hint: "[topic]"
---

# /guide: Studio, explained

If they named a topic ($ARGUMENTS), such as "the stages", "status", "panel", "branches" or "which Claude", explain just that part in a few lines, then stop. For "which Claude" (or Claude Design, or why Claude Code), show the whole "Which Claude for what" section. Otherwise show the guide below, as written, and end with the closing line. Don't use em dashes.

## What Studio is

Studio makes Claude an extension of you. Paste a user story, and Claude builds the design in Figma, from wireframes and concepts to full visuals, using only your design system. It follows the story's requirements (and its Confluence technical design, if you add it), covers every path the story describes, keeps every screen consistent, and makes the interactions clear, so what developers build matches the design. You decide; Claude proposes and does the work.

## The stages

Work moves through four stages, like a designer's own workflow:

1. **The brief:** paste the user story (its Confluence technical design is optional, but encouraged). Claude plays it back: the requirements, the paths, and questions for anything unclear. It never fills a gap itself. Then you choose where in Figma, whether to use a Figma branch (you make it and paste its link; Claude can't make one), and whether to start with concepting or go straight to visual design.
2. **Concepting:** wireframes and concepts in Figma, to explore directions.
3. **Visual design:** full visuals with your design system's components, styles and variables. If something's missing from it, Claude stops and asks. Each change you ask for is made once and carried across every screen it affects.
4. **Review:** checked against the story and the design system, with notes in Figma where something doesn't match; interactions made clear (annotations, state pages, or a coded prototype if you ask); and the handover checklist.

In concepting and visual design, Claude always says what it will make first and waits for your yes. No story? Just describe what you'd like, and Claude starts at the stage that fits. You can skip a stage or go back; just say so.

## Project status

The **status** is for the whole project, and only you set it:

- **Not started**, **In progress**, **Feedback** (shared with stakeholders or the team, waiting for their feedback), **Ready for dev** (review done, handover checklist ticked).
- Change it from the dropdown in the panel, or just say it ("mark it as out for feedback"). When it's a natural moment, Studio asks you with one click, for example "Mark SIGN-142 as Ready for dev?". Claude never changes it on its own.
- **Needs you** is separate: when Claude is waiting for your answer or your yes, it says so in ochre.

## The band and the panel

- **The band** (above where you type) shows the Studio logo before any work, then the stage and status, for example "Visual design · In progress". The dot's colour is the status: grey not started, coral in progress, dusk blue feedback, sage ready for dev. Four segments show the stages. Anything waiting for you is added in ochre. **Stop** appears while Claude is working, and the hint under where you type says what to do next.
- **The Studio panel** (beside the conversation; `/panel` opens it) starts with a welcome, then follows the story: the title, the status dropdown, the stages, and cards for what matters now, with what needs you first, outlined in ochre. You can answer Claude's questions there, open the Figma page, and tick off the handover checklist.

## Your work is safe

- **Design system files are never changed.** Studio refuses any change to them, even if asked.
- **Nothing changes in Figma without your say-so.** Before Claude's first change to a Figma file in a conversation, Studio asks you in plain words ("Work in … in Figma?").
- **Jira and Confluence are read only.** Claude never changes anything there.
- **Undo:** in Figma, use its undo or version history. For files on this computer, say "go back".
- **Nothing is uploaded** (sent to GitHub or anywhere online) unless you ask, and Studio checks where it's going first.

## Which Claude for what

Claude comes in a few forms, and it's fair to wonder why a designer would use one built for code. Each is good at something different:

- **Claude (chat)**, for thinking it through: research, writing and checking copy, critique, summaries. It doesn't touch your files.
- **Claude Design**, for exploring ideas fast: wireframes, quick prototypes, decks and one-pagers, to try directions and get people aligned early. You'll find it in Claude itself.
- **Claude Code, where Studio lives** · *Recommended*. For real work: it connects to Figma and your design system, so it can build and check designs in your Figma files and get them ready for developers, and turn a design into a coded prototype.

| I want to… | Use |
|---|---|
| Think through a problem, write copy, summarise research | Claude (chat) |
| Try a few directions quickly, or show an early idea | Claude Design |
| Design a user story in Figma with the design system, check it, and get it ready for developers | Claude Code, with Studio · *Recommended* |
| Turn a design into a coded prototype | Claude Code, with Studio · *Recommended* |

**Why Claude Code?** It sounds like a tool for developers, and it is one; that's the point. It works where developers work, so what you make arrives in a form they can use. Studio makes it clearer, calmer and safer.

**Working in Figma?** Claude Code connects to Figma directly, so it can read your design system and build in your files. Claude Design doesn't send work to Figma, so for a Figma-first team, Claude Code with Studio is the bridge.

## Commands

You never need one; just ask in your own words. These are there if you like them:

| Command | What it does |
|---|---|
| `/setup` | A short chat: is Figma connected, is it the right account, which design system, which Figma file |
| `/panel` | Open the Studio panel |
| `/glossary` | What words mean |
| `/version` | Which Studio you have, and update it if there's a newer one |
| `/guide` | This guide |

## Setting Studio up for a team

A team shares a few settings: the list of design systems, and optionally the team logo for project covers and the page canvas colour (#F5F5F5 unless the team picks another). The first person adds them during `/setup`, and can save a small team file to share (`studio-team export` puts it on the Desktop). Everyone else drags that file in during `/setup`. It stays on each computer; nothing is uploaded. `team/studio-team-setup.md` in Studio's folder explains it, with a checklist.

---

Closing line: "Paste a user story whenever you're ready. Try `/guide the stages` to learn about one part."
