function runSourceSelectorTest() {
  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const sources = [
    {
      id: 'source-001',
      name: 'Primary Official Source',
      class: 'official',
      priority: 100
    },
    {
      id: 'source-002',
      name: 'Community Source',
      class: 'community',
      priority: 60
    },
    {
      id: 'source-003',
      name: 'Disabled Source',
      class: 'official',
      priority: 90
    },
    {
      id: 'source-004',
      name: 'Degraded Source',
      class: 'aggregator',
      priority: 80
    },
    {
      id: 'source-005',
      name: 'Unknown Source',
      class: 'community',
      priority: 70
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
      status: 'healthy',
      consecutive_failures: 0
    },
    {
      source_id: 'source-003',
      status: 'unhealthy',
      consecutive_failures: 3
    },
    {
      source_id: 'source-004',
      status: 'unhealthy',
      consecutive_failures: 1
    }
  ];

  const selected = selectUsableSources(
    sources,
    healthRecords,
    policy
  );

  if (selected.length !== 3) {
    throw new Error(
      'Expected 3 usable sources, got ' + selected.length
    );
  }

  if (selected[0].id !== 'source-001') {
    throw new Error(
      'Highest-priority usable source was not selected first.'
    );
  }

  if (selected[1].id !== 'source-004') {
    throw new Error(
      'Second-highest-priority usable source was not selected correctly.'
    );
  }

  if (selected[2].id !== 'source-002') {
    throw new Error(
      'Third usable source was not selected correctly.'
    );
  }

  const officialSources = selectSourcesByClass(
    sources,
    healthRecords,
    policy,
    'official'
  );

  if (officialSources.length !== 1) {
    throw new Error(
      'Expected exactly one usable official source.'
    );
  }

  if (officialSources[0].id !== 'source-001') {
    throw new Error(
      'Incorrect official source selected.'
    );
  }

  const communitySources = selectSourcesByClass(
    sources,
    healthRecords,
    policy,
    'community'
  );

  if (communitySources.length !== 1) {
    throw new Error(
      'Unknown community source must not be selected.'
    );
  }

  if (communitySources[0].id !== 'source-002') {
    throw new Error(
      'Incorrect community source selected.'
    );
  }

  console.log('USABLE SOURCE COUNT: PASSED');
  console.log('PRIORITY ORDER: PASSED');
  console.log('DISABLED SOURCE EXCLUDED: PASSED');
  console.log('UNKNOWN SOURCE EXCLUDED: PASSED');
  console.log('DEGRADED SOURCE RETAINED: PASSED');
  console.log('CLASS FILTER: PASSED');
  console.log('STEP 6B.5 TEST: PASSED');
}
