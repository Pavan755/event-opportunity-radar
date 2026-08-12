function createProductionAdapters(httpClient) {
  if (!httpClient || typeof httpClient.fetch !== 'function') {
    throw new Error(
      'A valid HTTP client with fetch() is required.'
    );
  }

  return [
    createGitHubRepositoryAdapter(
      'github',
      httpClient
    )
  ];
}

function validateProductionAdapters(adapters) {
  if (!Array.isArray(adapters)) {
    return {
      valid: false,
      errors: ['Production adapters must be an array.']
    };
  }

  const errors = [];

  adapters.forEach(function(adapter) {
    const validation =
      validateExecutionAdapter(adapter);

    if (!validation.valid) {
      validation.errors.forEach(function(error) {
        errors.push(error);
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
