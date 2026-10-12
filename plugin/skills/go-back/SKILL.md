---
name: go-back
description: Restore the designer's files to a Studio snapshot or save point, i.e. undo Claude's recent changes. Use when they say undo, go back, revert, or "put it back how it was".
allowed-tools:
  - Bash(git rev-parse:*)
  - Bash(git status:*)
  - Bash(git log:*)
  - Bash(git for-each-ref:*)
  - Bash(git diff:*)
  - Bash(git restore:*)
  - Bash(studio-snapshot:*)
---

# Go back to before a change

Studio keeps hidden snapshots under `refs/studio/snapshots/`, one before each request in which Claude changed files. Visible save points are ordinary commits.

1. **List the recent places they could go back to**, newest first, and pick the most likely one:
   - snapshots: `git for-each-ref refs/studio/snapshots --sort=-creatordate --count=5 --format='%(refname)|%(creatordate:relative)|%(contents:subject)'`
   - save points: `git log -5 --format='%h|%cr|%s'`

   If it's obvious (they said "undo that"), use the newest snapshot. Otherwise show 2 or 3 options in plain words, e.g. "Before 'make the sign-up screen calmer' (5 minutes ago)".
2. **Show what would change back**: `git diff --stat <target>`, described in plain words.
3. **Ask to confirm.** Say that Studio will snapshot the current state first, so going back can itself be undone.
4. **After a yes:**
   - snapshot the current state: `studio-snapshot "Before going back"`
   - restore the files: `git restore --source=<target> --worktree --staged -- .`
   - mention any files Claude created after the snapshot. Ask before removing those.
5. **Reply:** "✓ Back to how it was before '…'. If you change your mind, say 'go back' again to return."

Never use `git reset --hard`, and never delete snapshots or save points.
