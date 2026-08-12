function runPolicyAwareEvidenceRecordIntegrationTest() {
  const record = {
    discovery_id: 'd-policy-record-001',
    query_id: 'q-policy-record-001',
    source_id: 'github',
    title: 'AI Hackathon Repository',
    organizer: 'example-org',
    url:
      'https://github.com/example/repository',
    verification: {
      status: 'unverified',
      confidence: 0,
      sources: []
    },
    status: 'discovered'
  };

  const evidenceInput = {
    discovery_id:
      'd-policy-record-001',

    url:
      'https://github.com/example/repository',

    source_id:
      'github',

    source_type:
      'github_repository',

    source_class:
      'github',

    can_verify: true,

    discovery_only: false,

    authority: 'primary',

    evidence_type:
      'github_repository',

    title:
      'AI Hackathon Repository',

    organizer:
      'example-org'
  };

  const updated =
    attachPolicyAwareVerificationEvidence(
      record,
      evidenceInput,
      null
    );

  if (
    updated.discovery_id !==
    record.discovery_id
  ) {
    throw new Error(
      'Record discovery_id was not preserved.'
    );
  }

  if (
    !Array.isArray(
      updated.verification_evidence
    )
  ) {
    throw new Error(
      'verification_evidence was not created.'
    );
  }

  if (
    updated.verification_evidence.length !== 1
  ) {
    throw new Error(
      'Expected exactly one evidence record.'
    );
  }

  const evidence =
    updated.verification_evidence[0];

  if (
    evidence.authority !== 'primary'
  ) {
    throw new Error(
      'GitHub evidence did not retain primary authority.'
    );
  }

  if (
    evidence.evidence_id === undefined ||
    evidence.evidence_id === null
  ) {
    throw new Error(
      'Evidence ID was not generated.'
    );
  }

  if (
    updated.verification.sources.length !== 1
  ) {
    throw new Error(
      'Verification source was not attached.'
    );
  }

  if (
    updated.verification.sources[0]
      .evidence_id !==
    evidence.evidence_id
  ) {
    throw new Error(
      'Verification source evidence identity mismatch.'
    );
  }

  if (
    updated.verification.sources[0]
      .authority !== 'primary'
  ) {
    throw new Error(
      'Verification source authority mismatch.'
    );
  }

  const validation =
    validatePolicyAwareRecordEvidence(
      updated
    );

  if (!validation.valid) {
    throw new Error(
      'Integrated record evidence failed validation: ' +
      validation.errors.join(' ')
    );
  }

  let mismatchRejected = false;

  try {
    attachPolicyAwareVerificationEvidence(
      record,
      {
        discovery_id:
          'd-different-record',

        url:
          'https://github.com/example/other',

        source_id:
          'github',

        source_type:
          'github_repository',

        source_class:
          'github',

        can_verify: true,

        discovery_only: false,

        authority: 'primary',

        evidence_type:
          'github_repository'
      },
      null
    );
  } catch (error) {
    mismatchRejected = true;
  }

  if (!mismatchRejected) {
    throw new Error(
      'Mismatched evidence was not rejected.'
    );
  }

  console.log(
    'POLICY-AWARE RECORD ATTACHMENT: PASSED'
  );

  console.log(
    'PRIMARY GITHUB AUTHORITY PRESERVED: PASSED'
  );

  console.log(
    'EVIDENCE ID PROPAGATION: PASSED'
  );

  console.log(
    'VERIFICATION SOURCE PROPAGATION: PASSED'
  );

  console.log(
    'INTEGRATED EVIDENCE VALIDATION: PASSED'
  );

  console.log(
    'DISCOVERY ID MISMATCH REJECTION: PASSED'
  );

  console.log(
    'STEP 6C.6 TEST: PASSED'
  );
}
