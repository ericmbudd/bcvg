// Inspect inline formatting (bold/italic/underline) inside all headings of the live post.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical,html' });
  console.log('updated_at:', post.updated_at);
  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  // collect text nodes within a heading (recursive through links etc.)
  const textNodes = (n) => {
    const out = [];
    const walk = (v) => {
      if (Array.isArray(v)) return v.forEach(walk);
      if (!v || typeof v !== 'object') return;
      if (v.type === 'extended-text') out.push(v);
      Object.values(v).forEach(walk);
    };
    walk(n.children || []);
    return out;
  };

  const stats = { total: 0, bold: 0, italic: 0, underline: 0, mixed: 0, clean: 0, hasLink: 0 };
  const boldList = [];
  const otherList = [];

  root.forEach((n, i) => {
    if (n.type !== 'extended-heading') return;
    stats.total++;
    const tns = textNodes(n);
    const hasBold = tns.some((t) => (t.format & 1) === 1);
    const hasItalic = tns.some((t) => (t.format & 2) === 2);
    const hasUnderline = tns.some((t) => (t.format & 4) === 4);
    const hasLink = tns.length !== (n.children || []).length || (n.children || []).some((c) => c.type === 'link');
    if (hasLink) stats.hasLink++;
    if (hasBold) {
      stats.bold++;
      boldList.push([i, n.tag, textOf(n)]);
    } else if (hasItalic || hasUnderline) {
      stats.italic++;
      otherList.push([i, n.tag, textOf(n), { hasItalic, hasUnderline }]);
    } else {
      stats.clean++;
    }
  });

  console.log('\n=== heading format stats ===');
  console.log(JSON.stringify(stats, null, 2));
  console.log(`\n=== headings WITH bold (${boldList.length}) ===`);
  boldList.forEach(([i, tag, t]) => console.log(`[${i}] ${tag.toUpperCase()} | ${t.slice(0, 85)}`));
  if (otherList.length) {
    console.log(`\n=== headings with italic/underline (no bold) ===`);
    otherList.forEach(([i, tag, t, f]) => console.log(`[${i}] ${tag.toUpperCase()} | italic:${f.hasItalic} underline:${f.hasUnderline} | ${t.slice(0, 85)}`));
  }
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
