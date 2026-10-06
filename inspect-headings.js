// Inspect heading hierarchy of the main guide.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical,html' });
  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  // summary card anchor targets
  const card = root.find((n) => n.type === 'markdown');
  const anchors = new Set();
  (card.markdown.match(/\]\(#[^)]+\)/g) || []).forEach((m) => anchors.add(m.slice(3, -1)));
  console.log('summary anchors:', anchors.size);

  // rendered heading ids -> text (for id verification)
  const html = post.html;
  const re = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/gi;
  const rendered = [];
  let m;
  while ((m = re.exec(html)) !== null) rendered.push({ tag: 'h' + m[1], id: m[2], text: m[3].replace(/<[^>]+>/g, '').trim() });

  // lexical headings
  console.log('\n=== lexical headings (index | tag | is-summary-anchor | text) ===');
  const counts = {};
  root.forEach((n, i) => {
    if (n.type === 'extended-heading') {
      const t = textOf(n);
      counts[n.tag] = (counts[n.tag] || 0) + 1;
      const isAnchor = anchors.has(t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
      console.log(`[${i}] ${n.tag} ${isAnchor ? 'ANCHOR' : '      '} | ${t.slice(0, 90)}`);
    }
  });
  console.log('\ntag counts:', JSON.stringify(counts));

  // cross-check: rendered ids not matching simple slug of text (position suffixes etc.)
  console.log('\n=== rendered headings whose id != simple-slug(text) ===');
  rendered.forEach((r) => {
    const simple = r.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (r.id !== simple) console.log(`${r.tag} id="${r.id}" simple="${simple}" :: ${r.text.slice(0, 60)}`);
  });

  // h4 texts that are NOT summary anchors (candidate sub-headers)
  console.log('\n=== h4 texts NOT in summary anchors (would stay h4) ===');
  const seen = new Set();
  root.forEach((n) => {
    if (n.type === 'extended-heading' && n.tag === 'h4') {
      const t = textOf(n);
      const simple = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (!anchors.has(simple) && !seen.has(t)) { seen.add(t); console.log('  ' + t.slice(0, 90)); }
    }
  });
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
