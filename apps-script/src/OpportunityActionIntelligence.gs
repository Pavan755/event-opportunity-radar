/**
 * Score-free opportunity action intelligence.
 *
 * Facts are copied from discovery evidence. Suggested roles, routes, timing,
 * and prompts are explicitly marked as predictions so the UI never presents
 * a useful guess as a verified organizer claim.
 */

function createOpportunityActionIntelligence(record) {
  if (!record || typeof record !== 'object') {
    throw new Error('An opportunity record is required.');
  }

  const categories = Array.isArray(record.categories)
    ? record.categories
    : [];
  const text = String(
    (record.title || '') + ' ' +
    (record.raw_text || '') + ' ' +
    categories.join(' ')
  ).toLowerCase();

  const roles = [];
  if (/volunteer|community|event support|meetup/.test(text)) {
    roles.push({
      role: 'Event or community volunteer',
      basis: 'Volunteer, community, or meetup signal detected.',
      confidence: 'medium'
    });
  }
  if (/documentation|open source|github|developer|technical|software/.test(text)) {
    roles.push({
      role: 'Documentation or technical contributor',
      basis: 'Technical or open-source signal detected.',
      confidence: 'medium'
    });
  }
  if (/media|video|photography|content/.test(text)) {
    roles.push({
      role: 'Media or content support',
      basis: 'Media or content signal detected.',
      confidence: 'low'
    });
  }
  if (roles.length === 0) {
    roles.push({
      role: 'Participant and community contributor',
      basis: 'General opportunity signal; organizer role is not explicit.',
      confidence: 'low'
    });
  }

  const applicationOptions = [];
  if (record.apply_url) {
    applicationOptions.push({
      kind: 'official_application',
      label: 'Use the official application or registration route',
      url: record.apply_url,
      status: 'verified'
    });
  }
  if (record.contact_url || record.contact_email) {
    applicationOptions.push({
      kind: 'organizer_outreach',
      label: 'Ask the organizer about volunteer or contributor openings',
      url: record.contact_url || null,
      email: record.contact_email || null,
      status: 'verified'
    });
  }
  applicationOptions.push({
    kind: 'community_discovery',
    label: 'Check the source page for a role-specific call before acting',
    url: record.url || null,
    status: 'predicted'
  });

  const dateStatus = record.event_start_date || record.event_end_date
    ? 'verified'
    : 'unknown';

  return {
    event_window: {
      start_date: record.event_start_date || null,
      end_date: record.event_end_date || null,
      application_deadline: record.application_deadline || null,
      status: dateStatus,
      confidence: dateStatus === 'verified' ? 'medium' : 'none',
      basis: dateStatus === 'verified'
        ? 'Date extracted from source content.'
        : 'No reliable event date was found in the captured source content.'
    },
    roles: roles,
    application_options: applicationOptions,
    contacts: {
      organizer: record.organizer || null,
      email: record.contact_email || null,
      url: record.contact_url || null,
      links: Array.isArray(record.contact_links)
        ? record.contact_links
        : []
    },
    strategy: [
      'Confirm the event window and role requirements from the source.',
      'Choose one realistic contribution offer before contacting the organizer.',
      'Use the application route first; use organizer outreach when no role form exists.',
      'Follow up with evidence of attendance, contribution, or a completed deliverable.'
    ],
    prompts: [
      'Help me prepare a concise application for this opportunity using only the verified facts provided.',
      'Help me write a respectful organizer message offering my skills without claiming experience I do not have.',
      'Help me create a preparation plan for this event and label every assumption as a prediction.'
    ],
    predictions: {
      likely_next_step: applicationOptions.length > 1
        ? 'Review the official route, then prepare a targeted organizer message.'
        : 'Find and confirm the organizer role before applying.',
      confidence: applicationOptions.length > 1 ? 'medium' : 'low',
      basis: 'Derived from available links, categories, and source text; organizer confirmation is still required.'
    }
  };
}

function attachOpportunityActionIntelligence(records) {
  if (!Array.isArray(records)) {
    throw new Error('Opportunity action intelligence requires records.');
  }

  return records.map(function(record) {
    return {
      ...record,
      action_intelligence: createOpportunityActionIntelligence(record)
    };
  });
}

function runOpportunityActionPipeline(
  queries,
  sources,
  healthRecords,
  adapters,
  policy
) {
  const discoveryResult = runDiscoveryPipeline(
    queries,
    sources,
    healthRecords,
    adapters,
    policy
  );

  const identityRecords = attachOpportunityIdentities(
    discoveryResult.records
  );

  const lifecycleRecords = attachOpportunityLifecycles(
    identityRecords
  );

  return {
    ...discoveryResult,
    records: attachOpportunityActionIntelligence(lifecycleRecords),
    action_intelligence: {
      version: '1.0.0',
      status: 'completed',
      record_count: lifecycleRecords.length
    }
  };
}