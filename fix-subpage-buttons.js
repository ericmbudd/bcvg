// Repoint the "Read the Full 2026 Voter Guide" button on all subpages
// from the section anchor to the main guide's summary heading:
//   "Colorado Voter Guide 2026 — November 3rd, 2026 General Election in Boulder, Colorado"
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const SUMMARY_ID = 'colorado-voter-guide-2026-%E2%80%94-november-3rd-2026-general-election-in-boulder-colorado';
const NEW_URL = `https://bouldercoloradovoterguide.com/election-guide#${SUMMARY_ID}`;

const SLUGS = [
  'regional-transportation-district-director-district-o-2026',
  'city-of-boulder-mayoral-candidates-2026',
  'city-of-boulder-council-candidates-2026',
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

  for (const slug of SLUGS) {
    console.log(`\n=== ${slug} ===`);
    const p = await api.posts.read({ slug }, { formats: 'lexical,html' });
    const doc = JSON.parse(p.lexical);
    const buttons = doc.root.children.filter((n) => n.type === 'button');
    if (buttons.length !== 1) { console.error(`ABORT: expected 1 button, found ${buttons.length}`); process.exit(1); }
    const b = buttons[0];
    console.log('current buttonUrl:', b.buttonUrl);
    if (b.buttonUrl === NEW_URL) { console.log('already updated — skipping'); continue; }
    b.buttonUrl = NEW_URL;

    if (!PUSH) { console.log('plan: ->', NEW_URL); continue; }

    fs.writeFileSync(`2026/backups/subpage-pre-button-summary-${slug}-${STAMP}.json`, p.lexical);
    const updated = await saveWithRetry(() => api.posts.edit({ id: p.id, updated_at: p.updated_at, lexical: JSON.stringify(doc) }));
    console.log('saved | new updated_at:', updated.updated_at);

    const check = await api.posts.read({ slug }, { formats: 'html' });
    console.log('verify rendered button href:', check.html.includes(`href="${NEW_URL}"`) ? 'OK' : 'MISSING');
    if (!check.html.includes(`href="${NEW_URL}"`)) process.exit(1);
  }

  if (!PUSH) console.log('\nDRY RUN — re-run with --push to apply.');
  else console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
