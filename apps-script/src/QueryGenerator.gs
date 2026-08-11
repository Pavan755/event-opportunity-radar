function generateDiscoveryQueries(config) {
  if (!config || !config.query_groups || !config.query_modifiers) {
    throw new Error('Invalid query configuration.');
  }

  const queries = [];
  const seen = {};

  config.query_groups.forEach(function(group) {
    group.terms.forEach(function(term) {
      config.query_modifiers.locations.forEach(function(location) {
        addQuery_(queries, seen, term + ' ' + location, group.id, location);
      });
    });
  });

  config.query_groups.forEach(function(group) {
    group.terms.forEach(function(term) {
      config.query_modifiers.remote_terms.forEach(function(remote) {
        addQuery_(queries, seen, term + ' ' + remote, group.id, remote);
      });
    });
  });

  return queries;
}

function addQuery_(queries, seen, text, groupId, modifier) {
  const normalized = text.trim().toLowerCase();

  if (seen[normalized]) {
    return;
  }

  seen[normalized] = true;

  queries.push({
    query_id: 'q-' + Utilities.getUuid(),
    text: text.trim(),
    group: groupId,
    modifier: modifier,
    generated_at: new Date().toISOString(),
    status: 'generated'
  });
}
