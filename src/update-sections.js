require('dotenv').config();
const fs = require('fs');
const { createGhostAdminClient } = require('./ghost-client');
const { parseArgs, argValue, findBySlug } = require('./ghost-content');
const SECTIONS = require('../2026/sections-data.js');

// Node factories matching the shapes already stored by this Ghost post,
// so every generated node is native editor content (not HTML).
const text = (t, format = 0) => ({ detail: 0, format, mode: 'normal', style: '', text: t, type: 'extended-text', version: 1 });
const linebreak = () => ({ type: 'linebreak', version: 1 });

const heading = (tag, t) => ({
  children: [text(t, tag === 'h4' ? 1 : 0)],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'extended-heading',
  version: 1,
  tag
});

const quote = ({ caption, question }) => ({
  children: caption ? [text(caption), linebreak(), text(question)] : [text(question)],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'extended-quote',
  version: 1
});

const paragraph = (segments) => ({
  children: segments.map((s) => text(s.text, s.bold ? 1 : 0)),
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'paragraph',
  version: 1
});

const link = (url, label) => ({
  children: [text(label)],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'link',
  version: 1,
  rel: 'noreferrer noopener',
  target: '_blank',
  title: null,
  url
});

const linkWrap = (url, child) => ({
  children: [child],
  direction: 'ltr',
  format: '',
  indent: 0,
  type: 'link',
  version: 1,
  rel: 'noreferrer noopener',
  target: '_blank',
  title: null,
  url
});

const listItem = (item, value) => {
  const children = [link(item.url, item.label)];

  if (item.tail) {
    children.push(text(` — ${item.tail}`));
  }

  return { children, direction: 'ltr', format: '', indent: 0, type: 'listitem', version: 1, value };
};

const list = (items) => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  children: items.map(listItem)
});

const namesParagraph = ({ prefix, names, suffix = '' }) => {
  const children = [text(prefix)];
  names.forEach((name, i) => {
    const isObj = typeof name === 'object';
    const label = isObj ? name.text : name;
    const boldText = text(label, 1);
    children.push(isObj ? linkWrap(name.url, boldText) : boldText);
    if (i < names.length - 1) children.push(text(', '));
  });
  if (suffix) children.push(text(suffix));
  return { children, direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1 };
};

function buildNode(section) {
  switch (section.kind) {
    case 'h2':
    case 'h3':
    case 'h4':
      return heading(section.kind, section.text);
    case 'quote':
      return quote(section);
    case 'para':
      return paragraph([{ text: section.text }]);
    case 'names':
      return namesParagraph(section);
    case 'sources':
      return [
        heading('h4', 'Additional Reporting, Commentary, and Sources'),
        list(section.items)
      ];
    case 'html':
      return { type: 'html', html: section.html };
    default:
      throw new Error(`Unknown section kind "${section.kind}".`);
  }
}

function textOf(node) {
  const parts = [];

  const walk = (value) => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!value || typeof value !== 'object') {
      return;
    }
    if (typeof value.text === 'string') {
      parts.push(value.text);
    }
    Object.values(value).forEach(walk);
  };

  walk(node);
  return parts.join('');
}

async function updateSections() {
  const args = parseArgs(process.argv.slice(2));
  const slug = argValue(args.slug) || 'election-guide';
  const dryRun = Boolean(args['dry-run']);

  const api = createGhostAdminClient();

  console.log(`Looking up "${slug}"...`);
  const found = await findBySlug(api, slug);

  if (!found) {
    throw new Error(`No page or post found with slug "${slug}".`);
  }

  const { type, item } = found;
  console.log(`Found ${type === 'posts' ? 'post' : 'page'} "${item.title}" (status: ${item.status}).`);

  if (!item.lexical) {
    throw new Error('This content has no lexical field to update.');
  }

  const root = JSON.parse(item.lexical);
  const kids = root.root.children;

  const cardIndex = kids.findIndex((c) => c.type === 'markdown');
  if (cardIndex < 0) {
    throw new Error('No markdown card found - cannot locate the summary section boundary.');
  }

  const closingIndex = kids.findIndex((c) => c.type === 'extended-heading' && c.tag === 'h2' && /^Thank you/.test(textOf(c)));
  if (closingIndex < 0) {
    throw new Error('No "Thank you" h2 found - cannot locate the end of the content sections.');
  }

  const before = kids.slice(0, cardIndex + 1);
  const closing = kids.slice(closingIndex);
  const generated = SECTIONS.flatMap(buildNode);

  root.root.children = [...before, ...generated, ...closing];

  const headingCount = generated.filter((n) => n.type === 'extended-heading').length;
  console.log(`Replacing ${closingIndex - cardIndex - 1} old nodes with ${generated.length} new nodes (${SECTIONS.length} sections, ${headingCount} headings) from ${cardIndex + 1} to ${closingIndex}.`);

  if (dryRun) {
    console.log('Dry run - nothing saved. Section outline would be:');
    generated.forEach((n) => {
      if (n.type === 'extended-heading') {
        console.log(`${n.tag === 'h2' ? '' : '  '}${n.tag}: ${n.children.map((c) => c.text).join('')}`);
      }
    });
    return;
  }

  // Snapshot the current live content before overwriting anything, so an edit that
  // clobbers changes made directly in the Ghost editor can always be recovered.
  fs.mkdirSync('2026/backups', { recursive: true });
  const backupPath = `2026/backups/pre-update-${new Date().toISOString().replace(/[:.]/g, '-')}-${slug}.json`;
  fs.writeFileSync(backupPath, item.lexical);
  console.log(`Backed up current content to ${backupPath}`);

  const updated = await api[type].edit({
    id: item.id,
    updated_at: item.updated_at,
    lexical: JSON.stringify(root)
  });

  console.log('Success! Body sections updated.');
  console.log(`  Title:  ${updated.title}`);
  console.log(`  Editor: ${process.env.GHOST_URL}/ghost/#/${type}/${updated.id}`);
}

updateSections().catch((err) => {
  console.error('Error updating sections:');
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
