function runFullLocalDiscoveryPipelineTest() {
  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const queries = [
    {
      query_id: 'q-pipeline-001',
      text: 'AI hackathon Visakhapatnam'
    },
    {
      query_id: 'q-pipeline-002',
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
      location: 'Visakhapatnam'
    },
    {
      title: 'Open Source Virtual Meetup',
      organizer: 'Test Open Source Group',
      url: 'https://example.com/open-source',
      location: 'Virtual'
    }
  ];

  const adapter = createControlledSourceAdapter(
    'controlled-source-001',
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
    sources,
    healthRecords,
    policy
  );

  if (selectedSources.length !== 1) {
    throw new Error(
      'Expected exactly one usable source.'
    );
  }

  const planned =
    planDiscoverySources(
      queries,
      selectedSources,
      healthRecords,
      policy
    );

  if (planned.length !== 2) {
    throw new Error(
      'Expected two discovery plans, got ' +
      planned.length
    );
  }

  const deduplicated =
    deduplicateDiscoveryPlans(planned);

  if (deduplicated.length !== 2) {
    throw new Error(
      'Expected two unique discovery plans.'
    );
  }

  const executedResults = [];

  deduplicated.forEach(function(plan) {
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

    executedResults.push(result);
  });

  if (executedResults.length !== 2) {
    throw new Error(
      'Expected two execution results.'
    );
  }

  executedResults.forEach(function(result) {
    if (result.status !== 'executed') {
      throw new Error(
        'Every controlled execution should succeed.'
      );
    }

    if (result.records.length !== 2) {
      throw new Error(
        'Every controlled execution should return two fixture records.'
      );
    }
  });

  const allRecords = [];

  executedResults.forEach(function(result) {
    result.records.forEach(function(record) {
      allRecords.push(record);
    });
  });

  if (allRecords.length !== 4) {
    throw new Error(
      'Expected four total discovery records, got ' +
      allRecords.length
    );
  }

  if (allRecords.some(function(record) {
    return !record.title;
  })) {
    throw new Error(
      'Every discovery record must have a title.'
    );
  }

  if (allRecords.some(function(record) {
    return record.source_id !== 'controlled-source-001';
  })) {
    throw new Error(
      'Source identity was lost during the pipeline.'
    );
  }

  console.log('SOURCE SELECTION: PASSED');
  console.log('SOURCE PLANNING: PASSED');
  console.log('PLAN DEDUPLICATION: PASSED');
  console.log('PLAN VALIDATION: PASSED');
  console.log('ADAPTER EXECUTION: PASSED');
  console.log('RESULT VALIDATION: PASSED');
  console.log('RECORD COLLECTION: PASSED');
  console.log('IDENTITY PRESERVATION: PASSED');
  console.log('TOTAL RECORDS: ' + allRecords.length);
  console.log('STEP 6B.13 TEST: PASSED');
}
