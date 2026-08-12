function attachPolicyAwareVerificationEvidence(
  record,
  evidenceInput,
  policy
) {
  if (!record || typeof record !== 'object') {
    throw new Error(
      'Discovery record is required.'
    );
  }

  if (!evidenceInput ||
      typeof evidenceInput !== 'object') {
    throw new Error(
      'Evidence input is required.'
    );
  }

  const evidence =
    createPolicyAwareVerificationEvidence(
      evidenceInput,
      policy
    );

  if (
    record.discovery_id &&
    evidence.discovery_id &&
    record.discovery_id !==
      evidence.discovery_id
  ) {
    throw new Error(
      'Evidence discovery_id does not match record.'
    );
  }

  const updated =
    Object.assign({}, record);

  updated.discovery_id =
    record.discovery_id ||
    evidence.discovery_id;

  if (
    !Array.isArray(
      updated.verification_evidence
    )
  ) {
    updated.verification_evidence = [];
  }

  updated.verification_evidence.push(
    evidence
  );

  if (!updated.verification) {
    updated.verification = {
      status: 'unverified',
      confidence: 0,
      sources: []
    };
  }

  if (
    !Array.isArray(
      updated.verification.sources
    )
  ) {
    updated.verification.sources = [];
  }

  updated.verification.sources.push({
    evidence_id:
      evidence.evidence_id,

    url:
      evidence.url || null,

    source_id:
      evidence.source_id || null,

    source_type:
      evidence.source_type || null,

    source_class:
      evidence.source_class || null,

    authority:
      evidence.authority || 'unknown',

    captured_at:
      evidence.captured_at ||
      new Date().toISOString()
  });

  return updated;
}

function validatePolicyAwareRecordEvidence(
  record
) {
  if (!record ||
      typeof record !== 'object') {
    return {
      valid: false,
      errors: [
        'Discovery record must be an object.'
      ]
    };
  }

  const errors = [];

  if (!record.discovery_id) {
    errors.push(
      'Discovery record is missing discovery_id.'
    );
  }

  if (
    !Array.isArray(
      record.verification_evidence
    )
  ) {
    errors.push(
      'verification_evidence must be an array.'
    );
  }

  if (
    !record.verification ||
    typeof record.verification !== 'object'
  ) {
    errors.push(
      'Verification object is required.'
    );
  }

  if (
    record.verification &&
    !Array.isArray(
      record.verification.sources
    )
  ) {
    errors.push(
      'verification.sources must be an array.'
    );
  }

  if (
    Array.isArray(
      record.verification_evidence
    )
  ) {
    record.verification_evidence.forEach(
      function(evidence, index) {
        if (!evidence ||
            typeof evidence !== 'object') {
          errors.push(
            'Invalid evidence at index ' +
            index + '.'
          );
          return;
        }

        if (!evidence.evidence_id) {
          errors.push(
            'Evidence at index ' +
            index +
            ' is missing evidence_id.'
          );
        }

        if (!evidence.discovery_id) {
          errors.push(
            'Evidence at index ' +
            index +
            ' is missing discovery_id.'
          );
        }

        if (
          evidence.discovery_id !==
          record.discovery_id
        ) {
          errors.push(
            'Evidence at index ' +
            index +
            ' does not match record discovery_id.'
          );
        }

        if (!evidence.authority) {
          errors.push(
            'Evidence at index ' +
            index +
            ' is missing authority.'
          );
        }
      }
    );
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
