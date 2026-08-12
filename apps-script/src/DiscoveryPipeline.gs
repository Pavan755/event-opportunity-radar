function runDiscoveryPipeline(
  queries,
  sources,
  healthRecords,
  adapters,
  policy
) {
  if (!Array.isArray(queries)) {
    throw new Error('Queries must be an array.');
  }

  if (!Array.isArray(sources)) {
    throw new Error('Sources must be an array.');
  }

  if (!Array.isArray(healthRecords)) {
    throw new Error('Health records must be an array.');
  }

  if (!Array.isArray(adapters)) {
    throw new Error('Adapters must be an array.');
  }

  if (!policy) {
    throw new Error('Policy is required.');
  }

  const selectedSources = selectUsableSources(
    sources,
    healthRecords,
    policy
  );

  const plans = planDiscoverySources(
    queries,
    selectedSources,
    healthRecords,
    policy
  );

  const uniquePlans =
    deduplicateDiscoveryPlans(plans);

  const normalizedRecords = [];

  uniquePlans.forEach(function(plan) {
    if (!isValidDiscoveryPlan(plan)) {
      throw new Error(
        'Generated discovery plan failed validation.'
      );
    }

    const result = executeDiscoveryPlan(
      plan,
      adapters
    );

    const resultValidation =
      validateDiscoveryExecutionResult(
        result,
        plan
      );

    if (!resultValidation.valid) {
      throw new Error(
        'Discovery execution result failed validation: ' +
        resultValidation.errors.join(' ')
      );
    }

    if (result.status !== 'executed') {
      return;
    }

    const records =
      normalizeDiscoveryRecords(
        result.records,
        {
          source_id: plan.source_id,
          query_id: plan.query_id
        }
      );

    const source =
      selectedSources.filter(
        function(candidate) {
          return candidate &&
            candidate.id === plan.source_id;
        }
      )[0];

    if (!source) {
      throw new Error(
        'Selected source metadata not found for plan source_id: ' +
        plan.source_id
      );
    }

    records.forEach(function(record) {
      const evidenceAttachedRecord =
        attachPolicyAwareDiscoveryEvidence(
          record,
          plan,
          source,
          policy
        );

      normalizedRecords.push(
        evidenceAttachedRecord
      );
    });
  });

  return {
    selected_sources: selectedSources,
    plans: uniquePlans,
    records: normalizedRecords,
    status: 'completed'
  };
}
