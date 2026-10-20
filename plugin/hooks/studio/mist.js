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
  tint: '#FBE9E6',         // background for what needs you
  tintText: '#A9483D',     // text for what needs you
}

// The Studio mark: a coral dot centred on the lowercase s of "studio".
// Desktop draws the dot as a picture, sized to the line of text, with the dot
// lowered to the letters' x-height; the terminal uses a coral ● character.
const DOT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="16" viewBox="0 0 8 16"><circle cx="4" cy="9.5" r="3.5" fill="${MIST.coral}"/></svg>`

export function mark(el, surface, key = 'mark') {
  const { Box, Text, Svg } = el
  const dot = surface === 'desktop' && Svg
    ? Svg({ key: key + '-dot', source: DOT_SVG, alt: '', width: 8, height: 16 })
    : Text({ key: key + '-dot', color: MIST.coral, children: ['●'] })
  return Box({ key, flexDirection: 'row', columnGap: 1, alignItems: 'center', children: [
    dot,
    Text({ key: key + '-word', color: MIST.text, bold: true, children: ['studio'] }),
  ] })
}
