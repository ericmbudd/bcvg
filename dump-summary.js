// Dump the full summary card + party mentions in race sections.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  const doc = JSON.parse(post.lexical);
  const card = doc.root.children.find((n) => n.type === 'markdown');
  console.log('=== full summary card ===');
  card.markdown.split('\n').forEach((l, i) => console.log(`${String(i).padStart(2)} | ${l.slice(0, 200)}`));
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
