function runDiscoveryPipelineRegressionTest() {
  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const queries = [
    {
      query_id: 'q-regression-001',
      text: 'AI hackathon Visakhapatnam'
    },
    {
      query_id: 'q-regression-002',
      text: 'open source event virtual'
    }
  ];

  const sources = [
    {
      id: 'controlled-source-001',
      name: 'Controlled Event Source',
      type: 'controlled_fixture',
      class: 'official',
      priority: 100
    }
  ];

  const healthRecords = [
    {
      source_id: 'controlled-source-001',
      status: 'healthy',
      consecutive_failures: 0
    }
  ];

  const fixtureRecords = [
    {
      title: 'AI Hackathon Visakhapatnam',
      organizer: 'Test Technology Community',
      url: 'https://example.com/ai-hackathon',
      location: 'Visakhapatnam',
      source_type: 'controlled_fixture',
      raw_text: 'AI Hackathon Visakhapatnam'
    },
    {
      title: 'Open Source Virtual Meetup',
      organizer: 'Test Open Source Group',
      url: 'https://example.com/open-source',
      location: 'Virtual',
      source_type: 'controlled_fixture',
      raw_text: 'Open Source Virtual Meetup'
    }
  ];

  const adapter = createControlledSourceAdapter(
    'controlled-source-001',
    fixtureRecords
  );

  const result = runDiscoveryPipeline(
    queries,
    sources,
    healthRecords,
    [adapter],
    policy
  );

  if (result.status !== 'completed') {
    throw new Error(
      'Regression pipeline did not complete.'
    );
  }

  if (result.selected_sources.length !== 1) {
    throw new Error(
      'Regression expected one selected source.'
    );
  }

  if (result.plans.length !== 2) {
    throw new Error(
      'Regression expected two plans, got ' +
      result.plans.length
    );
  }

  if (result.records.length !== 4) {
    throw new Error(
      'Regression expected four records, got ' +
      result.records.length
    );
  }

  const titles = result.records.map(function(record) {
    return record.title;
  });

  if (
    titles.indexOf('AI Hackathon Visakhapatnam') === -1
  ) {
    throw new Error(
      'AI Hackathon record missing.'
    );
  }

  if (
    titles.indexOf('Open Source Virtual Meetup') === -1
  ) {
    throw new Error(
      'Open Source record missing.'
    );
  }

  result.records.forEach(function(record) {
    if (!record.discovery_id) {
      throw new Error(
        'Regression record missing discovery_id.'
      );
    }

    if (!record.source_id) {
      throw new Error(
        'Regression record missing source_id.'
      );
    }

    if (!record.query_id) {
      throw new Error(
        'Regression record missing query_id.'
      );
    }

    if (record.status !== 'discovered') {
      throw new Error(
        'Regression record has incorrect status.'
      );
    }

    if (record.verification_status !== 'unverified') {
      throw new Error(
        'Regression record has incorrect verification status.'
      );
    }

    if (!record.discovered_at) {
      throw new Error(
        'Regression record missing discovered_at.'
      );
    }
  });

  console.log('ORCHESTRATOR EXECUTION: PASSED');
  console.log('SOURCE SELECTION REGRESSION: PASSED');
  console.log('PLAN REGRESSION: PASSED');
  console.log('EXECUTION REGRESSION: PASSED');
  console.log('NORMALIZATION REGRESSION: PASSED');
  console.log('RECORD COUNT REGRESSION: PASSED');
  console.log('RECORD CONTENT REGRESSION: PASSED');
  console.log('CANONICAL SCHEMA REGRESSION: PASSED');
  console.log('STEP 6B.18 TEST: PASSED');
}
