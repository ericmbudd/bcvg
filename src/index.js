const GhostAdminAPI = require('@tryghost/admin-api');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function escapeCsvValue(value) {
  const stringValue = value === undefined || value === null ? '' : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function parseGeolocation(geolocation) {
  if (!geolocation) {
    return { country: '', city: '' };
  }

  let geo;

  try {
    geo = typeof geolocation === 'string' ? JSON.parse(geolocation) : geolocation;
  } catch {
    return { country: '', city: '' };
  }

  return {
    country: geo.country || '',
    city: geo.city || ''
  };
}

function normalizeGhostApiKey({ directKeyName, idKeyName, secretKeyName }) {
  const directKey = process.env[directKeyName];
  const keyId = process.env[idKeyName];
  const keySecret = process.env[secretKeyName];

  if (keyId || keySecret) {
    if (!keyId || !keySecret) {
      throw new Error(`Set both ${idKeyName} and ${secretKeyName}, or use ${directKeyName}.`);
    }

    return `${keyId.trim()}:${keySecret.trim()}`;
  }

  return directKey ? directKey.trim().replace(/^['"]|['"]$/g, '') : '';
}

async function exportMembersWithLocation() {
  const siteUrl = process.env.GHOST_URL;
  const adminApiKey = normalizeGhostApiKey({
    directKeyName: 'GHOST_ADMIN_API_KEY',
    idKeyName: 'GHOST_ADMIN_API_KEY_ID',
    secretKeyName: 'GHOST_ADMIN_API_KEY_SECRET'
  });
  const outputFile = process.env.OUTPUT_FILE || 'members_location_export.csv';

  if (!siteUrl || !adminApiKey) {
    throw new Error('Missing GHOST_URL or GHOST_ADMIN_API_KEY in environment variables.');
  }

  const ghostKeyPattern = /^([a-f0-9]{24}):([a-f0-9]{64})$/i;

  if (!ghostKeyPattern.test(adminApiKey)) {
    throw new Error('Invalid Ghost admin API key format. Use the full {id}:{secret} key, or set GHOST_ADMIN_API_KEY_ID and GHOST_ADMIN_API_KEY_SECRET.');
  }

  const api = new GhostAdminAPI({
    url: siteUrl,
    key: adminApiKey,
    version: 'v5.0'
  });

  console.log('Fetching members from Ghost...');
  const members = [];
  const pageSize = 100;
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const result = await api.members.browse({ limit: pageSize, page });
    const batch = Array.isArray(result) ? result : [];

    members.push(...batch);

    const nextPage = result && result.meta && result.meta.pagination ? result.meta.pagination.next : null;
    hasMore = Boolean(nextPage);
    page = nextPage || page + 1;
  }

  const csvRows = members.map((member) => {
    const { country, city } = parseGeolocation(member.geolocation);

    return [
      escapeCsvValue(member.name || ''),
      escapeCsvValue(member.email || ''),
      escapeCsvValue(member.status || ''),
      escapeCsvValue(country),
      escapeCsvValue(city)
    ].join(',');
  });

  const csvHeader = 'Name,Email,Status,Country,City';
  const finalData = [csvHeader, ...csvRows].join('\n');
  const resolvedOutputPath = path.resolve(process.cwd(), outputFile);

  fs.writeFileSync(resolvedOutputPath, finalData, 'utf8');
  console.log(`Success! Exported ${members.length} members to ${resolvedOutputPath}`);
}

exportMembersWithLocation().catch((err) => {
  console.error('Error exporting members:');
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});