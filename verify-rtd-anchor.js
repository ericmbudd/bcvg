// Verify RTD heading anchor id in rendered HTML + find summary card link for RTD.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

(async () => {
  const api = createGhostAdminClient();
  const post = await api.posts.read({ slug: 'election-guide' }, { formats: 'html,lexical' });
  const html = post.html;

  // find the RTD heading and its id
  const re = /<h[234][^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h[234]>/gi;
  let m;
  const headings = [];
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (/regional transportation district/i.test(text)) headings.push({ id: m[1], tag: m[0].slice(1, 3), text });
  }
  console.log('=== RTD headings in rendered HTML ===');
  headings.forEach((h) => console.log(`${h.tag} id="${h.id}" :: ${h.text}`));

  // find summary-card links mentioning RTD / District O
  console.log('\n=== links mentioning RTD/District O in rendered HTML ===');
  const linkRe = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = linkRe.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (/rtd|district o/i.test(text) && text.length < 120) console.log(`href="${m[1]}" :: ${text}`);
  }

  // also check the lexical markdown card for the RTD line
  const doc = JSON.parse(post.lexical);
  const cards = doc.root.children.filter((n) => n.type === 'markdown');
  console.log('\n=== markdown cards containing RTD ===');
  cards.forEach((c, i) => {
    if (/rtd|district o/i.test(c.markdown || '')) {
      const lines = c.markdown.split('\n').filter((l) => /rtd|district o/i.test(l));
      console.log(`--- card #${i} (of ${cards.length}) matching lines:`);
      lines.forEach((l) => console.log('   ' + l.trim().slice(0, 200)));
    }
  });
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
