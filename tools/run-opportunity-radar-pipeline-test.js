const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const skillProfile =
  JSON.parse(
    fs.readFileSync(
      path.join(root, 'config', 'skills.json'),
      'utf8'
    )
  );

const scoringConfig =
  JSON.parse(
    fs.readFileSync(
      path.join(root, 'config', 'scoring.json'),
      'utf8'
    )
  );

const context = {
  console: console,
  Utilities: {
    getUuid: () =>
      'test-' + Math.random().toString(36).substring(2, 14)
  }
};

vm.createContext(context);

const discoveryFiles = [
  'apps-script/src/SourceHealthPolicy.gs',
  'apps-script/src/SourceRegistryHealthGate.gs',
  'apps-script/src/SourceSelector.gs',
  'apps-script/src/DiscoverySourcePlanner.gs',
  'apps-script/src/DiscoveryPlanDeduplicator.gs',
  'apps-script/src/DiscoveryPlanValidator.gs',
  'apps-script/src/DiscoveryPlanExecutor.gs',
  'apps-script/src/DiscoveryResultValidator.gs',
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/ControlledSourceAdapter.gs',
  'apps-script/src/DiscoveryRecordNormalizer.gs',
  'apps-script/src/VerificationAuthorityPolicy.gs',
  'apps-script/src/VerificationEvidence.gs',
  'apps-script/src/PolicyAwareVerificationEvidence.gs',
  'apps-script/src/PolicyAwareDiscoveryEvidenceIntegration.gs',
  'apps-script/src/PolicyAwareEvidenceRecordIntegration.gs',
  'apps-script/src/DiscoveryPipeline.gs'
];

const intelligenceFiles = [
  'apps-script/src/OpportunityLifecycle.gs',
  'apps-script/src/SkillIntelligence.gs',
  'apps-script/src/OpportunityIntelligence.gs',
  'apps-script/src/OpportunityScoring.gs',
  'apps-script/src/OpportunityIdentity.gs',
  'apps-script/src/OpportunityIntelligenceScoringPipeline.gs',
  'apps-script/src/OpportunityRadarPipeline.gs'
];

for (const file of discoveryFiles) {
  vm.runInContext(
    fs.readFileSync(
      path.join(root, file),
      'utf8'
    ),
    context,
    { filename: file }
  );
}

for (const file of intelligenceFiles) {
  vm.runInContext(
    fs.readFileSync(
      path.join(root, file),
      'utf8'
    ),
    context,
    { filename: file }
  );
}

/*
 * Load the existing discovery test source, but expose its
 * actual fixture variables without modifying the repository.
 *
 * This avoids inventing or duplicating the discovery fixture.
 */
const discoveryTestPath =
  path.join(
    root,
    'apps-script',
    'src',
    'DiscoveryPipelineTest.gs'
  );

let discoveryTestSource =
  fs.readFileSync(
    discoveryTestPath,
    'utf8'
  );

const exportFixture =
  `
  contextFixture = {
    policy: policy,
    queries: queries,
    sources: sources,
    healthRecords: healthRecords,
    fixtureRecords: fixtureRecords
  };
`;

discoveryTestSource =
  discoveryTestSource.replace(
    /\}\s*$/,
    exportFixture + '\n}'
  );

context.contextFixture = null;

vm.runInContext(
  discoveryTestSource,
  context,
  { filename: 'DiscoveryPipelineTest.gs' }
);

if (
  typeof context.runDiscoveryPipelineTest !==
  'function'
) {
  throw new Error(
    'Existing discovery pipeline test was not loaded.'
  );
}

context.runDiscoveryPipelineTest();

if (!context.contextFixture) {
  throw new Error(
    'Existing discovery fixture could not be extracted.'
  );
}

const fixture =
  context.contextFixture;

function assert(condition, message) {
  if (!condition) {
    throw new Error(
      'ASSERTION FAILED: ' + message
    );
  }
}

console.log(
  '=== STEP 7.8.5 OPPORTUNITY RADAR COMPOSITION TEST ==='
);

/*
 * Build the skill and scoring models using the
 * production configuration files.
 */
const skillModel =
  context.createSkillIntelligenceModel(
    skillProfile
  );

const scoringModel =
  context.createOpportunityScoringModel(
    scoringConfig
  );

assert(
  skillModel,
  'Skill intelligence model must be created.'
);

assert(
  scoringModel,
  'Opportunity scoring model must be created.'
);

console.log(
  'PRODUCTION MODELS: PASSED'
);

/*
 * Create a fresh controlled adapter from the exact
 * fixture used by the existing discovery regression.
 */
const adapter =
  context.createControlledSourceAdapter(
    'controlled-source-001',
    fixture.fixtureRecords
  );


assert(
  adapter,
  'Controlled fixture adapter must be created.'
);

console.log(
  'CONTROLLED DISCOVERY FIXTURE: PASSED'
);

/*
 * Execute the complete production composition layer:
 *
 * Discovery
 *   ->
 * Opportunity Intelligence
 *   ->
 * Opportunity Scoring
 *   ->
 * Ranked Records
 */
const result =
  context.runOpportunityRadarPipeline(
    fixture.queries,
    fixture.sources,
    fixture.healthRecords,
    [adapter],
    fixture.policy,
    skillProfile,
    skillModel,
    scoringConfig
  );

assert(
  result &&
  typeof result === 'object',
  'Radar pipeline must return an object.'
);

assert(
  result.status === 'completed',
  'Radar pipeline status must be completed.'
);

assert(
  Array.isArray(result.records),
  'Original discovery records must be preserved.'
);

assert(
  Array.isArray(result.ranked_records),
  'Ranked records must be returned.'
);

