// Insert the 🔗+Share actions card after the Amendment 81 heading.
// Idempotent; dry-run by default; pass --push to apply.
require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./src/ghost-client');

const PUSH = process.argv.includes('--push');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');

const HEADING = 'Amendment 81 (CONSTITUTIONAL): NO / AGAINST';
const URL_ = 'https://bouldercoloradovoterguide.com/amendment-81-constitutional-no-against-2026/';
const SHARE_TITLE = 'Amendment 81 — 2026 Boulder Colorado Voter Guide';
const LABEL = 'Amendment 81 — 2026 voter guide';

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
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical,html' });
  console.log('guide read | updated_at:', post.updated_at);

  const doc = JSON.parse(post.lexical);
  const root = doc.root.children;
  const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

  const idx = root.findIndex((n) => n.type === 'extended-heading' && textOf(n) === HEADING);
  if (idx === -1) { console.error('ABORT: heading not found'); process.exit(1); }
  const h = root[idx];
  if (h.children.length === 1 && h.children[0].type === 'link') {
    h.children = h.children[0].children;
    console.log('unwrapped heading link');
  }
  const next = root[idx + 1];
  const card = { type: 'html', version: 1, html: actionsHtml(URL_, SHARE_TITLE, LABEL) };
  if (next && next.type === 'html' && (next.html || '').includes('sg-section-actions')) {
    root[idx + 1] = card;
    console.log(`[${idx}] replaced existing actions card`);
  } else {
    root.splice(idx + 1, 0, card);
    console.log(`[${idx}] inserted actions card -> ${URL_}`);
  }

  if (!PUSH) {
    console.log('\nDRY RUN — re-run with --push to apply.');
    process.exit(0);
  }

  fs.writeFileSync(`2026/backups/election-guide-pre-b1-amendment-81-${STAMP}.json`, post.lexical);
  console.log('\nbackup written');

  const updated = await saveWithRetry(() => api.posts.edit({ id: post.id, updated_at: post.updated_at, lexical: JSON.stringify(doc) }));
  console.log('saved | new updated_at:', updated.updated_at);

  const check = await api.posts.read({ slug: 'election-guide' }, { formats: 'html' });
  console.log('verify: card link present:', check.html.includes(`href="${URL_}"`) ? 'YES' : 'NO');
  const doc2 = JSON.parse(updated.lexical);
  const card2 = doc2.root.children.find((n) => n.type === 'markdown');
  const anchors = (card2.markdown.match(/\]\(#[^)]+\)/g) || []).map((s) => s.slice(3, -1));
  const missing = anchors.filter((a) => !check.html.includes(`id="${a}"`));
  console.log(`summary anchors: ${anchors.length}, unresolved: ${missing.length}`);
  if (missing.length) process.exit(1);
  console.log('\nALL CHECKS PASSED');
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
