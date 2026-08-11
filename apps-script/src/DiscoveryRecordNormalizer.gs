function normalizeDiscoveryRecord(record, context) {
  if (!record || typeof record !== 'object') {
    throw new Error('Discovery record must be an object.');
  }

  if (!context || !context.source_id) {
    throw new Error('Normalization context must contain source_id.');
  }

  if (!context.query_id) {
    throw new Error('Normalization context must contain query_id.');
  }

  const normalized = {
    discovery_id:
      record.discovery_id ||
      'd-' + Utilities.getUuid(),

    query_id: context.query_id,
    source_id: context.source_id,

    discovered_at:
      record.discovered_at ||
      new Date().toISOString(),

    title:
      record.title == null
        ? null
        : String(record.title).trim(),

    organizer:
      record.organizer == null
        ? null
        : String(record.organizer).trim(),

    url:
      record.url == null
        ? null
        : String(record.url).trim(),

    source_type:
      record.source_type == null
        ? null
        : String(record.source_type).trim(),

    location:
      record.location == null
        ? null
        : String(record.location).trim(),

    raw_text:
      record.raw_text == null
        ? null
        : String(record.raw_text),

    verification_status:
      record.verification_status || 'unverified',

    status:
      record.status || 'discovered'
  };

  return normalized;
}

function normalizeDiscoveryRecords(records, context) {
  if (!Array.isArray(records)) {
    throw new Error('Discovery records must be an array.');
  }

  return records.map(function(record) {
    return normalizeDiscoveryRecord(record, context);
  });
}
