function runHttpClientContractTest() {
  const fakeResponse = {
    status_code: 200,
    content_type: 'text/html',
    body: '<html><body>Test Event</body></html>',
    url: 'https://example.com/events',
    fetched_at: '2026-08-11T12:00:00.000Z'
  };

  const fakeFetch = function(url, options) {
    if (url !== 'https://example.com/events') {
      throw new Error(
        'Unexpected URL supplied to HTTP client.'
      );
    }

    if (!options || options.method !== 'GET') {
      throw new Error(
        'HTTP client did not receive expected GET options.'
      );
    }

    return fakeResponse;
  };

  const client = createHttpClient(fakeFetch);

  const clientValidation =
    validateHttpClient(client);

  if (!clientValidation.valid) {
    throw new Error(
      'Valid HTTP client was rejected: ' +
      clientValidation.errors.join(' ')
    );
  }

  const rawResponse = client.fetch(
    'https://example.com/events',
    {
      method: 'GET'
    }
  );

  const response =
    normalizeHttpResponse(rawResponse);

  if (response.status_code !== 200) {
    throw new Error(
      'HTTP status code was not preserved.'
    );
  }

  if (response.content_type !== 'text/html') {
    throw new Error(
      'Content type was not preserved.'
    );
  }

  if (
    response.body !==
    '<html><body>Test Event</body></html>'
  ) {
    throw new Error(
      'HTTP response body was not preserved.'
    );
  }

  if (
    response.url !==
    'https://example.com/events'
  ) {
    throw new Error(
      'HTTP response URL was not preserved.'
    );
  }

  if (!response.fetched_at) {
    throw new Error(
      'HTTP response timestamp is missing.'
    );
  }

  let invalidClientRejected = false;

  try {
    createHttpClient(null);
  } catch (error) {
    invalidClientRejected = true;
  }

  if (!invalidClientRejected) {
    throw new Error(
      'Invalid HTTP client was accepted.'
    );
  }

  let invalidResponseRejected = false;

  try {
    normalizeHttpResponse({
      status_code: 'not-a-number',
      body: 'test'
    });
  } catch (error) {
    invalidResponseRejected = true;
  }

  if (!invalidResponseRejected) {
    throw new Error(
      'Invalid HTTP response was accepted.'
    );
  }

  console.log('HTTP CLIENT CREATION: PASSED');
  console.log('HTTP CLIENT VALIDATION: PASSED');
  console.log('HTTP FETCH CONTRACT: PASSED');
  console.log('STATUS CODE NORMALIZATION: PASSED');
  console.log('CONTENT TYPE NORMALIZATION: PASSED');
  console.log('BODY NORMALIZATION: PASSED');
  console.log('URL NORMALIZATION: PASSED');
  console.log('TIMESTAMP NORMALIZATION: PASSED');
  console.log('INVALID CLIENT REJECTION: PASSED');
  console.log('INVALID RESPONSE REJECTION: PASSED');
  console.log('STEP 6B.19 TEST: PASSED');
}
