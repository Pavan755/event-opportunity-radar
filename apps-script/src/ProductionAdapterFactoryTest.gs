function runProductionAdapterFactoryTest() {
  const fakeHttpClient = {
    fetch: function() {
      return {
        status_code: 200,
        content_type: 'application/json',
        body: JSON.stringify({
          items: []
        }),
        url: 'https://api.github.com/search/repositories',
        fetched_at: '2026-08-11T12:00:00.000Z'
      };
    }
  };

  const adapters =
    createProductionAdapters(
      fakeHttpClient
    );

  if (!Array.isArray(adapters)) {
    throw new Error(
      'Production adapters must be an array.'
    );
  }

  if (adapters.length !== 1) {
    throw new Error(
      'Expected exactly one production adapter.'
    );
  }

  if (adapters[0].source_id !== 'github') {
    throw new Error(
      'GitHub production adapter was not registered correctly.'
    );
  }

  const validation =
    validateProductionAdapters(adapters);

  if (!validation.valid) {
    throw new Error(
      'Production adapter validation failed: ' +
      validation.errors.join(' ')
    );
  }

  const invalidValidation =
    validateProductionAdapters([
      {
        source_id: 'broken'
      }
    ]);

  if (invalidValidation.valid) {
    throw new Error(
      'Invalid production adapter was incorrectly accepted.'
    );
  }

  console.log('FACTORY CREATION: PASSED');
  console.log('GITHUB ADAPTER REGISTRATION: PASSED');
  console.log('ADAPTER VALIDATION: PASSED');
  console.log('INVALID ADAPTER REJECTION: PASSED');
  console.log('STEP 6B.23 TEST: PASSED');
}
