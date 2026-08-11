function createHttpClient(fetchFunction) {
  if (typeof fetchFunction !== 'function') {
    throw new Error(
      'fetchFunction must be a function.'
    );
  }

  return {
    fetch: fetchFunction
  };
}

function validateHttpClient(client) {
  if (!client || typeof client !== 'object') {
    return {
      valid: false,
      errors: ['HTTP client must be an object.']
    };
  }

  const errors = [];

  if (typeof client.fetch !== 'function') {
    errors.push(
      'HTTP client must expose fetch().'
    );
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
