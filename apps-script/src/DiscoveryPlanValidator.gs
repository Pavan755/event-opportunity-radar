function validateDiscoveryPlan(plan) {
  if (!plan || typeof plan !== 'object') {
    return {
      valid: false,
      errors: ['Plan must be an object.']
    };
  }

  const errors = [];

  if (!plan.plan_id || String(plan.plan_id).trim() === '') {
    errors.push('Missing plan_id.');
  }

  if (!plan.query_id || String(plan.query_id).trim() === '') {
    errors.push('Missing query_id.');
  }

  if (!plan.source_id || String(plan.source_id).trim() === '') {
    errors.push('Missing source_id.');
  }

  if (!plan.query_text || String(plan.query_text).trim() === '') {
    errors.push('Missing query_text.');
  }

  if (!plan.source_class || String(plan.source_class).trim() === '') {
    errors.push('Missing source_class.');
  }

  if (!plan.status || String(plan.status).trim() === '') {
    errors.push('Missing status.');
  }

  if (!plan.created_at || String(plan.created_at).trim() === '') {
    errors.push('Missing created_at.');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function isValidDiscoveryPlan(plan) {
  return validateDiscoveryPlan(plan).valid;
}
