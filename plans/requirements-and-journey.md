# Studio: requirements and the designer's journey

Draft, 20 October 2026. Built only from what's agreed in `plans/core-jobs.md` and the reset (`plans/studio-today.md`). Anything not yet decided is a question at the end, not an answer. Nothing is built from this yet.

## The core

> Studio makes Claude an extension of the designer. Claude builds designs in Figma, from wireframes and concepts to full visuals, following the project's user story and requirements, its technical design document and the design system. It maps every path a user can take, keeps every screen accurate and consistent, and makes the interaction design clear, so what developers build matches the design. It never edits the design system, invents components or requirements, or touches anything outside the project.

## The designer's journey

A designer picks up a piece of work. The journey below is the target; each step names the requirements it needs.

1. **Pick up the story.** The designer opens Claude Code and points Claude at the Jira story (and its Confluence technical design document). *(R1, R2)*
2. **Claude reads the brief and plays it back.** It summarises the story, the requirements and the paths the story describes, and lists anything missing or unclear as questions. It doesn't fill gaps itself. *(R3, R4)*
3. **The designer chooses where and how.** Which Figma file and page, and what level: wireframes, concepts or full visuals. *(R5, R6)*
4. **Claude says what it will make, and waits for a yes.** *(R7)*
5. **Claude builds it in Figma,** using only the design system's components, styles and variables, covering every path in the story. If a component doesn't exist, it stops and asks. *(R8, R9, R10)*
6. **The designer reviews and asks for changes.** A change made once is carried across every affected screen. *(R11)*
7. **Claude checks the work** against the story's requirements and the design system, and reports anything that doesn't match. *(R12)*
8. **Claude makes the interactions clear for developers,** so nothing is lost in flat visuals. *(R13)*
9. **The work is ready to hand over.** *(R14)*

## Requirements

### Reading the brief

- **R1. Read Jira stories:** the user story, its requirements and acceptance criteria.
- **R2. Read Confluence pages:** the technical design document linked to the work.
- **R3. Play the brief back** in plain words before designing: the requirements and every path the story describes.
- **R4. Never invent requirements.** Anything missing, unclear or contradictory becomes a question for the designer.

### Making designs in Figma

- **R5. Work in the project's Figma file:** normally one file with several pages, sometimes a folder of files.
- **R6. Three levels:** wireframes, concepts or full visuals, as the designer asks.
- **R7. Say first, then do.** Before changing the Figma file, Claude says what it will make or change, and where, and waits for a yes.
- **R8. Only the design system.** Use its components, styles and variables; never lookalikes or hand-drawn copies.
- **R9. Never invent components.** If the design system doesn't have what's needed, stop and ask.
- **R10. Every path the story describes,** and none it doesn't.

### Keeping it right

- **R11. Change once, everywhere.** A change the designer asks for is applied to every screen it affects.
- **R12. Check accuracy and consistency** against the story's requirements and the design system, and report anything that doesn't match.

### For developers

- **R13. Make the interaction design clear,** so the coded version can match it.
- **R14. Ready to hand over.**

### Never (protections)

- **R15. Never edit the design system.**
- **R16. Never change anything in Jira or Confluence.** Read only, with no exceptions, even if asked.
- **R17. Never touch files outside the project,** in Figma or anywhere else.
- **R18. The designer decides.** Claude is an extension of the designer: it proposes and does the work; the designer approves.

### How the protections are made trustworthy

R16 must be **enforced, not just instructed**, with four layers, each working even if another fails:

- **R19. Claude Code's block list:** Claude Code itself refuses every Jira and Confluence action that creates, edits, comments or deletes.
- **R20. Studio's read-only list:** Studio allows only a short list of known reading actions; anything else is refused, including actions Atlassian adds later and its general "execute" actions that can reach hidden write tools.
- **R21. Read-only access on the Atlassian side,** so Jira and Confluence themselves refuse any change. Possible: your Atlassian org admin can block **Write** for the connector, per app, and it only ever acts with each person's own permissions. Details in `plans/atlassian-read-only.md`.
- **R22. Proof:** a test that tries to make a change and shows it refused, repeated after any update. Jira and Confluence's own history shows any change.
- **Note:** layers R19 and R20 live on each designer's computer. To stop them being removed, the team's IT can put them in company-managed settings.

The same approach should be used for R15 and R17 where Studio can check Figma actions before they run.

### The experience

- **R23. Plain language,** with technical words explained, and a way to dismiss explanations or turn them off.
- **R24. UX and UI first.** Studio should feel like a designed tool, not extra text. The band, panel and setup are to be redesigned from this journey.
- **R25. Undo:** a clear way back, and plain words about how (Figma's own undo and version history for Figma work).
- **R26. Simple setup,** leaning on the conversation rather than long forms.

## Not in scope for now

- Coded prototypes, project folders, save points and other file-based tools (later, if the team moves to coded prototypes).
- Team feedback and discovery questions (after it's built).
- Accessibility checks, screen sizes, learning HTML and CSS (separate or later).

## Questions to decide

1. **Step 1, pointing at the story:** does the designer paste a Jira link, give a story key (like ABC-123), or pick from a list?
2. **R12, checking:** how should Claude report what doesn't match? In the conversation, as notes in Figma, or both?
3. **R13, interactions:** what does "clear for developers" look like in your Figma files today? For example annotations beside frames, prototype connections, a states page, or something else.
4. **R14, handover:** what does "ready to hand over" mean for your team? A specific page, a status, a Jira update (made by the designer, since Studio can't change Jira)?
5. **Steps 3 and 5, where it goes:** new pages, new frames on an existing page, or the designer's choice each time?
6. **Figma branches:** should Claude work on a Figma branch by default, so the main file isn't touched until the designer merges?
