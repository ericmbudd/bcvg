require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createGhostAdminClient } = require('./ghost-client');
const { parseArgs, argValue, findBySlug } = require('./ghost-content');

function findMarkdownCards(node) {
  const cards = [];

  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    if (value.type === 'markdown') {
      cards.push(value);
    }

    Object.values(value).forEach(visit);
  };

  visit(node);
  return cards;
}

async function updateMarkdown() {
  const args = parseArgs(process.argv.slice(2));
  const slug = argValue(args.slug) || 'election-guide';
  const file = argValue(args.file) || '2026/outline-2026.md';
  const dryRun = Boolean(args['dry-run']);

  const filePath = path.resolve(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const markdown = fs.readFileSync(filePath, 'utf8');

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
  const cards = findMarkdownCards(root);

  if (cards.length === 0) {
    throw new Error('No markdown card found in this content. Add one in the Ghost editor first.');
  }

  if (cards.length > 1) {
    console.log(`Warning: found ${cards.length} markdown cards; updating the first.`);
  }

  const previousLength = typeof cards[0].markdown === 'string' ? cards[0].markdown.length : 0;
  cards[0].markdown = markdown;

  console.log(`Markdown card: ${previousLength} chars -> ${markdown.length} chars.`);

  if (dryRun) {
    console.log('Dry run - nothing saved. New content starts with:');
    console.log(markdown.split('\n').slice(0, 8).join('\n'));
    return;
  }

  const updated = await api[type].edit({
    id: item.id,
    updated_at: item.updated_at,
    lexical: JSON.stringify(root)
  });

  console.log('Success! Markdown card updated.');
  console.log(`  Title:  ${updated.title}`);
  console.log(`  Editor: ${process.env.GHOST_URL}/ghost/#/${type}/${updated.id}`);
}

updateMarkdown().catch((err) => {
  console.error('Error updating markdown card:');
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
