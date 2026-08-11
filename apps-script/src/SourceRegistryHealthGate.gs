function getSourceHealthState(source, healthRecords, policy) {
  if (!source) {
    throw new Error('Source is required.');
  }

  const records = healthRecords || [];
  const health = records.find(function(record) {
    return record.source_id === source.id;
  });

  if (!health) {
    return 'unknown';
  }

  return evaluateSourceHealth(health, policy);
}

function isRegisteredSourceUsable(source, healthRecords, policy) {
  const state = getSourceHealthState(source, healthRecords, policy);

  return state === 'healthy' || state === 'degraded';
}
