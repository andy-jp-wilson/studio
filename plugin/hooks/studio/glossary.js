// Studio's friendly words, the real terms beside them, and one plain sentence.
// Same list as skills/glossary/SKILL.md and the Figma Desktop panel (page 02).
export const GLOSSARY = [
  { friendly: 'Project', real: 'repository (repo)', meaning: 'The folder that holds everything for one piece of work.' },
  { friendly: 'Exploration', real: 'branch', meaning: 'A safe copy where you can try an idea without touching the original.' },
  { friendly: 'Save point', real: 'commit', meaning: 'A snapshot of your work you can always go back to.' },
  { friendly: 'Handoff for review', real: 'pull request', meaning: 'Asking a teammate to look at an exploration before it joins the main work.' },
  { friendly: 'Working memory', real: 'context window', meaning: 'How much of your conversation Claude can hold in mind at once.' },
  { friendly: 'Workspace', real: 'terminal', meaning: 'The text window where you talk to Claude Code.' },
  { friendly: 'Private preview', real: 'localhost', meaning: 'A website running on your own computer that only you can see.' },
]

export function search(query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return GLOSSARY
  return GLOSSARY.filter(g => (g.friendly + ' ' + g.real + ' ' + g.meaning).toLowerCase().includes(q))
}