const expectedDiscoveryRecordCount =
  fixture.fixtureRecords.length *
  fixture.queries.length;

assert(
  result.records.length ===
    expectedDiscoveryRecordCount,
  'Original discovery record count must be preserved across all query executions.'
);

assert(
  result.ranked_records.length ===
    result.records.length,
  'Every discovery record must receive intelligence + scoring.'
);

/*
 * STEP 7.15E - canonical opportunity identity integration
 *
 * Verify that opportunity_id survives the complete
 * discovery -> identity -> intelligence -> scoring -> ranking path.
 */

const originalRecordsByDiscoveryId = {};

result.records.forEach(function(record) {
  assert(
    record &&
    typeof record === 'object',
    'Original result record must be an object.'
  );

  assert(
    typeof record.discovery_id === 'string' &&
    record.discovery_id.length > 0,
    'Every original result record must preserve discovery_id.'
  );

  assert(
    typeof record.opportunity_id === 'string' &&
    /^o-[0-9a-f]{8}$/.test(record.opportunity_id),
    'Every original result record must contain a valid opportunity_id.'
  );

  assert(
    record.lifecycle &&
    record.lifecycle.discovery_id === record.discovery_id &&
    record.lifecycle.state === 'new' &&
    Array.isArray(record.lifecycle.history) &&
    record.lifecycle.history.length === 1,
    'Every original result record must contain a new lifecycle.'
  );

  originalRecordsByDiscoveryId[record.discovery_id] = record;
});

result.ranked_records.forEach(function(record) {
  assert(
    record &&
    typeof record === 'object',
    'Every ranked result record must be an object.'
  );

  assert(
    typeof record.discovery_id === 'string' &&
    record.discovery_id.length > 0,
    'Every ranked record must preserve discovery_id.'
  );

  assert(
    typeof record.opportunity_id === 'string' &&
    /^o-[0-9a-f]{8}$/.test(record.opportunity_id),
    'Every ranked record must preserve a valid opportunity_id.'
  );

  const originalRecord =
    originalRecordsByDiscoveryId[record.discovery_id];

  assert(
    originalRecord,
    'Every ranked record must correspond to an original discovery record.'
  );

  assert(
    record.opportunity_id ===
      originalRecord.opportunity_id,
    'opportunity_id must remain unchanged through ranking.'
  );

  assert(
    record.lifecycle &&
    record.lifecycle.discovery_id === record.discovery_id &&
    record.lifecycle.state === 'new',
    'Every ranked record must preserve its lifecycle.'
  );
});

console.log(
  'OPPORTUNITY IDENTITY ATTACHMENT: PASSED'
);

console.log(
  'OPPORTUNITY IDENTITY RANKING PRESERVATION: PASSED'
);

console.log(
  'DISCOVERY ID + OPPORTUNITY ID LINKAGE: PASSED'
);

console.log(
  'INTEGRATION OPPORTUNITY IDENTITY: PASSED'
);

console.log(
  'INTEGRATION OPPORTUNITY LIFECYCLE: PASSED'
);
console.log(
  'FULL DISCOVERY EXECUTION: PASSED'
);

console.log(
  'ORIGINAL RECORD PRESERVATION: PASSED'
);

console.log(
  'INTELLIGENCE ENRICHMENT: PASSED'
);

console.log(
  'SCORING ENRICHMENT: PASSED'
);

/*
 * Validate every ranked record.
 */
result.ranked_records.forEach(
  function(record, index) {

    assert(
      record &&
      typeof record === 'object',
      'Ranked record ' +
        (index + 1) +
        ' must be an object.'
    );

    assert(
      record.discovery_id,
      'Ranked record ' +
        (index + 1) +
        ' must preserve discovery_id.'
    );

    assert(
      record.intelligence,
      'Ranked record ' +
        (index + 1) +
        ' must contain intelligence.'
    );

    assert(
      record.scoring,
      'Ranked record ' +
        (index + 1) +
        ' must contain scoring.'
    );

    assert(
      typeof record.scoring.score === 'number',
      'Ranked record ' +
        (index + 1) +
        ' must contain numeric score.'
    );

    assert(
      record.scoring.score >= 0 &&
      record.scoring.score <= 100,
      'Ranked record ' +
        (index + 1) +
        ' score must be 0-100.'
    );

    assert(
      ['S', 'A', 'B', 'C', 'D']
        .includes(record.scoring.rank),
      'Ranked record ' +
        (index + 1) +
        ' must have a valid rank.'
    );
  }
);

console.log(
  'RANKED RECORD VALIDATION: PASSED'
);

/*
 * Verify descending score ordering.
 */
for (
  let i = 1;
  i < result.ranked_records.length;
  i++
) {
  const previous =
    result.ranked_records[i - 1].scoring.score;

  const current =
    result.ranked_records[i].scoring.score;

  assert(
    previous >= current,
    'Ranked records must be ordered by descending score.'
  );
}

console.log(
  'SCORE ORDERING: PASSED'
);

/*
 * Verify version metadata.
 */
assert(
  result.intelligence_scoring,
  'Intelligence/scoring metadata must be present.'
);

assert(
  result.intelligence_scoring.scoring_version ===
    scoringConfig.version,
  'Scoring version must be preserved.'
);

assert(
  result.intelligence_scoring.record_count ===
    result.ranked_records.length,
  'Pipeline record count metadata must be correct.'
);

console.log(
  'VERSION + PIPELINE METADATA: PASSED'
);

console.log(
  'STEP 7.8.5 TEST: PASSED'
);

console.log(
  'LOCAL PRODUCTION OPPORTUNITY RADAR PIPELINE TEST: PASSED'
);
