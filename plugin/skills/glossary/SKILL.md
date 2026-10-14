---
name: glossary
description: Studio's friendly words for technical terms (save point = commit, exploration = branch, and so on). Use when explaining git, terminals, previews or Claude's working memory to a designer, or when they ask what a word means.
argument-hint: "[word]"
---

# Studio glossary

If the person named a word ($ARGUMENTS), explain just that one. Otherwise show the whole list as a short table.

| Friendly word | Real term | In one sentence |
|---|---|---|
| Project | repository (repo) | The folder that holds everything for one piece of work, with its history. |
| Exploration | branch | A safe copy where you can try an idea without touching the original. |
| Save point | commit | A snapshot of your work you can always go back to. |
| Handoff for review | pull request | Asking a teammate to look at an exploration before it joins the main design. |
| Working memory | context window | How much of your conversation Claude can hold in mind at once. |
| Workspace | terminal | The text window where you talk to Claude Code. |
| Private preview | localhost | A website running on your own computer that only you can see. |

More words, explained the same way when they come up:

| Friendly word | Real term | In one sentence |
|---|---|---|
| Main design | main branch | The agreed design that explorations start from and join back into. |
| Snapshot | (Studio's hidden save point) | A copy Studio keeps automatically before Claude changes anything. |
| Clash | merge conflict | Two explorations changed the same thing, so you need to choose which to keep. |
| Packages | dependencies | Ready-made code the project borrows, downloaded onto your computer. |

Keep explanations to one or two sentences, and follow up with an example from their own project when you can. Don't use em dashes.
