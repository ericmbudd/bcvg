// Append an anchor re-scroll helper to the main guide's codeinjection_foot.
// Fixes: initial fragment scroll races image loading on long pages (target drifts).
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const HELPER = `
<script>
(function(){
  if (!location.hash) return;
  function rescroll(){
    var id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch (e) { id = location.hash.slice(1); }
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  if (document.readyState === 'complete') rescroll();
  else window.addEventListener('load', rescroll);
  setTimeout(rescroll, 1000);
})();
</script>`;

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
  const p = await api.posts.read({ slug: 'election-guide' });
  const foot = p.codeinjection_foot || '';
  if (foot.includes('rescroll')) { console.log('helper already present — nothing to do'); process.exit(0); }
  const newFoot = foot + HELPER;
  console.log(`foot: ${foot.length} -> ${newFoot.length} chars`);

  if (!PUSH) { console.log('\nDRY RUN — re-run with --push to apply.'); process.exit(0); }

  fs.writeFileSync(`2026/backups/election-guide-pre-rescroll-helper-${STAMP}.json`, JSON.stringify({ codeinjection_foot: foot }, null, 2));
  const updated = await saveWithRetry(() => api.posts.edit({ id: p.id, updated_at: p.updated_at, codeinjection_foot: newFoot }));
  console.log('saved | new updated_at:', updated.updated_at);

  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  console.log('verify helper in foot:', (check.codeinjection_foot || '').includes('rescroll') ? 'YES' : 'NO');
  if (!(check.codeinjection_foot || '').includes('rescroll')) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
