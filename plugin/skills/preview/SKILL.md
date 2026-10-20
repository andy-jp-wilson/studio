---
name: preview
description: Start the designer's private preview of a prototype (a local website on their computer) and give them the link. Only for projects with a prototype; designs in Figma are seen in Figma. Use when they ask to see, preview, open or try their work.
allowed-tools:
  - Bash(lsof -i:*)
  - Bash(cat package.json)
  - Bash(python3 -m http.server:*)
  - Bash(npm run dev:*)
  - Bash(npm run start:*)
  - Bash(npm start:*)
  - Bash(curl -s:*)
---

# /preview: open your private preview

1. Work out how this project previews:
   - **`package.json` with a `dev` or `start` script**: use `npm run dev` (or `start`). If `node_modules` is missing, say you need to download the project's packages first (one sentence on what that means), ask, then run `npm install`.
   - **Plain HTML** (an `index.html`, no package.json): use `python3 -m http.server 4321`.
   - **Neither**: there's no prototype yet; the design lives in Figma. Give the link to the project's Figma file (from `studio-project status`, `project.targetFileUrl`) and say a prototype is only made if they ask for one. Don't create files to have something to preview.
2. If a preview is already running (check the usual ports with `lsof -i :<port>`), reuse it rather than starting another.
3. Start the preview **in the background**, so the conversation can continue. Wait until it answers, then read the address it prints.
4. Reply:

   Your private preview is ready: http://localhost:4321
   Only you can see it. It updates when you save changes (refresh the page if it doesn't).

   - **In the Desktop app**, add: "You can also open it in the Browser pane beside this conversation."
   - **If the preview fails to start**, follow the calm error shape: what happened, that their work is safe, and what to do next.
