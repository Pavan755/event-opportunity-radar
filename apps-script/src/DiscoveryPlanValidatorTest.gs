function runDiscoveryPlanValidatorTest() {
  const validPlan = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-001',
    query_text: 'AI hackathon Visakhapatnam',
    source_class: 'official',
    status: 'planned',
    created_at: '2026-08-11T12:00:00.000Z'
  };

  if (!isValidDiscoveryPlan(validPlan)) {
    throw new Error(
      'Valid discovery plan was rejected.'
    );
  }

  const invalidPlan = {
    plan_id: 'plan-002',
    query_id: 'q-002',
    source_id: 'source-002',
    query_text: '',
    source_class: 'community',
    status: 'planned',
    created_at: '2026-08-11T12:00:00.000Z'
  };

  const validation = validateDiscoveryPlan(invalidPlan);

  if (validation.valid) {
    throw new Error(
      'Invalid discovery plan was accepted.'
    );
  }

  if (
    validation.errors.indexOf('Missing query_text.') === -1
  ) {
    throw new Error(
      'Missing query_text error was not detected.'
    );
  }

  const missingFieldsPlan = {};

  const missingValidation =
    validateDiscoveryPlan(missingFieldsPlan);

  if (missingValidation.valid) {
    throw new Error(
      'Plan with missing fields was accepted.'
    );
  }

  if (missingValidation.errors.length !== 7) {
    throw new Error(
      'Expected 7 validation errors, got ' +
      missingValidation.errors.length
    );
  }

  console.log('VALID PLAN ACCEPTED: PASSED');
  console.log('INVALID PLAN REJECTED: PASSED');
  console.log('MISSING FIELD DETECTION: PASSED');
  console.log('VALIDATION ERROR REPORTING: PASSED');
  console.log('STEP 6B.8 TEST: PASSED');
}
