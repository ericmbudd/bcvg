async function findBySlug(api, slug, forcedType) {
  const types = forcedType ? [forcedType] : ['pages', 'posts'];

  for (const type of types) {
    const result = await api[type].browse({
      limit: 1,
      filter: `slug:${slug}`,
      formats: 'lexical,mobiledoc,html'
    });

    if (Array.isArray(result) && result.length > 0) {
      return { type, item: result[0] };
    }
  }

  return null;
}

function replaceInString(value, replacements) {
  let next = value;

  replacements.forEach(([from, to]) => {
    next = next.split(from).join(to);
  });

  return next;
}

// Replaces text only inside Lexical "extended-text" nodes (visible prose),
// so link URLs, image sources, and card settings are never touched.
// Optionally also replaces inside raw HTML cards when explicitly requested.
function applyReplacementsToLexical(lexicalString, replacements, { includeHtmlCards = false } = {}) {
  const root = JSON.parse(lexicalString);
  const changedTexts = [];
  let htmlCardsChanged = 0;

  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== 'object') {
      return;
    }

    if (value.type === 'extended-text' && typeof value.text === 'string') {
      const next = replaceInString(value.text, replacements);

      if (next !== value.text) {
        changedTexts.push({ before: value.text, after: next });
        value.text = next;
      }
    }

    if (includeHtmlCards && value.type === 'html' && typeof value.html === 'string') {
      const next = replaceInString(value.html, replacements);

      if (next !== value.html) {
        htmlCardsChanged += 1;
        value.html = next;
      }
    }

    Object.values(value).forEach(visit);
  };

  visit(root);

  return { lexical: JSON.stringify(root), changedTexts, htmlCardsChanged };
}

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith('--')) {
      continue;
    }

    const key = arg.slice(2);
    const next = argv[i + 1];
    let value = true;

    if (next && !next.startsWith('--')) {
      value = next;
      i++;
    }

    if (key in args) {
      if (Array.isArray(args[key])) {
        args[key].push(value);
      } else {
        args[key] = [args[key], value];
      }
    } else {
      args[key] = value;
    }
  }

  return args;
}

function argValue(value) {
  return Array.isArray(value) ? value[value.length - 1] : value;
}

module.exports = {
  findBySlug,
  replaceInString,
  applyReplacementsToLexical,
  parseArgs,
  argValue
};
