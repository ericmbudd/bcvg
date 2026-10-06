// Batch-create subpages for all remaining STATE ballot measures + insert their actions cards.
// Reads position/description from the summary card; slug = anchor + '-2026'; staggered published_at.
// Dry-run by default; pass --push to create.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const GUIDE_URL = 'https://bouldercoloradovoterguide.com/election-guide/';
const SUMMARY_ID = 'colorado-voter-guide-2026-%25E2%2580%2594-november-3rd-2026-general-election-in-boulder-colorado';
const FIRST_MINUTE = 5; // Amendment 81 = 12:04; remaining measures start at 12:05

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const link = (url, children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: null, target: null, title: null, url });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });
const EMPTY_PARA = para([]);
const BUTTON = { type: 'button', version: 1, buttonText: 'Read the Full 2026 Voter Guide', alignment: 'center', buttonUrl: `${GUIDE_URL.replace(/\/$/, '')}#${SUMMARY_ID}` };

const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

function actionsHtml(url, shareTitle, label) {
  return `<div class="sg-section-actions" data-share-url="${url}" data-share-title="${shareTitle}">
<a class="sga-btn sga-link" href="${url}" title="${label}" aria-label="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></a>
<button class="sga-btn sga-share" type="button" aria-label="Share this section"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share</button>
<span class="sga-toast" role="status" aria-live="polite">Link copied</span>
</div>
<style>
.sg-section-actions{display:flex;align-items:center;gap:10px;margin:0.9em 0 1.5em}
.sg-section-actions .sga-btn{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 14px;border:0;border-radius:999px;background:#1e3a8a;color:#fff;font:inherit;font-size:.875rem;font-weight:600;line-height:1;cursor:pointer;text-decoration:none;box-shadow:0 1px 2px rgba(0,0,0,.15),0 2px 6px rgba(30,58,138,.25);transition:transform .15s ease,box-shadow .15s ease,background .15s ease}
.sg-section-actions .sga-btn:hover{background:#16295e;transform:translateY(-1px);box-shadow:0 2px 4px rgba(0,0,0,.18),0 4px 10px rgba(30,58,138,.3)}
.sg-section-actions .sga-btn:active{transform:translateY(0);box-shadow:0 1px 2px rgba(0,0,0,.15)}
.sg-section-actions .sga-btn:focus-visible{outline:2px solid #1e3a8a;outline-offset:2px}
.sg-section-actions .sga-link{padding:0 11px}
.sg-section-actions .sga-btn svg{width:15px;height:15px;flex:none}
.sg-section-actions .sga-toast{font-size:.8125rem;opacity:0;transition:opacity .2s ease}
.sg-section-actions .sga-toast.sga-show{opacity:.75}
</style>
<script>
(function(){
function copyText(t){
if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(t);}
return new Promise(function(res,rej){
try{var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy')?res():rej();document.body.removeChild(ta);}catch(e){rej(e);}
});
}
document.querySelectorAll('.sg-section-actions').forEach(function(w){
if(w.dataset.ready){return}
w.dataset.ready='1';
var btn=w.querySelector('.sga-share');
if(!btn){return}
var url=w.dataset.shareUrl,title=w.dataset.shareTitle,toast=w.querySelector('.sga-toast');
function copied(){if(toast){toast.classList.add('sga-show');setTimeout(function(){toast.classList.remove('sga-show');},2000);}}
btn.addEventListener('click',function(){
if(navigator.share){navigator.share({title:title,url:url}).catch(function(){});return;}
copyText(url).then(copied).catch(function(){window.prompt('Copy link:',url);});
});
});
})();
</script>`;
}

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

  // --- read guide (lexical + html) ---
  const guide = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical,html' });
  console.log('guide read | updated_at:', guide.updated_at);
  const doc = JSON.parse(guide.lexical);
  const root = doc.root.children;

  // map rendered heading id -> heading text
  const idToText = new Map();
  const re = /<h([1-6])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(guide.html)) !== null) idToText.set(m[2], m[3].replace(/<[^>]+>/g, '').trim());

  // parse state-measure lines from the summary card
  const card = root.find((n) => n.type === 'markdown');
  const lines = card.markdown.split('\n');
  const startIdx = lines.findIndex((l) => l.includes('[State Ballot Measures]'));
  const endIdx = lines.findIndex((l) => l.includes('[Boulder County Ballot Measures]'));
  const measureRe = /^\s*\*\s*\[([^\]]+)\]\(#([^)]+)\):\s*<span style="color:(#[0-9a-f]+);font-weight:700">([^<]+)<\/span>\s*\(([^)]+)\)/;
  const measures = [];
  for (let i = startIdx + 1; i < endIdx; i++) {
    const mm = lines[i].match(measureRe);
    if (mm) measures.push({ linkText: mm[1], anchor: mm[2], position: mm[4].trim(), description: mm[5].trim() });
  }
  console.log(`state measures parsed from card: ${measures.length}`);
  measures.forEach((x, i) => console.log(`  ${i}: ${x.anchor} | ${x.position} | ${x.description.slice(0, 50)}`));

  // existing slugs
  const existing = [...(await api.posts.browse({ limit: 50 }).catch(() => [])), ...(await api.pages.browse({ limit: 50 }).catch(() => []))];
  const taken = new Set(existing.map((p) => p.slug));

  const headings = root.map((n, i) => [n, i]).filter(([n]) => n.type === 'extended-heading');

  // --- phase 1: create subpages ---
  let minute = FIRST_MINUTE;
  const created = [];
  for (const meas of measures) {
    const slug = meas.anchor + '-2026';
    if (taken.has(slug)) { console.log(`skip (exists): ${slug}`); continue; }
    const headingText = idToText.get(meas.anchor);
    if (!headingText) { console.error(`ABORT: no heading text for anchor ${meas.anchor}`); process.exit(1); }

    const start = headings.find(([n]) => textOf(n) === headingText);
    if (!start) { console.error(`ABORT: heading "${headingText}" not found in lexical`); process.exit(1); }
    const startI = start[1];
    let endI = root.length;
    for (const [n, i] of headings) { if (i > startI && (n.tag === 'h2' || n.tag === 'h3')) { endI = i; break; } }
    const bodyNodes = root.slice(startI + 1, endI);

    const body = [...bodyNodes];
    while (body.length && body[body.length - 1].type === 'paragraph' && (!body[body.length - 1].children || body[body.length - 1].children.length === 0)) body.pop();
    let promoted = 0;
    body.forEach((n) => { if (n.type === 'extended-heading' && n.tag === 'h4') { n.tag = 'h2'; promoted++; } });

    const name = headingText.replace(/ \((CONSTITUTIONAL|STATUTORY)\):[\s\S]*$/, '');
    const type = /CONSTITUTIONAL/.test(headingText) ? 'constitutional' : 'statutory';
    const intro = para([
      text('This page is part of my '),
      link(GUIDE_URL, [text('2026 Boulder Colorado Voter Guide', 1)]),
      text(` for the November 3rd, 2026 General Election in Boulder, Colorado. It covers ${name}, a ${type} measure on ${meas.description} — I recommend voting ${meas.position}.`),
    ]);
    const excerpt = `I am voting ${meas.position} on ${name} (${meas.description}) in the November 2026 election. Analysis, who put it on the ballot, and sources — part of the Boulder Colorado Voter Guide.`;

    const children = [EMPTY_PARA, intro, ...body, BUTTON];
    const lexical = JSON.stringify({ root: { children, direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } });

    const published_at = `2026-10-05T12:${String(minute).padStart(2, '0')}:00.000Z`;
    minute++;

    console.log(`\n--- ${headingText} ---`);
    console.log(`slug: ${slug} | nodes: ${children.length} (h4->h2: ${promoted}) | ${published_at}`);

    if (!PUSH) continue;

    fs.writeFileSync(`2026/backups/subpage-src-${slug}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, JSON.stringify(bodyNodes, null, 2));
    const createdPost = await saveWithRetry(() => api.posts.add({
      title: headingText + ' (2026)',
      slug,
      lexical,
      status: 'published',
      published_at,
      custom_excerpt: excerpt,
      feature_image: guide.feature_image,
      feature_image_alt: guide.feature_image_alt,
      feature_image_caption: guide.feature_image_caption,
      visibility: 'public',
      codeinjection_foot: guide.codeinjection_foot,
    }));
    console.log('created:', createdPost.url);
    created.push({ ...meas, headingText, slug, url: createdPost.url });
  }

  if (!PUSH) {
    console.log(`\nDRY RUN — ${measures.length} measures planned. Re-run with --push to create.`);
    process.exit(0);
  }

  // --- phase 2: insert actions cards (fresh read to minimize conflict risk) ---
  console.log('\n=== phase 2: actions cards ===');
  const guide2 = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical,html' });
  const doc2 = JSON.parse(guide2.lexical);
  const root2 = doc2.root.children;
  const headings2 = root2.map((n, i) => [n, i]).filter(([n]) => n.type === 'extended-heading');

  const insertions = [];
  for (const meas of measures) {
    const headingText = idToText.get(meas.anchor);
    const found = headings2.find(([n]) => textOf(n) === headingText);
    if (!found) { console.error(`ABORT: heading "${headingText}" not found`); process.exit(1); }
    insertions.push({ idx: found[1], headingText, url: GUIDE_URL.replace(/\/$/, '') + '/' + meas.anchor + '-2026/' });
  }
  // insert from last to first so indices stay valid
  insertions.sort((a, b) => b.idx - a.idx);
  for (const ins of insertions) {
    const h = root2[ins.idx];
    if (h.children.length === 1 && h.children[0].type === 'link') h.children = h.children[0].children;
    const next = root2[ins.idx + 1];
    const name = ins.headingText.replace(/ \((CONSTITUTIONAL|STATUTORY)\):[\s\S]*$/, '');
    const card = { type: 'html', version: 1, html: actionsHtml(ins.url, `${name} — 2026 Boulder Colorado Voter Guide`, `${name} — 2026 voter guide`) };
    if (next && next.type === 'html' && (next.html || '').includes('sg-section-actions')) {
      root2[ins.idx + 1] = card;
      console.log(`[${ins.idx}] replaced card: ${name}`);
    } else {
      root2.splice(ins.idx + 1, 0, card);
      console.log(`[${ins.idx}] inserted card: ${name}`);
    }
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-b1-measures-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, guide2.lexical);
  const updated = await saveWithRetry(() => api.posts.edit({ id: guide2.id, updated_at: guide2.updated_at, lexical: JSON.stringify(doc2) }));
  console.log('guide saved | new updated_at:', updated.updated_at);

  // --- verify ---
  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  const doc3 = JSON.parse(updated.lexical);
  const card3 = doc3.root.children.find((n) => n.type === 'markdown');
  const anchors = (card3.markdown.match(/\]\(#[^)]+\)/g) || []).map((s) => s.slice(3, -1));
  const missing = anchors.filter((a) => !check.html.includes(`id="${a}"`));
  console.log(`\nverify: summary anchors ${anchors.length}, unresolved: ${missing.length}${missing.length ? ' -> ' + missing.join(', ') : ''}`);
  const missingCards = measures.filter((x) => !check.html.includes(`href="${GUIDE_URL.replace(/\/$/, '')}/${x.anchor}-2026/"`));
  console.log('actions cards missing:', missingCards.length ? missingCards.map((x) => x.anchor).join(', ') : 'none');
  if (missing.length || missingCards.length) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
