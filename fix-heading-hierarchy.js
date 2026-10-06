// Apply recommended heading hierarchy to the main guide:
//   h3 -> h2: top-level group "About Boulder Colorado Voter Guide and Disclosures" (exactly 1)
//   h3 -> h4: stray "Additional Reporting, Commentary, and Sources" h3 (exactly 1)
//   h4 -> h3: measure/candidate/office headers (exactly 26, classified by excluding known sub-header patterns)
// Heading IDs derive from text, so all summary-card anchors keep working.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

// known sub-header texts (stay h4)
const SUB_PATTERNS = [
  /^Additional Reporting, Commentary, and Sources$/,
  /^Who put the measure on the ballot\?$/,
  /^Short Description:$/,
  /^Analysis and Commentary:$/,
  /^Position:/,
  /^I.m ranking /,
  /^I am voting for /,
  /^What are the biggest challenges/,
  /^Comparing endorsements/,
  /^Other candidates you may consider$/,
  /mayor election uses ranked choice voting/,
  /^Ballot Issue 2K Overview:$/,
  /^Ballot Issue 7A Overview:$/,
  /^What does the bond do/,
  /^What if we made the bond smaller/,
  /^What if we vote on this again/,
  /^What happens if we don.t address the problem/,
  /^Is the cost for individuals and businesses too high/,
  /^What would Issue 7A do/,
  /^Boulder has paid significant money for a train/,
  /^What happens if 7A fails/,
  /^How would 7A benefit Boulder and Denver/,
  /^Compelling reasons to vote No:$/,
  /^Now, the Yes arguments/,
  /^Possible Option [AB]:$/,
];

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

  const toH2 = [];
  const toH4 = [];
  const toH3 = [];

  root.forEach((n, i) => {
    if (n.type !== 'extended-heading') return;
    const t = textOf(n);
    if (n.tag === 'h3') {
      if (t === 'About Boulder Colorado Voter Guide and Disclosures') toH2.push([i, t]);
      else if (t === 'Additional Reporting, Commentary, and Sources') toH4.push([i, t]);
    } else if (n.tag === 'h4') {
      if (!SUB_PATTERNS.some((p) => p.test(t))) toH3.push([i, t]);
    }
  });

  console.log(`\nplan: ${toH2.length} h3->h2, ${toH4.length} h3->h4, ${toH3.length} h4->h3`);
  if (toH2.length !== 1 || toH4.length !== 1 || toH3.length !== 26) {
    console.error('ABORT: counts do not match expected 1/1/26');
    toH3.forEach(([i, t]) => console.log(`  would promote [${i}] ${t.slice(0, 90)}`));
    process.exit(1);
  }
  console.log('\nh3 -> h2:');
  toH2.forEach(([i, t]) => console.log(`  [${i}] ${t}`));
  console.log('h3 -> h4:');
  toH4.forEach(([i, t]) => console.log(`  [${i}] ${t}`));
  console.log('h4 -> h3:');
  toH3.forEach(([i, t]) => console.log(`  [${i}] ${t.slice(0, 90)}`));

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-heading-hierarchy-${STAMP}.json`, post.lexical);
  console.log('\nbackup written');

  toH2.forEach(([i]) => { root[i].tag = 'h2'; });
  toH4.forEach(([i]) => { root[i].tag = 'h4'; });
  toH3.forEach(([i]) => { root[i].tag = 'h3'; });

  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  // verify rendered html
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const html = check.html;
  const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  const re = /<h([1-6])[^>]*id="/g;
  let m;
  while ((m = re.exec(html)) !== null) counts['h' + m[1]]++;
  console.log('\nrendered heading counts:', JSON.stringify(counts), '(expect h2:10 h3:58 h4:124)');

  // all summary anchors must resolve
  const doc2 = JSON.parse(updated.lexical);
  const card = doc2.root.children.find((n) => n.type === 'markdown');
  const anchors = (card.markdown.match(/\]\(#[^)]+\)/g) || []).map((s) => s.slice(3, -1));
  const missing = anchors.filter((a) => !html.includes(`id="${a}"`));
  console.log(`summary anchors: ${anchors.length}, unresolved: ${missing.length}${missing.length ? ' -> ' + missing.join(', ') : ''}`);

  console.log('RTD anchor + B1 card intact:', html.includes('id="regional-transportation-district-directordistrict-o"') && html.includes('sg-section-actions') ? 'YES' : 'NO');
  if (missing.length || counts.h2 !== 10 || counts.h3 !== 58 || counts.h4 !== 124) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
