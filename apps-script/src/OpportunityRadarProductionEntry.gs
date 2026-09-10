/**
 * Production boundary for the complete opportunity radar flow.
 *
 * Configuration and adapters are injected so scheduled Apps Script jobs can
 * provide their own source credentials and storage without changing the core
 * pipeline.
 */

const OPPORTUNITY_RADAR_REQUIRED_CONFIG_FIELDS = [
  'queries',
  'sources',
  'healthRecords',
  'adapters',
  'policy'
];

function validateOpportunityRadarProductionConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Production radar configuration is required.');
  }

  OPPORTUNITY_RADAR_REQUIRED_CONFIG_FIELDS.forEach(function(field) {
    if (config[field] === undefined || config[field] === null) {
      throw new Error(
        'Production radar configuration is missing: ' + field
      );
    }
  });

  return config;
}

function createOpportunityRadarDashboardRows(result) {
  if (!result || !Array.isArray(result.records)) {
    throw new Error(
      'A ranked opportunity radar result is required.'
    );
  }

  return result.records.map(function(record, index) {
    if (!record || !record.discovery_id) {
      throw new Error(
        'Ranked opportunity records must contain discovery_id.'
      );
    }

    const evidence = record.verification || record.evidence || {};
    const action = record.action_intelligence || {};

    return {
      discovery_id: String(record.discovery_id),
      opportunity_id: record.opportunity_id || '',
      title: record.title || 'Untitled opportunity',
      organizer: record.organizer || '',
      location: record.location || '',
      event_start_date: action.event_window
        ? action.event_window.start_date || ''
        : '',
      event_end_date: action.event_window
        ? action.event_window.end_date || ''
        : '',
      application_deadline: action.event_window
        ? action.event_window.application_deadline || ''
        : '',
      url: record.url || '',
      verification_status:
        evidence.verification_status ||
        record.verification_status ||
        '',
      lifecycle_state:
        record.lifecycle && record.lifecycle.state
          ? record.lifecycle.state
          : 'new',
      evidence_json: JSON.stringify(evidence),
      action_intelligence_json: JSON.stringify(action),
      lifecycle_json: JSON.stringify(record.lifecycle || {}),
      published_at: new Date().toISOString()
    };
  });
}

function runProductionOpportunityRadar(config) {
  validateOpportunityRadarProductionConfig(config);

  const result = runOpportunityActionPipeline(
    config.queries,
    config.sources,
    config.healthRecords,
    config.adapters,
    config.policy
  );

  const dashboardRows = createOpportunityRadarDashboardRows(result);

  if (config.publisher) {
    if (typeof config.publisher.replace !== 'function') {
      throw new Error(
        'Production radar publisher must provide replace(rows).'
      );
    }

    config.publisher.replace(dashboardRows);
  }

  return {
    ...result,
    dashboard_rows: dashboardRows,
    published: Boolean(config.publisher)
  };
}