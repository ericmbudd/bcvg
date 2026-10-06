// Delete leftover test drafts from bisecting.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();
  const pages = await api.pages.browse({ limit: 50, filter: 'slug:[test-raw-1791224588580]' }).catch(() => []);
  // broader: find any test pages/posts
  const all = await api.pages.browse({ limit: 50 });
  const allPosts = await api.posts.browse({ limit: 50, filter: 'status:draft' }).catch(() => []);
  const targets = [
    ...all.filter((p) => /^test-/.test(p.slug)),
    ...allPosts.filter((p) => /^test-/.test(p.slug)),
  ];
  if (!targets.length) { console.log('no test pages found'); return; }
  for (const t of targets) {
    console.log('deleting', t.slug, t.id);
    if (t.slug.startsWith('test-raw') || t.slug.startsWith('test-lib') || t.slug.startsWith('test-min') || t.slug.startsWith('test-bisect')) {
      try {
        if (all.some((p) => p.id === t.id)) await api.pages.delete({ id: t.id });
        else await api.posts.delete({ id: t.id });
        console.log('  deleted');
      } catch (e) { console.log('  failed:', e.message); }
    }
  }
})();
