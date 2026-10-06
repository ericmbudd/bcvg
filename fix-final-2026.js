// Final 2026 fixes:
//   1. FAQ intro: "2025 election" -> "2026 election"
//   2. Main guide voting reminder: Election Day date 2025 -> 2026 (+ mail-by date)
// Dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

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

  // --- fix 1: FAQ intro ---
  console.log('=== FAQ: What is BCVG intro ===');
  const faq = await api.pages.read({ slug: 'election-guide-faq' }, { formats: 'lexical' });
  const fdoc = JSON.parse(faq.lexical);
  const fpara = fdoc.root.children[1];
  const ftext = textOf(fpara);
  if (!ftext.includes('2025 election')) {
    if (ftext.includes('2026 election')) console.log('already fixed — skipping');
    else { console.error('ABORT: unexpected FAQ intro text'); process.exit(1); }
  } else {
    const newFtext = ftext.replace('for the 2025 election in Boulder, Colorado', 'for the 2026 election in Boulder, Colorado');
    fpara.children = [{ detail: 0, format: 0, mode: 'normal', style: '', text: newFtext, type: 'extended-text', version: 1 }];
    console.log('plan: 2025 -> 2026 in FAQ intro');
    if (PUSH) {
      fs.writeFileSync(`2026/backups/faq-pre-intro-2026-${STAMP}.json`, faq.lexical);
      const u = await saveWithRetry(() => api.pages.edit({ id: faq.id, updated_at: faq.updated_at, lexical: JSON.stringify(fdoc) }));
      console.log('saved | new updated_at:', u.updated_at);
    }
  }

  // --- fix 2: main guide voting reminder ---
  console.log('\n=== main guide: voting reminder ===');
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  const gdoc = JSON.parse(post.lexical);
  const root = gdoc.root.children;
  const node = root.find((n) => n.type === 'paragraph' && textOf(n).includes('Election Day, Tuesday November 4th, 2025'));
  if (!node) {
    const already = root.find((n) => n.type === 'paragraph' && textOf(n).includes('Election Day, Tuesday November 3rd, 2026'));
    if (already) console.log('already fixed — skipping');
    else { console.error('ABORT: voting reminder node not found'); process.exit(1); }
  } else {
    const old = textOf(node);
    console.log('old:', old);
    const newT = old
      .replace('October 27th', 'October 26th')
      .replace('Tuesday November 4th, 2025', 'Tuesday November 3rd, 2026');
    console.log('new:', newT);
    node.children = [{ detail: 0, format: 0, mode: 'normal', style: '', text: newT, type: 'extended-text', version: 1 }];
    if (PUSH) {
      fs.writeFileSync(`2026/backups/election-guide-pre-voting-reminder-${STAMP}.json`, post.lexical);
      const u = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(gdoc) }));
      console.log('saved | new updated_at:', u.updated_at);
    }
  }

  if (!PUSH) console.log('\nDRY RUN — re-run with --push to apply.');
  else console.log('\nDONE');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
