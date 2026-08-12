function evaluateVerificationAuthority(source, policy) {
  if (!source || typeof source !== 'object') {
    throw new Error('Source metadata is required.');
  }

  const sourceClass =
    source.class ||
    source.source_class ||
    null;

  if (!sourceClass) {
    throw new Error(
      'Source class is required.'
    );
  }

  if (
    source.discovery_only === true ||
    source.can_verify === false
  ) {
    return 'discovery_only';
  }

  if (sourceClass === 'official') {
    return 'primary';
  }

  if (sourceClass === 'github') {
    return 'primary';
  }

  if (sourceClass === 'community') {
    return 'secondary';
  }

  if (sourceClass === 'event_platform') {
    return 'secondary';
  }

  if (sourceClass === 'social') {
    return 'discovery_only';
  }

  if (sourceClass === 'aggregator') {
    return 'discovery_only';
  }

  return 'unknown';
}

function canSourceVerify(source, policy) {
  return (
    evaluateVerificationAuthority(
      source,
      policy
    ) === 'primary'
  );
}

function validateVerificationAuthority(
  source,
  policy
) {
  if (!source || typeof source !== 'object') {
    return {
      valid: false,
      errors: [
        'Source metadata is required.'
      ]
    };
  }

  const authority =
    evaluateVerificationAuthority(
      source,
      policy
    );

  const errors = [];

  if (
    source.discovery_only === true &&
    authority !== 'discovery_only'
  ) {
    errors.push(
      'Discovery-only source cannot have verification authority.'
    );
  }

  if (
    source.can_verify === false &&
    authority === 'primary'
  ) {
    errors.push(
      'Source marked can_verify=false cannot be primary.'
    );
  }

  return {
    valid: errors.length === 0,
    authority: authority,
    errors: errors
  };
}
