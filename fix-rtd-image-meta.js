// Fix RTD subpage: copy feature image alt text + caption from the main guide,
// and add a leading empty paragraph so the caption doesn't overflow into the body text.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const SLUG = 'regional-transportation-district-director-district-o-2026';

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

  const guide = await api.posts.read({ slug: 'election-guide' });
  const sub = await api.posts.read({ slug: SLUG }, { formats: 'lexical' });

  console.log('guide alt:', JSON.stringify(guide.feature_image_alt));
  console.log('guide caption:', JSON.stringify(guide.feature_image_caption));
  console.log('sub alt:', JSON.stringify(sub.feature_image_alt), '| sub caption:', JSON.stringify(sub.feature_image_caption));

  const doc = JSON.parse(sub.lexical);
  const first = doc.root.children[0];
  const isEmptyPara = first && first.type === 'paragraph' && (!first.children || first.children.length === 0);
  console.log('\nleading empty paragraph already present:', isEmptyPara ? 'YES' : 'NO');

  if (!PUSH) {
    console.log('\nplan:');
    console.log('  feature_image_alt <- guide alt');
    console.log('  feature_image_caption <- guide caption');
    if (!isEmptyPara) console.log('  insert empty paragraph at start of lexical');
    console.log('DRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/rtd-subpage-pre-image-meta-${STAMP}.json`, JSON.stringify(sub, null, 2));
  console.log('\nbackup written');

  const payload = {
    id: sub.id,
    updated_at: sub.updated_at,
    feature_image_alt: guide.feature_image_alt,
    feature_image_caption: guide.feature_image_caption,
  };
  if (!isEmptyPara) {
    doc.root.children.unshift({ children: [], direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });
    payload.lexical = JSON.stringify(doc);
  }

  const updated = await saveWithRetry(() => api.posts.edit(payload));
  console.log('saved | new updated_at:', updated.updated_at);
  console.log('verify alt:', JSON.stringify(updated.feature_image_alt));
  console.log('verify caption:', JSON.stringify(updated.feature_image_caption));
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
