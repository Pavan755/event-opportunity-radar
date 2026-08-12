function runPolicyAwareProductionDiscoveryEvidenceTest() {
  const sources = [
    {
      id: 'github',
      type: 'github_repository',
      class: 'github',
      priority: 100,
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'social',
      type: 'social_post',
      class: 'social',
      priority: 50,
      enabled: true,
      discovery_only: true,
      can_verify: false
    }
  ];

  const queries = [
    {
      query_id: 'q-production-evidence-001',
      text: 'AI hackathon'
    }
  ];

  const healthRecords = [];
  const policy = {
    name: 'test-policy'
  };

  const adapters = [];

  const result = runDiscoveryPipeline(
    queries,
    sources,
    healthRecords,
    adapters,
    policy
  );

  if (result.status !== 'completed') {
    throw new Error(
      'Production discovery pipeline did not complete.'
    );
  }

  if (result.records.length !== 2) {
    throw new Error(
      'Expected exactly two production discovery records.'
    );
  }

  const githubRecord =
    result.records.filter(function(record) {
      return record.source_id === 'github';
    })[0];

  const socialRecord =
    result.records.filter(function(record) {
      return record.source_id === 'social';
    })[0];

  if (!githubRecord) {
    throw new Error(
      'GitHub production record was not found.'
    );
  }

  if (!socialRecord) {
    throw new Error(
      'Social production record was not found.'
    );
  }

  if (
    !Array.isArray(
      githubRecord.verification_evidence
    )
  ) {
    throw new Error(
      'GitHub record did not receive verification evidence.'
    );
  }

  if (
    githubRecord.verification_evidence.length !== 1
  ) {
    throw new Error(
      'GitHub record should contain exactly one evidence record.'
    );
  }

  const githubEvidence =
    githubRecord.verification_evidence[0];

  if (githubEvidence.authority !== 'primary') {
    throw new Error(
      'GitHub production evidence was not primary.'
    );
  }

  if (
    githubEvidence.evidence_type !==
    'github_repository'
  ) {
    throw new Error(
      'GitHub evidence type was not preserved.'
    );
  }

  if (
    !Array.isArray(
      githubRecord.verification.sources
    )
  ) {
    throw new Error(
      'GitHub verification sources were not created.'
    );
  }

  if (
    githubRecord.verification.sources.length !== 1
  ) {
    throw new Error(
      'GitHub verification source was not attached.'
    );
  }

  if (
    githubRecord.verification.sources[0].evidence_id !==
    githubEvidence.evidence_id
  ) {
    throw new Error(
      'GitHub evidence identity was not propagated.'
    );
  }

  if (
    !Array.isArray(
      socialRecord.verification_evidence
    )
  ) {
    throw new Error(
      'Social record did not receive evidence metadata.'
    );
  }

  if (
    socialRecord.verification_evidence.length !== 1
  ) {
    throw new Error(
      'Social record should contain exactly one evidence record.'
    );
  }

  const socialEvidence =
    socialRecord.verification_evidence[0];

  if (
    socialEvidence.authority !==
    'discovery_only'
  ) {
    throw new Error(
      'Social source was incorrectly granted verification authority.'
    );
  }

  if (
    socialEvidence.evidence_type !==
    'social_post'
  ) {
    throw new Error(
      'Social evidence type was not preserved.'
    );
  }

  const githubValidation =
    validatePolicyAwareRecordEvidence(
      githubRecord
    );

  if (!githubValidation.valid) {
    throw new Error(
      'GitHub integrated evidence failed validation: ' +
      githubValidation.errors.join(' ')
    );
  }

  const socialValidation =
    validatePolicyAwareRecordEvidence(
      socialRecord
    );

  if (!socialValidation.valid) {
    throw new Error(
      'Social integrated evidence failed validation: ' +
      socialValidation.errors.join(' ')
    );
  }

  console.log(
    'GITHUB PRODUCTION EVIDENCE: PASSED'
  );

  console.log(
    'GITHUB PRIMARY AUTHORITY: PASSED'
  );

  console.log(
    'GITHUB EVIDENCE ID PROPAGATION: PASSED'
  );

  console.log(
    'SOCIAL PRODUCTION EVIDENCE: PASSED'
  );

  console.log(
    'SOCIAL DISCOVERY-ONLY AUTHORITY: PASSED'
  );

  console.log(
    'INTEGRATED RECORD VALIDATION: PASSED'
  );

  console.log(
    'STEP 6C.8.4 TEST: PASSED'
  );
}
