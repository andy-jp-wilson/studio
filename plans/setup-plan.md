# `/setup`: getting a designer ready

Status: **built** (2026-10-16), the six core steps, in `plugin/skills/setup/SKILL.md` and `plugin/bin/studio-project`. Extras still to decide. Test with `plans/setup-test-checklist.md`.

Setup walks a designer through everything Studio needs before they start, one step at a time, in plain words. It can be run again any time to recheck, and it remembers answers so later commands (`/handover`, Send to Figma) use the right files without asking.

The Figma design for these screens is skipped for now; we'll come back to it (would be page 06).

## The steps

### Once per computer

1. **Figma connection works.** Studio makes a small test call to Figma.
   - Works: "Figma is connected."
   - Doesn't: "Figma isn't connected yet." Then the steps: type `/mcp`, choose Figma, sign in. Setup waits, then tries again.
2. **The right Figma account.** Studio shows who is signed in, e.g. "Signed in as Andrew Wilson (name@company.com), on the Acme plan." and asks "Is this the account you use for work?"
   - Yes: carry on.
   - No: explain how to sign out and in with the right account, then check again.
   - (Decided: the person confirms; nothing is enforced.)

### Once per project

3. **Project folder.** Studio asks whether to start a new project or use the current folder.
   - New: asks for a name ("onboarding"), creates the folder, and offers the Studio folder layout below. The person can say no and keep their own.
   - Existing: offers to add any missing folders from the layout, never moving or deleting anything.
4. **Design system file.** The person links the design system (Acme Design System by default, once the team gives Studio its link). Studio reads the file and shows its name, asking "Is this the Acme Design System?"
5. **Target Figma file.** Where this project's designs live. The person pastes a link, or Studio offers to create a new file (asking which team or project it goes in). Studio shows the file's name and pages, plus a small picture of the first page, and asks "Is this the right file?"
6. **Studio remembers.** Answers go in `.studio/project.json` inside the project: the Figma account confirmed, the design system file, the target file, and which steps are done. Nothing here leaves the computer.

At the end: a short summary with a tick per step, and what to try first.

## Studio folder layout (draft, for review)

```
onboarding/
  README.md        What this project is, who's involved, and links to its Figma file and design system
  prototype/       The prototype's code: the screens you preview, e.g. the sign-up screen
    assets/        Images, icons and fonts the prototype uses
  handover/        The project's one handover for developers, updated by each /handover
  .studio/         Studio's own notes about this project (hidden)
```

Open questions on the layout:
- Should `prototype/` be split by flow (e.g. `prototype/sign-up/`), or stay flat?
- Does the team want a fixed place for exports from Figma?

Decided (2026-10-16): `screens/` is now `prototype/`, where all the code goes. `brief/` and `references/` are left out for now. `assets/` lives inside `prototype/`, so everything a developer needs is in one place.

## Extras (to decide)

Not in the first build unless chosen:
- **Edit access check:** make sure the account can edit the target file (Send to Figma and handover pages need it).
- **Save points and upload place:** set up save points with the right name, and confirm no personal upload place (ties to the local-by-default guardrail).
- **Preview and versions:** check the private preview tools, and that Studio and Claude Code are recent enough.
- **Progress and first task:** "Setup: 4 of 6 done · /setup" in the band and panel, and a short guided first task at the end.

## Team presets (later)

The team sets these once, like the upload list (`STUDIO_ALLOWED_ORGS`): the design system link, and the folder layout. Until then, Studio asks.

## Facts checked

- The Figma connection can return the signed-in account (name, email, plans and seats), a file's name and pages, the libraries a file uses, and can create a new file in a chosen team or project.
- `/setup` isn't a built-in command (checked 2026-10-16; built-ins nearby are `/terminal-setup`, `/auto-mode-setup`, `/setup-bedrock`, `/setup-vertex`).
- Headless test runs (`claude -p`) can't reach Figma, so the Figma steps are tested in the app.
