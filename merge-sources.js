// Surgical merge: replace only the "Additional Reporting, Commentary, and Sources" lists
// in the live post with the lists defined in 2026/sections-data.js, and insert the
// statewide-overview block after the "State Ballot Measures" h2 if missing. Everything
// else in the post (editor-authored content included) is left untouched.
// See 2026/UPDATE-METHODS.md.
//
// Usage: node merge-sources.js          (dry run - prints the plan)
//        node merge-sources.js --push   (apply and save to Ghost)
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');
const { findBySlug } = require('./src/ghost-content');
const SECTIONS = require('./2026/sections-data.js');

// Node factories matching update-sections.js so generated nodes stay native editor content.
const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const linebreak = () => ({ type: 'linebreak', version: 1 });
const link = (url, label) => ({ children: [text(label)], direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: 'noreferrer noopener', target: '_blank', title: null, url });
const listItem = (item, value) => {
  const children = [link(item.url, item.label)];
  if (item.tail) children.push(text(` — ${item.tail}`));
  return { children, direction: 'ltr', format: '', indent: 0, type: 'listitem', version: 1, value };
};
const list = (items) => ({ type: 'list', listType: 'bullet', tag: 'ul', start: 1, direction: 'ltr', format: '', indent: 0, version: 1, children: items.map(listItem) });
const heading = (tag, t) => ({ children: [text(t, tag === 'h4' ? 1 : 0)], direction: 'ltr', format: '', indent: 0, type: 'extended-heading', version: 1, tag });

const textOf = (n) => {
  const parts = [];
  const walk = (v) => {
    if (Array.isArray(v)) return v.forEach(walk);
    if (!v || typeof v !== 'object') return;
    if (typeof v.text === 'string') parts.push(v.text);
    Object.values(v).forEach(walk);
  };
  walk(n);
  return parts.join('');
};

const normKey = (t) => t.split(':')[0].trim();

// Map: normalized preceding-heading text -> sources items (from sections-data.js).
const sourcesByHeading = {};
{
  let lastHeading = '';
  for (const sec of SECTIONS) {
    if (sec.kind === 'h2' || sec.kind === 'h3' || sec.kind === 'h4') lastHeading = normKey(sec.text);
    if (sec.kind === 'sources') sourcesByHeading[lastHeading] = sec.items;
  }
}

const htmlByHeading = {};
{
  let lastHeading = '';
  for (const sec of SECTIONS) {
    if (sec.kind === 'h2' || sec.kind === 'h3' || sec.kind === 'h4') lastHeading = normKey(sec.text);
    if (sec.kind === 'html') htmlByHeading[lastHeading] = sec.html;
  }
}

