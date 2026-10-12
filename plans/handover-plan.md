# /handover: a team handover with nothing uploaded (plan)

`/handoff` stays as it is: it shares an exploration online as a pull request. Its description changes to "share online for review" so the two read differently.

`/handover` packages finished work so a designer can present it to their team and hand it to developers. Nothing is uploaded unless they choose to send it to Figma.

## What it produces
1. **Changelog** (in every output). A plain-language list of what changed and why, built from the save points since the last handover. For example: "Sign-up heading: 32px extra bold → 26px medium, so it feels calmer."
   - Studio marks each handover with a hidden local marker (`refs/studio/handovers/<date>`), so the next changelog starts from there.
   - With no earlier handover, it starts from the first save point.
2. **Figma handover page**, built from the Studio default template:
   - cover and summary
   - captured screens
   - the changelog
   - specs: colours, type and spacing used in the screens
   - notes for developers

   Studio asks which Figma file to add it to, and confirms before writing.
3. **Developer pack**, a folder in the project:
   ```
   handover/2026-10-12-calmer-sign-up/
     index.html      a review page: screens, changelog, specs (opens in any browser)
     CHANGELOG.md    the changelog as text
     specs.json      colours, fonts and spacing found in the CSS
     screens/        images of each screen
     prototype/      copy of the HTML, CSS and images (no packages, no history)
   ```

## Steps
1. **Design first.** Add **page 05 Handover** to the Studio Figma file:
   - the handover template (cover, summary, changelog, screens, specs, developer notes)
   - the matching review page for the developer pack, using the existing tokens and components

   Stop for your feedback.
2. **Build.**
   - a `studio-changelog` helper (lists save points since the last handover, with what changed)
   - a `studio-pack` helper (builds the developer pack folder)
   - the `/handover` skill, which asks which outputs you want, writes the changelog in the Studio voice, and builds each one
3. **Test** in the practice project, in the terminal and in Desktop.

## To check while building
- **Capturing screens into Figma.** Figma's tool captures web pages as editable layers; I need to confirm it works with a private preview (localhost). If not, the fallback is images of each screen.
- **Reusing the template in other Figma files.** Components can only be reused across files if the Studio file is published as a team library, which you would do in Figma. Until then, Studio rebuilds the page from the same design in whichever file you choose.
