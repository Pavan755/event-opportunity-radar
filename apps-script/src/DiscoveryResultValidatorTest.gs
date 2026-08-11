function runDiscoveryResultValidatorTest() {
  const plan = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-001',
    query_text: 'AI hackathon Visakhapatnam',
    source_class: 'official',
    status: 'planned',
    created_at: '2026-08-11T12:00:00.000Z'
  };

  const validResult = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-001',
    status: 'executed',
    records: [
      {
        title: 'Test AI Hackathon'
      }
    ],
    error: null
  };

  if (
    !isValidDiscoveryExecutionResult(
      validResult,
      plan
    )
  ) {
    throw new Error(
      'Valid execution result was rejected.'
    );
  }

  const badStatusResult = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-001',
    status: 'unknown-status',
    records: [],
    error: null
  };

  if (
    isValidDiscoveryExecutionResult(
      badStatusResult,
      plan
    )
  ) {
    throw new Error(
      'Invalid execution status was accepted.'
    );
  }

  const badRecordsResult = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-001',
    status: 'executed',
    records: 'not-an-array',
    error: null
  };

  if (
    isValidDiscoveryExecutionResult(
      badRecordsResult,
      plan
    )
  ) {
    throw new Error(
      'Non-array records were accepted.'
    );
  }

  const mismatchedSourceResult = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-999',
    status: 'executed',
    records: [],
    error: null
  };

  if (
    isValidDiscoveryExecutionResult(
      mismatchedSourceResult,
      plan
    )
  ) {
    throw new Error(
      'Mismatched source ID was accepted.'
    );
  }

  const badErrorResult = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-001',
    status: 'failed',
    records: [],
    error: {
      message: 'Invalid error type'
    }
  };

  if (
    isValidDiscoveryExecutionResult(
      badErrorResult,
      plan
    )
  ) {
    throw new Error(
      'Invalid error field was accepted.'
    );
  }

  console.log('VALID RESULT ACCEPTED: PASSED');
  console.log('INVALID STATUS REJECTED: PASSED');
  console.log('INVALID RECORDS REJECTED: PASSED');
  console.log('SOURCE ID MISMATCH REJECTED: PASSED');
  console.log('INVALID ERROR FIELD REJECTED: PASSED');
  console.log('STEP 6B.10 TEST: PASSED');
}
