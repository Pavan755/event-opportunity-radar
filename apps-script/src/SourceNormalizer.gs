function normalizeSourceResult(raw, source) {
  if (!raw) {
    throw new Error('Cannot normalize an empty source result.');
  }

  if (!source) {
    throw new Error('Source metadata is required.');
  }

  return {
    discovery_id:
      raw.discovery_id ||
      ('d-' + Utilities.getUuid()),

    title:
      raw.title || null,

    organizer:
      raw.organizer || null,

    url:
      raw.url || null,

    source_type:
      source.type || null,

    source_class:
      source.class || null,

    location:
      raw.location || null,

    event_date:
      raw.event_date || null,

    event_end_date:
      raw.event_end_date || null,

    format:
      raw.format || null,

    category:
      raw.category || [],

    raw_text:
      raw.raw_text || null,

    verification: {
      status: 'unverified',
      confidence: 0,
      sources: [
        {
          url: raw.url || null,
          source_type: source.type || null,
          source_class: source.class || null,
          captured_at: new Date().toISOString()
        }
      ]
    },

    status: 'discovered'
  };
}

function validateNormalizedResult(result) {
  const required = [
    'discovery_id',
    'title',
    'organizer',
    'url',
    'source_type',
    'source_class',
    'verification',
    'status'
  ];

  required.forEach(function(field) {
    if (
      result[field] === undefined ||
      result[field] === null
    ) {
      throw new Error(
        'Normalized result missing required field: ' + field
      );
    }
  });

  if (result.verification.status !== 'unverified') {
    throw new Error(
      'New normalized results must start as unverified.'
    );
  }

  if (result.verification.confidence !== 0) {
    throw new Error(
      'New normalized results must start with zero verification confidence.'
    );
  }

  if (result.status !== 'discovered') {
    throw new Error(
      'New normalized results must start as discovered.'
    );
  }

  return true;
}
