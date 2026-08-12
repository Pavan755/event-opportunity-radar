function runDiscoveryResultValidatorHttpErrorTest() {
  const plan = {
    plan_id: 'plan-http-error-001',
    query_id: 'q-http-error-001',
    source_id: 'github',
    query_text: 'AI event Visakhapatnam',
    source_class: 'github',
    status: 'planned',
    created_at: '2026-08-11T12:00:00.000Z'
  };

  const result = {
    plan_id: plan.plan_id,
    query_id: plan.query_id,
    source_id: plan.source_id,
    status: 'http_error',
    records: [],
    error: 'GitHub API returned HTTP 403.'
  };

  const validation =
    validateDiscoveryExecutionResult(
      result,
      plan
    );

  if (!validation.valid) {
    throw new Error(
      'HTTP error result was rejected: ' +
      validation.errors.join(' ')
    );
  }

  console.log(
    'HTTP ERROR STATUS ACCEPTED: PASSED'
  );
  console.log(
    'HTTP ERROR RESULT SCHEMA: PASSED'
  );
  console.log(
    'STEP 6B.26A TEST: PASSED'
  );
}
