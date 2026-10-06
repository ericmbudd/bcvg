// Fix broken actions-card URLs: /election-guide/{slug}-2026/ -> /{slug}-2026/ (site root).
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const BAD_RE = /https:\/\/bouldercoloradovoterguide\.com\/election-guide\/([a-z0-9-]+-2026\/)/g;
const GOOD = 'https://bouldercoloradovoterguide.com/$1';

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
  const cards = doc.root.children.filter((n) => n.type === 'html' && (n.html || '').includes('sg-section-actions'));
  let fixedCards = 0;
  let fixedUrls = 0;
  cards.forEach((c) => {
    const before = c.html;
    c.html = c.html.replace(BAD_RE, GOOD);
    if (c.html !== before) { fixedCards++; fixedUrls += (before.match(BAD_RE) || []).length; }
  });
  console.log(`fixed ${fixedUrls} URL(s) across ${fixedCards} card(s)`);
  if (fixedCards === 0) { console.log('nothing to fix'); process.exit(0); }

  if (!PUSH) { console.log('\nDRY RUN — re-run with --push to apply.'); process.exit(0); }

  fs.writeFileSync(`2026/backups/election-guide-pre-card-url-fix-${STAMP}.json`, post.lexical);
  console.log('backup written');

  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const stillBad = (check.html.match(/https:\/\/bouldercoloradovoterguide\.com\/election-guide\/[a-z0-9-]+-2026\//g) || []).length;
  console.log('verify: broken URLs remaining:', stillBad, '(expect 0)');
  const doc2 = JSON.parse(updated.lexical);
  const card2 = doc2.root.children.find((n) => n.type === 'markdown');
  const anchors = (card2.markdown.match(/\]\(#[^)]+\)/g) || []).map((s) => s.slice(3, -1));
  const missing = anchors.filter((a) => !check.html.includes(`id="${a}"`));
  console.log(`summary anchors: ${anchors.length}, unresolved: ${missing.length}`);
  if (stillBad > 0 || missing.length) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
