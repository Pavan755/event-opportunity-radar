function createControlledSourceAdapter(sourceId, fixtureRecords) {
  if (!sourceId || String(sourceId).trim() === '') {
    throw new Error('sourceId is required.');
  }

  if (!Array.isArray(fixtureRecords)) {
    throw new Error('fixtureRecords must be an array.');
  }

  return createExecutionAdapter(
    sourceId,
    function(plan) {
      return {
        status: 'executed',
        records: fixtureRecords.map(function(record) {
          return {
            title: record.title || null,
            organizer: record.organizer || null,
            url: record.url || null,
            location: record.location || null,
            source_id: sourceId,
            query_id: plan.query_id
          };
        }),
        error: null
      };
    }
  );
}
