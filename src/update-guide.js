require('dotenv').config();
const { createGhostAdminClient } = require('./ghost-client');
const {
  findBySlug,
  replaceInString,
  applyReplacementsToLexical,
  parseArgs,
  argValue
} = require('./ghost-content');

// Text metadata fields that get the same replacements as the body.
const TEXT_FIELDS = [
  'title',
  'excerpt',
  'meta_title',
  'meta_description',
  'og_title',
  'og_description',
  'twitter_title',
  'twitter_description'
];

function truncate(value, max = 64) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

// Shows a window around the first differing character so long paragraphs
// preview the actual change instead of just their opening words.
function changeContext(before, after, windowSize = 40) {
  const minLen = Math.min(before.length, after.length);
  let diffIndex = 0;

  while (diffIndex < minLen && before[diffIndex] === after[diffIndex]) {
    diffIndex++;
  }

  const start = Math.max(0, diffIndex - windowSize);

  const frame = (value) => {
    const end = diffIndex + windowSize;
    const suffix = value.length > end ? '…' : '';
    const prefix = diffIndex > windowSize ? '…' : '';
    return `${prefix}${value.slice(start, Math.min(end, value.length))}${suffix}`;
  };

  return { before: frame(before), after: frame(after) };
}

async function updateGuide() {
  const args = parseArgs(process.argv.slice(2));
  const slug = argValue(args.slug) || 'election-guide';
  const dryRun = Boolean(args['dry-run']);
  const publish = Boolean(args.publish);
  const includeHtmlCards = Boolean(args['include-html-cards']);
  const replaceArgs = args.replace === undefined
    ? []
    : (Array.isArray(args.replace) ? args.replace : [args.replace]);

  const replacements = replaceArgs.map((pair) => {
    const raw = String(pair);
    const separatorIndex = raw.indexOf(':');

    if (separatorIndex <= 0) {
      throw new Error(`Invalid --replace value "${raw}". Use OLD:NEW, e.g. --replace 2025:2026.`);
    }

    return [raw.slice(0, separatorIndex), raw.slice(separatorIndex + 1)];
  });

  if (replacements.length === 0 && !publish) {
    throw new Error('Nothing to do. Pass --replace OLD:NEW and/or --publish.');
  }

  const api = createGhostAdminClient();

  console.log(`Looking up "${slug}"...`);
  const found = await findBySlug(api, slug);

  if (!found) {
    throw new Error(`No page or post found with slug "${slug}".`);
  }

  const { type, item } = found;
  const label = type === 'posts' ? 'post' : 'page';
  console.log(`Found ${label} "${item.title}" (status: ${item.status}).`);

  if (!item.lexical) {
    throw new Error(`This ${label} has no lexical content. Open it once in the Ghost editor to convert it, then rerun.`);
  }

  const payload = { id: item.id, updated_at: item.updated_at };
  const changedFields = [];

  if (replacements.length > 0) {
    const { lexical, changedTexts, htmlCardsChanged } = applyReplacementsToLexical(item.lexical, replacements, { includeHtmlCards });

    console.log(`Body: ${changedTexts.length} text node(s) would change${includeHtmlCards ? `, ${htmlCardsChanged} HTML card(s) would change` : ''}.`);
    changedTexts.slice(0, 5).forEach(({ before, after }) => {
      const context = changeContext(before, after);
      console.log(`  - "${context.before}"`);
      console.log(`    -> "${context.after}"`);
    });

    if (changedTexts.length > 5) {
      console.log(`  ... and ${changedTexts.length - 5} more`);
    }

    if (changedTexts.length > 0 || htmlCardsChanged > 0) {
      payload.lexical = lexical;
      changedFields.push('lexical');
    }

    TEXT_FIELDS.forEach((field) => {
      if (typeof item[field] === 'string' && item[field] !== '') {
        const next = replaceInString(item[field], replacements);

        if (next !== item[field]) {
          payload[field] = next;
          changedFields.push(field);
          const context = changeContext(item[field], next);
          console.log(`  ${field}: "${context.before}"`);
          console.log(`    -> "${context.after}"`);
        }
      }
    });
  }

  if (publish && item.status !== 'published') {
    payload.status = 'published';
    changedFields.push('status');
    console.log('Status: will be set to published.');
  }

  if (changedFields.length === 0) {
    console.log('Nothing to change; skipping save.');
    return;
  }

  if (dryRun) {
    console.log(`Dry run - nothing saved. ${changedFields.length} field(s) would be updated: ${changedFields.join(', ')}`);
    return;
  }

  const updated = await api[type].edit(payload);

  console.log('Success!');
  console.log(`  Title:  ${updated.title}`);
  console.log(`  Status: ${updated.status}`);
  console.log(`  Editor: ${process.env.GHOST_URL}/ghost/#/${type}/${updated.id}`);
}

updateGuide().catch((err) => {
  console.error('Error updating content:');
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
