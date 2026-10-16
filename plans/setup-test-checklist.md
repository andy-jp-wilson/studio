# `/setup` test checklist

Try these in the Claude app. Restart the app first (Cmd+Q, reopen, **New**) so it picks up Studio 0.2.5.

| # | Do this | You should see |
|---|---|---|
| 1 | In any folder, type `/setup` while Figma is signed out | "Setup has six short steps", then "Figma isn't connected yet" with the `/mcp` steps |
| 2 | Sign in through `/mcp`, then say "done" | "✓ Figma is connected" (Claude may ask once to allow the Figma check) |
| 3 | Answer the account question | Your name, email and Figma teams, then "Is this the account you use for work?" |
| 4 | Choose **new project**, name it "setup-test" | The layout explained, then a new folder in `~/Studio projects/` with `prototype/`, `prototype/assets/`, `handovers/` and a README |
| 5 | Paste the Acme Design System link (or any Figma design file) | The file's name and pages, then "Is this the Acme Design System?" |
| 6 | Paste a target Figma file link, or ask for a new one | Its name and pages (and a small picture), then "Is this the right file?". A new file is only made after you say yes |
| 7 | Finish | A tick list, a note that nothing was uploaded, and how to open the new folder |
| 8 | Open the new folder's README | Links to the Figma file and the design system |
| 9 | Type `/setup` again in that folder | "Everything's done", with an offer to recheck or change an answer |

Note anything confusing or slow, and send screenshots if you can.
