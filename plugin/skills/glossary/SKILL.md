---
name: glossary
description: Plain explanations of the words that come up when working with Studio and Claude Code (Figma branch, design system, coded prototype, upload, working memory and so on). Use when explaining a technical word to a designer, or when they ask what a word means.
argument-hint: "[word]"
---

# Studio glossary

If the person named a word ($ARGUMENTS), explain just that one. Otherwise show the whole list as a short table.

| Word | In one sentence |
|---|---|
| User story | The piece of work, written in Jira: what a user wants, why, and how we'll know it's done (the acceptance criteria). Studio reads it and never changes it. |
| Technical design | The Confluence page developers write about how the story will be built. Optional, but it helps Claude check the design. Read only. |
| Path | One way a user can go through the story, like "email already used, then sign in". |
| Stage | Where the work is: the brief, concepting, visual design or review. |
| Project status | Where the whole project stands: not started, in progress, feedback or ready for dev. Only you set it. |
| Needs you | Claude is waiting for your answer or your yes. Shown in ochre, separate from the status. |
| Project template | Five pages Studio can add to a project's Figma file, so every project looks the same: Cover, User story, Concept, Final design and Designer notes. Optional. |
| Designer notes | A page in the project's Figma file saying where it stands: stage, status, decisions, open questions, what's next. Claude updates it only when you say yes. |
| Pick up | Carrying on someone else's project: say "pick up SIGN-142" and Claude reads their Designer notes (without changing anything) and plays back where it's at. |
| Design system | Your team's shared components, styles and variables in Figma. Claude builds only with these, and never changes them. |
| Figma branch | A copy of a Figma file where work happens without touching the main file, until you merge it. Claude can't make one, so you make it and paste its link. |
| Annotation | A note in Figma beside a design, explaining how something behaves. |
| State page | A Figma page showing each state of a screen or component, like empty, error and loading. |
| Coded prototype | The design built in HTML and CSS (the languages web pages are made of), so it can be clicked and tried. Optional, after Figma. |
| Upload | Sending work to GitHub or another website, so it leaves this computer (developers say "push"). Studio only does it when you ask. |
| Snapshot | A hidden copy Studio keeps automatically before Claude changes files on this computer, so you can say "go back". |
| Working memory | How much of your conversation Claude can hold in mind at once (developers say "context window"). |
| Workspace | The text window where you talk to Claude Code (developers say "terminal"). |

Keep explanations to one or two sentences, and follow up with an example from their own story when you can. Don't use em dashes.
