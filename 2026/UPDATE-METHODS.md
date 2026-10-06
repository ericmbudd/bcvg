# 2026 Guide — Update Methodologies

Notes on how to update the 2026 voter guide safely: where content lives, which tools
to use, the link format rules, research techniques that work, and how to recover from
mistakes. Read this before touching the Ghost post.

---

## Source of truth

**The Ghost post is the source of truth for content structure.**
`2026/sections-data.js` is a *build file*, not a mirror of the live post.

- The live post (slug `election-guide`) contains editor-authored blocks that are
  **not** in `sections-data.js`: per-measure `Position: …`, `Who put the measure on the
  ballot?`, and `Short Description:` headings/prose, position suffixes in measure
  headings (e.g. `Amendment 81 (CONSTITUTIONAL): NO / AGAINST`), `Analysis and
  Commentary:` stubs, and renamed section headings (`Colorado Offices`,
  `Boulder County Offices`).
- Consequence: **do not run `npm run update-sections` casually.** It replaces every
  node between the summary (markdown) card and the closing "Thank you" heading with
  what is in `sections-data.js` — anything added directly in the Ghost editor inside
  that range is deleted. (It now writes a backup first — see Backups — but deletion is
  still the default behavior.)

---

## The two update paths

### 1. Surgical sources update — `node merge-sources.js` (preferred)

Replaces **only** the "Additional Reporting, Commentary, and Sources" lists in the live
post with the lists defined in `2026/sections-data.js`, and inserts the
statewide-overview block after the `State Ballot Measures` h2 if it is missing.
Everything else in the post is untouched.

```bash
node merge-sources.js          # dry run: prints what would change
node merge-sources.js --push   # apply (saves a pre-merge backup first)
```

- Matching: each sources list is keyed by its enclosing heading. User-added sub-headings
  (Position / Who put… / Short Description) between the measure heading and the list are
  handled — the matcher falls back from the immediate heading to the enclosing h3, then h2.
- Lists with no matching key are left untouched and reported as `UNMATCHED` — check the
  output before pushing.
- **New in sections-data.js are inserted too:** a `sources` block whose heading has no
  list in the post yet is added automatically (heading + list, or just the list if an
  editor-authored "Additional Reporting" heading already exists there).
- **HTML cards** (`kind: 'html'`, e.g. lite YouTube embeds) are inserted before their
  section's sources heading, keyed by the enclosing heading and idempotent via the
  card's element `id` (re-runs skip if the id is already in the post).

### 2. Full rebuild — `npm run update-sections` (destructive)

Only use when `sections-data.js` fully mirrors the intended post structure (i.e. after
syncing it with the live post — see Syncing below). Always:

1. `npm run update-sections -- --dry-run` and review the section outline.
2. Check the backup it writes (`2026/backups/pre-update-…json`) exists after the run.
3. Diff the backup against the new content if anything looks off.

---

## Editing sources links

Sources live in `2026/sections-data.js` as blocks of:

```js
{ kind: 'sources', items: [
  { label: 'Article title', url: 'https://…', tail: 'Outlet' },
  { label: 'Article title', url: 'https://…', tail: 'Outlet (opinion)' },
  { label: 'Description of non-article resource', url: '#', tail: 'Publishing org (official)' }
] }
```

Rendered as: `[label](url) — tail`

**Format rules**

- `label` = the article name. For non-article resources (official pages, bills,
  calendars) use a short description. **Never put the publication name in the label.**
- `tail` = the publication / source name, rendered after the link as `— Source`.
  Opinion pieces append `(opinion)`. Official resources append `(official)`.
- Order within every list: **official/reference items first, then news, then opinion.**
- Only use **verified URLs** — fetched, with title/topic/date matching. Never guess URL
  patterns. Unresolved entries keep `url: '#'` (they render as inert links; see Status).

Example lines as they render in the guide:

```
Amendment 81: Requires local law enforcement to communicate with ICE — CPR News
'No' on Amendment 81 and 82; Taishya Adams has conviction; stand with Boulder (Letters) — Daily Camera (opinion)
2026 Blue Book analysis — Colorado Legislative Council (official)
```

---

## Subpages (per-section pages)

The guide is being split into per-section subpages so each race/measure gets a
shareable, SEO-targetable URL. Subpages contain the **same content** as the main
guide's section — they add no new information. Framing is therefore "standalone /
shareable page," never "read more."

### Which sections get a subpage

- **Yes:** every section with real content — all ballot measures (state, county,
  City of Boulder, Front Range Passenger Rail), RTD District O, and content-rich
  office sections (mayoral, council candidates).
- **No:** federal/state/county offices that only carry a recommendation plus a
  sources list (no additional commentary).

### Slug rule

Slug = section title, **properly hyphenated**, + `-2026`.

- Heading "Regional Transportation District Director - District O" →
  `regional-transportation-district-director-district-o-2026`.
- **Do not derive the slug from the Ghost heading anchor id.** Ghost's slugifier drops
  hyphens in odd places (that heading's anchor id is
  `regional-transportation-district-directordistrict-o` — no hyphen before the second
  "district"). Slugs use normal hyphenation; anchors keep Ghost's generated id.

### Subpage spec (Ghost post — not a page)

| Field | Value |
|---|---|
| type | **post** (see gotchas — in-place page→post conversion is not possible) |
| visibility | **`public`** — the Admin API defaults new posts to `members`, which hides all body content behind a subscribe CTA |
| custom_excerpt | set explicitly; the `excerpt` field is computed/read-only and silently ignored on create |
| feature_image | copied from the main guide |
| feature_image_alt / feature_image_caption | copied from the main guide (caption renders under the header image) |
| codeinjection_foot | **ballot-measure subpages: copy the main guide's `codeinjection_foot` verbatim** — see Code injection below |
| published_at | staggered **+1 minute** per subpage in guide order; first = guide's `published_at` + 1 min (`2026-10-05T12:01:00.000Z`) |

Body structure, in order:

1. **Leading empty paragraph** — required; without it the feature-image caption
   overflows into the first paragraph of body text.
2. **SEO intro paragraph** — short race context that links back to the full guide
   (`https://bouldercoloradovoterguide.com/election-guide/`).
3. **Section content carried over verbatim** from the main guide (paragraphs, embed
   cards, sources list) — minus the section's own heading (the page title covers it)
   and any trailing empty paragraph.
