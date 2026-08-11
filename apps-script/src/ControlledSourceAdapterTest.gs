function runControlledSourceAdapterTest() {
  const fixtureRecords = [
    {
      title: 'AI Hackathon Vizag',
      organizer: 'Test Technology Community',
      url: 'https://example.com/event-1',
      location: 'Visakhapatnam'
    },
    {
      title: 'Open Source Meetup',
      organizer: 'Test Open Source Group',
      url: 'https://example.com/event-2',
      location: 'Virtual'
    }
  ];

  const adapter = createControlledSourceAdapter(
    'controlled-source-001',
    fixtureRecords
  );

  const validation = validateExecutionAdapter(adapter);

  if (!validation.valid) {
    throw new Error(
      'Controlled adapter failed validation: ' +
      validation.errors.join(' ')
    );
  }

  const plan = {
    plan_id: 'plan-controlled-001',
    query_id: 'q-controlled-001',
    source_id: 'controlled-source-001'
  };

  const result = adapter.execute(plan);

  if (result.status !== 'executed') {
    throw new Error(
      'Controlled adapter did not execute.'
    );
  }

  if (result.records.length !== 2) {
    throw new Error(
      'Expected 2 fixture records, got ' +
      result.records.length
    );
  }

  if (result.records[0].title !== 'AI Hackathon Vizag') {
    throw new Error(
      'First fixture record was not preserved.'
    );
  }

  if (result.records[1].location !== 'Virtual') {
    throw new Error(
      'Second fixture location was not preserved.'
    );
  }

  if (result.records[0].source_id !== 'controlled-source-001') {
    throw new Error(
      'Source identity was not attached.'
    );
  }

  if (result.records[0].query_id !== 'q-controlled-001') {
    throw new Error(
      'Query identity was not attached.'
    );
  }

  console.log('CONTROLLED ADAPTER CREATION: PASSED');
  console.log('ADAPTER VALIDATION: PASSED');
  console.log('FIXTURE EXECUTION: PASSED');
  console.log('RECORD COUNT: PASSED');
  console.log('RECORD MAPPING: PASSED');
  console.log('SOURCE ID PROPAGATION: PASSED');
  console.log('QUERY ID PROPAGATION: PASSED');
  console.log('STEP 6B.12 TEST: PASSED');
}
