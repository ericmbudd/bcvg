// Create the Mayoral + Council subpages (Ghost posts).
// Feature image = each section's endorsement comparison graphic (alt + caption carried over).
// Body: leading empty para + SEO intro + section content (h4 -> h2) + back-button.
// Dry-run by default; pass --push to create.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const GUIDE_URL = 'https://bouldercoloradovoterguide.com/election-guide/';

const SUBPAGES = [
  {
    heading: 'City of Boulder Mayoral Candidates',
    slug: 'city-of-boulder-mayoral-candidates-2026',
    title: 'City of Boulder Mayoral Candidates (2026)',
    published_at: '2026-10-05T12:02:00.000Z',
    anchor: 'city-of-boulder-mayoral-candidates',
    excerpt:
      'My 2026 Boulder mayoral recommendations: I am ranking Aaron Brockett first and Taishya Adams second. Candidate profiles, endorsement comparisons, and analysis for the November 2026 election — part of the Boulder Colorado Voter Guide.',
    intro:
      'This page is part of my |GUIDE| for the November 3rd, 2026 General Election in Boulder, Colorado. It covers the Boulder mayoral race — my ranked choice voting recommendations, candidate profiles, endorsement comparisons, and analysis of the biggest challenges facing the next mayor and city council.',
    imageAfterHeading: "Comparing endorsements in Boulder's mayoral race",
  },
  {
    heading: 'City of Boulder Council Candidates',
    slug: 'city-of-boulder-council-candidates-2026',
    title: 'City of Boulder Council Candidates (2026)',
    published_at: '2026-10-05T12:03:00.000Z',
    anchor: 'city-of-boulder-council-candidates',
    excerpt:
      'I am voting for Ryan Schuchard, Jamillah Richmond, Sam Fuqua, Jill Adler Grano, and Tina Marquis for Boulder City Council in November 2026. Profiles, other candidates to consider, endorsement comparisons, and sources — part of the Boulder Colorado Voter Guide.',
    intro:
      'This page is part of my |GUIDE| for the November 3rd, 2026 General Election in Boulder, Colorado. It covers the Boulder City Council race: the five candidates I am voting for, candidate profiles, other candidates to consider, endorsement comparisons, and additional reporting and sources.',
    imageAfterHeading: "Comparing endorsements in Boulder's city council race",
  },
];

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const link = (url, children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: null, target: null, title: null, url });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });
const EMPTY_PARA = para([]);
const BUTTON = (anchor) => ({ type: 'button', version: 1, buttonText: 'Read the Full 2026 Voter Guide', alignment: 'center', buttonUrl: `${GUIDE_URL.replace(/\/$/, '')}#${anchor}` });

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
  const existingPosts = await api.posts.browse({ limit: 50 }).catch(() => []);
  const existingPages = await api.pages.browse({ limit: 50 }).catch(() => []);
  const taken = new Set([...existingPosts, ...existingPages].map((p) => p.slug));

  // fresh read of the guide
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  console.log('guide read | updated_at:', post.updated_at);
  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;

  const headingIdx = root.map((n, i) => [n, i]).filter(([n]) => n.type === 'extended-heading');

  for (const spec of SUBPAGES) {
    console.log(`\n=== ${spec.title} ===`);
    if (taken.has(spec.slug)) { console.error(`ABORT: slug "${spec.slug}" already exists`); process.exit(1); }

    const start = headingIdx.find(([n]) => textOf(n) === spec.heading);
    if (!start) { console.error(`ABORT: heading "${spec.heading}" not found`); process.exit(1); }
    const startI = start[1];
    // section ends at the next h2/h3 heading
    let endI = root.length;
    for (const [n, i] of headingIdx) {
      if (i > startI && (n.tag === 'h2' || n.tag === 'h3')) { endI = i; break; }
    }
    const bodyNodes = root.slice(startI + 1, endI);
    console.log(`section nodes: [${startI + 1}, ${endI}) = ${bodyNodes.length}`);

    // find the endorsement graphic (first image after the given h4 heading within the section)
    const cmpIdx = bodyNodes.findIndex((n) => n.type === 'extended-heading' && textOf(n) === spec.imageAfterHeading);
    const imgNode = cmpIdx >= 0 ? bodyNodes.slice(cmpIdx).find((n) => n.type === 'image') : null;
    if (!imgNode) { console.error(`ABORT: endorsement graphic not found after "${spec.imageAfterHeading}"`); process.exit(1); }
    console.log('feature image:', imgNode.src);
    console.log('alt:', JSON.stringify(imgNode.alt));
    console.log('caption:', JSON.stringify((imgNode.caption || '').slice(0, 90)));

    // build body: drop trailing empty para; promote h4 -> h2
    const body = [...bodyNodes];
    while (body.length && body[body.length - 1].type === 'paragraph' && (!body[body.length - 1].children || body[body.length - 1].children.length === 0)) body.pop();
    let promoted = 0;
    body.forEach((n) => { if (n.type === 'extended-heading' && n.tag === 'h4') { n.tag = 'h2'; promoted++; } });

    const introText = spec.intro.replace('|GUIDE|', '');
    const intro = para([
      text('This page is part of my '),
      link(GUIDE_URL, [text('2026 Boulder Colorado Voter Guide', 1)]),
      text(introText),
    ]);

    const children = [EMPTY_PARA, intro, ...body, BUTTON(spec.anchor)];
    const lexical = JSON.stringify({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } });

    console.log(`plan: ${children.length} nodes (empty para + intro + ${body.length} section nodes with ${promoted} h4->h2 + button)`);
    console.log('published_at:', spec.published_at, '| excerpt set:', !!spec.excerpt);

    if (!PUSH) continue;

    fs.mkdirSync('2026/backups', { recursive: true });
    fs.writeFileSync(`2026/backups/subpage-src-${spec.slug}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, JSON.stringify(bodyNodes, null, 2));

    const created = await saveWithRetry(() => api.posts.add({
      title: spec.title,
      slug: spec.slug,
      lexical,
      status: 'published',
      published_at: spec.published_at,
      custom_excerpt: spec.excerpt,
      feature_image: imgNode.src,
      feature_image_alt: imgNode.alt || undefined,
      feature_image_caption: imgNode.caption || undefined,
      visibility: 'public',
    }));
    console.log('created:', created.url, '| id:', created.id, '| published_at:', created.published_at, '| visibility:', created.visibility);
  }

  if (!PUSH) console.log('\nDRY RUN — re-run with --push to create.');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
