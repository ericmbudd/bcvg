// Minimal payload tests to isolate the pages.add validation error.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const para = (children) => ({ children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 });

(async () => {
  const api = createGhostAdminClient();

  const tests = [
    ['plain para, no link', para([text('Hello world test.')])],
    ['para with link (null rel)', para([text('See '), { children: [text('my guide')], direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, rel: null, target: null, title: null, url: 'https://bouldercoloradovoterguide.com/election-guide/' }, text('.')])],
    ['para with link (no null fields)', para([text('See '), { children: [text('my guide')], direction: 'ltr', format: '', indent: 0, type: 'link', version: 1, url: 'https://bouldercoloradovoterguide.com/election-guide/' }, text('.')])],
  ];

  for (const [name, ...childrenList] of tests) {
    for (const children of childrenList) {
      const lexical = JSON.stringify({ root: { children: [children], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } });
      try {
        const p = await api.pages.add({ title: 'TEST ' + name, slug: 'test-min-' + Date.now() + '-' + Math.floor(Math.random() * 1000), lexical, status: 'draft' }, { source: 'lexical' });
        console.log('OK   :', name, '-> id', p.id);
        await api.pages.delete(p.id).catch((e) => console.log('  (cleanup failed:', e.message + ')'));
      } catch (e) {
        console.log('FAIL :', name, '->', e.message, e.response?.status, JSON.stringify(e.response?.data?.errors || '').slice(0, 300));
      }
    }
  }

  // also try a POST as page via posts.add to see if error differs
  try {
    const lexical = JSON.stringify({ root: { children: [para([text('Hello world test.')])], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } });
    const p = await api.posts.add({ title: 'TEST post minimal', slug: 'test-min-post-' + Date.now(), lexical, status: 'draft' }, { source: 'lexical' });
    console.log('OK   : posts.add minimal -> id', p.id);
    await api.posts.delete(p.id).catch(() => {});
  } catch (e) {
    console.log('FAIL : posts.add minimal ->', e.message, JSON.stringify(e.response?.data?.errors || '').slice(0, 300));
  }
})().catch((e) => { console.error('ERROR:', e.message); process.exit(1); });
