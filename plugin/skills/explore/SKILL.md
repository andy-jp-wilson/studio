---
name: explore
description: Start a new exploration (a git branch) to try an idea safely, or list and switch between explorations. Design work for the idea goes where the person's "Designs go to" setting says (Figma by default, on its own page). Use when the designer wants to try something, compare ideas or go back to another idea.
argument-hint: "[name of idea]"
allowed-tools:
  - Bash(git rev-parse:*)
  - Bash(git status:*)
  - Bash(git branch:*)
  - Bash(git log:*)
  - Bash(git switch:*)
---

# /explore: try an idea safely

First, if this folder doesn't keep save points yet, offer `/start` to set it up and stop.

Call `main` or `master` the **main design**, not an exploration.

## With a name ($ARGUMENTS)

1. Turn the name into a short, lowercase, hyphenated exploration name, e.g. "bolder button" becomes `bolder-button`.
2. If there are unsaved changes (`git status --short`), ask whether to save them first, in the current exploration, before branching off. If yes, follow the `/save` steps.
3. Create it and switch to it: `git switch -c <name>`.
4. Reply: "You're now on a new exploration called **bolder-button**. Your earlier work is safe on **<previous>**." The first time, add a "New word" note: developers call an exploration a branch.
5. **If the idea is something to design or build** (e.g. "create a test screen", "try a bolder button"), carry on with it, following Studio's project note on where designs go:
   - **Figma (the default):** make it in the project's Figma file, on a new page named after the exploration (e.g. "Exploration · bolder-button"), so the main design isn't touched. As with any first change to the Figma file in a conversation, say what you'll make and where, and wait for a yes. Don't create HTML or CSS files.
   - **Prototype (if the person made prototypes their default):** build it in `prototype/` on this exploration.
   - **No Figma file linked:** offer `/setup` to link one, or ask whether they'd like a prototype instead.

An exploration keeps files on this computer separate; work in Figma lives on its own page, so it's separate there too.

## Without a name

1. List the explorations with their last save point:

   `git branch --sort=-committerdate --format='%(refname:short)|%(committerdate:relative)|%(contents:subject)'`

2. Show them as a short list, marking the current one, e.g. "● fewer-steps · saved 2h ago · Calmer sign-up".
3. Ask which one to switch to, or offer to start a new one.
4. Before switching, if there are unsaved changes, ask whether to save them first. Then `git switch <name>`.

Never delete an exploration unless they explicitly ask, and confirm first. Don't use em dashes.
