function deduplicateDiscoveryPlans(plans) {
  if (!Array.isArray(plans)) {
    throw new Error('Plans must be an array.');
  }

  const seen = {};
  const unique = [];

  plans.forEach(function(plan) {
    if (!plan || !plan.query_id || !plan.source_id) {
      return;
    }

    const key = (
      String(plan.query_id).trim().toLowerCase() +
      '|' +
      String(plan.source_id).trim().toLowerCase()
    );

    if (seen[key]) {
      return;
    }

    seen[key] = true;
    unique.push(plan);
  });

  return unique;
}
