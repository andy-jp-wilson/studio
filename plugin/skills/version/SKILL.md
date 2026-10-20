---
name: version
description: Say which version of Studio is running, check whether a newer one is available, and offer to update. Use when the designer types /version, asks which Studio they have, or whether Studio is up to date.
allowed-tools:
  - Bash(studio-version)
  - Bash(studio-version --update)
---

# /version: which Studio you have

1. Run `studio-version` (a Studio helper; it's already allowed). It prints one line. Reply in the Studio voice, briefly:
   - `up-to-date 0.2.2`: "You're on **Studio 0.2.2**, the latest." Nothing else to do.
   - `update-available 0.2.2 0.2.3`: "You're on **Studio 0.2.2**. **0.2.3** is ready. Want to update?" Wait for a yes.
   - `unversioned-changes 0.2.2`: "You're on **Studio 0.2.2**. The Studio folder has newer changes that haven't been given a version number yet, so there's nothing to update to. When they get a new number, `/version` will offer it."
   - `from-folder 0.2.2`: "You're on **Studio 0.2.2**, loaded straight from its folder, so it's always current."
   - `unknown 0.2.2` or anything else: "You're on **Studio 0.2.2**. I couldn't check for a newer one right now; your work isn't affected." Offer to try again later.
2. **If they say yes to updating**, say you're updating Studio (only Studio; their work isn't touched), then run `studio-version --update`:
   - `updated 0.2.2 0.2.3`: "Studio is now **0.2.3**. To start using it, quit the Claude app (Cmd+Q), reopen it and click **New**. In the terminal, start a new session."
   - `up-to-date ...`: say they already have the latest.
   - `update-failed ...`: follow the calm failure shape: the update didn't go through, their work is safe, and offer to try again.

Don't show the helper's raw output. Don't use em dashes.