(async () => {
  const push = process.argv.includes('--push');
  const api = createGhostAdminClient();
  const found = await findBySlug(api, 'election-guide');
  const { type, item } = found;
  console.log(`Loaded ${type} "${item.title}" (updated_at=${item.updated_at})`);

  const root = JSON.parse(item.lexical);
  const kids = root.root.children;

  let lastHeading = '';
  let lastH2 = '';
  let lastH3 = '';
  let pendingSources = false;
  let replaced = 0;
  let unmatched = [];
  let inserted = 0;
  const replacedKeys = new Set();

  for (let i = 0; i < kids.length; i++) {
    const node = kids[i];
    if (node.type === 'extended-heading') {
      const t = textOf(node);
      if (t.startsWith('Additional Reporting')) {
        pendingSources = true;
        continue;
      }
      lastHeading = normKey(t);
      if (node.tag === 'h2') lastH2 = lastHeading;
      if (node.tag === 'h3') lastH3 = lastHeading;
      pendingSources = false;
      continue;
    }
    if (pendingSources && node.type === 'list') {
      // The sources list belongs to the enclosing section; user-added sub-headings
      // (Position / Who put... / Short Description) may sit between, so fall back
      // from the immediate heading to the enclosing h3, then h2.
      const key = [lastHeading, lastH3, lastH2].find((k) => sourcesByHeading[k]);
      const items = key ? sourcesByHeading[key] : null;
      if (items) {
        console.log(`replace [${key}] (under "${lastHeading}"): ${node.children.length} items -> ${items.length} items`);
        kids[i] = list(items);
        replaced++;
        replacedKeys.add(key);
      } else {
        unmatched.push(lastHeading);
      }
      pendingSources = false;
    } else if (pendingSources) {
      pendingSources = false;
    }
  }

  // Insert brand-new sources blocks: sections-data.js entries whose heading has no
  // sources list in the post yet (e.g. offices getting sources for the first time).
  for (const [key, items] of Object.entries(sourcesByHeading)) {
    if (key === 'State Ballot Measures' || replacedKeys.has(key)) continue;
    const hIdx = kids.findIndex((c) => c.type === 'extended-heading' && normKey(textOf(c)) === key);
    if (hIdx < 0) { unmatched.push(`${key} (heading not found)`); continue; }
    let insertAt = kids.length;
    let existingSourcesHeading = false;
    for (let j = hIdx + 1; j < kids.length; j++) {
      const nn = kids[j];
      if (!nn) continue;
      if (nn.type === 'extended-heading') {
        if (textOf(nn).startsWith('Additional Reporting')) {
          // An editor-authored sources heading already exists here - fill it with the list
          // instead of adding a duplicate heading.
          existingSourcesHeading = true;
          insertAt = j + 1;
        } else {
          insertAt = j;
        }
        break;
      }
    }
    if (existingSourcesHeading) {
      kids.splice(insertAt, 0, list(items));
      inserted += 1;
      console.log(`inserted list under existing sources heading for [${key}] (${items.length} items)`);
    } else {
      kids.splice(insertAt, 0, heading('h4', 'Additional Reporting, Commentary, and Sources'), list(items));
      inserted += 2;
      console.log(`inserted new sources block for [${key}] (${items.length} items)`);
    }
  }

  // Insert html cards (e.g. lite YouTube embeds) keyed by their preceding heading,
  // placed just before the section's sources heading. Skipped if already present.
  for (const [key, html] of Object.entries(htmlByHeading)) {
    const marker = (html.match(/id="([^"]+)"/) || [])[1];
    if (marker && item.lexical.includes(marker)) {
      // Card already exists - update it in place if the html content changed.
      let updatedCard = false;
      const updateCard = (node) => {
        if (!node || typeof node !== 'object') return;
        if (node.type === 'html' && typeof node.html === 'string' && node.html.includes(marker) && node.html !== html) {
          node.html = html;
          updatedCard = true;
        }
        if (Array.isArray(node.children)) node.children.forEach(updateCard);
      };
      kids.forEach(updateCard);
      console.log(updatedCard ? `updated html card for [${key}]` : `html block for [${key}] already present - skipping`);
      continue;
    }
    const hIdx = kids.findIndex((c) => c.type === 'extended-heading' && normKey(textOf(c)) === key);
    if (hIdx < 0) { unmatched.push(`${key} (html heading not found)`); continue; }
    let insertAt = kids.length;
    for (let j = hIdx + 1; j < kids.length; j++) {
      const nn = kids[j];
      if (!nn) continue;
      if (nn.type === 'extended-heading') { insertAt = j; break; }
    }
    kids.splice(insertAt, 0, { type: 'html', html });
    inserted += 1;
    console.log(`inserted html block for [${key}]`);
  }

  // Insert the statewide-overview block after the "State Ballot Measures" h2 if not present.
  const h2Idx = kids.findIndex((c) => c.type === 'extended-heading' && c.tag === 'h2' && textOf(c) === 'State Ballot Measures');
  if (h2Idx >= 0 && !(kids[h2Idx + 1] && kids[h2Idx + 1].type === 'extended-heading' && textOf(kids[h2Idx + 1]).startsWith('Additional Reporting'))) {
    const general = sourcesByHeading['State Ballot Measures'];
    kids.splice(h2Idx + 1, 0, heading('h4', 'Additional Reporting, Commentary, and Sources'), list(general));
    inserted = 2;
    console.log(`inserted statewide-overview block (${general.length} items) after "State Ballot Measures" h2`);
  } else if (h2Idx >= 0) {
    console.log('statewide-overview block already present - skipping insert');
  }

  console.log(`\nSummary: ${replaced} source lists replaced, ${inserted} nodes inserted, ${kids.length} total nodes.`);
  if (unmatched.length) console.log('UNMATCHED source lists (left untouched):', unmatched.join(', '));

  if (!push) {
    console.log('\nDry run - nothing saved. Re-run with --push to apply.');
    return;
  }

  fs.mkdirSync('2026/backups', { recursive: true });
  fs.writeFileSync(`2026/backups/pre-merge-${Date.now()}.json`, item.lexical);

  // Ghost Admin edits of large Lexical payloads occasionally fail with transient TLS
  // errors ("bad record mac") - retry a few times before giving up.
  let updated = null;
  for (let attempt = 1; attempt <= 4 && !updated; attempt++) {
    try {
      updated = await api[type].edit({ id: item.id, updated_at: item.updated_at, lexical: JSON.stringify(root) });
    } catch (e) {
      console.error(`Save attempt ${attempt} failed: ${e.message}`);
      if (attempt < 4) await new Promise((r) => setTimeout(r, attempt * 4000));
      else throw e;
    }
  }
  console.log('Saved to Ghost.');
  console.log(`  Title:  ${updated.title}`);
  console.log(`  Editor: ${process.env.GHOST_URL}/ghost/#/${type}/${updated.id}`);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
