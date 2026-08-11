function runSourceTest() {
  const source = {
    id: 'test-source-001',
    name: 'Test Source',
    type: 'organizer_social_profile',
    source_class: 'social',
    priority: 100
  };

  const raw = {
    title: 'Test AI Hackathon',
    organizer: 'Test Organization',
    url: 'https://example.com/test-event',
    location: 'Virtual',
    event_date: '2026-09-01',
    event_end_date: null,
    format: 'virtual',
    category: ['hackathon', 'ai_ml'],
    raw_text: 'Test event for source normalization.'
  };

  const normalized = normalizeSourceResult(raw, source);

  validateNormalizedResult(normalized);

  if (normalized.title !== raw.title) {
    throw new Error('Title normalization failed.');
  }

  if (normalized.organizer !== raw.organizer) {
    throw new Error('Organizer normalization failed.');
  }

  if (normalized.url !== raw.url) {
    throw new Error('URL normalization failed.');
  }

  if (normalized.source_type !== source.type) {
    throw new Error('Source type normalization failed.');
  }

  if (normalized.source_class !== source.source_class) {
    throw new Error('Source class normalization failed.');
  }

  if (normalized.verification.status !== 'unverified') {
    throw new Error('Verification status must start as unverified.');
  }

  if (normalized.verification.confidence !== 0) {
    throw new Error('Verification confidence must start at zero.');
  }

  if (normalized.status !== 'discovered') {
    throw new Error('Discovery status must start as discovered.');
  }

  console.log('SOURCE TYPE: ' + normalized.source_type);
  console.log('SOURCE CLASS: ' + normalized.source_class);
  console.log('TITLE: ' + normalized.title);
  console.log('VERIFICATION STATUS: ' + normalized.verification.status);
  console.log('DISCOVERY STATUS: ' + normalized.status);
  console.log('STEP 6A.5 TEST: PASSED');
}
