function runFullLocalDiscoveryNormalizationPipelineTest() {
  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const query = {
    query_id: 'q-pipeline-normalize-001',
    text: 'AI hackathon Visakhapatnam'
  };

  const source = {
    id: 'controlled-source-001',
    name: 'Controlled Event Source',
    type: 'controlled_fixture',
    class: 'official',
    priority: 100
  };

  const healthRecords = [
    {
      source_id: 'controlled-source-001',
      status: 'healthy',
      consecutive_failures: 0
    }
  ];

  const fixtureRecords = [
    {
      title: '  AI Hackathon Visakhapatnam  ',
      organizer: '  Test Technology Community  ',
      url: ' https://example.com/ai-hackathon ',
      location: ' Visakhapatnam ',
      source_type: 'controlled_fixture',
      raw_text: 'AI Hackathon Visakhapatnam'
    },
    {
      title: '  Open Source Virtual Meetup  ',
      organizer: '  Test Open Source Group  ',
      url: ' https://example.com/open-source ',
      location: ' Virtual ',
      source_type: 'controlled_fixture',
      raw_text: 'Open Source Virtual Meetup'
    }
  ];

  const adapter = createControlledSourceAdapter(
    source.id,
    fixtureRecords
  );

  const adapterValidation =
    validateExecutionAdapter(adapter);

  if (!adapterValidation.valid) {
    throw new Error(
      'Controlled adapter validation failed: ' +
      adapterValidation.errors.join(' ')
    );
  }

  const selectedSources = selectUsableSources(
    [source],
    healthRecords,
    policy
  );

  if (selectedSources.length !== 1) {
    throw new Error(
      'Expected exactly one usable source.'
    );
  }

  const plans = planDiscoverySources(
    [query],
    selectedSources,
    healthRecords,
    policy
  );

  if (plans.length !== 1) {
    throw new Error(
      'Expected exactly one discovery plan.'
    );
  }

  const plan = plans[0];

  if (!isValidDiscoveryPlan(plan)) {
    throw new Error(
      'Generated discovery plan failed validation.'
    );
  }

  const result = executeDiscoveryPlan(
    plan,
    [adapter]
  );

  const resultValidation =
    validateDiscoveryExecutionResult(
      result,
      plan
    );

  if (!resultValidation.valid) {
    throw new Error(
      'Execution result failed validation: ' +
      resultValidation.errors.join(' ')
    );
  }

  const normalizedRecords =
    normalizeDiscoveryRecords(
      result.records,
      {
        source_id: plan.source_id,
        query_id: plan.query_id
      }
    );

  if (normalizedRecords.length !== 2) {
    throw new Error(
      'Expected two normalized records, got ' +
      normalizedRecords.length
    );
  }

  normalizedRecords.forEach(function(record) {
    if (!record.discovery_id) {
      throw new Error(
        'Normalized record has no discovery ID.'
      );
    }

    if (record.source_id !== source.id) {
      throw new Error(
        'Source identity was lost after normalization.'
      );
    }

    if (record.query_id !== query.query_id) {
      throw new Error(
        'Query identity was lost after normalization.'
      );
    }

    if (record.status !== 'discovered') {
      throw new Error(
        'Normalized record has incorrect status.'
      );
    }

    if (record.verification_status !== 'unverified') {
      throw new Error(
        'Normalized record has incorrect verification status.'
      );
    }

    if (!record.discovered_at) {
      throw new Error(
        'Normalized record has no discovery timestamp.'
      );
    }
  });

  if (
    normalizedRecords[0].title !==
    'AI Hackathon Visakhapatnam'
  ) {
    throw new Error(
      'First event title was not normalized.'
    );
  }

  if (
    normalizedRecords[1].title !==
    'Open Source Virtual Meetup'
  ) {
    throw new Error(
      'Second event title was not normalized.'
    );
  }

  console.log('SOURCE SELECTION: PASSED');
  console.log('SOURCE PLANNING: PASSED');
  console.log('PLAN VALIDATION: PASSED');
  console.log('ADAPTER EXECUTION: PASSED');
  console.log('RESULT VALIDATION: PASSED');
  console.log('RAW RECORD COLLECTION: PASSED');
  console.log('RECORD NORMALIZATION: PASSED');
  console.log('IDENTITY PRESERVATION: PASSED');
  console.log('CANONICAL STATUS: PASSED');
  console.log('NORMALIZED RECORD COUNT: ' +
    normalizedRecords.length);
  console.log('STEP 6B.16 TEST: PASSED');
}
