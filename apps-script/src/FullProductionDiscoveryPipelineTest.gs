function runFullProductionDiscoveryPipelineTest() {
  const fakeHttpClient = {
    fetch: function(url, options) {
      return {
        status_code: 200,
        content_type: 'application/json',
        body: JSON.stringify({
          items: [
            {
              full_name: 'test-org/ai-hackathon',
              name: 'ai-hackathon',
              html_url:
                'https://github.com/test-org/ai-hackathon',
              description:
                'Test AI hackathon repository.',
              owner: {
                login: 'test-org'
              }
            },
            {
              full_name:
                'test-community/open-source-event',
              name: 'open-source-event',
              html_url:
                'https://github.com/test-community/open-source-event',
              description:
                'Test open source event repository.',
              owner: {
                login: 'test-community'
              }
            }
          ]
        }),
        url: url,
        fetched_at:
          '2026-08-11T12:00:00.000Z'
      };
    }
  };

  const adapters =
    createProductionAdapters(
      fakeHttpClient
    );

  const adapterValidation =
    validateProductionAdapters(adapters);

  if (!adapterValidation.valid) {
    throw new Error(
      'Production adapter validation failed: ' +
      adapterValidation.errors.join(' ')
    );
  }

  const sources = [
    {
      id: 'github',
      name: 'GitHub',
      type: 'github_repository',
      class: 'github',
      priority: 95,
      enabled: true,
      discovery_only: false,
      can_verify: true
    }
  ];

  const healthRecords = [
    {
      source_id: 'github',
      status: 'healthy',
      consecutive_failures: 0
    }
  ];

  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const queries = [
    {
      query_id: 'q-production-001',
      text: 'AI hackathon Visakhapatnam'
    }
  ];

  const result =
    runDiscoveryPipeline(
      queries,
      sources,
      healthRecords,
      adapters,
      policy
    );

  if (!result || result.status !== 'completed') {
    throw new Error(
      'Production discovery pipeline did not complete.'
    );
  }

  if (result.selected_sources.length !== 1) {
    throw new Error(
      'Expected one selected production source.'
    );
  }

  if (
    result.selected_sources[0].id !==
    'github'
  ) {
    throw new Error(
      'GitHub source was not selected.'
    );
  }

  if (result.plans.length !== 1) {
    throw new Error(
      'Expected one discovery plan.'
    );
  }

  if (
    result.plans[0].source_id !==
    'github'
  ) {
    throw new Error(
      'Production plan has incorrect source ID.'
    );
  }

  if (
    result.plans[0].query_text !==
    'AI hackathon Visakhapatnam'
  ) {
    throw new Error(
      'Production plan lost query text.'
    );
  }

  if (result.records.length !== 2) {
    throw new Error(
      'Expected two normalized GitHub records.'
    );
  }

  result.records.forEach(function(record) {
    if (!record.discovery_id) {
      throw new Error(
        'Normalized record is missing discovery_id.'
      );
    }

    if (
      record.source_id !==
      'github'
    ) {
      throw new Error(
        'Normalized record lost source identity.'
      );
    }

    if (
      record.query_id !==
      'q-production-001'
    ) {
      throw new Error(
        'Normalized record lost query identity.'
      );
    }

    if (!record.title) {
      throw new Error(
        'Normalized record is missing title.'
      );
    }

    if (!record.url) {
      throw new Error(
        'Normalized record is missing URL.'
      );
    }

    if (
      record.status !==
      'discovered'
    ) {
      throw new Error(
        'Canonical discovery status is incorrect.'
      );
    }
  });

  console.log(
    'PRODUCTION ADAPTER VALIDATION: PASSED'
  );
  console.log(
    'SOURCE SELECTION: PASSED'
  );
  console.log(
    'PRODUCTION PLAN CREATION: PASSED'
  );
  console.log(
    'PRODUCTION ADAPTER EXECUTION: PASSED'
  );
  console.log(
    'RESULT VALIDATION: PASSED'
  );
  console.log(
    'RECORD NORMALIZATION: PASSED'
  );
  console.log(
    'IDENTITY PRESERVATION: PASSED'
  );
  console.log(
    'CANONICAL RECORD VALIDATION: PASSED'
  );
  console.log(
    'TOTAL RECORDS: ' +
    result.records.length
  );
  console.log(
    'STEP 6B.25 TEST: PASSED'
  );
}
