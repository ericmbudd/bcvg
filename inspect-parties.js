// Find party mentions (Democrat/Republican/etc.) in each partisan race section.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

const RACES = [
  'United States Senator',
  'Representative to the 120th United States Congress - District 2 (Vote for One)',
  'Governor/Lieutenant Governor (Vote for One Pair)',
  'Secretary of State',
  'State Treasurer',
  'Attorney General',
  'Regent of the University of Colorado - Congressional District 2',
  'State Representative - District 10',
  'Boulder County Commissioner - District 3',
  'Boulder County Clerk and Recorder',
  'Boulder County Treasurer',
  'Boulder County Assessor',
  'Boulder County Sheriff',
  'Boulder County Surveyor',
  'Boulder County Coroner',
];

(async () => {
  const api = createGhostAdminClient();
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  const headings = [];
  root.forEach((n, i) => { if (n.type === 'extended-heading') headings.push([i, textOf(n)]); });

  for (const race of RACES) {
    const idx = headings.find(([, t]) => t === race);
    if (!idx) { console.log(`\n### ${race}: HEADING NOT FOUND`); continue; }
    const start = idx[0];
    // section ends at next heading of same-or-higher level (h3 or h2)
    const tag = root[start].tag;
    let end = root.length;
    for (const [i, t] of headings) {
      if (i > start && (root[i].tag === 'h2' || root[i].tag === 'h3')) { end = i; break; }
    }
    const sectionText = root.slice(start, end).map(textOf).join(' ').replace(/\s+/g, ' ');
    // find party mentions with context
    const partyRe = /(Democrat|Democratic|Republican|Libertarian|Green Party|unaffiliated|nonpartisan|non-partisan|\(D\)|\(R\))/gi;
    const mentions = [];
    let m;
    while ((m = partyRe.exec(sectionText)) !== null) {
      const s = Math.max(0, m.index - 90);
      mentions.push('…' + sectionText.slice(s, m.index + m[0].length + 90).trim() + '…');
      if (mentions.length >= 6) break;
    }
    console.log(`\n### ${race} [${start}-${end})`);
    if (!mentions.length) console.log('  (no party mentions found)');
    mentions.forEach((x) => console.log('  ' + x));
  }
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
