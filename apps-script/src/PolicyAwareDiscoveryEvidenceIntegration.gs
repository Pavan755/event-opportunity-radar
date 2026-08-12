function resolveDiscoveryEvidenceType(source) {
  if (!source || typeof source !== 'object') {
    return 'unknown';
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

  const sourceType =
    source.type == null
      ? null
      : String(source.type).trim();

  if (
    sourceType &&
    allowedEvidenceTypes.indexOf(sourceType) !== -1
  ) {
    return sourceType;
  }

  if (source.class === 'official') {
    return 'official_event_page';
  }

  if (source.class === 'github') {
    return 'github_repository';
  }

  if (source.class === 'community') {
    return 'community_page';
  }

  if (source.class === 'event_platform') {
    return 'event_platform';
  }

  if (source.class === 'social') {
    return 'social_post';
  }

  if (source.class === 'aggregator') {
    return 'aggregator_listing';
  }

  return 'unknown';
}


function attachPolicyAwareDiscoveryEvidence(
  record,
  plan,
  source,
  policy
) {
  if (!record || typeof record !== 'object') {
    throw new Error(
      'Discovery record is required for evidence integration.'
    );
  }

  if (!plan || typeof plan !== 'object') {
    throw new Error(
      'Discovery plan is required for evidence integration.'
    );
  }

  if (!source || typeof source !== 'object') {
    throw new Error(
      'Source metadata is required for evidence integration.'
    );
  }

  if (!record.discovery_id) {
    throw new Error(
      'Discovery record is missing discovery_id.'
    );
  }

  if (!plan.source_id) {
    throw new Error(
      'Discovery plan is missing source_id.'
    );
  }

  if (!source.id) {
    throw new Error(
      'Source metadata is missing id.'
    );
  }

  if (source.id !== plan.source_id) {
    throw new Error(
      'Plan source_id does not match selected source id.'
    );
  }

  const evidenceInput = {
    discovery_id:
      record.discovery_id,

    url:
      record.url || null,

    source_id:
      source.id,

    source_type:
      source.type || null,

    source_class:
      source.class || null,

    enabled:
      source.enabled === undefined
        ? true
        : source.enabled,

    discovery_only:
      source.discovery_only === true,

    can_verify:
      source.can_verify !== false,

    evidence_type:
      resolveDiscoveryEvidenceType(source),

    title:
      record.title || null,

    organizer:
      record.organizer || null,

    event_date:
      record.event_date || null,

    application_url:
      record.application_url || null,

    raw_text:
      record.raw_text || null
  };

  return attachPolicyAwareVerificationEvidence(
    record,
    evidenceInput,
    policy
  );
}
