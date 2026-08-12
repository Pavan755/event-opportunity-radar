function runGitHubRepositoryAdapterTest() {
  const captured = {
    url: null,
    options: null
  };

  const fakePayload = {
    items: [
      {
        full_name: 'test-org/ai-hackathon',
        name: 'ai-hackathon',
        html_url: 'https://github.com/test-org/ai-hackathon',
        description: 'Test AI hackathon repository.',
        owner: {
          login: 'test-org'
        }
      },
      {
        full_name: 'test-community/open-source-event',
        name: 'open-source-event',
        html_url: 'https://github.com/test-community/open-source-event',
        description: 'Test open source event repository.',
        owner: {
          login: 'test-community'
        }
      }
    ]
  };

  const fakeHttpClient = {
    fetch: function(url, options) {
      captured.url = url;
      captured.options = options;

      return {
        status_code: 200,
        content_type: 'application/json',
        body: JSON.stringify(fakePayload),
        url: url,
        timestamp: '2026-08-11T12:00:00.000Z'
      };
    }
  };

  const adapter =
    createGitHubRepositoryAdapter(
      'github-repositories',
      fakeHttpClient
    );

  const validation =
    validateExecutionAdapter(adapter);

  if (!validation.valid) {
    throw new Error(
      'GitHub adapter validation failed: ' +
      validation.errors.join(' ')
    );
  }

  const plan = {
    plan_id: 'plan-github-001',
    query_id: 'q-github-001',
    source_id: 'github-repositories',
    source_type: 'github_repository',
    source_class: 'github',
    source_priority: 95,
    query_text: 'AI hackathon Visakhapatnam',
    status: 'planned',
    created_at: '2026-08-11T12:00:00.000Z'
  };

  const result = adapter.execute(plan);

  if (!result || result.status !== 'executed') {
    throw new Error(
      'GitHub adapter did not execute successfully.'
    );
  }

  if (!captured.url) {
    throw new Error(
      'HTTP request URL was not captured.'
    );
  }

  if (
    captured.url.indexOf(
      'https://api.github.com/search/repositories'
    ) !== 0
  ) {
    throw new Error(
      'Unexpected GitHub API URL.'
    );
  }

  if (
    captured.url.indexOf(
      'AI%20hackathon%20Visakhapatnam'
    ) === -1
  ) {
    throw new Error(
      'Query text was not encoded into the GitHub request.'
    );
  }

  if (!captured.options) {
    throw new Error(
      'HTTP request options were not supplied.'
    );
  }

  if (
    captured.options.headers['Accept'] !==
    'application/vnd.github+json'
  ) {
    throw new Error(
      'GitHub Accept header is incorrect.'
    );
  }

  if (result.records.length !== 2) {
    throw new Error(
      'Expected two mapped GitHub records.'
    );
  }

  if (
    result.records[0].title !==
    'test-org/ai-hackathon'
  ) {
    throw new Error(
      'Repository title mapping failed.'
    );
  }

  if (
    result.records[0].organizer !==
    'test-org'
  ) {
    throw new Error(
      'Repository owner mapping failed.'
    );
  }

  if (
    result.records[0].url !==
    'https://github.com/test-org/ai-hackathon'
  ) {
    throw new Error(
      'Repository URL mapping failed.'
    );
  }

  if (
    result.records[0].source_id !==
    'github-repositories'
  ) {
    throw new Error(
      'Source ID propagation failed.'
    );
  }

  if (
    result.records[0].query_id !==
    'q-github-001'
  ) {
    throw new Error(
      'Query ID propagation failed.'
    );
  }

  console.log('GITHUB ADAPTER CREATION: PASSED');
  console.log('GITHUB ADAPTER VALIDATION: PASSED');
  console.log('GITHUB URL CONSTRUCTION: PASSED');
  console.log('QUERY ENCODING: PASSED');
  console.log('HTTP OPTIONS: PASSED');
  console.log('GITHUB RESPONSE MAPPING: PASSED');
  console.log('RECORD COUNT: PASSED');
  console.log('SOURCE ID PROPAGATION: PASSED');
  console.log('QUERY ID PROPAGATION: PASSED');
  console.log('STEP 6B.21 TEST: PASSED');
}
