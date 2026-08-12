function runVerificationAuthorityPolicyTest() {
  const officialSource = {
    id: 'official_web',
    type: 'official_event_website',
    class: 'official',
    enabled: true,
    discovery_only: false,
    can_verify: true
  };

  const githubSource = {
    id: 'github',
    type: 'github_repository',
    class: 'github',
    enabled: true,
    discovery_only: false,
    can_verify: true
  };

  const socialSource = {
    id: 'social',
    type: 'organizer_social_post',
    class: 'social',
    enabled: true,
    discovery_only: true,
    can_verify: false
  };

  const aggregatorSource = {
    id: 'aggregator',
    type: 'secondary_listing',
    class: 'aggregator',
    enabled: true,
    discovery_only: true,
    can_verify: false
  };

  if (
    evaluateVerificationAuthority(
      officialSource,
      null
    ) !== 'primary'
  ) {
    throw new Error(
      'Official source was not classified as primary.'
    );
  }

  if (
    evaluateVerificationAuthority(
      githubSource,
      null
    ) !== 'primary'
  ) {
    throw new Error(
      'GitHub source was not classified as primary.'
    );
  }

  if (
    evaluateVerificationAuthority(
      socialSource,
      null
    ) !== 'discovery_only'
  ) {
    throw new Error(
      'Social source was not classified as discovery_only.'
    );
  }

  if (
    evaluateVerificationAuthority(
      aggregatorSource,
      null
    ) !== 'discovery_only'
  ) {
    throw new Error(
      'Aggregator source was not classified as discovery_only.'
    );
  }

  if (
    !canSourceVerify(
      officialSource,
      null
    )
  ) {
    throw new Error(
      'Official source should be allowed to verify.'
    );
  }

  if (
    canSourceVerify(
      socialSource,
      null
    )
  ) {
    throw new Error(
      'Social source must not be allowed to verify.'
    );
  }

  if (
    canSourceVerify(
      aggregatorSource,
      null
    )
  ) {
    throw new Error(
      'Aggregator source must not be allowed to verify.'
    );
  }

  const socialValidation =
    validateVerificationAuthority(
      socialSource,
      null
    );

  if (!socialValidation.valid) {
    throw new Error(
      'Valid social discovery-only policy was rejected: ' +
      socialValidation.errors.join(' ')
    );
  }

  const officialValidation =
    validateVerificationAuthority(
      officialSource,
      null
    );

  if (!officialValidation.valid) {
    throw new Error(
      'Valid official verification policy was rejected: ' +
      officialValidation.errors.join(' ')
    );
  }

  console.log(
    'OFFICIAL PRIMARY AUTHORITY: PASSED'
  );

  console.log(
    'GITHUB PRIMARY AUTHORITY: PASSED'
  );

  console.log(
    'SOCIAL DISCOVERY-ONLY AUTHORITY: PASSED'
  );

  console.log(
    'AGGREGATOR DISCOVERY-ONLY AUTHORITY: PASSED'
  );

  console.log(
    'PRIMARY VERIFICATION PERMISSION: PASSED'
  );

  console.log(
    'DISCOVERY-ONLY VERIFICATION BLOCK: PASSED'
  );

  console.log(
    'AUTHORITY VALIDATION: PASSED'
  );

  console.log(
    'STEP 6C.4 TEST: PASSED'
  );
}