4. **Button card** at the bottom: "Read the Full 2026 Voter Guide" → the main guide's
   **summary section**, not the section anchor. The summary h2 ("Colorado Voter Guide
   2026 — November 3rd, 2026 General Election in Boulder, Colorado") has a
   Ghost-generated id that **literally contains `%E2%80%94`** (Ghost percent-encodes
   the em-dash inside the id attribute). Browsers percent-decode URL fragments before
   matching ids, so a fragment written as `%E2%80%94` decodes to a real em-dash and
   never matches — the link silently fails and the page loads at the top. **The
   fragment must be double-encoded** (`%25E2%2580%2594` → decodes once to
   `%E2%80%94` → matches the literal id):

   ```
   https://bouldercoloradovoterguide.com/election-guide#colorado-voter-guide-2026-%25E2%2580%2594-november-3rd-2026-general-election-in-boulder-colorado
   ```

   (Alternative if this ever gets messy: rename the h2 to avoid the em-dash — its id
   would then be plain ASCII. Avoid linking any heading whose id contains `%XX`
   sequences without double-encoding.)
5. Carried-over sub-headers (h4 on the main guide) should become **h2** on the
   subpage, since the post title is the h1 there. Not yet applied to the RTD subpage —
   handle in the batch.

### Code injection (ballot-measure subpages)

Measure sections reference YES / FOR and NO / AGAINST in body text; the coloring
comes from the main guide's **site-post code injection**, which does not carry over
to new posts automatically. Any subpage whose section contains YES/FOR or NO/AGAINST
text (all ballot measures; candidate sections that discuss positions) must set its
own `codeinjection_foot` — **copy the main guide's `codeinjection_foot` verbatim**.
It contains exactly the generic pieces:

- `scroll-behavior: smooth` style (anchor jumps animate)
- `.pos-yes` (`#1e3a8a`) / `.pos-no` (`#b91c1c`) styles
- the TreeWalker script that wraps YES / FOR and NO / AGAINST text nodes in those
  classes (idempotent via a `posColored` guard; skips text already inside colored
  spans, so it never doubles the summary card's inline spans). **Scope note:** the
  script walks `document.body`, not `.gh-content` — Ghost renders the post title and
  custom excerpt *outside* `.gh-content`, so a content-scoped script would leave the
  title/subheader uncolored (fixed 2026-10-06). The built-in filters (skip
  script/style nodes, skip spans already carrying `pos-` classes or inline `color:`)
  make body-wide walking safe.
- the **anchor re-scroll helper** (added 2026-10-06): on pages loaded with a
  `#fragment`, re-scrolls to the target after `window.load` (+1s fallback) with
  `scrollIntoView({behavior:'instant'})`. Needed because the browser's initial
  fragment scroll races image loading on this long page — images without reserved
  space shift the layout after the jump, so deep anchors (e.g. Proposition 137)
  landed in the wrong place on some devices/browsers while shallow ones worked. The
  helper decodes the hash once, so the double-encoded em-dash id still matches.

**Do not copy `codeinjection_head`** — it holds guide-specific pieces (LD+JSON
article schema, meta itemprop dates, the lite-youtube loader). Subpages get Ghost's
auto-generated meta/schema; only copy head code if the section actually embeds a
YouTube video (then just the lite-youtube `<script>` line).

Reference: `create-amendment-81-subpage.js` (first measure subpage, created with the
foot injection).

### Main guide changes per subpage

1. **Summary-card anchor stays.** The markdown summary card keeps linking to the
   in-page anchor (`#…`). Do not repoint it at the subpage URL.
2. **Section heading stays unlinked.** Do not wrap heading text in a link (tried once;
   reverted).
3. **Insert the actions HTML card** immediately after the section heading. Idempotent —
   re-runs replace the existing card. It contains:
   - **🔗 permalink button** — a real `<a href="subpage-url">` (this is the SEO
     internal link), labeled via `aria-label` + `title` = "<Section> — 2026 voter
     guide". Icon-only anchors are acceptable for SEO when labeled this way.
     **`SUBPAGE_URL` is always at the site root** —
     `https://bouldercoloradovoterguide.com/{slug}-2026/` — **never** under
     `/election-guide/`. (A batch script once concatenated the guide URL with the
     slug, producing `/election-guide/amendment-82-…-2026/` 404s on all 14 measure
     cards — fixed 2026-10-06. The same wrong URL must not go in `data-share-url`,
     or the Share button shares the broken link.)
   - **Share button** — Web Share API (`navigator.share`) with clipboard-copy fallback
     and a "Link copied" toast for browsers without share support.
   - **Styling:** filled pills in the guide blue `#1e3a8a`, white text, subtle shadow,
     hover lift, `:focus-visible` ring, `margin: 0.9em 0 1.5em` (keeps clear of the
     heading). Uses `currentColor`-safe solid fills so it works in dark mode.
   - Per-section data rides in `data-share-url` / `data-share-title` attributes.
   - Reference implementation: `implement-b1-rtd.js` (RTD section; the batch templates
     it per section).

   Card template (swap `SUBPAGE_URL` and the two `SECTION — 2026 voter guide` labels;
   everything else is identical for every section):

   ```html
   <div class="sg-section-actions" data-share-url="SUBPAGE_URL" data-share-title="SECTION — 2026 Boulder Colorado Voter Guide">
   <a class="sga-btn sga-link" href="SUBPAGE_URL" title="SECTION — 2026 voter guide" aria-label="SECTION — 2026 voter guide"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></a>
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
   </script>
   ```

   Behavior notes: the script is idempotent per card (`data-ready` guard) and handles
   multiple cards on one page; Share opens the native share sheet where
   `navigator.share` exists (mobile Safari/Chrome, desktop Chrome/Edge/Safari) and
   falls back to clipboard + toast elsewhere; the toast needs no positioning (it sits
   inline after the buttons).

### Heading hierarchy conventions (guide-wide)

- **h2** = top-level groups (Federal, State & County Candidates; City of Boulder
  Offices; State Ballot Measures; …).
- **h3** = sub-groups (Federal Offices; City of Boulder Mayoral Candidates) **and**
  every race/measure/office unit (Amendment 81; RTD District O; Secretary of State).
- **h4** = everything inside a unit: Position / Who put… / Short Description /
  Analysis and Commentary / Additional Reporting…, and candidate names within a race.
- **No h5/h6.** Candidate names are leaf headers (nothing nests beneath them), so they
  stay h4 even though they are "candidate headers" — promoting them to h3 made them
  siblings of their race and, in the council section, put children above their parent
  grouping ("Other candidates you may consider").
- **No inline formatting in headings** (no bold/italic). The tag + theme control
  emphasis; 62 headings had stray bold, normalized 2026-10-05.
- Heading ids are generated from heading **text**, not tag — retagging h4→h3 does not
  break summary-card anchors. Renaming heading text does (then run
  `node card-fix.js --push`).

### Ghost API gotchas (learned building the RTD subpage)

- **Never pass `?source=lexical` on create** — Ghost 6 rejects it ("Validation
  (AllowedValues) failed for source"). `api.posts.add(page)` auto-detects the
  `lexical` field.
- **`visibility` defaults to `members`** on API-created posts → anonymous visitors see
  the title but the body is replaced by a subscribe CTA. Always set
  `visibility: 'public'`.
- **`excerpt` is ignored on create** — set `custom_excerpt`.
- **In-place page→post conversion is not possible** — the posts endpoint 404s on page
  ids ("Resource not found error, cannot edit post"). Convert by delete + recreate;
  the URL is identical (Ghost serves both at `/{slug}/`), so inbound links survive.
- **Lexical list nodes must be `type: 'list'`** (with `value: 1,2,…` on each
  `listitem`) — **not** `type: 'extended-list'`. An `extended-list` node passes the
  save validation but **breaks Ghost's render pipeline**: the public page truncates
  silently at that node (everything after it vanishes from the page while the API's
  `lexical` still looks correct). Always copy list structure from an existing rendered
  node (see any sources list in the guide) and verify the PUBLIC page, not just the
  API's `html` render, after editing lexical by hand. (Hit 2026-10-06 on the FAQ
  endorsements update; fixed by rebuilding the lists as `type: 'list'.)

### Process (same discipline as all guide edits)

1. Read the live post fresh immediately before every push — the user edits
   concurrently, and stale reads clobber or get clobbered. Warn them to reload their
   editor tab after batch saves.
2. Dry-run first; show the plan.
3. Write a pre-change backup to `2026/backups/`.
4. Save with 4× retry/backoff (transient SSL "bad record mac" errors are common).
5. Verify after every push: re-read rendered `html` via the API, confirm all summary
   anchors resolve, spot-check the public URL with a browser-UA fetch.

### Subpage scripts (repo root, one-off/reference)

- `create-rtd-subpage.js` — creates a subpage post; template for the batch
- `implement-b1-rtd.js` — inserts/replaces the 🔗+Share actions card after a section
  heading (idempotent)
- `fix-heading-hierarchy.js`, `demote-candidates.js`, `unbold-headings.js` — heading
  normalization passes (hierarchy, candidate demotion, bold strip)
- `link-rtd-subpage.js`, `fix-rtd-subpage.js`, `fix-rtd-image-meta.js`,
  `convert-page-to-post.js` — earlier RTD fixes kept as batch reference (card-link
  swap + revert, slug rename, heading unwrap, image meta copy, page→post conversion)

---

### Election FAQ page — annual update playbook

The FAQ (`election-guide-faq`, a Ghost **page** — edit via `api.pages`, linked in the
nav as "Voter Guide FAQ") was fully migrated 2025 → 2026 on 2026-10-06. Each section,
what changes every election, and where the data comes from:

| Section | Annual update | Data source |
|---|---|---|
| What is Boulder Colorado Voter Guide? | year string in the intro ("…voter guide for the **YYYY** election…") | trivial edit |
| Which candidates did BCVG support for Boulder City Council? | new candidate list **in the guide's endorsement order**, each linked to their campaign website; intro "supports N candidates… in YYYY:" | candidate names + order: the main guide's council section ("I am voting for…" paragraph). Website URLs: the guide's council candidate-profile paragraphs ("…'s website" links) — re-verify each returns 200 before linking |
| *(appended after the list)* references paragraph | links to the council + mayoral subpages | subpage URLs (`/{slug}-2026/`) |
| What are the Boulder City Council endorsements for candidates backed by BCVG? | one H3 + bullet list per endorsed candidate (guide order), **no links**; endorsing groups in table order | the endorsement comparison table/graphic data (user-provided each cycle; parse per-candidate endorser lists — watch for count mismatches between the table's Count row and its rows) |
| What are the accomplishments from the current Boulder City Council? | intro naming the BCVG-endorsed incumbents on council + the accomplishments list | intro framing + list: the main guide's mayoral section ("…and the council have accomplished…" paragraph + list), adapted for the FAQ |
| What ballot measure positions did BCVG support for the YYYY election? | heading year, intro, and a **markdown card of all measures** — grouped by level, colored spans for YES/FOR + NO/AGAINST, bold-black for NO POSITION / Option B, **each measure linked to its subpage** | **built programmatically from the main guide's summary card** (positions, descriptions, grouping, anchors → subpage slugs). No manual data entry |
| Tell me more about BCVG's history and previous guides? | prepend the prior year's guide as a **linked** top entry (list items = post titles) | prior guide post slug/title from the Ghost posts list |

**Scripts (repo root, config-driven — edit the CONFIG block at the top, then run):**

- `update-faq-supported.js` — CANDIDATES array (name + website URL)
- `update-faq-endorsements.js` — CANDIDATES array (name + endorsers list)
- `update-faq-accomplishments.js` — INTRO + ITEMS array
- `update-faq-positions.js` — fully automatic from the summary card (only the year in
  the heading/intro strings is hardcoded)
- `update-faq-internal-links.js` — references paragraph + re-links the positions card
  to subpages (automatic from the summary card)
- year-string fixes (e.g. "2025 election" → "2026 election") — one-off edits

**Single-step workflow for a new election year:**

1. Finish the main guide + summary card first (the FAQ's positions section is generated
   from it), and create the subpages (their slugs are derived from card anchors).
2. Edit the CONFIG blocks in `update-faq-supported.js`, `update-faq-endorsements.js`,
   `update-faq-accomplishments.js` with the new cycle's data.
3. Run all five scripts with `--push` (each backs up + verifies; the positions and
   internal-links scripts need no manual data).
4. Sweep for stale year strings on the FAQ (search "2025" → previous cycle) — the only
   intentional ones are the history list's prior-guide entries.
5. Verify the **public** page renders completely (see gotcha below).

**FAQ-specific gotchas:**

- Lexical lists must be `type: 'list'` with `value` on listitems — see the render
  truncation gotcha above.
- The page is edited via `api.pages`, and the FAQ's own code injection (button year
  replacement script) lives in its settings — leave it alone.
- Ghost appends `?ref=bouldercoloradovoterguide.com` to outbound links and strips
  `target="_blank"` — don't mistake these for broken links when verifying.

---

## Research methodology (finding and verifying links)

Techniques that worked (in order of preference):

1. **Google News RSS** — returns titles + pubDates, supports date operators:
   `https://news.google.com/rss/search?q=%22Amendment+81%22+Colorado+after%3A2026-06-25&hl=en-US&gl=US&ceid=US:en`
2. **Outlet WordPress search / REST API** (Colorado Sun, Boulder Reporting Lab, Yellow Scene):
   - `https://coloradosun.com/wp-json/wp/v2/posts?search=KEYWORDS&per_page=20`
   - `https://boulderreportinglab.org/?s=KEYWORDS`
3. **DuckDuckGo HTML endpoint** — `https://html.duckduckgo.com/html/?q=QUERY`
   (works reliably; may serve CAPTCHAs under heavy use — back off, don't hammer)
4. **Bing** — `https://www.bing.com/search?q=…` (quoted queries sometimes ignored;
   double-check results actually match)
5. **Direct page fetches** for outlet pages already linked from search results.

**Verification rule:** every URL must be loaded and must match the expected
title/topic/date before it goes in the data file. Record the publisher's own date.
Never fabricate or pattern-guess a URL.

**Known gotchas**

- Axios blocks bots — direct URLs may be unobtainable; Google News redirect links are
  not a substitute (they are session-bound and expire).
- Google News `news.google.com/rss/articles/...` links are redirects, not real URLs —
  always resolve to the publisher's URL.
- CPR News pages fetch fine directly, but its site search is JS-only; find CPR URLs via
  RSS/DDG. CPR voter-guide pages live at `cpr.org/2026/09/25/vg-2026-…`.
- Daily Camera / Denver Post / Gazette are paywalled (fine for citation).
- Fetching full article pages floods context fast when delegating research — prefer
  RSS/API metadata endpoints, and fetch full pages only to verify finalists.

---

## Backups & recovery

- **Automatic:** `update-sections.js` writes `2026/backups/pre-update-<timestamp>-<slug>.json`
  before every write; `merge-sources.js --push` writes `2026/backups/pre-merge-<timestamp>.json`.
- **Manual snapshot:** `2026/backups/restored-lexical-2026-09-25.json` — the full post
  content as restored after the 2026-09-25 overwrite incident (includes all
  editor-authored blocks).
- **Ghost editor history** (Admin UI, post editor) can restore prior versions. Note: the
  REST revisions endpoint returns 404 on this site (Ghost v6.44), so recovery must go
  through the Admin UI or these local backups — don't rely on the API for revisions.
- Backups are Lexical JSON strings. To inspect one:

```bash
node -e "const k=JSON.parse(require('fs').readFileSync('BACKUP_FILE','utf8')).root.children; k.forEach((n,i)=>console.log(i, n.type, JSON.stringify(n.children?.map(c=>c.text).join('')||'').slice(0,80)))"
```

**Pull the current live content** (do this before any risky operation):

```bash
node -e "require('dotenv').config();const {createGhostAdminClient}=require('./src/ghost-client');const {findBySlug}=require('./src/ghost-content');(async()=>{const f=await findBySlug(createGhostAdminClient(),'election-guide');require('fs').writeFileSync('2026/backups/live-lexical.json',f.item.lexical);console.log('saved',f.item.updated_at)})()"
```

---

## Syncing local <-> live

- **live → local** (do this before any full rebuild): pull the live lexical (command
  above), then update `sections-data.js` so it includes the editor-authored blocks
  (Position / Who put… / Short Description headings and prose, heading position
  suffixes, `Analysis and Commentary:` stubs). Not yet automated — do it by hand from
  the snapshot, or ask for a sync script.
- **local → live**: sources-only changes go through `merge-sources.js`. Full-structure
  changes go through `update-sections` only after the sync above.

---

## Status / pending work

- **Election FAQ fully updated for 2026 (2026-10-06):** supported candidates (linked
  to campaign sites + references paragraph linking the council/mayor subpages),
  council endorsements, council accomplishments (intro names Brockett/Schuchard/
  Marquis), all 22 measure positions (markdown card generated from the summary card,
  measures linked to subpages), and the 2025 guide linked at the top of the history
  list. See the **Election FAQ page — annual update playbook** above for the
  repeatable per-cycle workflow.
- **Subpages: COMPLETE (2026-10-06) — 26 live.** RTD District O (12:01), Mayoral
  (12:02, feature image = mayoral endorsements graphic), Council (12:03, feature
  image = council endorsements graphic), all 14 state measures (12:04–12:17), county
  measures 1A (12:18) / 200 (12:19) / 201 (12:20), city measures 2J (12:21) / 2K
  (12:22) / 2L (12:23) / 2M (12:24), Front Range 7A (12:25). Each: post, public,
  `custom_excerpt`, leading empty paragraph, back-button to the guide's summary
  anchor (double-encoded em-dash), yes/no color `codeinjection_foot`
  (document.body-scoped), h4→h2 sub-headers, and a 🔗+Share actions card on the main
  guide (site-root URLs); summary-card anchors unchanged. Non-colored positions
  (NO POSITION, Option B) are bold black in the summary card (`**…**`), and their
  subpage excerpts use "taking NO POSITION" / "support Option B" phrasing. Batch
  scripts: `create-state-measure-subpages.js`, `create-final-subpages.js`
  (idempotent — skip existing slugs). **Remaining polish:** optional — sync the
  re-scroll helper into the early subpages' foots (functionally unnecessary; nothing
  links to them with fragments).
- **Placeholder links: resolved (2026-09-25).** All 55 former `url: '#'` entries were
  addressed: 45 filled with verified URLs, 10 removed because the described piece could
  not be verified to exist (see Removed entries below). The live post has **zero** `#`
  links. Re-run `node merge-sources.js --push` after any future `sections-data.js`
  edits to sync sources to Ghost.
- **Removed entries** (described content could not be found after repeated searches —
  re-add only if a real URL turns up):
  - Amendment 81: "Colorado Sun fact check on Initiative 95" (no such Sun piece found)
  - Amendment 84: "Colorado Sun Aug. 26 report on mail-ballot ID" (not found)
  - Amendment 82: CPR News "legislative efforts to counter" — replaced by the Sun's
    version of the same Capitol News Alliance story (May 8, 2026)
  - Prop 132: CPR/CCA "background on Initiative 85" — same CCA story already cited via
    the Sun (Nov 20, 2025)
  - Prop 134: 9NEWS video report (canonical URL unresolvable; Yahoo copy not found)
  - Prop 137: Newsline Aug. 25 conservation report (canonical URL unresolvable)
  - Issue 1A: BRL "Aug. 18 election overview" (the only Aug 18 BRL election post is a
    coverage-survey callout, not an overview)
  - Question 200: KGNU July petition report (not found in KGNU's archive)
  - Issue 2J: KGNU "Aug. 7 roundup of Boulder ballot measures" (no such roundup; KGNU's
    Aug 7 piece is the natural-gas measure, cited under Amendment 82)
  - Judicial retention: "Colorado Judicial Branch 2026 retention information" page
    (does not exist; the Judicial Performance Commission's 2026 evaluations page covers it)
- **Added:** KGNU's dedicated Amendment 82 explainer (Sep 10, 2026) surfaced during the hunt.
- **Sync debt:** `sections-data.js` does not yet reflect the live post's
  editor-authored blocks (see Source of truth).
