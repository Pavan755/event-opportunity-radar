function runExecutionAdapterTest() {
  const adapter = createExecutionAdapter(
    'source-test-001',
    function(plan) {
      return {
        status: 'executed',
        records: [
          {
            title: 'Controlled Test Event',
            source_id: plan.source_id
          }
        ],
        error: null
      };
    }
  );

  const validation = validateExecutionAdapter(adapter);

  if (!validation.valid) {
    throw new Error(
      'Valid execution adapter was rejected: ' +
      validation.errors.join(' ')
    );
  }

  if (adapter.source_id !== 'source-test-001') {
    throw new Error('Adapter source ID mismatch.');
  }

  if (typeof adapter.execute !== 'function') {
    throw new Error('Adapter execute function missing.');
  }

  const result = adapter.execute({
    plan_id: 'plan-test-001',
    source_id: 'source-test-001'
  });

  if (result.status !== 'executed') {
    throw new Error('Controlled adapter did not execute.');
  }

  if (result.records.length !== 1) {
    throw new Error('Controlled adapter returned incorrect record count.');
  }

  let invalidRejected = false;

  try {
    createExecutionAdapter(
      'source-test-002',
      null
    );
  } catch (error) {
    invalidRejected = true;
  }

  if (!invalidRejected) {
    throw new Error(
      'Adapter without execute function was accepted.'
    );
  }

  console.log('ADAPTER CREATION: PASSED');
  console.log('ADAPTER VALIDATION: PASSED');
  console.log('ADAPTER EXECUTION: PASSED');
  console.log('RECORD RETURN: PASSED');
  console.log('INVALID ADAPTER REJECTION: PASSED');
  console.log('STEP 6B.11 TEST: PASSED');
}
