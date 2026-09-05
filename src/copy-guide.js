require('dotenv').config();
const { createGhostAdminClient } = require('./ghost-client');
const { parseArgs, argValue, findBySlug } = require('./ghost-content');

// Fields carried over verbatim when they exist on the source.
const COPY_FIELDS = [
  'feature_image',
  'feature_image_alt',
  'feature_image_caption',
  'codeinjection_head',
  'codeinjection_foot',
  'excerpt',
  'meta_title',
  'meta_description',
  'og_image',
  'og_title',
  'og_description',
  'twitter_image',
  'twitter_title',
  'twitter_description'
];

async function copyGuide() {
  const args = parseArgs(process.argv.slice(2));
  const sourceSlug = argValue(args.from) || 'election-guide';
  const targetSlug = argValue(args.to) || 'election-guide-2026';
  const status = argValue(args.status) === 'published' ? 'published' : 'draft';

  if (!/^[a-z0-9-]+$/.test(targetSlug)) {
    throw new Error(`Invalid target slug "${targetSlug}". Use lowercase letters, numbers, and hyphens.`);
  }

  const api = createGhostAdminClient();

  console.log(`Looking up "${sourceSlug}"...`);
  const found = await findBySlug(api, sourceSlug);

  if (!found) {
    throw new Error(`No page or post found with slug "${sourceSlug}".`);
  }

  const { type: sourceType, item: source } = found;
  const resource = api[sourceType];
  console.log(`Found it as a ${sourceType === 'posts' ? 'post' : 'page'}.`);

  const contentField = source.lexical ? 'lexical' : 'mobiledoc';

  if (!source[contentField]) {
    throw new Error('Source has no lexical or mobiledoc content to copy.');
  }

  const existingTarget = await findBySlug(api, targetSlug, sourceType);

  if (existingTarget) {
    throw new Error(`A ${sourceType === 'posts' ? 'post' : 'page'} with slug "${targetSlug}" already exists. Delete or rename it first.`);
  }

  const newTitle = argValue(args.title) || String(source.title || '').replace(/2025/g, '2026');

  const payload = {
    title: newTitle,
    slug: targetSlug,
    status,
    tags: (source.tags || []).map((tag) => tag.name || tag.slug).filter(Boolean)
  };
  payload[contentField] = source[contentField];

  COPY_FIELDS.forEach((field) => {
    if (source[field] !== undefined && source[field] !== null && source[field] !== '') {
      payload[field] = source[field];
    }
  });

  console.log(`Creating ${status} ${sourceType === 'posts' ? 'post' : 'page'} "${newTitle}" at /${targetSlug}/ (copying ${contentField} verbatim)...`);
  const created = await resource.add(payload);

  console.log('Success!');
  console.log(`  Title:    ${created.title}`);
  console.log(`  Slug:     ${created.slug}`);
  console.log(`  Status:   ${created.status}`);
  console.log(`  Editor:   ${process.env.GHOST_URL}/ghost/#/${sourceType}/${created.id}`);

  if (created.status === 'draft') {
    console.log('It was created as a draft. Open it in Ghost Admin, review, and publish.');
  }
}

copyGuide().catch((err) => {
  console.error('Error copying content:');
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
