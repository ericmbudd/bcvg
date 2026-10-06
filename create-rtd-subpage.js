// Create the RTD District O subpage (first of the 2026 subpages).
// Dry-run by default; pass --push to create.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');

const SECTION_HEADING_ID = 'regional-transportation-district-directordistrict-o';
const SLUG = SECTION_HEADING_ID + '-2026';
const TITLE = 'Regional Transportation District Director - District O (2026)';
const PUBLISHED_AT = '2026-10-05T12:01:00.000Z'; // guide published_at + 1 minute
const GUIDE_URL = 'https://bouldercoloradovoterguide.com/election-guide/';
const BACK_URL = 'https://bouldercoloradovoterguide.com/election-guide#' + SECTION_HEADING_ID;

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const link = (url, children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: null, target: null, title: null, url });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });

(async () => {
  const api = createGhostAdminClient();

  // guard: slug must not already exist
  const existing = await api.pages.browse({ limit: 50 }).catch(() => []);
  if (existing.some((p) => p.slug === SLUG)) {
    console.error(`ABORT: page with slug "${SLUG}" already exists`);
    process.exit(1);
  }

  // carry over the RTD section nodes from the backup taken from the live post
  const section = JSON.parse(require('fs').readFileSync('2026/backups/rtd-section-nodes.json', 'utf8'));
  // section[0] is the H4 title (becomes the page title) and the last node is an empty paragraph — drop both
  const body = section.slice(1, -1);

  const intro = para([
    text('This page is part of my '),
    link(GUIDE_URL, [text('2026 Boulder Colorado Voter Guide', 1)]),
    text(' for the November 3rd, 2026 General Election in Boulder, Colorado. It covers the Regional Transportation District (RTD) Board of Directors race for District O — the director seat representing Boulder and nearby communities on the board that oversees Denver-area transit service, fares, and long-term planning.'),
  ]);

  const button = {
    type: 'button',
    version: 1,
    buttonText: 'Read the Full 2026 Voter Guide',
    alignment: 'center',
    buttonUrl: BACK_URL,
  };

  const lexical = JSON.stringify({
    root: { children: [intro, ...body, button], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 },
  });

  // reuse the main guide's feature image for consistent social cards
  const guide = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  const feature_image = guide.feature_image || undefined;

  const excerpt =
    'I am supporting Jack Rosenthal for RTD Director - District O in the November 2026 election. My analysis, the RTD District O candidate forum video, and sources for the RTD Board of Directors race in Boulder County.';

  const page = {
    title: TITLE,
    slug: SLUG,
    lexical,
    status: 'published',
    published_at: PUBLISHED_AT,
    excerpt,
    feature_image,
  };

  console.log('=== plan (dry-run) ===');
  console.log('type: page');
  console.log('title:', page.title);
  console.log('slug:', page.slug);
  console.log('published_at:', page.published_at);
  console.log('feature_image:', feature_image || '(none)');
  console.log('excerpt:', excerpt);
  console.log('nodes:', [intro, ...body, button].length, '(intro + ' + body.length + ' section nodes + button)');
  console.log('button ->', BACK_URL);
  console.log('guide published_at:', guide.published_at, '| guide updated_at:', guide.updated_at);

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to create.');
    process.exit(0);
  }

  console.log('\ncreating page...');
  // NOTE: Ghost 6 rejects ?source=lexical (AllowedValues validation) — it auto-detects the lexical field
  const created = await api.pages.add(page);
  console.log('created:', created.url, '| id:', created.id, '| published_at:', created.published_at);
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
