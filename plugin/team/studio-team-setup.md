# Setting Studio up for your team

Studio works for one designer on their own, but it's better when everyone on a team has the same settings. This guide explains how.

## What the team settings are

| Setting | What it does |
|---|---|
| Team name | Used in Studio's messages. |
| Upload places | The only GitHub organisations or accounts work may be uploaded to. Anything else is stopped. |
| Projects folder | Where new projects are made on each designer's computer. |
| Figma write places | The Figma teams or folders Studio may change. Recorded now; enforced in a later version. |
| Design systems | Every design system your team uses, each with its Figma library link. Designers choose one for each project. |

None of them are required. They're saved on each designer's computer, in Claude Code's own settings, and nothing is uploaded.

## How it works

1. **One person sets them up first.** They run `/setup` in Studio. At the first step, Team settings, they choose **Type them in**, fill in the form and save.
2. **They save a copy for the team.** In the same form, **Save a copy for the team** makes a small team file on their Desktop, ending in `.studio-team.json`.
3. **They share the file** with the team, however the team usually shares files.
4. **Each designer loads it.** They run `/setup`, choose **Load a team file** (recommended), drag the file into the box, check the settings and save. Typing them in works too.

The form can be opened again any time with `/team-settings`.

## Checklists

### For the person setting up the team

- [ ] Studio is installed on your computer
- [ ] You know your team's GitHub organisation, if uploads should only go there
- [ ] You have the Figma library link for each design system your team uses
- [ ] You've decided where new projects should go
- [ ] You've run `/setup`, chosen **Type them in**, and saved the team settings
- [ ] You've clicked **Save a copy for the team** and found the file on your Desktop
- [ ] You've shared the file with your designers, along with this guide

### For each designer

- [ ] Studio is installed on your computer
- [ ] You have the team file from your team
- [ ] You've opened the Claude app, gone to the **Code** tab, and run `/setup`
- [ ] At Team settings, you chose **Load a team file**, checked the settings and saved
- [ ] You've finished the rest of `/setup`: Figma, your project, its design system and its Figma file
- [ ] You've restarted the Claude app, so every part of Studio uses the new settings
