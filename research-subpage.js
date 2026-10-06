// Inspect example page details + extract RTD District O section from live post.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();

  // --- example page details ---
  const exLex = fs.readFileSync('2026/backups/example-2025-page.json', 'utf8');
  const exRoot = JSON.parse(exLex).root.children;
  console.log('=== example page HTML card [1] ===');
  console.log(exRoot[1].html);
  console.log('\n=== example page button [33] ===');
  console.log(JSON.stringify(exRoot[33], null, 2));
  console.log('\n=== example page sources paragraphs [35] ===');
  console.log(JSON.stringify(exRoot[35], null, 2).slice(0, 1200));

  // --- live post: extract RTD section ---
  console.log('\n=== live post: RTD District O section ===');
  const posts = await api.posts.browse({ limit: 5, filter: 'slug:election-guide', formats: 'lexical' });
  const post = posts.find((p) => p.slug === 'election-guide');
  if (!post) { console.log('post not found'); process.exit(1); }
  console.log('post:', post.title, '| status:', post.status, '| published_at:', post.published_at, '| updated_at:', post.updated_at);
  fs.writeFileSync('2026/backups/election-guide-pre-subpages.json', post.lexical);

  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  // find the RTD heading
  let start = -1;
  for (let i = 0; i < root.length; i++) {
    const n = root[i];
    if (n.type === 'extended-heading' && /regional transportation district/i.test(textOf(n))) {
      console.log(`[${i}] H${n.tag.toUpperCase()}: ${textOf(n)}`);
      if (start === -1) start = i;
    }
  }
  if (start === -1) { console.log('RTD heading not found'); process.exit(1); }

  // section ends at next h2 or h3
  let end = root.length;
  for (let i = start + 1; i < root.length; i++) {
    const n = root[i];
    if (n.type === 'extended-heading' && (n.tag === 'h2' || n.tag === 'h3')) { end = i; break; }
  }
  console.log(`\nsection range: [${start}, ${end}) — ${end - start} nodes`);
  root.slice(start, end).forEach((n, i) => {
    const idx = start + i;
    if (n.type === 'extended-heading') console.log(`  [${idx}] H${n.tag.toUpperCase()}: ${textOf(n).slice(0, 100)}`);
    else if (n.type === 'markdown') console.log(`  [${idx}] MARKDOWN card (${(n.markdown || '').length} chars): ${(n.markdown || '').slice(0, 120).replace(/\n/g, ' | ')}`);
    else if (n.type === 'html') console.log(`  [${idx}] HTML card (${(n.html || '').length} chars): ${(n.html || '').slice(0, 120).replace(/\n/g, ' | ')}`);
    else if (n.type === 'image') console.log(`  [${idx}] IMAGE: ${(n.src || '').slice(0, 100)}`);
    else if (n.type === 'quote') console.log(`  [${idx}] QUOTE: ${textOf(n).slice(0, 120)}`);
    else if (n.type === 'extended-list') console.log(`  [${idx}] LIST (${n.children?.length} items): ${textOf(n).slice(0, 120)}`);
    else console.log(`  [${idx}] ${n.type}: ${textOf(n).slice(0, 120)}`);
  });

  // save the section nodes for the subpage build
  fs.writeFileSync('2026/backups/rtd-section-nodes.json', JSON.stringify(root.slice(start, end), null, 2));
  console.log('\nsaved section nodes to 2026/backups/rtd-section-nodes.json');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
