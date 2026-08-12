function runVerificationEvidenceTest() {
  const evidence = createVerificationEvidence({
    discovery_id: 'd-001',
    url: 'https://example.com/event',
    source_id: 'official_web',
    source_type: 'official_event_website',
    source_class: 'official',
    authority: 'primary',
    evidence_type: 'official_event_page',
    title: 'Test AI Hackathon',
    organizer: 'Test Organizer',
    event_date: '2026-09-01',
    application_url: 'https://example.com/apply',
    raw_text: 'Official event page'
  });

  const validation =
    validateVerificationEvidence(
      evidence
    );

  if (!validation.valid) {
    throw new Error(
      'Valid evidence was rejected: ' +
      validation.errors.join(' ')
    );
  }

  if (!evidence.evidence_id) {
    throw new Error(
      'Evidence ID was not generated.'
    );
  }

  if (evidence.discovery_id !== 'd-001') {
    throw new Error(
      'Discovery ID was not preserved.'
    );
  }

  if (evidence.authority !== 'primary') {
    throw new Error(
      'Primary authority was not preserved.'
    );
  }

  if (
    evidence.evidence_type !==
    'official_event_page'
  ) {
    throw new Error(
      'Evidence type was not preserved.'
    );
  }

  const invalidAuthority =
    createVerificationEvidence({
      discovery_id: 'd-002',
      url: 'https://example.com',
      source_id: 'social',
      source_type: 'organizer_social_post',
      source_class: 'social',
      authority: 'primary',
      evidence_type: 'social_post'
    });

  invalidAuthority.authority = 'invalid_authority';

  const invalidValidation =
    validateVerificationEvidence(
      invalidAuthority
    );

  if (invalidValidation.valid) {
    throw new Error(
      'Invalid evidence authority was accepted.'
    );
  }

  console.log(
    'EVIDENCE CREATION: PASSED'
  );

  console.log(
    'EVIDENCE VALIDATION: PASSED'
  );

  console.log(
    'EVIDENCE ID GENERATION: PASSED'
  );

  console.log(
    'DISCOVERY ID PRESERVATION: PASSED'
  );

  console.log(
    'AUTHORITY PRESERVATION: PASSED'
  );

  console.log(
    'EVIDENCE TYPE PRESERVATION: PASSED'
  );

  console.log(
    'INVALID AUTHORITY REJECTION: PASSED'
  );

  console.log(
    'STEP 6C.2 TEST: PASSED'
  );
}
