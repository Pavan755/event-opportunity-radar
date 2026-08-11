function createSourceAdapter(id, name, type, sourceClass) {
  return {
    id: id,
    name: name,
    type: type,
    source_class: sourceClass,
    enabled: true,
    discovery_only: false,
    can_verify: false,
    discover: function(query) {
      throw new Error(
        'Discovery not implemented for source: ' + id
      );
    }
  };
}

function validateSourceAdapter(adapter) {
  const required = [
    'id',
    'name',
    'type',
    'source_class',
    'enabled',
    'discovery_only',
    'can_verify',
    'discover'
  ];

  required.forEach(function(field) {
    if (
      adapter[field] === undefined ||
      adapter[field] === null
    ) {
      throw new Error(
        'Source adapter missing required field: ' + field
      );
    }
  });

  if (typeof adapter.discover !== 'function') {
    throw new Error(
      'Source adapter discover must be a function.'
    );
  }

  return true;
}
