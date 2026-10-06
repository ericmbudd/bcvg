// Dump all headings in the mayoral section of the live post.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  console.log('updated_at:', post.updated_at);
  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  const start = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === 'City of Boulder Offices');
  const end = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === 'City of Boulder Council Candidates');
  console.log(`mayoral section: nodes [${start}, ${end})\n`);
  for (let i = start; i < end; i++) {
    const n = root[i];
    if (n.type === 'extended-heading') {
      console.log(`[${i}] ${n.tag.toUpperCase()} | ${textOf(n).slice(0, 95)}`);
    }
  }
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
