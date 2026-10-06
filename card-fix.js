// Re-sync the markdown summary card's internal anchor links with the heading ids
// Ghost renders. Run after changing any heading text (e.g. updating a position
// label like ": NO / AGAINST"), since heading ids are derived from heading text.
// Idempotent. See 2026/UPDATE-METHODS.md.
//
// Usage: node card-fix.js          (dry run)
//        node card-fix.js --push   (apply)
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');
const { findBySlug } = require('./src/ghost-content');

const decode = (s) => s
  .replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const normalize = (s) => s.split(':')[0].trim();

(async () => {
  const push = process.argv.includes('--push');
  const api = createGhostAdminClient();
  const found = await findBySlug(api, 'election-guide');
  const { type, item } = found;
  console.log(`Loaded ${type} "${item.title}" (updated_at=${item.updated_at})`);

  // 1. Heading id map from the rendered html
  const posts = await api.posts.browse({ limit: 1, filter: 'slug:election-guide', formats: 'html' });
  const html = posts[0].html || '';
  const idMap = new Map(); // normalized heading text -> id
  const re = /<h([234]) id="([^"]*)">([\s\S]*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(html))) {
    const text = normalize(decode(m[3].replace(/<[^>]+>/g, '')));
    if (text && !idMap.has(text)) idMap.set(text, m[2]);
  }
  console.log('heading ids found:', idMap.size);

  // 2. Rewrite the markdown card
  const doc = JSON.parse(item.lexical);
  const root = doc.root.children;
  const card = root.find((n) => n.type === 'markdown');

  const aliases = { 'State Offices': 'Colorado Offices', 'County Offices': 'Boulder County Offices' };
  const unresolved = [];
  let resolved = 0;
  const linkRe = /\[([^\]]+)\]\((#|https:\/\/bouldercoloradovoterguide\.com\/#)[^)]*\)/g;
  card.markdown = card.markdown.replace(linkRe, (full, text, href) => {
    const target = aliases[text] || text;
    const id = idMap.get(normalize(target));
    if (!id) { unresolved.push(text); return full; }
    resolved++;
    return `[${text}](#${id})`;
  });

  console.log(`links resolved: ${resolved} | unresolved: ${unresolved.length ? unresolved.join(' | ') : 'none'}`);
  if (!push) {
    console.log('\n--- new card markdown ---\n' + card.markdown);
    console.log('Dry run - nothing saved. Re-run with --push to apply.');
    return;
  }
  if (resolved === 0) { console.log('Nothing to change - not saving.'); return; }

  fs.mkdirSync('2026/backups', { recursive: true });
  fs.writeFileSync(`2026/backups/pre-cardfix-${Date.now()}.json`, item.lexical);

  let saved = false;
  for (let attempt = 1; attempt <= 4 && !saved; attempt++) {
    try {
      await api[type].edit({ id: item.id, updated_at: item.updated_at, lexical: JSON.stringify(doc) });
      saved = true;
    } catch (e) {
      console.error(`Save attempt ${attempt} failed: ${e.message}`);
      if (attempt < 4) await new Promise((r) => setTimeout(r, attempt * 4000));
      else throw e;
    }
  }
  console.log('Saved to Ghost.');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });