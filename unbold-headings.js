// Strip bold formatting from all heading text nodes in the main guide.
// Theme heading styles control weight; <strong> inside headings is redundant and inconsistent.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

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

  let headingsChanged = 0;
  let nodesCleared = 0;
  root.forEach((n) => {
    if (n.type !== 'extended-heading') return;
    let changed = false;
    const walk = (v) => {
      if (Array.isArray(v)) return v.forEach(walk);
      if (!v || typeof v !== 'object') return;
      if (v.type === 'extended-text' && (v.format & 1) === 1) {
        v.format = v.format & ~1; // clear bold bit only
        changed = true;
        nodesCleared++;
      }
      Object.values(v).forEach(walk);
    };
    walk(n.children || []);
    if (changed) headingsChanged++;
  });

  console.log(`plan: clear bold on ${nodesCleared} text node(s) across ${headingsChanged} heading(s)`);
  if (headingsChanged === 0) {
    console.log('nothing to do — all headings already clean');
    process.exit(0);
  }

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-heading-unbold-${STAMP}.json`, post.lexical);
  console.log('\nbackup written');

  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  // verify rendered html
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const html = check.html;
  const strongInHeading = (html.match(/<h[1-6][^>]*>\s*<strong>/g) || []).length;
  const counts = { h2: 0, h3: 0, h4: 0 };
  const re = /<h([1-6])[^>]*id="/g;
  let m;
  while ((m = re.exec(html)) !== null) counts['h' + m[1]]++;

  const doc2 = JSON.parse(updated.lexical);
  const card = doc2.root.children.find((n) => n.type === 'markdown');
  const anchors = (card.markdown.match(/\]\(#[^)]+\)/g) || []).map((s) => s.slice(3, -1));
  const missing = anchors.filter((a) => !html.includes(`id="${a}"`));

  console.log('\nverify rendered guide html:');
  console.log('  <strong> inside headings:', strongInHeading, '(expect 0)');
  console.log('  heading counts:', JSON.stringify(counts), '(expect h2:10 h3:47 h4:135)');
  console.log(`  summary anchors: ${anchors.length}, unresolved: ${missing.length}${missing.length ? ' -> ' + missing.join(', ') : ''}`);
  console.log('  RTD anchor + B1 card intact:', html.includes('id="regional-transportation-district-directordistrict-o"') && html.includes('sg-section-actions') ? 'YES' : 'NO');
  if (strongInHeading > 0 || missing.length) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
