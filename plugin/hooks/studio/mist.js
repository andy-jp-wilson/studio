// Studio's look: D5 Mist (Figma page 13, variable collection "Studio · Mist").
// Studio owns the band and the panel; everything else keeps Claude's look.
// Plugins can set raw colours, borders and bold, and show Svg pictures in
// Desktop, but not font size or typeface.

export const MIST = {
  surface: '#F6F6F8',      // band and panel background
  raised: '#FFFFFF',       // Studio's buttons
  text: '#40404A',         // main text
  muted: '#7E7E88',        // secondary text
  rule: '#E6E6EA',         // faint rules between panel sections
  line: '#9C9CA6',         // the line across the top of the band
  control: '#D6D6DC',      // borders of Studio's buttons (Stop)
  coral: '#E07A6E',        // Studio's dot; the band line when something needs you
  tint: '#FBE9E6',         // (not used: no background for what needs you)
  tintText: '#A9483D',     // text for what needs you
}

// The Studio mark: a coral dot centred on the lowercase s of "studio".
// A coral ● character on every surface: the Desktop band doesn't draw Svg
// pictures (seen 2026-10-20), and ● sits at the letters' x-height anyway.
export function mark(el, surface, key = 'mark') {
  const { Box, Text } = el
  const dot = Text({ key: key + '-dot', color: MIST.coral, children: ['●'] })
  return Box({ key, flexDirection: 'row', columnGap: 1, alignItems: 'center', children: [
    dot,
    Text({ key: key + '-word', color: MIST.text, bold: true, children: ['studio'] }),
  ] })
}
