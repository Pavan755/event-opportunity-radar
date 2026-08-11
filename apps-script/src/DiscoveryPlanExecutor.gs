function executeDiscoveryPlan(plan, adapters) {
  const validation = validateDiscoveryPlan(plan);

  if (!validation.valid) {
    throw new Error(
      'Cannot execute invalid discovery plan: ' +
      validation.errors.join(' ')
    );
  }

  if (!Array.isArray(adapters)) {
    throw new Error('Adapters must be an array.');
  }

  let adapter = null;

  for (let i = 0; i < adapters.length; i++) {
    const candidate = adapters[i];

    if (
      candidate &&
      candidate.source_id === plan.source_id
    ) {
      adapter = candidate;
      break;
    }
  }

  if (!adapter) {
    return {
      plan_id: plan.plan_id,
      query_id: plan.query_id,
      source_id: plan.source_id,
      status: 'adapter_unavailable',
      records: [],
      error: 'No adapter registered for source.'
    };
  }

  if (typeof adapter.execute !== 'function') {
    return {
      plan_id: plan.plan_id,
      query_id: plan.query_id,
      source_id: plan.source_id,
      status: 'adapter_invalid',
      records: [],
      error: 'Registered adapter does not expose execute().'
    };
  }

  const result = adapter.execute(plan);

  if (!result || typeof result !== 'object') {
    return {
      plan_id: plan.plan_id,
      query_id: plan.query_id,
      source_id: plan.source_id,
      status: 'execution_invalid',
      records: [],
      error: 'Adapter returned an invalid result.'
    };
  }

  return {
    plan_id: plan.plan_id,
    query_id: plan.query_id,
    source_id: plan.source_id,
    status: result.status || 'executed',
    records: Array.isArray(result.records)
      ? result.records
      : [],
    error: result.error || null
  };
}
