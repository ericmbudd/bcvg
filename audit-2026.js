// Final 2026-readiness audit: site settings, homepage og tags, 2025 references.
require('dotenv').config();
const crypto = require('crypto');
const { createGhostAdminClient } = require('./src/ghost-client');

const url = process.env.GHOST_URL.replace(/\/$/, '');
const [keyId, secret] = process.env.GHOST_ADMIN_API_KEY.split(':');
function token() {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: keyId })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 300, aud: '/v5/admin/' })).toString('base64url');
  const sig = crypto.createHmac('sha256', Buffer.from(secret, 'hex')).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}
const textOf = (n) => { const p = []; const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (!v || typeof v !== 'object') return; if (typeof v.text === 'string') p.push(v.text); Object.values(v).forEach(walk); }; walk(n); return p.join(''); };

(async () => {
  // 1. site settings (raw — the library client lacks settings)
  console.log('=== site settings ===');
  try {
    const res = await fetch(`${url}/ghost/api/admin/settings/`, { headers: { Authorization: `Ghost ${token()}`, 'Accept-Version': 'v5.0' } });
    const data = await res.json();
    const s = {};
    data.settings.forEach((x) => { s[x.key] = x.value; });
    ['title', 'description', 'cover_image', 'og_image', 'icon', 'navigation'].forEach((k) => {
      const v = s[k];
      if (k === 'navigation') { console.log('  navigation:', (v || '').slice(0, 300)); return; }
      console.log(`  ${k}: ${v === null || v === undefined || v === '' ? '(empty)' : String(v).slice(0, 220)}`);
    });
  } catch (e) {
    console.log('  settings fetch failed:', e.message);
  }

  // 2. homepage og tags
  console.log('\n=== homepage og tags ===');
  try {
    const html = await (await fetch('https://bouldercoloradovoterguide.com/', { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
    const og = html.match(/<meta[^>]*property="og:(title|description|image|url)"[^>]*content="([^"]*)"/g) || [];
    og.forEach((t) => console.log('  ' + t.replace(/<meta[^>]*property="/, 'property="').slice(0, 200)));
    console.log('  <title>: ' + (html.match(/<title>([^<]*)<\/title>/) || [])[1]);
    console.log('  homepage mentions 2025:', (html.match(/2025/g) || []).length, 'times | 2026:', (html.match(/2026/g) || []).length, 'times');
  } catch (e) {
    console.log('  homepage fetch failed:', e.message);
  }

  const api = createGhostAdminClient();

  // 3. FAQ 2025 references (with context)
  console.log('\n=== FAQ: remaining "2025" mentions ===');
  const faq = await api.pages.read({ slug: 'election-guide-faq' }, { formats: 'lexical' });
  const fdoc = JSON.parse(faq.lexical);
  fdoc.root.children.forEach((n, i) => {
    const t = textOf(n);
    if (/2025/.test(t)) console.log(`  [${i}] ${n.type}: …${t.slice(Math.max(0, t.indexOf('2025') - 60), t.indexOf('2025') + 80)}…`);
  });

  // 4. main guide 2025 references (context check — some are intentional history)
  console.log('\n=== main guide: "2025" mentions (context) ===');
  const guide = await api.posts.read({ slug: 'election-guide' }, { formats: 'lexical' });
  const gdoc = JSON.parse(guide.lexical);
  gdoc.root.children.forEach((n, i) => {
    const t = textOf(n);
    if (/2025/.test(t)) {
      const at = t.indexOf('2025');
      console.log(`  [${i}] ${n.type}: …${t.slice(Math.max(0, at - 70), at + 90).replace(/\n/g, ' ')}…`);
    }
  });

  // 5. other pages quick scan
  console.log('\n=== other pages: 2025 mentions ===');
  for (const slug of ['election-guide-page', 'images', 'about-eric-budd']) {
    try {
      const p = await api.pages.read({ slug }, { formats: 'lexical' });
      const d = JSON.parse(p.lexical);
      const count = (JSON.stringify(d).match(/2025/g) || []).length;
      console.log(`  ${slug}: ${count} occurrence(s) of "2025" | title: ${p.title} | status: ${p.status}`);
    } catch (e) {
      console.log(`  ${slug}: read failed (${e.message})`);
    }
  }
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
