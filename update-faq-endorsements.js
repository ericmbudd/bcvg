// Update the FAQ page's council-endorsements section with the 2026 BCVG-endorsed
// candidates (guide order) and all their endorsing groups (plain text, no links).
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const SECTION_HEADING = 'What are the Boulder City Council endorsements for candidates backed by Boulder Colorado Voter Guide?';

const CANDIDATES = [
  {
    name: 'Ryan Schuchard',
    endorsers: ['Boulder Colorado Voter Guide', 'Boulder Progressives', 'Better Boulder', 'Sierra Club', 'Daily Camera', 'Working Families Party', 'Boulder Area Labor Council', 'Transform RTD', 'Run On Climate', 'PLAN Boulder', 'Boulder Action'],
  },
  {
    name: 'Jamillah Richmond',
    endorsers: ['Boulder Colorado Voter Guide', 'Boulder Progressives', 'Better Boulder', 'Working Families Party', 'Moms Demand Action', 'Boulder DSA', 'Boulder Action'],
  },
  {
    name: 'Sam Fuqua',
    endorsers: ['Boulder Colorado Voter Guide', 'Boulder Progressives', 'Better Boulder', 'Daily Camera'],
  },
  {
    name: 'Jill Adler Grano',
    endorsers: ['Boulder Colorado Voter Guide', 'Boulder Progressives', 'Better Boulder', 'Sierra Club', 'Daily Camera', 'Boulder Area Labor Council', 'Open Boulder'],
  },
  {
    name: 'Tina Marquis',
    endorsers: ['Boulder Colorado Voter Guide', 'Boulder Progressives', 'Better Boulder', 'Sierra Club', 'Daily Camera', 'Colorado BlueFlower Fund', 'PLAN Boulder', 'Boulder Action', 'Open Boulder'],
  },
];

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const h3 = (t) => ({ children: [text(t)], direction: 'ltr', format: '', indent: 0, type: 'extended-heading', version: 1, tag: 'h3' });
const list = (items) => ({
  children: items.map((t, i) => ({ children: [text(t)], direction: 'ltr', format: '', indent: 0, type: 'listitem', version: 1, value: i + 1 })),
  direction: 'ltr', format: '', indent: 0, type: 'list', version: 1, listType: 'bullet', start: 1, tag: 'ul',
});

async function saveWithRetry(fn, attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      const transient = /bad record mac|ECONNRESET|ETIMEDOUT|socket hang up|5\d\d/i.test(e.message);
      console.log(`attempt ${i} failed: ${e.message}`);
      if (!transient || i === attempts) throw e;
      const wait = 2000 * i;
      console.log(`  transient — retrying in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

(async () => {
  const api = createGhostAdminClient();
  const page = await api.pages.read({ slug: 'election-guide-faq' }, { formats: 'lexical' });
  console.log('FAQ read | updated_at:', page.updated_at);

  const doc = JSON.parse(page.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  const idx = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === SECTION_HEADING);
  if (idx === -1) { console.error('ABORT: section heading not found'); process.exit(1); }

  // section content runs until the next h2
  let end = root.length;
  for (let i = idx + 1; i < root.length; i++) {
    if (root[i].type === 'extended-heading' && root[i].tag === 'h2') { end = i; break; }
  }
  const oldNodes = root.slice(idx + 1, end);
  console.log(`section at [${idx}]; replacing ${oldNodes.length} content node(s) [${idx + 1}, ${end})`);
  oldNodes.forEach((n, k) => console.log(`  [${idx + 1 + k}] ${n.type}: ${textOf(n).slice(0, 80)}`));

  const newNodes = [];
  CANDIDATES.forEach((c) => {
    newNodes.push(h3(`${c.name} has been endorsed by the following organizations:`));
    newNodes.push(list(c.endorsers));
  });

  if (!PUSH) {
    console.log('\n--- new content preview ---');
    CANDIDATES.forEach((c) => {
      console.log(`H3: ${c.name} has been endorsed by the following organizations:`);
      c.endorsers.forEach((e) => console.log('   - ' + e));
    });
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/faq-pre-endorsements-${STAMP}.json`, page.lexical);
  console.log('\nbackup written');

  root.splice(idx + 1, oldNodes.length, ...newNodes);
  const updated = await saveWithRetry(() => api.pages.edit({ id: page.id, updated_at: page.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  const check = await api.pages.read({ slug: 'election-guide-faq' }, { formats: 'html' });
  const ok = CANDIDATES.every((c) => check.html.includes(`${c.name} has been endorsed by the following organizations:`));
  console.log('verify all 5 candidate H3s present:', ok ? 'YES' : 'NO');
  console.log('verify sample endorser:', check.html.includes('Colorado BlueFlower Fund') && check.html.includes('Transform RTD') ? 'YES' : 'NO');
  if (!ok) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
