// Create the Amendment 81 subpage (Ghost post) with the yes/no color code injection.
// Dry-run by default; pass --push to create.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const GUIDE_URL = 'https://bouldercoloradovoterguide.com/election-guide/';
const SUMMARY_ID = 'colorado-voter-guide-2026-%25E2%2580%2594-november-3rd-2026-general-election-in-boulder-colorado';

const SPEC = {
  heading: 'Amendment 81 (CONSTITUTIONAL): NO / AGAINST',
  slug: 'amendment-81-constitutional-no-against-2026',
  title: 'Amendment 81 (CONSTITUTIONAL): NO / AGAINST (2026)',
  published_at: '2026-10-05T12:04:00.000Z',
  excerpt:
    'I am voting NO / AGAINST on Amendment 81, the law enforcement immigration notification measure, in the November 2026 election. Analysis, who put it on the ballot, and sources — part of the Boulder Colorado Voter Guide.',
  intro:
    'This page is part of my |GUIDE| for the November 3rd, 2026 General Election in Boulder, Colorado. It covers Amendment 81, a constitutional measure on law enforcement immigration notification — I recommend voting NO / AGAINST.',
};

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const link = (url, children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: null, target: null, title: null, url });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });
const EMPTY_PARA = para([]);
const BUTTON = { type: 'button', version: 1, buttonText: 'Read the Full 2026 Voter Guide', alignment: 'center', buttonUrl: `${GUIDE_URL.replace(/\/$/, '')}#${SUMMARY_ID}` };

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

  // slug collision guard
  const existing = [...(await api.posts.browse({ limit: 50 }).catch(() => [])), ...(await api.pages.browse({ limit: 50 }).catch(() => []))];
  if (existing.some((p) => p.slug === SPEC.slug)) { console.error(`ABORT: slug "${SPEC.slug}" exists`); process.exit(1); }

  // fresh guide read
  const guide = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  console.log('guide read | updated_at:', guide.updated_at);
  const doc = JSON.parse(guide.lexical);
  const root = doc.root.children;
  const headings = root.map((n, i) => [n, i]).filter(([n]) => n.type === 'extended-heading');

  const start = headings.find(([n]) => textOf(n) === SPEC.heading);
  if (!start) { console.error('ABORT: heading not found'); process.exit(1); }
  const startI = start[1];
  let endI = root.length;
  for (const [n, i] of headings) { if (i > startI && (n.tag === 'h2' || n.tag === 'h3')) { endI = i; break; } }
  const bodyNodes = root.slice(startI + 1, endI);
  console.log(`section nodes: [${startI + 1}, ${endI}) = ${bodyNodes.length}`);

  const body = [...bodyNodes];
  while (body.length && body[body.length - 1].type === 'paragraph' && (!body[body.length - 1].children || body[body.length - 1].children.length === 0)) body.pop();
  let promoted = 0;
  body.forEach((n) => { if (n.type === 'extended-heading' && n.tag === 'h4') { n.tag = 'h2'; promoted++; } });

  const intro = para([
    text('This page is part of my '),
    link(GUIDE_URL, [text('2026 Boulder Colorado Voter Guide', 1)]),
    text(SPEC.intro.replace('|GUIDE|', '')),
  ]);
  const children = [EMPTY_PARA, intro, ...body, BUTTON];
  const lexical = JSON.stringify({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } });

  console.log(`plan: ${children.length} nodes (empty para + intro + ${body.length} section nodes with ${promoted} h4->h2 + button)`);
  console.log('published_at:', SPEC.published_at);
  console.log('codeinjection_foot: copy guide foot verbatim (' + (guide.codeinjection_foot || '').length + ' chars)');

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to create.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/subpage-src-${SPEC.slug}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, JSON.stringify(bodyNodes, null, 2));

  const created = await saveWithRetry(() => api.posts.add({
    title: SPEC.title,
    slug: SPEC.slug,
    lexical,
    status: 'published',
    published_at: SPEC.published_at,
    custom_excerpt: SPEC.excerpt,
    feature_image: guide.feature_image,
    feature_image_alt: guide.feature_image_alt,
    feature_image_caption: guide.feature_image_caption,
    visibility: 'public',
    codeinjection_foot: guide.codeinjection_foot,
  }));
  console.log('created:', created.url, '| id:', created.id, '| published_at:', created.published_at, '| visibility:', created.visibility);
  console.log('codeinjection_foot set:', (created.codeinjection_foot || '').length, 'chars');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
