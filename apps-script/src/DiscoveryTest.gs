function runDiscoveryEngineTest() {
  const config = {
    query_groups: [
      {
        id: 'hackathon',
        priority: 100,
        terms: ['hackathon']
      },
      {
        id: 'volunteer',
        priority: 100,
        terms: ['technical volunteer']
      }
    ],
    query_modifiers: {
      locations: [
        'Visakhapatnam',
        'Hyderabad',
        'Bengaluru'
      ],
      remote_terms: [
        'virtual',
        'online'
      ]
    }
  };

  const queries = generateDiscoveryQueries(config);

  if (!queries || queries.length === 0) {
    throw new Error('Query generation failed.');
  }

  const firstQuery = queries[0];

  const record1 = createDiscoveryRecord(firstQuery);
  const record2 = createDiscoveryRecord(firstQuery);

  record1.title = 'Test AI Hackathon';
  record1.organizer = 'Test Organizer';
  record1.url = 'https://example.com/test-event';

  record2.title = 'Test AI Hackathon';
  record2.organizer = 'Test Organizer';
  record2.url = 'https://example.com/test-event';

  const records = [record1, record2];
  const uniqueRecords = deduplicateDiscoveryRecords(records);

  if (uniqueRecords.length !== 1) {
    throw new Error(
      'Deduplication failed. Expected 1 record, got ' +
      uniqueRecords.length
    );
  }

  if (record1.verification_status !== 'unverified') {
    throw new Error('New discovery records must start as unverified.');
  }

  if (record1.status !== 'discovered') {
    throw new Error('New discovery records must start as discovered.');
  }

  console.log('QUERY COUNT: ' + queries.length);
  console.log('FIRST QUERY: ' + firstQuery.text);
  console.log('DEDUPLICATED RECORD COUNT: ' + uniqueRecords.length);
  console.log('VERIFICATION STATUS: ' + record1.verification_status);
  console.log('DISCOVERY STATUS: ' + record1.status);
  console.log('STEP 5D TEST: PASSED');
}
