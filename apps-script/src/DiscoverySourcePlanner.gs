function planDiscoverySources(queries, sources, healthRecords, policy) {
  if (!Array.isArray(queries)) {
    throw new Error('Queries must be an array.');
  }

  if (!Array.isArray(sources)) {
    throw new Error('Sources must be an array.');
  }

  const usableSources = selectUsableSources(
    sources,
    healthRecords,
    policy
  );

  const plans = [];

  queries.forEach(function(query) {
    if (!query || !query.query_id) {
      return;
    }

    usableSources.forEach(function(source) {
      plans.push({
        plan_id: 'plan-' + Utilities.getUuid(),
        query_id: query.query_id,
        source_id: source.id,
        source_type: source.type || null,
        source_class: source.class || null,
        source_priority: Number(source.priority || 0),
        query_text: query.text || null,
        status: 'planned',
        created_at: new Date().toISOString()
      });
    });
  });

  return plans;
}
