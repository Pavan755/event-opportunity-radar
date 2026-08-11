function runDiscoveryPlanExecutorTest() {
  const validPlan = {
    plan_id: 'plan-001',
    query_id: 'q-001',
    source_id: 'source-001',
    query_text: 'AI hackathon Visakhapatnam',
    source_class: 'official',
    status: 'planned',
    created_at: '2026-08-11T12:00:00.000Z'
  };

  const adapters = [
    {
      source_id: 'source-001',

      execute: function(plan) {
        return {
          status: 'executed',
          records: [
            {
              title: 'Test AI Hackathon',
              source_id: plan.source_id
            }
          ]
        };
      }
    }
  ];

  const result = executeDiscoveryPlan(
    validPlan,
    adapters
  );

  if (result.status !== 'executed') {
    throw new Error(
      'Valid plan was not executed.'
    );
  }

  if (result.records.length !== 1) {
    throw new Error(
      'Expected one discovery record.'
    );
  }

  if (result.records[0].title !== 'Test AI Hackathon') {
    throw new Error(
      'Adapter record was not returned correctly.'
    );
  }

  const noAdapterResult = executeDiscoveryPlan(
    {
      plan_id: 'plan-002',
      query_id: 'q-002',
      source_id: 'source-999',
      query_text: 'Test query',
      source_class: 'community',
      status: 'planned',
      created_at: '2026-08-11T12:00:00.000Z'
    },
    adapters
  );

  if (noAdapterResult.status !== 'adapter_unavailable') {
    throw new Error(
      'Missing adapter was not handled correctly.'
    );
  }

  if (noAdapterResult.records.length !== 0) {
    throw new Error(
      'Missing adapter must not produce records.'
    );
  }

  const invalidAdapterResult = executeDiscoveryPlan(
    validPlan,
    [
      {
        source_id: 'source-001'
      }
    ]
  );

  if (invalidAdapterResult.status !== 'adapter_invalid') {
    throw new Error(
      'Invalid adapter was not detected.'
    );
  }

  let invalidPlanRejected = false;

  try {
    executeDiscoveryPlan(
      {
        plan_id: 'bad-plan',
        query_id: 'bad-query',
        source_id: 'source-001',
        query_text: '',
        source_class: 'official',
        status: 'planned',
        created_at: '2026-08-11T12:00:00.000Z'
      },
      adapters
    );
  } catch (error) {
    invalidPlanRejected = true;
  }

  if (!invalidPlanRejected) {
    throw new Error(
      'Invalid discovery plan was not rejected.'
    );
  }

  console.log('VALID PLAN EXECUTION: PASSED');
  console.log('ADAPTER RECORD RETURN: PASSED');
  console.log('MISSING ADAPTER HANDLING: PASSED');
  console.log('INVALID ADAPTER HANDLING: PASSED');
  console.log('INVALID PLAN REJECTION: PASSED');
  console.log('STEP 6B.9 TEST: PASSED');
}
