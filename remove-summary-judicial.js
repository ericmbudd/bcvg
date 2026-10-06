// Inspect + remove judicial retention lines from the summary markdown card.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

// match summary lines for these entries (any link/anchor wrapping)
const PATTERNS = [
  /Colorado Supreme Court Justice/i,
  /Colorado Court of Appeals Judge/i,
  /District Court Judge - 20th Judicial District/i,
  /County Court Judge - Boulder/i,
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
  const cards = doc.root.children.filter((n) => n.type === 'markdown');
  console.log('markdown cards:', cards.length);

  let totalMatches = 0;
  cards.forEach((c, ci) => {
    const lines = c.markdown.split('\n');
    lines.forEach((line, li) => {
      if (PATTERNS.some((p) => p.test(line))) {
        totalMatches++;
        console.log(`card #${ci} line ${li}: ${line.trim().slice(0, 220)}`);
      }
    });
  });
  console.log('total matching lines:', totalMatches);

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to remove these lines.');
    process.exit(0);
  }

  if (totalMatches === 0) { console.log('nothing to remove'); process.exit(0); }

  fs.writeFileSync(`2026/backups/election-guide-pre-summary-judicial-removal-${STAMP}.json`, post.lexical);
  console.log('\nbackup written');

  cards.forEach((c) => {
    const lines = c.markdown.split('\n');
    const kept = lines.filter((line) => !PATTERNS.some((p) => p.test(line)));
    if (kept.length !== lines.length) {
      console.log(`removing ${lines.length - kept.length} line(s) from a card`);
      c.markdown = kept.join('\n');
    }
  });

  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  // verify
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const stillThere = PATTERNS.filter((p) => p.test(check.html) && /Hood|Freyre|Kotlarczyk|Brodsky/.test(check.html));
  // simpler: check the summary section specifically is hard; check overall html for the exact summary strings is unreliable
  // because the same names appear in the judicial section lower in the article (which must stay).
  console.log('\nverify: judicial section content still present lower in article:');
  console.log('  Hood:', check.html.includes('Hood'));
  console.log('  Kotlarczyk:', check.html.includes('Kotlarczyk'));
  console.log('  Brodsky:', check.html.includes('Brodsky'));
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
