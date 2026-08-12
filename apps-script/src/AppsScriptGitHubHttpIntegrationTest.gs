function runAppsScriptGitHubHttpIntegrationTest() {
  const captured = {
    url: null,
    options: null
  };

  const fakeResponse = {
    getResponseCode: function() {
      return 200;
    },

    getAllHeaders: function() {
      return {
        'Content-Type': 'application/json'
      };
    },

    getContentText: function() {
      return JSON.stringify({
        items: [
          {
            full_name: 'test-org/test-ai-event',
            name: 'test-ai-event',
            html_url: 'https://github.com/test-org/test-ai-event',
            description: 'Test AI event repository.',
            owner: {
              login: 'test-org'
            }
          }
        ]
      });
    }
  };

  const fakeUrlFetchApp = {
    fetch: function(url, options) {
      captured.url = url;
      captured.options = options;

      return fakeResponse;
    }
  };

  const originalUrlFetchApp =
    typeof UrlFetchApp === 'undefined'
      ? undefined
      : UrlFetchApp;

  UrlFetchApp = fakeUrlFetchApp;

  try {
    const httpClient =
      createAppsScriptHttpClient();

    const httpValidation =
      validateHttpClient(httpClient);

    if (!httpValidation.valid) {
      throw new Error(
        'HTTP client validation failed: ' +
        httpValidation.errors.join(' ')
      );
    }

    const adapter =
      createGitHubRepositoryAdapter(
        'github',
        httpClient
      );

    const adapterValidation =
      validateExecutionAdapter(adapter);

    if (!adapterValidation.valid) {
      throw new Error(
        'GitHub adapter validation failed: ' +
        adapterValidation.errors.join(' ')
      );
    }

    const plan = {
      plan_id: 'plan-http-001',
      query_id: 'q-http-001',
      source_id: 'github',
      source_type: 'github_repository',
      source_class: 'github',
      source_priority: 95,
      query_text: 'AI event Visakhapatnam',
      status: 'planned',
      created_at: '2026-08-11T12:00:00.000Z'
    };

    const result =
      adapter.execute(plan);

    if (!result || result.status !== 'executed') {
      throw new Error(
        'GitHub adapter did not execute successfully.'
      );
    }

    if (!captured.url) {
      throw new Error(
        'UrlFetchApp.fetch() was not called.'
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
        'AI%20event%20Visakhapatnam'
      ) === -1
    ) {
      throw new Error(
        'Query text was not encoded correctly.'
      );
    }

    if (!captured.options) {
      throw new Error(
        'HTTP options were not passed.'
      );
    }

    if (
      captured.options.method !== 'get'
    ) {
      throw new Error(
        'HTTP method was not preserved.'
      );
    }

    if (
      captured.options.headers[
        'Accept'
      ] !== 'application/vnd.github+json'
    ) {
      throw new Error(
        'GitHub Accept header was not preserved.'
      );
    }

    if (result.records.length !== 1) {
      throw new Error(
        'Expected exactly one GitHub record.'
      );
    }

    const record = result.records[0];

    if (
      record.title !==
      'test-org/test-ai-event'
    ) {
      throw new Error(
        'GitHub repository title was not mapped.'
      );
    }

    if (
      record.organizer !==
      'test-org'
    ) {
      throw new Error(
        'GitHub repository owner was not mapped.'
      );
    }

    if (
      record.source_id !== 'github'
    ) {
      throw new Error(
        'Source ID was not preserved.'
      );
    }

    if (
      record.query_id !== 'q-http-001'
    ) {
      throw new Error(
        'Query ID was not preserved.'
      );
    }

    console.log(
      'URLFETCHAPP INVOCATION: PASSED'
    );
    console.log(
      'HTTP URL PROPAGATION: PASSED'
    );
    console.log(
      'HTTP OPTIONS PROPAGATION: PASSED'
    );
    console.log(
      'HTTP RESPONSE NORMALIZATION: PASSED'
    );
    console.log(
      'GITHUB ADAPTER INTEGRATION: PASSED'
    );
    console.log(
      'RECORD MAPPING: PASSED'
    );
    console.log(
      'IDENTITY PRESERVATION: PASSED'
    );
    console.log(
      'STEP 6B.24 TEST: PASSED'
    );
  } finally {
    if (originalUrlFetchApp === undefined) {
      UrlFetchApp = undefined;
    } else {
      UrlFetchApp = originalUrlFetchApp;
    }
  }
}
