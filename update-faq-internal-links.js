// FAQ updates:
//   1. "supported candidates" section: append references paragraph linking the
//      council + mayoral subpages.
//   2. "measure positions" markdown card: link each measure to its subpage
//      (rebuilt from the summary card; slug = anchor + '-2026').
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const SITE = 'https://bouldercoloradovoterguide.com';

const COUNCIL_URL = SITE + '/city-of-boulder-council-candidates-2026/';
const MAYOR_URL = SITE + '/city-of-boulder-mayoral-candidates-2026/';

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const link = (url, children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: null, target: null, title: null, url });
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

  // --- build the linked measure markdown from the guide's summary card ---
  const guide = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  const gdoc = JSON.parse(guide.lexical);
  const gcard = gdoc.root.children.find((n) => n.type === 'markdown');
  const lines = gcard.markdown.split('\n');
  const startIdx = lines.findIndex((l) => l.includes('[State Ballot Measures]'));
  if (startIdx === -1) { console.error('ABORT: State Ballot Measures group not found'); process.exit(1); }
  const mdLines = [];
  let measureCount = 0;
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const groupM = line.match(/^\s*\*\s*\[([^\]]+)\]\(#[^)]+\)\s*$/);
    if (groupM) {
      if (mdLines.length) mdLines.push('');
      mdLines.push(`**${groupM[1]}:**`);
      continue;
    }
    const linked = line.replace(/^\s*\*\s*/, '').replace(/\[([^\]]+)\]\(#([^)]+)\)/, (mm, name, anchor) => `[${name}](${SITE}/${anchor}-2026/)`);
    mdLines.push('* ' + linked);
    measureCount++;
  }
  const markdown = mdLines.join('\n');
  console.log(`built linked markdown card: ${measureCount} measures`);
  const subpageLinks = (markdown.match(/https:\/\/bouldercoloradovoterguide\.com\/[a-z0-9-]+-2026\//g) || []).length;
  console.log('subpage links in card:', subpageLinks, '(expect ' + measureCount + ')');
  if (subpageLinks !== measureCount) { console.error('ABORT: link count mismatch'); process.exit(1); }

  // --- apply to FAQ ---
  const page = await api.pages.read({ slug: 'election-guide-faq' }, { formats: 'lexical' });
  console.log('FAQ read | updated_at:', page.updated_at);
  const doc = JSON.parse(page.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  // 1. supported-candidates section: append references paragraph after the list
  const supIdx = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === 'Which candidates did Boulder Colorado Voter Guide support for Boulder City Council?');
  if (supIdx === -1) { console.error('ABORT: supported-candidates section not found'); process.exit(1); }
  let supEnd = root.length;
  for (let i = supIdx + 1; i < root.length; i++) {
    if (root[i].type === 'extended-heading' && root[i].tag === 'h2') { supEnd = i; break; }
  }
  const refPara = para([
    text('Read the full analysis on my '),
    link(COUNCIL_URL, [text('Boulder City Council Candidates (2026)', 1)]),
    text(' page, and my mayoral recommendations on the '),
    link(MAYOR_URL, [text('Boulder Mayoral Candidates (2026)', 1)]),
    text(' page.'),
  ]);
  const lastIsRef = root[supEnd - 1].type === 'paragraph' && textOf(root[supEnd - 1]).startsWith('Read the full analysis on my');
  if (lastIsRef) {
    root[supEnd - 1] = refPara;
    console.log('supported-candidates: replaced existing references paragraph');
  } else {
    root.splice(supEnd, 0, refPara);
    console.log('supported-candidates: appended references paragraph at [' + supEnd + ']');
  }

  // 2. measure positions: replace the markdown card content
  const posIdx = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === 'What ballot measure positions did Boulder Colorado Voter Guide support for the 2026 Boulder election?');
  if (posIdx === -1) { console.error('ABORT: measure positions section not found'); process.exit(1); }
  let posEnd = root.length;
  for (let i = posIdx + 1; i < root.length; i++) {
    if (root[i].type === 'extended-heading' && root[i].tag === 'h2') { posEnd = i; break; }
  }
  const mdIdx = root.slice(posIdx, posEnd).findIndex((n) => n.type === 'markdown');
  if (mdIdx === -1) { console.error('ABORT: markdown card not found in positions section'); process.exit(1); }
  root[posIdx + mdIdx].markdown = markdown;
  console.log('measure positions: markdown card updated with subpage links');

  if (!PUSH) {
    console.log('\n--- references paragraph preview ---');
    console.log(textOf(refPara));
    console.log('\n--- linked card preview (first 6 lines) ---');
    mdLines.slice(0, 6).forEach((l) => console.log(l.slice(0, 160)));
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/faq-pre-internal-links-${STAMP}.json`, page.lexical);
  console.log('\nbackup written');

  const updated = await saveWithRetry(() => api.pages.edit({ id: page.id, updated_at: page.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
