function runDiscoverySourcePlannerTest() {
  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const queries = [
    {
      query_id: 'q-001',
      text: 'AI hackathon Visakhapatnam'
    },
    {
      query_id: 'q-002',
      text: 'student fellowship online'
    }
  ];

  const sources = [
    {
      id: 'source-001',
      type: 'organizer_social_profile',
      class: 'social',
      priority: 100
    },
    {
      id: 'source-002',
      type: 'organizer_social_post',
      class: 'social',
      priority: 60
    },
    {
      id: 'source-003',
      type: 'disabled_source',
      class: 'official',
      priority: 90
    }
  ];

  const healthRecords = [
    {
      source_id: 'source-001',
      status: 'healthy',
      consecutive_failures: 0
    },
    {
      source_id: 'source-002',
      status: 'unhealthy',
      consecutive_failures: 1
    },
    {
      source_id: 'source-003',
      status: 'unhealthy',
      consecutive_failures: 3
    }
  ];

  const plans = planDiscoverySources(
    queries,
    sources,
    healthRecords,
    policy
  );

  if (plans.length !== 4) {
    throw new Error(
      'Expected 4 discovery plans, got ' + plans.length
    );
  }

  const first = plans[0];

  if (first.query_id !== 'q-001') {
    throw new Error(
      'First plan has incorrect query ID.'
    );
  }

  if (first.source_id !== 'source-001') {
    throw new Error(
      'Highest-priority source was not planned first.'
    );
  }

  if (first.status !== 'planned') {
    throw new Error(
      'Discovery plan must start with planned status.'
    );
  }

  if (plans.some(function(plan) {
    return plan.source_id === 'source-003';
  })) {
    throw new Error(
      'Disabled source must not appear in discovery plans.'
    );
  }

  if (plans.some(function(plan) {
    return !plan.query_text;
  })) {
    throw new Error(
      'Every discovery plan must retain query text.'
    );
  }

  if (plans.some(function(plan) {
    return !plan.plan_id;
  })) {
    throw new Error(
      'Every discovery plan must have a plan ID.'
    );
  }

  console.log('PLAN COUNT: PASSED');
  console.log('QUERY MAPPING: PASSED');
  console.log('SOURCE MAPPING: PASSED');
  console.log('DISABLED SOURCE EXCLUDED: PASSED');
  console.log('PLAN STATUS: PASSED');
  console.log('QUERY TEXT RETAINED: PASSED');
  console.log('PLAN IDs: PASSED');
  console.log('STEP 6B.6 TEST: PASSED');
}
