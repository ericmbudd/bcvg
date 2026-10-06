// Demote candidate-name headers + "Thoughts on other Candidates" from H3 -> H4.
// Rule: race/measure/office = H3 unit; every header inside a unit = H4.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const DEMOTE = new Set([
  'Taishya Adams',
  'Thoughts on other Candidates',
  'Jameson “Jamo” Goldstein',
  'Aquiles La Grave',
  'Ryan Schuchard',
  'Jamillah Richmond',
  'Sam Fuqua',
  'Jill Adler Grano',
  'Tina Marquis',
  'Rachel Rose Isaacson',
  'Tara Winer',
]);

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
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical,html' });
  console.log('guide read | updated_at:', post.updated_at);

  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  const found = [];
  root.forEach((n, i) => {
    if (n.type === 'extended-heading' && n.tag === 'h3' && DEMOTE.has(textOf(n))) found.push(i);
  });
  console.log(`matched ${found.length} of ${DEMOTE.size} expected h3 headers`);
  if (found.length !== DEMOTE.size) {
    console.error('ABORT: count mismatch');
    found.forEach((i) => console.log(`  [${i}] ${textOf(root[i])}`));
    process.exit(1);
  }
  found.forEach((i) => console.log(`  [${i}] h3 -> h4: ${textOf(root[i]).slice(0, 80)}`));

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-candidate-demote-${STAMP}.json`, post.lexical);
  console.log('\nbackup written');

  found.forEach((i) => { root[i].tag = 'h4'; });

  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  // verify
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const html = check.html;
  const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  const re = /<h([1-6])[^>]*id="/g;
  let m;
  while ((m = re.exec(html)) !== null) counts['h' + m[1]]++;
  console.log('\nrendered heading counts:', JSON.stringify(counts), '(expect h2:10 h3:47 h4:135)');

  const doc2 = JSON.parse(updated.lexical);
  const card = doc2.root.children.find((n) => n.type === 'markdown');
  const anchors = (card.markdown.match(/\]\(#[^)]+\)/g) || []).map((s) => s.slice(3, -1));
  const missing = anchors.filter((a) => !html.includes(`id="${a}"`));
  console.log(`summary anchors: ${anchors.length}, unresolved: ${missing.length}${missing.length ? ' -> ' + missing.join(', ') : ''}`);
  console.log('RTD anchor + B1 card intact:', html.includes('id="regional-transportation-district-directordistrict-o"') && html.includes('sg-section-actions') ? 'YES' : 'NO');
  if (missing.length || counts.h3 !== 47 || counts.h4 !== 135) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
