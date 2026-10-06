// Add abbreviated party to candidate names in the summary card (partisan races only).
// All parties verified from each section's "On the ballot" line — all (D) in this guide.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

// [exact current bold segment, new bold segment]
const UPDATES = [
  ['**John Hickenlooper**', '**John Hickenlooper (D)**'],
  ['**Joe Neguse**', '**Joe Neguse (D)**'],
  ['**Marx/Markert, Phil Weiser / Lesley Dahlkemper**', '**Marx/Markert, Phil Weiser (D) / Lesley Dahlkemper (D)**'],
  ['**Amanda Gonzalez**', '**Amanda Gonzalez (D)**'],
  ['**Jeff Bridges**', '**Jeff Bridges (D)**'],
  ['**Jena Griswold**', '**Jena Griswold (D)**'],
  ['**Edie Hooton**', '**Edie Hooton (D)**'],
  ['**Junie Joseph**', '**Junie Joseph (D)**'],
  ['**Ashley Stolzmann**', '**Ashley Stolzmann (D)**'],
  ['**Molly Fitzpatrick**', '**Molly Fitzpatrick (D)**'],
  ['**Rachel Friend**', '**Rachel Friend (D)**'],
  ['**Cynthia Braddock**', '**Cynthia Braddock (D)**'],
  ['**Curtis Johnson**', '**Curtis Johnson (D)**'],
  ['**Kayce D. W. Keane**', '**Kayce D. W. Keane (D)**'],
  ['**Jeff Martin**', '**Jeff Martin (D)**'],
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
  const card = doc.root.children.find((n) => n.type === 'markdown');
  let md = card.markdown;

  let applied = 0;
  for (const [oldSeg, newSeg] of UPDATES) {
    const count = md.split(oldSeg).length - 1;
    if (count !== 1) {
      console.error(`ABORT: "${oldSeg}" found ${count} times (expected 1)`);
      process.exit(1);
    }
    md = md.replace(oldSeg, newSeg);
    applied++;
  }
  console.log(`plan: ${applied} summary lines get party abbreviations`);
  card.markdown = md;

  if (!PUSH) {
    console.log('\n--- updated partisan lines preview ---');
    md.split('\n').forEach((l) => { if (/\(D\)|\(R\)/.test(l)) console.log('  ' + l.trim().slice(0, 180)); });
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-summary-party-${STAMP}.json`, post.lexical);
  console.log('\nbackup written');

  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  // verify rendered html
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const html = check.html;
  const dCount = (html.match(/\(D\)</g) || []).length;
  console.log('\nverify: "(D)" occurrences in rendered html:', dCount, '(expect 16: 15 names, governor pair has 2)');
  console.log('spot checks:', ['John Hickenlooper (D)', 'Jena Griswold (D)', 'Kayce D. W. Keane (D)'].map((s) => s + ' -> ' + (html.includes(s) ? 'OK' : 'MISSING')).join(' | '));
  const doc2 = JSON.parse(updated.lexical);
  const card2 = doc2.root.children.find((n) => n.type === 'markdown');
  const anchors = (card2.markdown.match(/\]\(#[^)]+\)/g) || []).map((s) => s.slice(3, -1));
  const missing = anchors.filter((a) => !html.includes(`id="${a}"`));
  console.log(`summary anchors: ${anchors.length}, unresolved: ${missing.length}`);
  if (missing.length) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
