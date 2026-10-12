// Studio handover page builder for the Figma use_figma tool.
// Replace the DATA line with the handover.json contents (same shape), then run.
// Works in any Figma design file: colours are fixed values from the Studio palette,
// not variables. Returns the page id and one empty frame id per screen, ready for
// the screen pictures to be placed into with upload_assets (nodeIds).
const DATA = __DATA__;

const C = { bg:'#F7F4EE', surface:'#EFEAE1', raised:'#FFFFFF', border:'#E2DACD', text:'#2A2723', muted:'#6E675E',
  accent:'#C2643D', info:'#4F6D8F', infoSoft:'#DFE6EE', warn:'#B8862B', warnSoft:'#F3E8D2' };
const rgb = h => ({ r: parseInt(h.slice(1,3),16)/255, g: parseInt(h.slice(3,5),16)/255, b: parseInt(h.slice(5,7),16)/255 });
const solid = h => [{ type:'SOLID', color: rgb(h) }];

const fonts = await figma.listAvailableFontsAsync();
const has = (f,s) => fonts.some(x => x.fontName.family===f && x.fontName.style===s);
const SANS = 'Inter', DISPLAY = has('Instrument Serif','Regular') ? 'Instrument Serif' : 'Inter';
const MONO = has('JetBrains Mono','Regular') ? 'JetBrains Mono' : 'Inter';
const T = {
  display:[DISPLAY, DISPLAY==='Inter'?'Medium':'Regular', 56], h1:[SANS,'Semi Bold',28], h2:[SANS,'Semi Bold',20],
  body:[SANS,'Regular',15], strong:[SANS,'Medium',15], caption:[SANS,'Regular',12], label:[SANS,'Medium',11], mono:[MONO,'Regular',13]
};
for (const [f,s] of Object.values(T)) await figma.loadFontAsync({ family:f, style:s });

const box = (dir, name, o = {}) => { const f = figma.createAutoLayout(dir, { name }); f.fills = o.fill ? solid(o.fill) : [];
  if (o.stroke) { f.strokes = solid(o.stroke); f.strokeWeight = 1; } if (o.r) f.cornerRadius = o.r;
  if (o.p != null) { const [x,y] = Array.isArray(o.p) ? o.p : [o.p,o.p]; f.paddingLeft=f.paddingRight=x; f.paddingTop=f.paddingBottom=y; }
  if (o.gap != null) f.itemSpacing = o.gap; return f; };
function text(parent, s, style, color, o = {}) {
  const [f,st,size] = T[style]; const t = figma.createText(); t.fontName = { family:f, style:st }; t.fontSize = size;
  if (style==='label') t.letterSpacing = { unit:'PERCENT', value:4 };
  t.lineHeight = { unit:'PERCENT', value: style==='display'?110:150 }; t.characters = Array.isArray(s) ? s.join(', ') : String(s ?? ''); t.fills = solid(color);
  parent.appendChild(t); if (o.fill) { t.textAutoResize = 'HEIGHT'; t.layoutSizingHorizontal = 'FILL'; }
  else if (o.width) { t.resize(o.width, t.height); t.textAutoResize = 'HEIGHT'; } return t; }

const page = figma.createPage(); page.name = `Handover · ${DATA.date} · ${DATA.title}`;
await figma.setCurrentPageAsync(page);
const root = box('VERTICAL', 'Handover', { fill:C.bg, p:48, gap:48 }); page.appendChild(root);
root.counterAxisSizingMode = 'FIXED'; root.resize(1440, root.height);

// Cover
const cover = box('VERTICAL','Cover',{ gap:16 }); root.appendChild(cover); cover.layoutSizingHorizontal='FILL';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const [yy,mm,dd] = String(DATA.date).split('-').map(Number);
const niceDate = yy && mm && dd ? `${dd} ${MONTHS[mm-1]} ${yy}` : DATA.date;
text(cover, `HANDOVER  ·  ${niceDate.toUpperCase()}`, 'label', C.accent);
text(cover, DATA.title, 'display', C.text);
text(cover, DATA.summary, 'body', C.muted, { width:760 });
const meta = box('HORIZONTAL','Meta',{ gap:12 }); cover.appendChild(meta);
for (const [k,v] of [['PROJECT',DATA.project],['EXPLORATION',DATA.exploration],['DESIGNER',DATA.designer],['SAVE POINTS',DATA.savePoints]]) {
  const m = box('VERTICAL',`Meta/${k}`,{ fill:C.surface, stroke:C.border, r:8, p:[16,12], gap:2 }); meta.appendChild(m);
  text(m,k,'label',C.muted); text(m,v,'strong',C.text); }

const section = (title, sub) => { const s = box('VERTICAL', title, { gap:16 }); root.appendChild(s); s.layoutSizingHorizontal='FILL';
  const h = box('VERTICAL','Heading',{ gap:4 }); s.appendChild(h); text(h,title,'h1',C.text); if (sub) text(h,sub,'body',C.muted,{ width:760 }); return s; };

