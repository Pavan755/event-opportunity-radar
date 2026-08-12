function runPolicyAwareVerificationEvidenceTest() {
  const officialEvidence =
    createPolicyAwareVerificationEvidence(
      {
        discovery_id: 'd-policy-001',
        url: 'https://example.com/official',
        source_id: 'official_web',
        source_type:
          'official_event_website',
        source_class: 'official',
        can_verify: true,
        discovery_only: false,
        authority: 'primary',
        evidence_type:
          'official_event_page'
      },
      null
    );

  if (
    officialEvidence.authority !== 'primary'
  ) {
    throw new Error(
      'Official source was not allowed primary evidence.'
    );
  }

  const socialEvidence =
    createPolicyAwareVerificationEvidence(
      {
        discovery_id: 'd-policy-002',
        url: 'https://example.com/social',
        source_id: 'social',
        source_type:
          'organizer_social_post',
        source_class: 'social',
        can_verify: false,
        discovery_only: true,
        evidence_type: 'social_post'
      },
      null
    );

  if (
    socialEvidence.authority !==
    'discovery_only'
  ) {
    throw new Error(
      'Social evidence was not classified as discovery_only.'
    );
  }

  let socialPrimaryRejected = false;

  try {
    createPolicyAwareVerificationEvidence(
      {
        discovery_id: 'd-policy-003',
        url: 'https://example.com/social-primary',
        source_id: 'social',
        source_type:
          'organizer_social_post',
        source_class: 'social',
        can_verify: false,
        discovery_only: true,
        authority: 'primary',
        evidence_type: 'social_post'
      },
      null
    );
  } catch (error) {
    socialPrimaryRejected = true;
  }

  if (!socialPrimaryRejected) {
    throw new Error(
      'Social primary authority request was not rejected.'
    );
  }

  let aggregatorRejected = false;

  try {
    createPolicyAwareVerificationEvidence(
      {
        discovery_id: 'd-policy-004',
        url: 'https://example.com/listing',
        source_id: 'aggregator',
        source_type:
          'secondary_listing',
        source_class: 'aggregator',
        can_verify: false,
        discovery_only: true,
        authority: 'primary',
        evidence_type:
          'aggregator_listing'
      },
      null
    );
  } catch (error) {
    aggregatorRejected = true;
  }

  if (!aggregatorRejected) {
    throw new Error(
      'Aggregator primary authority request was not rejected.'
    );
  }

  const githubEvidence =
    createPolicyAwareVerificationEvidence(
      {
        discovery_id: 'd-policy-005',
        url: 'https://github.com/example/repo',
        source_id: 'github',
        source_type:
          'github_repository',
        source_class: 'github',
        can_verify: true,
        discovery_only: false,
        authority: 'primary',
        evidence_type:
          'github_repository'
      },
      null
    );

  if (
    githubEvidence.authority !== 'primary'
  ) {
    throw new Error(
      'GitHub source was not allowed primary evidence.'
    );
  }

  console.log(
    'OFFICIAL POLICY-AWARE EVIDENCE: PASSED'
  );

  console.log(
    'SOCIAL DISCOVERY-ONLY DEFAULT: PASSED'
  );

  console.log(
    'SOCIAL PRIMARY REJECTION: PASSED'
  );

  console.log(
    'AGGREGATOR PRIMARY REJECTION: PASSED'
  );

  console.log(
    'GITHUB POLICY-AWARE EVIDENCE: PASSED'
  );

  console.log(
    'STEP 6C.5 TEST: PASSED'
  );
}
