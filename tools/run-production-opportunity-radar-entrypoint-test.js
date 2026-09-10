const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,
  Utilities: {
    getUuid: () => 'test-production-entrypoint'
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/SourceAdapter.gs',
  'apps-script/src/SourceHealthPolicy.gs',
  'apps-script/src/SourceRegistryHealthGate.gs',
  'apps-script/src/SourceSelector.gs',
  'apps-script/src/DiscoverySourcePlanner.gs',
  'apps-script/src/DiscoveryPlanDeduplicator.gs',
  'apps-script/src/DiscoveryPlanValidator.gs',
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/DiscoveryPlanExecutor.gs',
  'apps-script/src/DiscoveryResultValidator.gs',
  'apps-script/src/DiscoveryRecordNormalizer.gs',
  'apps-script/src/VerificationEvidence.gs',
  'apps-script/src/VerificationAuthorityPolicy.gs',
  'apps-script/src/PolicyAwareVerificationEvidence.gs',
  'apps-script/src/PolicyAwareEvidenceRecordIntegration.gs',
  'apps-script/src/PolicyAwareDiscoveryEvidenceIntegration.gs',
  'apps-script/src/DiscoveryPipeline.gs',
  'apps-script/src/OpportunityIdentity.gs',
  'apps-script/src/OpportunityLifecycle.gs',
  'apps-script/src/SkillIntelligence.gs',
  'apps-script/src/OpportunityIntelligence.gs',
  'apps-script/src/OpportunityScoring.gs',
  'apps-script/src/OpportunityIntelligenceScoringPipeline.gs',
  'apps-script/src/OpportunityRadarPipeline.gs',
  'apps-script/src/OpportunityActionIntelligence.gs',
  'apps-script/src/OpportunityRadarProductionEntry.gs',
  'apps-script/src/OpportunityRadarSheetPublisher.gs'
];

files.forEach(function(file) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, {
    filename: file
  });
});

function assert(condition, message) {
  if (!condition) {
    throw new Error('ASSERTION FAILED: ' + message);
  }
}

const source = {
  id: 'controlled',
  type: 'official_event_page',
  class: 'official',
  enabled: true,
  can_verify: true
};

const query = {
  query_id: 'q-production-entrypoint',
  text: 'technology conference',
  locations: ['Hyderabad']
};

const adapter = {
  source_id: 'controlled',
  execute: function(plan) {
    return {
      status: 'executed',
      records: [{
        title: 'Production entrypoint conference',
        organizer: 'Test organizer',
        location: 'Hyderabad',
        url: 'https://example.test/event',
        event_date: '2026-10-01',
        raw_text: 'technology conference networking documentation'
      }]
    };
  }
};

const config = {
  queries: [query],
  sources: [source],
  healthRecords: [{ source_id: 'controlled', status: 'healthy' }],
  adapters: [adapter],
  policy: {
    allow_degraded_sources: false,
    require_verification: true
  },
  skillProfile: {
    skills: [{
      id: 'documentation',
      name: 'Technical documentation',
      level: 'learning'
    }]
  },
  skillModel: context.createSkillIntelligenceModel({
    skills: [{
      id: 'documentation',
      name: 'Technical documentation',
      level: 'learning'
    }]
  }),
  scoringConfig: {
    version: 'test-scoring-v1',
    ranking: {
      thresholds: { S: 80, A: 60, B: 40, C: 20 }
    }
  }
};

delete config.skillProfile;
delete config.skillModel;
delete config.scoringConfig;

const published = [];
config.publisher = {
  replace: function(rows) {
    published.push.apply(published, rows);
  }
};

const result = context.runProductionOpportunityRadar(config);

assert(result.status === 'completed', 'Production pipeline must complete.');
assert(result.records.length === 1, 'One canonical record expected.');
assert(result.dashboard_rows.length === 1, 'One dashboard row expected.');
assert(result.dashboard_rows[0].discovery_id, 'Dashboard identity is required.');
assert(result.dashboard_rows[0].evidence_json !== '{}', 'Evidence must be published.');
assert(result.records[0].action_intelligence, 'Action intelligence must be attached.');
assert(result.records[0].action_intelligence.roles.length > 0, 'A predicted role must be provided.');
assert(result.records[0].action_intelligence.predictions.confidence, 'Prediction confidence is required.');
assert(result.dashboard_rows[0].score === undefined, 'Scores must not be published.');
assert(result.published === true, 'Publisher status must be reported.');
assert(published.length === 1, 'Publisher must receive dashboard rows.');

console.log('PRODUCTION ENTRYPOINT: PASSED');
console.log('CANONICAL ACTION RESULT: PASSED');
console.log('ACTION PROJECTION: PASSED');
console.log('PUBLISHER INTEGRATION: PASSED');
console.log('LOCAL PRODUCTION OPPORTUNITY RADAR ENTRYPOINT TEST: PASSED');