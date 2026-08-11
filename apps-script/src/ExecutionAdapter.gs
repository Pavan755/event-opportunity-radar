function createExecutionAdapter(sourceId, executeFunction) {
  if (!sourceId || String(sourceId).trim() === '') {
    throw new Error('sourceId is required.');
  }

  if (typeof executeFunction !== 'function') {
    throw new Error('executeFunction must be a function.');
  }

  return {
    source_id: sourceId,
    execute: executeFunction
  };
}

function validateExecutionAdapter(adapter) {
  if (!adapter || typeof adapter !== 'object') {
    return {
      valid: false,
      errors: ['Adapter must be an object.']
    };
  }

  const errors = [];

  if (!adapter.source_id) {
    errors.push('Missing source_id.');
  }

  if (typeof adapter.execute !== 'function') {
    errors.push('Missing execute function.');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
