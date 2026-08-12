function attachPolicyAwareVerificationEvidence(
  record,
  evidenceInput,
  policy
) {
  if (!record || typeof record !== 'object') {
    throw new Error(
      'Discovery record must be an object.'
    );
  }

  if (!record.discovery_id) {
    throw new Error(
      'Discovery record is missing discovery_id.'
    );
  }

  if (!evidenceInput || typeof evidenceInput !== 'object') {
    throw new Error(
      'Verification evidence input must be an object.'
    );
  }

  if (!evidenceInput.discovery_id) {
    throw new Error(
      'Verification evidence requires discovery_id.'
    );
  }

  if (
    evidenceInput.discovery_id !==
    record.discovery_id
  ) {
    throw new Error(
      'Verification evidence discovery_id does not match record discovery_id.'
    );
  }

  const evidence =
    createPolicyAwareVerificationEvidence(
      evidenceInput,
      policy
    );

  if (
    evidence.discovery_id !==
    record.discovery_id
  ) {
    throw new Error(
      'Created evidence discovery_id does not match record discovery_id.'
    );
  }

  const updated = Object.assign(
    {},
    record
  );

  updated.verification_evidence =
    Array.isArray(record.verification_evidence)
      ? record.verification_evidence.slice()
      : [];

  updated.verification =
    record.verification &&
    typeof record.verification === 'object'
      ? Object.assign(
          {},
          record.verification
        )
      : {
          status: 'unverified',
          confidence: 0,
          sources: []
        };

  updated.verification.sources =
    Array.isArray(
      updated.verification.sources
    )
      ? updated.verification.sources.slice()
      : [];

  updated.verification_evidence.push(
    evidence
  );

  updated.verification.sources.push({
    url: evidence.url,
    source_id: evidence.source_id,
    source_type: evidence.source_type,
    source_class: evidence.source_class,
    evidence_id: evidence.evidence_id,
    authority: evidence.authority,
    captured_at: evidence.captured_at
  });

  const validation =
    validatePolicyAwareRecordEvidence(
      updated
    );

  if (!validation.valid) {
    throw new Error(
      'Policy-aware record evidence validation failed: ' +
      validation.errors.join(' ')
    );
  }

  return updated;
}


function validatePolicyAwareRecordEvidence(
  record
) {
  if (
    !record ||
    typeof record !== 'object'
  ) {
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
        if (
          !evidence ||
          typeof evidence !== 'object'
        ) {
          errors.push(
            'Invalid evidence at index ' +
            index +
            '.'
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

        const evidenceValidation =
          validateVerificationEvidence(
            evidence
          );

        if (
          !evidenceValidation.valid
        ) {
          evidenceValidation.errors.forEach(
            function(error) {
              errors.push(
                'Evidence at index ' +
                index +
                ': ' +
                error
              );
            }
          );
        }
      }
    );
  }

  if (
    record.verification &&
    Array.isArray(
      record.verification.sources
    ) &&
    Array.isArray(
      record.verification_evidence
    )
  ) {
    record.verification_evidence.forEach(
      function(evidence, index) {
        const matchingSource =
          record.verification.sources.some(
            function(source) {
              return (
                source &&
                source.evidence_id ===
                evidence.evidence_id
              );
            }
          );

        if (!matchingSource) {
          errors.push(
            'Evidence at index ' +
            index +
            ' is missing a matching verification source.'
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
