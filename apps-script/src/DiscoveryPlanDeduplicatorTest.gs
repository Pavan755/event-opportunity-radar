function runDiscoveryPlanDeduplicatorTest() {
  const plans = [
    {
      plan_id: 'plan-001',
      query_id: 'q-001',
      source_id: 'source-001'
    },
    {
      plan_id: 'plan-002',
      query_id: 'q-001',
      source_id: 'source-001'
    },
    {
      plan_id: 'plan-003',
      query_id: 'q-001',
      source_id: 'source-002'
    },
    {
      plan_id: 'plan-004',
      query_id: 'q-002',
      source_id: 'source-001'
    },
    {
      plan_id: 'plan-005',
      query_id: 'q-002',
      source_id: 'source-001'
    }
  ];

  const unique = deduplicateDiscoveryPlans(plans);

  if (unique.length !== 3) {
    throw new Error(
      'Expected 3 unique plans, got ' + unique.length
    );
  }

  if (
    unique[0].query_id !== 'q-001' ||
    unique[0].source_id !== 'source-001'
  ) {
    throw new Error(
      'First unique plan was not preserved correctly.'
    );
  }

  if (
    unique[1].query_id !== 'q-001' ||
    unique[1].source_id !== 'source-002'
  ) {
    throw new Error(
      'Second unique plan was not preserved correctly.'
    );
  }

  if (
    unique[2].query_id !== 'q-002' ||
    unique[2].source_id !== 'source-001'
  ) {
    throw new Error(
      'Third unique plan was not preserved correctly.'
    );
  }

  console.log('DUPLICATE PLAN REMOVAL: PASSED');
  console.log('UNIQUE PLAN COUNT: PASSED');
  console.log('ORIGINAL ORDER PRESERVED: PASSED');
  console.log('QUERY + SOURCE KEY: PASSED');
  console.log('STEP 6B.7 TEST: PASSED');
}
