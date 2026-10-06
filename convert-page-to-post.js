// Convert the RTD subpage from page -> post.
// Ghost serves both at /{slug}/ so the public URL (and the main guide's card link) stays the same.
// Strategy: try in-place conversion via posts.edit; fall back to delete + recreate.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const SLUG = 'regional-transportation-district-directordistrict-o-2026';
const CUSTOM_EXCERPT =
  'I am supporting Jack Rosenthal for RTD Director - District O in the November 2026 election. My analysis, the RTD District O candidate forum video, and sources for the RTD Board of Directors race in Boulder County.';

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

  // 1. read the page
  const page = await api.pages.read({ slug: SLUG }, { formats: 'lexical,html' });
  console.log('found page:', page.id, '| title:', page.title, '| status:', page.status, '| published_at:', page.published_at, '| type field:', page.type);
  console.log('custom_excerpt:', JSON.stringify(page.custom_excerpt));

  fs.writeFileSync(`2026/backups/rtd-subpage-as-page-${STAMP}.json`, JSON.stringify(page, null, 2));
  console.log('backup written: 2026/backups/rtd-subpage-as-page-' + STAMP + '.json');

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to convert.');
    process.exit(0);
  }

  // 2. try in-place conversion via posts.edit
  let converted = null;
  try {
    converted = await saveWithRetry(() => api.posts.edit({
      id: page.id,
      updated_at: page.updated_at,
      title: page.title,
      slug: page.slug,
      lexical: page.lexical,
      status: page.status,
      published_at: page.published_at,
      custom_excerpt: page.custom_excerpt || CUSTOM_EXCERPT,
      feature_image: page.feature_image,
    }));
    console.log('\nin-place conversion via posts.edit succeeded:', converted.id, '| type:', converted.type);
  } catch (e) {
    console.log('\nin-place conversion failed:', e.message);
  }

  // 3. fallback: delete page + recreate as post
  if (!converted) {
    console.log('falling back to delete + recreate...');
    await api.pages.delete({ id: page.id });
    console.log('page deleted');
    converted = await saveWithRetry(() => api.posts.add({
      title: page.title,
      slug: page.slug,
      lexical: page.lexical,
      status: 'published',
      published_at: page.published_at,
      custom_excerpt: page.custom_excerpt || CUSTOM_EXCERPT,
      feature_image: page.feature_image,
    }));
    console.log('post created:', converted.id, '| type:', converted.type, '| published_at:', converted.published_at);
  }

  // 4. verify: pages endpoint must 404, posts endpoint must find it
  let pagesGone = false;
  try { await api.pages.read({ slug: SLUG }); } catch (e) { pagesGone = true; }
  const asPost = await api.posts.read({ slug: SLUG }, { formats: 'html' });
  console.log('\nverify:');
  console.log('  pages.read 404s:', pagesGone ? 'YES' : 'NO');
  console.log('  posts.read finds it:', asPost ? 'YES' : 'NO');
  console.log('  published_at preserved:', asPost.published_at === page.published_at ? 'YES (' + asPost.published_at + ')' : 'CHANGED -> ' + asPost.published_at);
  console.log('  has youtube card:', asPost.html.includes('yt-rtd-forum'));
  console.log('  has back-button:', asPost.html.includes('Read the Full 2026 Voter Guide'));
  console.log('  url:', asPost.url);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
