// Update the FAQ section "What ballot measure positions did Boulder Colorado Voter
// Guide support for the 2025 Boulder election?" -> 2026 positions from the summary card.
// Renders as a markdown card mirroring the guide's summary card (colored spans,
// bold-black NO POSITION / Option B), grouped by level.
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const SECTION_HEADING_OLD = 'What ballot measure positions did Boulder Colorado Voter Guide support for the 2025 Boulder election?';
const SECTION_HEADING_NEW = 'What ballot measure positions did Boulder Colorado Voter Guide support for the 2026 Boulder election?';

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });

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

  // --- build the FAQ markdown from the guide's summary card ---
  const guide = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  const gdoc = JSON.parse(guide.lexical);
  const gcard = gdoc.root.children.find((n) => n.type === 'markdown');
  const lines = gcard.markdown.split('\n');
  const startIdx = lines.findIndex((l) => l.includes('[State Ballot Measures]'));
  if (startIdx === -1) { console.error('ABORT: State Ballot Measures group not found in card'); process.exit(1); }

  const mdLines = [];
  let measureCount = 0;
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const isGroupHeader = /^\s*\*\s*\[([^\]]+)\]\(#[^)]+\)\s*$/.test(line);
    if (isGroupHeader) {
      const name = line.match(/\[([^\]]+)\]/)[1];
      if (mdLines.length) mdLines.push('');
      mdLines.push(`**${name}:**`);
      continue;
    }
    // measure line: strip the link, keep the rest
    const stripped = line.replace(/^\s*\*\s*/, '').replace(/\[([^\]]+)\]\(#[^)]+\)/, '$1');
    mdLines.push('* ' + stripped);
    measureCount++;
  }
  const markdown = mdLines.join('\n');
  console.log(`built markdown card: ${measureCount} measures, ${markdown.length} chars`);

  // --- apply to the FAQ page ---
  const page = await api.pages.read({ slug: 'election-guide-faq' }, { formats: 'lexical' });
  console.log('FAQ read | updated_at:', page.updated_at);
  const doc = JSON.parse(page.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  const idx = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === SECTION_HEADING_OLD);
  if (idx === -1) { console.error('ABORT: 2025 section heading not found'); process.exit(1); }
  let end = root.length;
  for (let i = idx + 1; i < root.length; i++) {
    if (root[i].type === 'extended-heading' && root[i].tag === 'h2') { end = i; break; }
  }
  console.log(`section at [${idx}]; replacing heading + ${end - idx - 1} content node(s)`);
  root.slice(idx, end).forEach((n, k) => console.log(`  [${idx + k}] ${n.type}: ${textOf(n).slice(0, 80)}`));

  // new nodes: updated H2, updated intro para, markdown card
  const newH2 = { children: [text(SECTION_HEADING_NEW)], direction: 'ltr', format: '', indent: 0, type: 'extended-heading', version: 1, tag: 'h2' };
  const newPara = para([text('Boulder Colorado Voter Guide took the following positions on ballot measures in the 2026 Boulder election:')]);
  const mdCard = { type: 'markdown', version: 1, markdown };

  if (!PUSH) {
    console.log('\n--- markdown card preview ---');
    console.log(markdown);
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/faq-pre-measure-positions-${STAMP}.json`, page.lexical);
  console.log('\nbackup written');

  root.splice(idx, end - idx, newH2, newPara, mdCard);
  const updated = await saveWithRetry(() => api.pages.edit({ id: page.id, updated_at: page.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
