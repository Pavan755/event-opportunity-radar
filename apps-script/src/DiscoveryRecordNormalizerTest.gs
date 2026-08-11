function runDiscoveryRecordNormalizerTest() {
  const context = {
    source_id: 'controlled-source-001',
    query_id: 'q-normalize-001'
  };

  const rawRecord = {
    title: '  AI Hackathon Visakhapatnam  ',
    organizer: '  Test Technology Community  ',
    url: ' https://example.com/ai-hackathon ',
    source_type: 'controlled_fixture',
    location: ' Visakhapatnam ',
    raw_text: 'AI Hackathon Visakhapatnam - test event',
    verification_status: 'unverified',
    status: 'discovered'
  };

  const normalized =
    normalizeDiscoveryRecord(rawRecord, context);

  if (!normalized.discovery_id) {
    throw new Error('Discovery ID was not generated.');
  }

  if (normalized.query_id !== 'q-normalize-001') {
    throw new Error('Query ID was not preserved.');
  }

  if (normalized.source_id !== 'controlled-source-001') {
    throw new Error('Source ID was not preserved.');
  }

  if (normalized.title !== 'AI Hackathon Visakhapatnam') {
    throw new Error('Title was not normalized correctly.');
  }

  if (normalized.organizer !== 'Test Technology Community') {
    throw new Error('Organizer was not normalized correctly.');
  }

  if (normalized.url !== 'https://example.com/ai-hackathon') {
    throw new Error('URL was not normalized correctly.');
  }

  if (normalized.location !== 'Visakhapatnam') {
    throw new Error('Location was not normalized correctly.');
  }

  if (normalized.verification_status !== 'unverified') {
    throw new Error(
      'Verification status was not preserved.'
    );
  }

  if (normalized.status !== 'discovered') {
    throw new Error(
      'Discovery status was not preserved.'
    );
  }

  const records = normalizeDiscoveryRecords(
    [rawRecord, rawRecord],
    context
  );

  if (records.length !== 2) {
    throw new Error(
      'Expected two normalized records, got ' +
      records.length
    );
  }

  records.forEach(function(record) {
    if (record.source_id !== 'controlled-source-001') {
      throw new Error(
        'Source identity was lost during normalization.'
      );
    }

    if (record.query_id !== 'q-normalize-001') {
      throw new Error(
        'Query identity was lost during normalization.'
      );
    }
  });

  console.log('DISCOVERY ID GENERATION: PASSED');
  console.log('QUERY ID PRESERVATION: PASSED');
  console.log('SOURCE ID PRESERVATION: PASSED');
  console.log('TITLE NORMALIZATION: PASSED');
  console.log('ORGANIZER NORMALIZATION: PASSED');
  console.log('URL NORMALIZATION: PASSED');
  console.log('LOCATION NORMALIZATION: PASSED');
  console.log('STATUS PRESERVATION: PASSED');
  console.log('BATCH NORMALIZATION: PASSED');
  console.log('STEP 6B.14 TEST: PASSED');
}
