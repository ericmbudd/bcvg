const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { createGhostAdminClient } = require('./ghost-client');

function escapeCsvValue(value) {
  const stringValue = value === undefined || value === null ? '' : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

const EXPORTED_BASE_FIELDS = [
  'id',
  'email',
  'name',
  'note',
  'subscribed_to_emails',
  'complimentary_plan',
  'stripe_customer_id',
  'created_at',
  'deleted_at',
  'labels',
  'tiers',
  'gift_id'
];

function parseGeolocation(geolocation) {
  if (!geolocation) {
    return {};
  }

  try {
    const parsed = typeof geolocation === 'string' ? JSON.parse(geolocation) : geolocation;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

function collectLocationKeys(members) {
  const keySet = new Set();

  members.forEach((member) => {
    const geolocation = parseGeolocation(member.geolocation);
    Object.keys(geolocation).forEach((key) => keySet.add(key));
  });

  return Array.from(keySet).sort();
}

function normalizeLocationValue(value) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value;
}

function formatLabels(labels) {
  if (!Array.isArray(labels) || labels.length === 0) {
    return '';
  }

  return labels.map((label) => label.name || label.slug || label.id || '').filter(Boolean).join('|');
}

function formatTiers(tiers) {
  if (!Array.isArray(tiers) || tiers.length === 0) {
    return '';
  }

  return tiers.map((tier) => tier.name || tier.slug || tier.id || '').filter(Boolean).join('|');
}

function resolveGiftId(member) {
  if (member.gift_id) {
    return member.gift_id;
  }

  if (member.gift && member.gift.id) {
    return member.gift.id;
  }

  return '';
}

function formatAdditionalFields(member) {
  const knownFields = new Set([...EXPORTED_BASE_FIELDS, 'gift', 'geolocation']);
  const additionalEntries = Object.entries(member).filter(([key]) => !knownFields.has(key));

  if (additionalEntries.length === 0) {
    return '';
  }

  return JSON.stringify(Object.fromEntries(additionalEntries));
}

async function exportMembers() {
  const outputFile = process.env.OUTPUT_FILE || 'members_location_export.csv';

  const api = createGhostAdminClient();

  console.log('Fetching members from Ghost...');
  const members = [];
  const pageSize = 100;
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const result = await api.members.browse({
      limit: pageSize,
      page,
      include: 'labels,tiers'
    });
    const batch = Array.isArray(result) ? result : [];

    members.push(...batch);

    const nextPage = result && result.meta && result.meta.pagination ? result.meta.pagination.next : null;
    hasMore = Boolean(nextPage);
    page = nextPage || page + 1;
  }

  const locationKeys = collectLocationKeys(members);

  const csvRows = members.map((member) => {
    const geolocation = parseGeolocation(member.geolocation);

    return [
      escapeCsvValue(member.id || ''),
      escapeCsvValue(member.email || ''),
      escapeCsvValue(member.name || ''),
      escapeCsvValue(member.note || ''),
      escapeCsvValue(member.subscribed_to_emails),
      escapeCsvValue(member.complimentary_plan),
      escapeCsvValue(member.stripe_customer_id || ''),
      escapeCsvValue(member.created_at || ''),
      escapeCsvValue(member.deleted_at || ''),
      escapeCsvValue(formatLabels(member.labels)),
      escapeCsvValue(formatTiers(member.tiers)),
      escapeCsvValue(resolveGiftId(member)),
      ...locationKeys.map((key) => escapeCsvValue(normalizeLocationValue(geolocation[key]))),
      escapeCsvValue(formatAdditionalFields(member))
    ].join(',');
  });

  const csvHeader = [
    ...EXPORTED_BASE_FIELDS,
    ...locationKeys.map((key) => `location_${key}`),
    'additional_fields_json'
  ].join(',');
  const finalData = [csvHeader, ...csvRows].join('\n');
  const resolvedOutputPath = path.resolve(process.cwd(), outputFile);

  fs.writeFileSync(resolvedOutputPath, finalData, 'utf8');
  console.log(`Success! Exported ${members.length} members to ${resolvedOutputPath}`);
}

exportMembers().catch((err) => {
  console.error('Error exporting members:');
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});