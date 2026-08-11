function createSourceHealthRecord(source) {
  return {
    source_id: source.id || null,
    source_name: source.name || null,
    status: 'unknown',
    last_checked_at: null,
    last_success_at: null,
    last_failure_at: null,
    consecutive_failures: 0,
    records_found: 0,
    records_normalized: 0,
    records_rejected: 0,
    error_message: null
  };
}

function markSourceSuccess(health, recordsFound, recordsNormalized) {
  health.status = 'healthy';
  health.last_checked_at = new Date().toISOString();
  health.last_success_at = health.last_checked_at;
  health.consecutive_failures = 0;
  health.records_found = recordsFound || 0;
  health.records_normalized = recordsNormalized || 0;
  health.records_rejected = Math.max(
    0,
    health.records_found - health.records_normalized
  );
  health.error_message = null;

  return health;
}

function markSourceFailure(health, errorMessage) {
  health.status = 'unhealthy';
  health.last_checked_at = new Date().toISOString();
  health.last_failure_at = health.last_checked_at;
  health.consecutive_failures += 1;
  health.error_message = errorMessage || 'Unknown source error';

  return health;
}
