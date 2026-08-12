function runVerificationEvidenceAttachmentTest() {
  const record = {
    discovery_id: 'd-attachment-001',
    title: 'Test AI Hackathon',
    organizer: 'Test Organizer',
    url: 'https://example.com/event',
    verification: {
      status: 'unverified',
      confidence: 0,
      sources: []
    },
    status: 'discovered'
  };

  const evidence = {
    evidence_id: 'e-attachment-001',
    discovery_id: 'd-attachment-001',
    url: 'https://example.com/event',
    source_id: 'official_web',
    source_type: 'official_event_website',
    source_class: 'official',
    authority: 'primary',
    evidence_type: 'official_event_page',
    captured_at:
      '2026-08-12T10:00:00.000Z'
  };

  const updated =
    attachVerificationEvidence(
      record,
      evidence
    );

  if (
    updated.discovery_id !==
    record.discovery_id
  ) {
    throw new Error(
      'Discovery ID was not preserved.'
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
      'Expected exactly one attached evidence record.'
    );
  }

  if (
    updated.verification_evidence[0].evidence_id !==
    evidence.evidence_id
  ) {
    throw new Error(
      'Evidence ID was not attached correctly.'
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
    updated.verification.sources[0].evidence_id !==
    evidence.evidence_id
  ) {
    throw new Error(
      'Verification source identity was not preserved.'
    );
  }

  const validation =
    validateRecordVerificationEvidence(
      updated
    );

  if (!validation.valid) {
    throw new Error(
      'Attached evidence failed validation: ' +
      validation.errors.join(' ')
    );
  }

  let mismatchRejected = false;

  try {
    attachVerificationEvidence(
      record,
      {
        evidence_id: 'e-mismatch-001',
        discovery_id: 'd-other-record',
        url: 'https://example.com/other',
        source_id: 'official_web',
        source_type:
          'official_event_website',
        source_class: 'official',
        authority: 'primary',
        evidence_type:
          'official_event_page'
      }
    );
  } catch (error) {
    mismatchRejected = true;
  }

  if (!mismatchRejected) {
    throw new Error(
      'Mismatched discovery evidence was not rejected.'
    );
  }

  console.log(
    'EVIDENCE ATTACHMENT: PASSED'
  );

  console.log(
    'DISCOVERY ID PRESERVATION: PASSED'
  );

  console.log(
    'EVIDENCE ID PRESERVATION: PASSED'
  );

  console.log(
    'VERIFICATION SOURCE ATTACHMENT: PASSED'
  );

  console.log(
    'ATTACHED EVIDENCE VALIDATION: PASSED'
  );

  console.log(
    'MISMATCH REJECTION: PASSED'
  );

  console.log(
    'STEP 6C.3 TEST: PASSED'
  );
}
