function createPolicyAwareVerificationEvidence(
  input,
  policy
) {
  if (!input || typeof input !== 'object') {
    throw new Error(
      'Verification evidence input must be an object.'
    );
  }

  if (!input.source_class) {
    throw new Error(
      'Verification evidence requires source_class.'
    );
  }

  const source = {
    id: input.source_id || null,
    type: input.source_type || null,
    class: input.source_class,
    enabled:
      input.enabled === undefined
        ? true
        : input.enabled,
    discovery_only:
      input.discovery_only === true,
    can_verify:
      input.can_verify === true
  };

  const authority =
    evaluateVerificationAuthority(
      source,
      policy
    );

  let requestedAuthority =
    input.authority || authority;

  if (
    requestedAuthority === 'primary' &&
    authority !== 'primary'
  ) {
    throw new Error(
      'Source is not authorized for primary verification.'
    );
  }

  if (
    requestedAuthority === 'secondary' &&
    authority === 'discovery_only'
  ) {
    throw new Error(
      'Discovery-only source cannot create secondary verification evidence.'
    );
  }

  if (
    authority === 'discovery_only'
  ) {
    requestedAuthority = 'discovery_only';
  }

  return createVerificationEvidence({
    evidence_id:
      input.evidence_id || null,

    discovery_id:
      input.discovery_id || null,

    url:
      input.url || null,

    source_id:
      input.source_id || null,

    source_type:
      input.source_type || null,

    source_class:
      input.source_class || null,

    authority:
      requestedAuthority,

    evidence_type:
      input.evidence_type || 'unknown',

    captured_at:
      input.captured_at || null,

    title:
      input.title || null,

    organizer:
      input.organizer || null,

    event_date:
      input.event_date || null,

    application_url:
      input.application_url || null,

    raw_text:
      input.raw_text || null
  });
}
