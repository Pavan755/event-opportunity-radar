/**
 * Canonical Opportunity Identity
 *
 * Purpose:
 * - Derive a stable identity for a real-world opportunity.
 * - Preserve discovery_id as the identity of the individual discovery record.
 * - Provide a deterministic opportunity_id for records that represent
 *   the same underlying opportunity.
 *
 * Non-responsibilities:
 * - No web requests.
 * - No discovery.
 * - No verification.
 * - No lifecycle transitions.
 * - No scoring.
 */

function normalizeOpportunityIdentityText_(value) {
  return String(value == null ? '' : value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeOpportunityIdentityUrl_(value) {
  const normalized =
    normalizeOpportunityIdentityText_(value);

  if (!normalized) {
    return '';
  }

  return normalized
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '');
}

function buildOpportunityIdentityKey(record) {
  if (!record || typeof record !== 'object') {
    throw new Error(
      'Opportunity identity record must be an object.'
    );
  }

  const title =
    normalizeOpportunityIdentityText_(
      record.title
    );

  const organizer =
    normalizeOpportunityIdentityText_(
      record.organizer
    );

  const location =
    normalizeOpportunityIdentityText_(
      record.location
    );

  const url =
    normalizeOpportunityIdentityUrl_(
      record.url
    );

  if (
    !title &&
    !organizer &&
    !location &&
    !url
  ) {
    throw new Error(
      'Opportunity identity requires at least one identity signal.'
    );
  }

  return [
    'title=' + title,
    'organizer=' + organizer,
    'location=' + location,
    'url=' + url
  ].join('|');
}

function hashOpportunityIdentityKey_(key) {
  let hash = 2166136261;

  for (
    let index = 0;
    index < key.length;
    index += 1
  ) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(
      hash,
      16777619
    );
  }

  return hash >>> 0;
}

function createOpportunityId(record) {
  const key =
    buildOpportunityIdentityKey(record);

  const hash =
    hashOpportunityIdentityKey_(key);

  return 'o-' +
    hash.toString(16).padStart(8, '0');
}

function attachOpportunityIdentity(record) {
  if (!record || typeof record !== 'object') {
    throw new Error(
      'Opportunity identity attachment requires a record.'
    );
  }

  const updated =
    Object.assign({}, record);

  updated.opportunity_id =
    createOpportunityId(record);

  return updated;
}

function attachOpportunityIdentities(records) {
  if (!Array.isArray(records)) {
    throw new Error(
      'Opportunity identity attachment requires an array.'
    );
  }

  return records.map(function(record) {
    return attachOpportunityIdentity(
      record
    );
  });
}
