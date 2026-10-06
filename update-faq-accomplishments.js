// Update the FAQ section "What are the accomplishments from the current Boulder City Council?"
// with the accomplishments list from the voter guide's mayoral section.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const SECTION_HEADING = 'What are the accomplishments from the current Boulder City Council?';

const INTRO =
  'Aaron Brockett and the current Boulder City Council have accomplished a massive amount in just the past three years. The work on housing, transportation, climate and sustainability is significant compared to the pace of change in the past few decades. Here are some of the council’s key accomplishments:';

const ITEMS = [
  'Updated the Boulder Valley Comprehensive Plan to significantly expand Boulder’s possible long-term housing supply',
  'Strengthened Boulder’s wildfire hardening and resilience code',
  'Implemented Boulder’s mandate that new buildings are all-electric and natural-gas free',
  'Supporting and approving a measure to set future council’s pay based on the median city wage',
  'Supported Colorado’s law to end discriminatory housing occupancy limits statewide in Colorado',
  'Established Boulder’s first citywide minimum wage',
  'Ended city-mandated parking requirements',
  'Expanded housing on transit corridors',
  'Expanded work on the Core Arterial Network to improve transportation',
  'Improved safety for people walking, biking, busing, and driving',
  'Established a transportation maintenance fee (first proposed in the early 2010s) as a permanent funding mechanism to improve maintenance on roads, bike paths, multi-use paths, and sidewalks',
  'Expanded housing options for townhomes, duplexes, and accessory dwelling units',
];

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });
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
  let end = root.length;
  for (let i = idx + 1; i < root.length; i++) {
    if (root[i].type === 'extended-heading' && root[i].tag === 'h2') { end = i; break; }
  }
  console.log(`section at [${idx}]; replacing ${end - idx - 1} content node(s) [${idx + 1}, ${end})`);
  root.slice(idx + 1, end).forEach((n, k) => console.log(`  [${idx + 1 + k}] ${n.type}: ${textOf(n).slice(0, 80)}`));

  const newPara = para([text(INTRO)]);
  const newList = list(ITEMS);

  if (!PUSH) {
    console.log('\n--- new content preview ---');
    console.log('PARA: ' + INTRO);
    ITEMS.forEach((t) => console.log('  - ' + t));
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/faq-pre-accomplishments-${STAMP}.json`, page.lexical);
  console.log('\nbackup written');

  root.splice(idx + 1, end - idx - 1, newPara, newList);
  const updated = await saveWithRetry(() => api.pages.edit({ id: page.id, updated_at: page.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
