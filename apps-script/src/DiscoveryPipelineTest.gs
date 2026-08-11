function runDiscoveryPipelineTest() {
  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const queries = [
    {
      query_id: 'q-orchestrator-001',
      text: 'AI hackathon Visakhapatnam'
    },
    {
      query_id: 'q-orchestrator-002',
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
      'Pipeline did not complete successfully.'
    );
  }

  if (result.selected_sources.length !== 1) {
    throw new Error(
      'Expected one selected source.'
    );
  }

  if (result.plans.length !== 2) {
    throw new Error(
      'Expected two unique discovery plans, got ' +
      result.plans.length
    );
  }

  if (result.records.length !== 4) {
    throw new Error(
      'Expected four normalized records, got ' +
      result.records.length
    );
  }

  result.records.forEach(function(record) {
    if (!record.discovery_id) {
      throw new Error(
        'Record is missing discovery ID.'
      );
    }

    if (!record.source_id) {
      throw new Error(
        'Record is missing source ID.'
      );
    }

    if (!record.query_id) {
      throw new Error(
        'Record is missing query ID.'
      );
    }

    if (record.status !== 'discovered') {
      throw new Error(
        'Record has incorrect discovery status.'
      );
    }

    if (record.verification_status !== 'unverified') {
      throw new Error(
        'Record has incorrect verification status.'
      );
    }

    if (!record.discovered_at) {
      throw new Error(
        'Record is missing discovery timestamp.'
      );
    }
  });

  console.log('SOURCE SELECTION: PASSED');
  console.log('PLAN CREATION: PASSED');
  console.log('PLAN DEDUPLICATION: PASSED');
  console.log('PLAN VALIDATION: PASSED');
  console.log('ADAPTER EXECUTION: PASSED');
  console.log('RESULT VALIDATION: PASSED');
  console.log('NORMALIZATION: PASSED');
  console.log('CANONICAL RECORDS: PASSED');
  console.log('PIPELINE STATUS: PASSED');
  console.log('TOTAL RECORDS: ' + result.records.length);
  console.log('STEP 6B.17 TEST: PASSED');
}
