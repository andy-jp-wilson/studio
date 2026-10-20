# Studio: the main jobs

Draft, 20 October 2026, from the user's own answers. For checking; nothing is built from it yet.

## The core, updated

> Studio makes Claude an extension of the designer. Claude builds designs in Figma, from wireframes and concepts to full visuals, following the project's user story and requirements, its technical design document and the design system. It maps every path a user can take, keeps every screen accurate and consistent, and makes the interaction design clear, so what developers build matches the design. It never edits the design system, invents components or requirements, or touches anything outside the project.

## The main jobs

1. **Design faster, from the brief.** Build wireframes, concepts or full visuals in Figma, at the level the designer asks for, from the user story, requirements and technical design document, using only the design system's components.
2. **Map every path.** Lay out the full user journey, showing all the paths a user could take, not just the main one.
3. **Keep it accurate and consistent.** Make a change once and have it carried across every screen; check screens against the requirements and the design system.
4. **Make interactions clear for developers.** Show the interaction design that gets lost in flat visuals, so the coded version matches the design.

## The rules (never, unless the designer asks for that exact thing)

- **Never edit the design system.**
- **Never invent components.** If the design system doesn't have what's needed, say so and ask.
- **Never invent requirements** or go outside the project's scope. If something's missing or unclear, ask.
- **Never touch or edit other files** outside the project.
- **Claude works as an extension of the designer:** the designer decides; Claude does the work.

## Questions to answer next

1. **Where do the user story, requirements and technical design document live?** For example Jira, Confluence, Word or PDF files, or Figma itself. This decides how Claude reads them.
2. **"All paths": what should a journey include?** For example, the main path, alternative paths, errors, empty states and loading.
3. **What counts as "the project" in Figma?** One Figma file, a set of pages, or a folder of files.
