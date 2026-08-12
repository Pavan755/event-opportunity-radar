function validateDiscoveryExecutionResult(result, plan) {
  if (!result || typeof result !== 'object') {
    return {
      valid: false,
      errors: ['Execution result must be an object.']
    };
  }

  const errors = [];

  if (!plan || typeof plan !== 'object') {
    errors.push('Plan is required for result validation.');
  }

  if (
    plan &&
    result.plan_id !== plan.plan_id
  ) {
    errors.push('Result plan_id does not match plan.');
  }

  if (
    plan &&
    result.query_id !== plan.query_id
  ) {
    errors.push('Result query_id does not match plan.');
  }

  if (
    plan &&
    result.source_id !== plan.source_id
  ) {
    errors.push('Result source_id does not match plan.');
  }

  const allowedStatuses = [
    'executed',
    'adapter_unavailable',
    'adapter_invalid',
    'execution_invalid',
    'http_error',
    'failed'
  ];

  if (
    allowedStatuses.indexOf(result.status) === -1
  ) {
    errors.push('Invalid execution result status.');
  }

  if (!Array.isArray(result.records)) {
    errors.push('Result records must be an array.');
  }

  if (
    result.error !== null &&
    result.error !== undefined &&
    typeof result.error !== 'string'
  ) {
    errors.push('Result error must be a string or null.');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function isValidDiscoveryExecutionResult(result, plan) {
  return validateDiscoveryExecutionResult(
    result,
    plan
  ).valid;
}
