// Inspect mayoral + council sections: node outline + image nodes (for feature images).
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  console.log('updated_at:', post.updated_at);
  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  for (const [name, startText, endText] of [
    ['MAYORAL', 'City of Boulder Mayoral Candidates', 'City of Boulder Council Candidates'],
    ['COUNCIL', 'City of Boulder Council Candidates', 'Judicial Retention Questions'],
  ]) {
    const start = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === startText);
    const end = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === endText);
    console.log(`\n=== ${name} section [${start}, ${end}) ===`);
    root.slice(start, end).forEach((n, k) => {
      const i = start + k;
      if (n.type === 'extended-heading') console.log(`  [${i}] ${n.tag.toUpperCase()}: ${textOf(n).slice(0, 90)}`);
      else if (n.type === 'image') console.log(`  [${i}] IMAGE src=${(n.src || '').slice(0, 110)}\n        alt=${JSON.stringify(n.alt || '')} caption=${JSON.stringify((n.caption || '').slice(0, 110))}`);
      else if (n.type === 'markdown') console.log(`  [${i}] MARKDOWN (${(n.markdown || '').length} chars)`);
      else if (n.type === 'html') console.log(`  [${i}] HTML card (${(n.html || '').length} chars)`);
      else if (n.type === 'extended-list') console.log(`  [${i}] LIST (${n.children?.length} items): ${textOf(n).slice(0, 80)}`);
      else if (n.type === 'paragraph') console.log(`  [${i}] PARA: ${textOf(n).slice(0, 80) || '(empty)'}`);
      else console.log(`  [${i}] ${n.type}: ${textOf(n).slice(0, 80)}`);
    });
  }
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
