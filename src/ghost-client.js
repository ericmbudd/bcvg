const GhostAdminAPI = require('@tryghost/admin-api');

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

function createGhostAdminClient() {
  const siteUrl = process.env.GHOST_URL;
  const adminApiKey = normalizeGhostApiKey({
    directKeyName: 'GHOST_ADMIN_API_KEY',
    idKeyName: 'GHOST_ADMIN_API_KEY_ID',
    secretKeyName: 'GHOST_ADMIN_API_KEY_SECRET'
  });

  if (!siteUrl || !adminApiKey) {
    throw new Error('Missing GHOST_URL or GHOST_ADMIN_API_KEY in environment variables.');
  }

  const ghostKeyPattern = /^([a-f0-9]{24}):([a-f0-9]{64})$/i;

  if (!ghostKeyPattern.test(adminApiKey)) {
    throw new Error('Invalid Ghost admin API key format. Use the full {id}:{secret} key, or set GHOST_ADMIN_API_KEY_ID and GHOST_ADMIN_API_KEY_SECRET.');
  }

  return new GhostAdminAPI({
    url: siteUrl,
    key: adminApiKey,
    version: 'v5.0'
  });
}

module.exports = { createGhostAdminClient, normalizeGhostApiKey };
