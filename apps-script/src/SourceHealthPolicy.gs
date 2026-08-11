function evaluateSourceHealth(health, policy) {
  const config = policy || {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  if (!health) {
    throw new Error('Health record is required.');
  }

  if (health.status === 'healthy') {
    return 'healthy';
  }

  if (health.consecutive_failures >= config.max_consecutive_failures) {
    return 'disabled';
  }

  if (
    health.status === 'unhealthy' &&
    health.consecutive_failures > 0
  ) {
    return 'degraded';
  }

  return 'unknown';
}

function isSourceUsable(health, policy) {
  const state = evaluateSourceHealth(health, policy);

  return state === 'healthy' || state === 'degraded';
}
