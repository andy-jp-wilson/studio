---
name: handoff
description: Prepare a handoff for review (a pull request) with a plain-language summary of what changed in this exploration. Always confirms before sharing anything online.
disable-model-invocation: true
allowed-tools:
  - Bash(git rev-parse:*)
  - Bash(git status:*)
  - Bash(git branch:*)
  - Bash(git log:*)
  - Bash(git diff:*)
  - Bash(git remote:*)
  - Bash(gh auth status)
---

# /handoff: share for review

A handoff shares work outside this computer, so **never push or open anything without a clear yes**.

1. **Check.**
   - Current exploration: `git branch --show-current`. If it's the main version (`main` or `master`), explain that handoffs are made from an exploration, and offer `/explore` first. Stop.
   - Unsaved changes: offer `/save` first.
   - Where it would go: `git remote -v`, and whether GitHub is connected (`gh auth status`).
2. **Write the summary** of what changed since the main version (`git log main..HEAD`, `git diff --stat main...HEAD`). Use design words:
   - **What changed**: 2 to 4 bullets, e.g. "Sign-up heading is softer and lighter".
   - **Why**: one sentence.
   - **How to see it**: how a reviewer can preview it.
3. **Show the summary and ask:** "Shall I share this exploration as a handoff for review? This uploads it to <remote name> so your team can see it."
4. **Only after a yes:** `git push -u origin <exploration>`, then `gh pr create --title "<short title>" --body "<summary>"`. Reply with the link.
5. **If there's nowhere to share to** (no remote, or GitHub isn't connected): say so plainly, keep the summary so they can paste it anywhere, and explain the one step that would make sharing possible. Don't attempt to set up accounts yourself.

The first time, add a "New word" note: developers call a handoff for review a pull request. Don't use em dashes.
