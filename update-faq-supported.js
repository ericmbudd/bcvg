// Update the FAQ section "Which candidates did Boulder Colorado Voter Guide support
// for Boulder City Council?" — 2026 candidates in guide order, linked to their websites.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const SECTION_HEADING = 'Which candidates did Boulder Colorado Voter Guide support for Boulder City Council?';

// website URLs reused from the main guide's council section (already user-vetted)
const CANDIDATES = [
  { name: 'Ryan Schuchard', url: 'https://www.ryanwithboulder.com/' },
  { name: 'Jamillah Richmond', url: 'http://jamillahanewvoice.com/' },
  { name: 'Sam Fuqua', url: 'https://www.fuquaforcouncil.com/' },
  { name: 'Jill Adler Grano', url: 'https://www.jillforcouncil.com/' },
  { name: 'Tina Marquis', url: 'https://www.tinaforboulder.com/' },
];

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const link = (url, children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: 'noreferrer noopener', target: '_blank', title: null, url });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });
const list = (items) => ({
  children: items.map((t, i) => ({ children: [t], direction: 'ltr', format: '', indent: 0, type: 'listitem', version: 1, value: i + 1 })),
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
  // liveness check on the website URLs (report only — they are already user-vetted)
  console.log('=== website liveness ===');
  for (const c of CANDIDATES) {
    try {
      const res = await fetch(c.url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
      console.log(`  ${c.name}: ${res.status} (${res.url})`);
    } catch (e) {
      console.log(`  ${c.name}: FETCH ERROR — ${e.message}`);
    }
  }

  const api = createGhostAdminClient();
  const page = await api.pages.read({ slug: 'election-guide-faq' }, { formats: 'lexical' });
  console.log('\nFAQ read | updated_at:', page.updated_at);

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

  const newPara = para([text('Boulder Colorado Voter Guide supports five candidates for Boulder City Council in 2026:')]);
  const newList = list(CANDIDATES.map((c) => link(c.url, [text(c.name)])));

  if (!PUSH) {
    console.log('\n--- new content preview ---');
    console.log('PARA: Boulder Colorado Voter Guide supports five candidates for Boulder City Council in 2026:');
    CANDIDATES.forEach((c) => console.log('  - ' + c.name + ' -> ' + c.url));
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/faq-pre-supported-candidates-${STAMP}.json`, page.lexical);
  console.log('\nbackup written');

  root.splice(idx + 1, end - idx - 1, newPara, newList);
  const updated = await saveWithRetry(() => api.pages.edit({ id: page.id, updated_at: page.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
