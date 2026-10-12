---
name: save
description: Make a save point (a git commit) of all current work, with a plain-language note. Use when the designer says save, keep this, or checkpoint.
argument-hint: "[note]"
allowed-tools:
  - Bash(git rev-parse:*)
  - Bash(git status:*)
  - Bash(git add:*)
  - Bash(git commit:*)
  - Bash(git log:*)
  - Bash(git diff:*)
---

# /save: make a save point

1. If this folder doesn't keep save points yet (`git rev-parse --is-inside-work-tree` fails), say so in one sentence and offer `/start` to set it up. Stop.
2. Check `git status --short`. If nothing has changed since the last save point, say "Nothing new to save; your last save point already has everything." and stop.
3. Write the note:
   - Use $ARGUMENTS if they gave one.
   - Otherwise write a short note from the changes, in design words, e.g. "Calmer sign-up heading and more space above Continue".
   - Keep it under 60 characters, with no em dashes.
4. Save everything: `git add -A`, then `git commit -m "<note>"`.
5. Reply in one or two lines:

   ✓ Saved "Calmer sign-up heading"
   Includes: SignUpScreen.tsx, styles.css

   If this is their first save point, add a one-line "New word" note: developers call a save point a commit.
