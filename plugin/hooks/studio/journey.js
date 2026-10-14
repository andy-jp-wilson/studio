// Studio: the journey stage and the small bits of text the band and panel share.

export const STAGES = ['Explore', 'Refine', 'Build']

// Studio's guess (decided 2026-10-12): Explore on the main design or on an
// exploration with no save points of its own; Refine once it has some;
// Build after a handover covers it. A stage the person chose wins.
export function guessStage(p) {
  if (p.handedOver) return 'Build'
  if (p.isMain || !p.ownSavePoints) return 'Explore'
  return 'Refine'
}

export function stageState(stage, current) {
  const i = STAGES.indexOf(stage), c = STAGES.indexOf(current)
  return i < c ? 'done' : i === c ? 'current' : 'upcoming'
}

export const GLYPH = { done: '✓', current: '●', upcoming: '○' }
// Theme keys, so the terminal follows the Studio theme.
export const COLOR = { done: 'success', current: 'claude', upcoming: 'inactive' }

export function ago(ms, now) {
  if (!ms) return null
  const m = Math.max(0, Math.round((now - ms) / 60000))
  if (m < 1) return 'saved just now'
  if (m < 60) return `saved ${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `saved ${h}h ago`
  return `saved ${Math.round(h / 24)}d ago`
}

// ▰▰▰▱▱▱▱▱ in 8 cells. Calm sage until 50%, ochre at 75%, soft rust from 90%.
export function memoryBar(percent) {
  const p = Math.max(0, Math.min(100, Math.round(percent || 0)))
  const filled = Math.round(p / 12.5)
  const color = p >= 90 ? 'error' : p >= 75 ? 'warning' : 'success'
  return { filled: '▰'.repeat(filled), empty: '▱'.repeat(8 - filled), percent: p + '%', color }
}

// Detail lines for the panel's journey steps.
export function stageDetail(stage, p, state) {
  if (stage === 'Explore') {
    const n = p.explorations || 0
    if (state === 'upcoming') return 'Try a few ideas safely'
    return n > 1 ? `${n} explorations so far` : 'Trying ideas on ' + (p.isMain ? 'the main design' : p.exploration)
  }
  if (stage === 'Refine') {
    if (state === 'upcoming') return 'Polish one idea with save points'
    const n = p.ownSavePoints || 0
    return `${n} save point${n === 1 ? '' : 's'} on ${p.exploration}`
  }
  if (state === 'upcoming') return 'Hand it over to your team'
  return p.handoverLabel ? 'Handed over ' + p.handoverLabel : 'Ready to hand over'
}

// "✓ Saved 2m ago" when everything is in a save point; "Changes not saved yet"
// when there's something new. Nothing outside a project that keeps save points.
export function saveStatus(s) {
  if (!s.hasSavePoints) return null
  if (s.unsaved) return { text: 'Changes not saved yet', color: 'warning' }
  const when = ago(s.lastSaveAt, s.now)
  return when ? { text: '✓ ' + when.charAt(0).toUpperCase() + when.slice(1), color: 'success' } : null
}
