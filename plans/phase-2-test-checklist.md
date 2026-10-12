# Phase 2: try Studio yourself

Open the practice project `~/code/projects/studio/playground/onboarding` twice: once in the **terminal** (`cd` there, then `claude`) and once in the **Desktop app's Code tab**. Try each step in both and note anything that looks or behaves differently.

| # | Type or do this | You should see |
|---|---|---|
| 1 | `/start` | Project, exploration ("bolder-button"), last save point and a suggested next step, in calm plain language |
| 2 | "Make the Continue button a bit bolder" | Claude says what it will do, narrates short steps, mentions the snapshot, and ends with how to see it and go back |
| 3 | `/show` | A private preview link (http://localhost:4321) that opens the sign-up screen. Desktop also mentions the Browser pane |
| 4 | "go back" | It offers what to go back to, asks first, then restores |
| 5 | `/save` | "✓ Saved …" and the files included |
| 6 | `/explore` | A list with the main version and bolder-button, offering to switch |
| 7 | `/glossary` | The friendly words table |
| 8 | `/handoff` | Explains there's nowhere to share to yet, and shares nothing |
| 9 | Terminal only: `/theme` | "Studio Light" and "Studio Dark" in the list; pick one |
| 10 | Ask anything | No em dashes; friendly words first, at most one or two real terms per reply |

## Switching Studio off and on
- Terminal: `claude plugin disable studio@studio-local`, and `claude plugin enable studio@studio-local` to turn it back on
- Desktop: **+ > Plugins > Manage plugins**

Studio is read straight from `~/code/projects/studio/plugin`, so any changes we make apply the next time you start a session (or after `/reload-plugins`).
