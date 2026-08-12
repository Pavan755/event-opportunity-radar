function createVerificationEvidence(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Verification evidence input must be an object.');
  }

  return {
    evidence_id:
      input.evidence_id ||
      ('e-' + Utilities.getUuid()),

    discovery_id:
      input.discovery_id || null,

    url:
      input.url == null
        ? null
        : String(input.url).trim(),

    source_id:
      input.source_id == null
        ? null
        : String(input.source_id).trim(),

    source_type:
      input.source_type == null
        ? null
        : String(input.source_type).trim(),

    source_class:
      input.source_class == null
        ? null
        : String(input.source_class).trim(),

    authority:
      input.authority == null
        ? 'unknown'
        : String(input.authority).trim(),

    evidence_type:
      input.evidence_type == null
        ? 'unknown'
        : String(input.evidence_type).trim(),

    captured_at:
      input.captured_at ||
      new Date().toISOString(),

    title:
      input.title == null
        ? null
        : String(input.title).trim(),

    organizer:
      input.organizer == null
        ? null
        : String(input.organizer).trim(),

    event_date:
      input.event_date == null
        ? null
        : String(input.event_date).trim(),

    application_url:
      input.application_url == null
        ? null
        : String(input.application_url).trim(),

    raw_text:
      input.raw_text == null
        ? null
        : String(input.raw_text)
  };
}

function validateVerificationEvidence(evidence) {
  if (!evidence || typeof evidence !== 'object') {
    return {
      valid: false,
      errors: ['Verification evidence must be an object.']
    };
  }

  const errors = [];

  const required = [
    'evidence_id',
    'discovery_id',
    'url',
    'source_id',
    'source_type',
    'source_class',
    'authority',
    'evidence_type',
    'captured_at'
  ];

  required.forEach(function(field) {
    if (
      evidence[field] === undefined ||
      evidence[field] === null ||
      String(evidence[field]).trim() === ''
    ) {
      errors.push(
        'Missing required evidence field: ' + field
      );
    }
  });

  const allowedAuthorities = [
    'primary',
    'secondary',
    'discovery_only',
    'unknown'
  ];

  if (
    allowedAuthorities.indexOf(evidence.authority) === -1
  ) {
    errors.push(
      'Invalid evidence authority.'
    );
  }

  const allowedEvidenceTypes = [
    'official_event_page',
    'official_organizer_page',
    'official_application_page',
    'official_program_page',
    'github_repository',
    'community_page',
    'event_platform',
    'social_post',
    'aggregator_listing',
    'unknown'
  ];

  if (
    allowedEvidenceTypes.indexOf(evidence.evidence_type) === -1
  ) {
    errors.push(
      'Invalid evidence type.'
    );
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

function isValidVerificationEvidence(evidence) {
  return validateVerificationEvidence(
    evidence
  ).valid;
}
