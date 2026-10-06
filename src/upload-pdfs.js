require('dotenv').config();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createGhostAdminClient } = require('./ghost-client');

const DEFAULT_DIR = path.join(__dirname, '..', '2026', 'blue book', 'measures');

function slugifyFileName(fileName) {
  const slug = fileName
    .replace(/\.pdf$/i, '')
    .replace(/\s*\(p\d+-\d+\)$/, '')
    .toLowerCase()
    .replace(/\s+-\s+/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug}.pdf`;
}

function extractUrl(response) {
  const entry = Array.isArray(response) ? response[0] : response;
  return entry && entry.url ? entry.url : null;
}

async function main() {
  const dir = process.argv[2] || DEFAULT_DIR;
  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.pdf')).sort();
  if (files.length === 0) {
    throw new Error(`No PDF files found in ${dir}`);
  }

  const api = createGhostAdminClient();

  // Ghost stores uploads under the original filename, so stage slug-named copies
  // to get clean URLs instead of ones with spaces and parentheses.
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'ghost-pdfs-'));

  const uploaded = [];
  const failures = [];

  try {
    for (const file of files) {
      const stagedPath = path.join(staging, slugifyFileName(file));
      fs.copyFileSync(path.join(dir, file), stagedPath);
      try {
        const response = await api.files.upload({ file: stagedPath, purpose: 'file' });
        const url = extractUrl(response);
        uploaded.push({ file, url });
        console.log(`Uploaded: ${file}`);
        console.log(`  -> ${url || JSON.stringify(response)}`);
      } catch (err) {
        failures.push({ file, message: err.message });
        console.error(`FAILED: ${file}`);
        console.error(`  ${err.message}`);
      }
    }
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }

  console.log(`\nDone: ${uploaded.length} uploaded, ${failures.length} failed of ${files.length} total.`);
  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
