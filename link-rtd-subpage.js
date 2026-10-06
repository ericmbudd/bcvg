// Point the main guide's summary-card RTD line at the new subpage.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const OLD_HREF = '#regional-transportation-district-directordistrict-o';
const NEW_HREF = 'https://bouldercoloradovoterguide.com/regional-transportation-district-directordistrict-o-2026/';
const LINE_RE = /\[Regional Transportation District Director - District O\]\(#regional-transportation-district-directordistrict-o\)/;

async function saveWithRetry(api, payload, attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await api.posts.edit(payload);
    } catch (e) {
      const transient = /bad record mac|ECONNRESET|ETIMEDOUT|socket hang up|5\d\d/i.test(e.message) || /bad record mac/i.test(String(e.cause || ''));
      console.log(`save attempt ${i} failed: ${e.message}`);
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
  console.log('read post | updated_at:', post.updated_at);

  const doc = JSON.parse(post.lexical);
  const cards = doc.root.children.filter((n) => n.type === 'markdown');
  let changed = 0;
  cards.forEach((c) => {
    if (LINE_RE.test(c.markdown)) {
      c.markdown = c.markdown.replace(LINE_RE, `[Regional Transportation District Director - District O](${NEW_HREF})`);
      changed++;
    }
  });
  if (changed !== 1) {
    console.error(`ABORT: expected exactly 1 matching card line, found ${changed}`);
    process.exit(1);
  }

  const lexical = JSON.stringify(doc);
  console.log('plan: swap RTD summary-card href', OLD_HREF, '->', NEW_HREF);

  if (!PUSH) {
    console.log('DRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-rtd-subpage-link-${STAMP}.json`, post.lexical);
  console.log('backup written');

  const updated = await saveWithRetry(api, { id: post.id, updated_at: post.updated_at, lexical });
  console.log('saved | new updated_at:', updated.updated_at);

  // verify rendered HTML
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const ok = check.html.includes(`href="${NEW_HREF}"`) && check.html.includes('Regional Transportation District Director - District O');
  console.log('verify rendered html contains subpage link:', ok ? 'YES' : 'NO');
  if (!ok) process.exit(1);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