// Summary
const sum = section('Summary','What this handover covers.');
const cards = box('HORIZONTAL','Summary cards',{ gap:16 }); sum.appendChild(cards); cards.layoutSizingHorizontal='FILL';
for (const p of DATA.points || []) { const k = box('VERTICAL',`Card/${p.title}`,{ fill:C.surface, stroke:C.border, r:12, p:24, gap:8 });
  cards.appendChild(k); k.layoutSizingHorizontal='FILL'; k.layoutSizingVertical='FILL'; text(k,p.title,'h2',C.text,{fill:true}); text(k,p.detail,'body',C.muted,{fill:true}); }

// Final design: empty frames, filled with screen pictures afterwards
const fd = section('Final design','The finished screens. Earlier versions are not included; the changelog describes what changed.');
const row = box('HORIZONTAL','Screens',{ gap:32 }); fd.appendChild(row);
const screenFrames = [];
for (const s of DATA.screens || []) { const w = box('VERTICAL',`Screen/${s.name}`,{ gap:8 }); row.appendChild(w);
  const f = figma.createFrame(); f.name = s.name; f.resize(390,844); f.cornerRadius = 28; f.fills = solid(C.raised); f.strokes = solid(C.border); f.strokeWeight = 1; w.appendChild(f);
  text(w,s.name,'caption',C.muted); screenFrames.push({ name:s.name, file:s.file, nodeId:f.id }); }

// Changelog
const cl = section('Changelog','Every save point since the last handover, newest first.');
const list = box('VERTICAL','Entries'); cl.appendChild(list); list.layoutSizingHorizontal='FILL';
for (const c of DATA.changes || []) { const e = box('HORIZONTAL','Entry',{ p:[0,16], gap:24 }); e.strokes = solid(C.border); e.strokeTopWeight = 0; e.strokeLeftWeight = 0; e.strokeRightWeight = 0; e.strokeBottomWeight = 1;
  list.appendChild(e); e.layoutSizingHorizontal='FILL'; text(e,c.when,'mono',C.muted,{ width:140 });
  const b = box('VERTICAL','Body',{ gap:6 }); e.appendChild(b); b.layoutSizingHorizontal='FILL';
  text(b,c.title,'strong',C.text,{fill:true}); text(b,c.detail,'body',C.text,{fill:true});
  const why = box('HORIZONTAL','Why',{ gap:8 }); b.appendChild(why); why.layoutSizingHorizontal='FILL'; text(why,'WHY','label',C.accent); text(why,c.why,'caption',C.muted,{fill:true});
  const fl = box('HORIZONTAL','Files',{ fill:C.surface, r:4, p:[6,2] }); b.appendChild(fl); text(fl,c.files,'mono',C.muted); }

// Specs: Acme Design System reference
const sp = section('Specs','Colours, type, spacing and components come from Acme Design System, our design system. Use Acme Design System as the source of truth; this handover doesn’t repeat its values.');
const ks = box('HORIZONTAL','Acme Design System reference',{ fill:C.surface, stroke:C.border, r:12, p:24, gap:32 }); sp.appendChild(ks); ks.layoutSizingHorizontal='FILL';
const kl = box('VERTICAL','Library',{ gap:8 }); ks.appendChild(kl); kl.layoutSizingHorizontal='FILL';
text(kl,'DESIGN SYSTEM','label',C.muted); text(kl,'Acme Design System','h2',C.text,{fill:true});
const lk = box('HORIZONTAL','Link',{ fill: DATA.acmeLink ? C.infoSoft : C.warnSoft, r:4, p:[8,4] }); kl.appendChild(lk);
text(lk, DATA.acmeLink || 'Link to Acme Design System: to be added', 'caption', DATA.acmeLink ? C.info : C.warn);
const kr = box('VERTICAL','Components used',{ gap:8 }); ks.appendChild(kr); kr.layoutSizingHorizontal='FILL';
text(kr,'ACME COMPONENTS ON THESE SCREENS','label',C.muted);
for (const c of DATA.components || []) { const r = box('HORIZONTAL','Component',{ gap:8 }); kr.appendChild(r); text(r,'◆','caption',C.accent); text(r,c,'body',C.text); }

// For developers
const dv = section('For developers');
const dn = box('VERTICAL','Developer notes',{ fill:C.infoSoft, r:12, p:24, gap:8 }); dv.appendChild(dn); dn.layoutSizingHorizontal='FILL';
const lkRow = box('HORIZONTAL','Pack link',{ gap:8 }); dn.appendChild(lkRow); lkRow.layoutSizingHorizontal='FILL';
text(lkRow,'Developer pack:','strong',C.text);
const pl = box('HORIZONTAL','Link',{ fill: DATA.packLink ? C.raised : C.warnSoft, r:4, p:[8,2] }); lkRow.appendChild(pl);
text(pl, DATA.packLink || 'Developer pack link: to be added', 'caption', DATA.packLink ? C.info : C.warn);
for (const s of ['The pack has a review page (index.html), the changelog, pictures of the final screens, and the prototype’s HTML and CSS.',
                 'Specs: use the Acme Design System; the components used are listed above.']) {
  const r = box('HORIZONTAL','Note',{ gap:8 }); dn.appendChild(r); r.layoutSizingHorizontal='FILL'; text(r,'–','body',C.info); text(r,s,'body',C.text,{fill:true}); }

return { pageId: page.id, rootId: root.id, screenFrames };
