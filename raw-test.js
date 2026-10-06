// Dump full error details from a library pages.add call.
require('dotenv').config();
const { createGhostAdminClient } = require('./src/ghost-client');

const para = { children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Hello world test.', type: 'extended-text', version: 1 }], direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 };
const lexical = JSON.stringify({ root: { children: [para], direction: 'ltr', format: '', indent: 0, type: 'root', version: 1 } });

(async () => {
  const api = createGhostAdminClient();
  try {
    const p = await api.pages.add({ title: 'TEST lib dump', slug: 'test-lib-' + Date.now(), lexical, status: 'draft' }, { source: 'lexical' });
    console.log('OK ->', p.id);
    await api.pages.delete(p.id).catch(() => {});
  } catch (e) {
    console.log('error name:', e.name);
    console.log('error message:', e.message);
    for (const k of Object.keys(e)) {
      const v = typeof e[k] === 'object' ? JSON.stringify(e[k]) : e[k];
      console.log(`  ${k}: ${v}`);
    }
  }
})();
