function runDiscoveryNormalizationPipelineTest() {
  const context = {
    source_id: 'controlled-source-001',
    query_id: 'q-pipeline-normalize-001'
  };

  const rawRecords = [
    {
      title: '  AI Hackathon Visakhapatnam  ',
      organizer: '  Test Technology Community  ',
      url: ' https://example.com/ai-hackathon ',
      source_type: 'controlled_fixture',
      location: ' Visakhapatnam ',
      raw_text: 'AI Hackathon Visakhapatnam'
    },
    {
      title: '  Open Source Virtual Meetup  ',
      organizer: '  Test Open Source Group  ',
      url: ' https://example.com/open-source ',
      source_type: 'controlled_fixture',
      location: ' Virtual ',
      raw_text: 'Open Source Virtual Meetup'
    }
  ];

  const normalized =
    normalizeDiscoveryRecords(rawRecords, context);

  if (normalized.length !== 2) {
    throw new Error(
      'Expected two normalized records, got ' +
      normalized.length
    );
  }

  if (normalized[0].title !== 'AI Hackathon Visakhapatnam') {
    throw new Error(
      'First normalized title is incorrect.'
    );
  }

  if (normalized[1].title !== 'Open Source Virtual Meetup') {
    throw new Error(
      'Second normalized title is incorrect.'
    );
  }

  normalized.forEach(function(record) {
    if (record.source_id !== context.source_id) {
      throw new Error(
        'Source identity was lost during normalization.'
      );
    }

    if (record.query_id !== context.query_id) {
      throw new Error(
        'Query identity was lost during normalization.'
      );
    }

    if (record.status !== 'discovered') {
      throw new Error(
        'Normalized record has incorrect discovery status.'
      );
    }

    if (record.verification_status !== 'unverified') {
      throw new Error(
        'Normalized record has incorrect verification status.'
      );
    }

    if (!record.discovery_id) {
      throw new Error(
        'Normalized record has no discovery ID.'
      );
    }

    if (!record.discovered_at) {
      throw new Error(
        'Normalized record has no discovery timestamp.'
      );
    }
  });

  console.log('RAW RECORD INPUT: PASSED');
  console.log('NORMALIZATION: PASSED');
  console.log('RECORD COUNT: PASSED');
  console.log('SOURCE IDENTITY: PASSED');
  console.log('QUERY IDENTITY: PASSED');
  console.log('DISCOVERY STATUS: PASSED');
  console.log('VERIFICATION STATUS: PASSED');
  console.log('DISCOVERY IDs: PASSED');
  console.log('DISCOVERY TIMESTAMPS: PASSED');
  console.log('STEP 6B.15 TEST: PASSED');
}
