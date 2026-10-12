---
name: start
description: Open the current project and summarise where the designer left off (exploration, recent save points, unsaved changes, next step). Use at the start of a session or when they ask "where was I?".
allowed-tools:
  - Bash(git rev-parse:*)
  - Bash(git status:*)
  - Bash(git log:*)
  - Bash(git branch:*)
  - Bash(git for-each-ref:*)
  - Bash(git config --get:*)
---

# /start: where you left off

1. Check whether this folder keeps save points: `git rev-parse --is-inside-work-tree`.
   - **If not**, explain in one sentence that save points aren't set up here yet, and what that would give them (undo for every step). Ask before setting up. If they agree:
     - `git init -b main`
     - if `git config --get user.name` is empty, ask for the name to put on save points and set it for this project only with `git config user.name` / `git config user.email`
     - add a `.gitignore` with `.DS_Store` and `node_modules/`
     - make the first save point, "Starting point"

     Then continue below.
2. Gather, quietly:
   - the project name (the folder name)
   - the current exploration: `git branch --show-current`
   - the last 5 save points: `git log -5 --format='%s|%cr'`
   - unsaved changes: `git status --short`
   - the number of Studio snapshots: `git for-each-ref refs/studio/snapshots --count=100 --format=x`
3. Reply in the Studio voice. Keep it short:

   **Project onboarding** · exploring **fewer-steps**
   - Last save point: "Calmer sign-up" (2 hours ago)
   - Unsaved changes: 2 files (SignUpScreen.tsx, styles.css)
   - 3 snapshots you can go back to

   Then suggest one or two next steps. For example, `/save` if there are unsaved changes, `/preview` to see the preview, or `/explore` to try something new.

If the current exploration is `main` or `master`, write "on the **main version**" instead of "exploring main".

Use friendly words; turn branch names and file names into readable text where it helps. Don't use em dashes.
