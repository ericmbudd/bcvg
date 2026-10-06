// Update the yes/no color script: scope to document.body so post title + custom excerpt
// (rendered outside .gh-content) also get colored. Applies to the main guide and the
// Amendment 81 subpage. Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const OLD_LINE = "var container = document.querySelector('.gh-content') || document.querySelector('.post-content') || document.querySelector('article') || document.body;";
const NEW_LINE = 'var container = document.body; // title/excerpt render outside .gh-content, so scope to the whole body';

const TARGETS = ['election-guide', 'amendment-81-constitutional-no-against-2026'];

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

  for (const slug of TARGETS) {
    console.log(`\n=== ${slug} ===`);
    const p = await api.posts.read({ slug });
    const foot = p.codeinjection_foot || '';
    if (!foot.includes(OLD_LINE)) {
      if (foot.includes(NEW_LINE)) { console.log('already updated — skipping'); continue; }
      console.error(`ABORT: container line not found in ${slug} foot (length ${foot.length})`);
      process.exit(1);
    }
    const newFoot = foot.replace(OLD_LINE, NEW_LINE);
    console.log(`foot: ${foot.length} -> ${newFoot.length} chars`);

    if (!PUSH) continue;

    fs.writeFileSync(`2026/backups/${slug === 'election-guide' ? 'election-guide' : slug}-pre-foot-body-scope-${STAMP}.json`, JSON.stringify({ codeinjection_foot: foot }, null, 2));
    const updated = await saveWithRetry(() => api.posts.edit({ id: p.id, updated_at: p.updated_at, codeinjection_foot: newFoot }));
    console.log('saved | new updated_at:', updated.updated_at);

    const check = await api.posts.read({ slug }, { formats: 'html' });
    const ok = (check.codeinjection_foot || '').includes(NEW_LINE);
    console.log('verify foot updated:', ok ? 'YES' : 'NO');
    if (!ok) process.exit(1);
  }

  if (!PUSH) console.log('\nDRY RUN — re-run with --push to apply.');
  else console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
