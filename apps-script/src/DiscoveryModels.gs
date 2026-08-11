function createDiscoveryRecord(query) {
  return {
    discovery_id: 'd-' + Utilities.getUuid(),
    query_id: query.query_id,
    discovered_at: new Date().toISOString(),
    title: null,
    organizer: null,
    url: null,
    source_type: null,
    location: null,
    raw_text: null,
    verification_status: 'unverified',
    status: 'discovered'
  };
}
