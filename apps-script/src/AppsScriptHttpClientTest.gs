function runAppsScriptHttpClientTest() {
  const originalUrlFetchApp =
    typeof UrlFetchApp !== 'undefined'
      ? UrlFetchApp
      : null;

  const mockResponse = {
    getResponseCode: function() {
      return 200;
    },

    getAllHeaders: function() {
      return {
        'Content-Type': 'text/html; charset=UTF-8'
      };
    },

    getContentText: function() {
      return '<html><body>Test Event</body></html>';
    }
  };

  const mockUrlFetchApp = {
    fetch: function(url, options) {
      if (url !== 'https://example.com/events') {
        throw new Error(
          'Unexpected URL supplied to UrlFetchApp.'
        );
      }

      if (!options || options.method !== 'GET') {
        throw new Error(
          'Expected GET request options.'
        );
      }

      return mockResponse;
    }
  };

  UrlFetchApp = mockUrlFetchApp;

  try {
    const client =
      createAppsScriptHttpClient();

    const validation =
      validateHttpClient(client);

    if (!validation.valid) {
      throw new Error(
        'Apps Script HTTP client failed validation: ' +
        validation.errors.join(' ')
      );
    }

    const response =
      client.fetch(
        'https://example.com/events',
        {
          method: 'GET'
        }
      );

    const normalized =
      normalizeHttpResponse(response);

    if (normalized.status_code !== 200) {
      throw new Error(
        'Expected HTTP 200 response.'
      );
    }

    if (
      normalized.content_type !==
      'text/html; charset=UTF-8'
    ) {
      throw new Error(
        'Content type was not preserved.'
      );
    }

    if (
      normalized.body !==
      '<html><body>Test Event</body></html>'
    ) {
      throw new Error(
        'Response body was not preserved.'
      );
    }

    if (
      normalized.url !==
      'https://example.com/events'
    ) {
      throw new Error(
        'Response URL was not preserved.'
      );
    }

    if (!normalized.fetched_at) {
      throw new Error(
        'Fetched timestamp is missing.'
      );
    }

    console.log(
      'APPS SCRIPT CLIENT CREATION: PASSED'
    );

    console.log(
      'URLFETCHAPP INVOCATION: PASSED'
    );

    console.log(
      'RESPONSE CODE CAPTURE: PASSED'
    );

    console.log(
      'CONTENT TYPE CAPTURE: PASSED'
    );

    console.log(
      'BODY CAPTURE: PASSED'
    );

    console.log(
      'URL CAPTURE: PASSED'
    );

    console.log(
      'TIMESTAMP CAPTURE: PASSED'
    );

    console.log(
      'STEP 6B.20 TEST: PASSED'
    );
  } finally {
    if (originalUrlFetchApp !== null) {
      UrlFetchApp = originalUrlFetchApp;
    }
  }
}
