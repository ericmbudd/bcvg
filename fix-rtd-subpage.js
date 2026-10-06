// Fix RTD subpage integration:
//   1. slug: ...directordistrict-o-2026 -> ...director-district-o-2026 (proper hyphens)
//   2. main guide: restore summary-card anchor link; hyperlink the section H4 heading to the subpage instead
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const OLD_SLUG = 'regional-transportation-district-directordistrict-o-2026';
const NEW_SLUG = 'regional-transportation-district-director-district-o-2026';
const SUBPAGE_URL = 'https://bouldercoloradovoterguide.com/' + NEW_SLUG + '/';
const ANCHOR_ID = 'regional-transportation-district-directordistrict-o';
const HEADING_TEXT = 'Regional Transportation District Director - District O';

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

  // --- 1. fix subpage slug ---
  const sub = await api.posts.read({ slug: OLD_SLUG });
  console.log('subpage post:', sub.id, '| current slug:', sub.slug);
  if (!PUSH) {
    console.log('plan: rename slug ->', NEW_SLUG);
  } else {
    const renamed = await saveWithRetry(() => api.posts.edit({ id: sub.id, updated_at: sub.updated_at, slug: NEW_SLUG }));
    console.log('slug renamed ->', renamed.slug);
  }

  // --- 2. main guide edits ---
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical,html' });
  console.log('\nguide read | updated_at:', post.updated_at);
  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  // 2a. revert summary-card href to the in-page anchor
  const cardRe = new RegExp('\\[' + HEADING_TEXT.replace(/[-]/g, '\\$&') + '\\]\\(https:\\/\\/bouldercoloradovoterguide\\.com\\/' + OLD_SLUG + '\\/\\)');
  let cardFixes = 0;
  root.forEach((n) => {
    if (n.type === 'markdown' && cardRe.test(n.markdown)) {
      n.markdown = n.markdown.replace(cardRe, `[${HEADING_TEXT}](#${ANCHOR_ID})`);
      cardFixes++;
    }
  });
  console.log('summary-card anchor reverts:', cardFixes);
  if (cardFixes !== 1) { console.error('ABORT: expected exactly 1 card line to revert, found ' + cardFixes); process.exit(1); }

  // 2b. hyperlink the section H4 heading to the subpage
  const headingIdx = [];
  root.forEach((n, i) => {
    if (n.type === 'extended-heading' && n.tag === 'h4' && textOf(n) === HEADING_TEXT) headingIdx.push(i);
  });
  console.log('matching H4 headings found:', headingIdx.length, 'at', headingIdx);
  if (headingIdx.length !== 1) { console.error('ABORT: expected exactly 1 heading match'); process.exit(1); }
  const h = root[headingIdx[0]];
  const alreadyLinked = h.children.length === 1 && h.children[0].type === 'link';
  if (alreadyLinked) {
    console.log('heading already linked ->', h.children[0].url);
    if (h.children[0].url !== SUBPAGE_URL) {
      h.children[0].url = SUBPAGE_URL;
      console.log('  updated link url ->', SUBPAGE_URL);
    }
  } else {
    h.children = [{
      children: h.children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'link',
      version: 1,
      rel: null,
      target: null,
      title: null,
      url: SUBPAGE_URL,
    }];
    console.log('heading wrapped in link ->', SUBPAGE_URL);
  }

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-rtd-heading-link-${STAMP}.json`, post.lexical);
  console.log('\nbackup written');

  const lexical = JSON.stringify(doc);
  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical }));
  console.log('saved | new updated_at:', updated.updated_at);

  // --- 3. verify rendered html ---
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const html = check.html;
  const anchorOk = html.includes(`href="#${ANCHOR_ID}"`);
  const headingLinked = new RegExp(`<h4 id="${ANCHOR_ID}"[^>]*>\\s*<a href="${SUBPAGE_URL.replace(/[/.]/g, '\\$&')}"`).test(html) || html.includes(`<a href="${SUBPAGE_URL}"`);
  console.log('\nverify rendered guide html:');
  console.log('  summary-card anchor restored:', anchorOk ? 'YES' : 'NO');
  console.log('  heading linked to subpage:', html.includes(`<a href="${SUBPAGE_URL}"`) ? 'YES' : 'NO');
  console.log('  heading id preserved:', html.includes(`id="${ANCHOR_ID}"`) ? 'YES' : 'NO');

  const pub = await fetch(SUBPAGE_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log('  subpage URL (new slug) status:', pub.status);
  if (!anchorOk || !html.includes(`id="${ANCHOR_ID}"`)) process.exit(1);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
