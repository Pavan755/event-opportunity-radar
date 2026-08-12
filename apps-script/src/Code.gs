function runGitHubDiscoverySmokeTest() {
  const httpClient =
    createAppsScriptHttpClient();

  const adapters =
    createProductionAdapters(
      httpClient
    );

  const adapterValidation =
    validateProductionAdapters(adapters);

  if (!adapterValidation.valid) {
    throw new Error(
      'Production adapter validation failed: ' +
      adapterValidation.errors.join(' ')
    );
  }

  const plan = {
    plan_id: 'plan-live-github-smoke-001',
    query_id: 'q-live-github-smoke-001',
    source_id: 'github',
    source_type: 'github_repository',
    source_class: 'github',
    source_priority: 95,
    query_text: 'AI hackathon',
    status: 'planned',
    created_at: new Date().toISOString()
  };

  const result =
    executeDiscoveryPlan(
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
      'Live GitHub result failed validation: ' +
      resultValidation.errors.join(' ')
    );
  }

  console.log(
    'LIVE GITHUB REQUEST STATUS: ' +
    result.status
  );

  console.log(
    'LIVE GITHUB RECORD COUNT: ' +
    result.records.length
  );

  if (result.status === 'http_error') {
    console.log(
      'LIVE GITHUB ERROR: ' +
      result.error
    );

    return result;
  }

  if (result.status !== 'executed') {
    throw new Error(
      'Unexpected GitHub execution status: ' +
      result.status
    );
  }

  result.records.forEach(
    function(record, index) {
      console.log(
        'RECORD ' +
        (index + 1) +
        ': ' +
        JSON.stringify(record)
      );
    }
  );

  console.log(
    'STEP 6B.26 TEST: PASSED'
  );

  return result;
}
