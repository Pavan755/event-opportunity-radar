function normalizeDiscoveryKey_(title, organizer, url) {
  const normalizedTitle = (title || '').trim().toLowerCase();
  const normalizedOrganizer = (organizer || '').trim().toLowerCase();
  const normalizedUrl = (url || '').trim().toLowerCase();

  return [
    normalizedTitle,
    normalizedOrganizer,
    normalizedUrl
  ].join('|');
}

function deduplicateDiscoveryRecords(records) {
  const seen = {};
  const unique = [];

  records.forEach(function(record) {
    const key = normalizeDiscoveryKey_(
      record.title,
      record.organizer,
      record.url
    );

    if (!seen[key]) {
      seen[key] = true;
      unique.push(record);
    }
  });

  return unique;
}
