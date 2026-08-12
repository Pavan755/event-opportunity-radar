/**
 * Local regression test for the production
 * Opportunity Intelligence + Scoring orchestration layer.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const files = [
  path.join(root, 'config', 'skills.json'),
  path.join(root, 'config', 'scoring.json')
];

const skillEnginePath =
  path.join(
    root,
    'apps-script',
    'src',
    'SkillIntelligence.gs'
  );

const intelligencePath =
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityIntelligence.gs'
  );

const scoringPath =
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityScoring.gs'
  );

const pipelinePath =
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityIntelligenceScoringPipeline.gs'
  );

const skillProfile =
  JSON.parse(
    fs.readFileSync(files[0], 'utf8')
  );

const scoringConfig =
  JSON.parse(
    fs.readFileSync(files[1], 'utf8')
  );

const context = {
  console: console
};

vm.createContext(context);

[
  skillEnginePath,
  intelligencePath,
  scoringPath,
  pipelinePath
].forEach(function(filePath) {
  vm.runInContext(
    fs.readFileSync(filePath, 'utf8'),
    context
  );
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(
      'ASSERTION FAILED: ' + message
    );
  }
}

console.log(
  '=== STEP 7.7.9 INTELLIGENCE + SCORING PIPELINE TEST ==='
);

const skillModel =
  context.createSkillIntelligenceModel(
    skillProfile
  );

const discoveryResult = {
  selected_sources: [
    {
      id: 'test-source',
      name: 'Test Source'
    }
  ],

  plans: [
    {
      plan_id: 'plan-test-001',
      source_id: 'test-source',
      query_id: 'query-test-001'
    }
  ],

  records: [
    {
      discovery_id: 'd-production-001',

      query_id: 'query-test-001',

      source_id: 'test-source',

      discovered_at:
        new Date().toISOString(),

      title:
        'Open Technology Research Conference',

      organizer:
        'Public Technology Research Group',

      url:
        'https://example.com/event',

      source_type:
        'test',

      location:
        'Hyderabad',

      raw_text:
        'Technology research conference with technical presentations, ' +
        'developer networking, documentation contribution, ' +
        'open source projects and volunteer video editing.',

      role:
        'Volunteer contributor',

      requirements:
        'Students and early-career technology participants welcome.',

      tags: [
        'technology',
        'research',
        'networking',
        'open-source'
      ],

      categories: [
        'conference',
        'research_event',
        'open_source_event'
      ],

      verification_status:
        'unverified',

      status:
        'discovered'
    }
  ],

  status:
    'completed'
};

const result =
  context.runOpportunityIntelligenceScoringPipeline(
    discoveryResult,
    skillProfile,
    skillModel,
    scoringConfig
  );

assert(
  result,
  'Pipeline result must be returned.'
);

assert(
  result.status === 'completed',
  'Pipeline status must be completed.'
);

assert(
  Array.isArray(result.records),
  'Original records must remain available.'
);

assert(
  Array.isArray(result.ranked_records),
  'Ranked records must be available.'
);

assert(
  result.records.length === 1,
  'Original record count must be preserved.'
);

assert(
  result.ranked_records.length === 1,
  'Ranked record count must match discovery count.'
);

const ranked =
  result.ranked_records[0];

assert(
  ranked.discovery_id ===
    'd-production-001',
  'Discovery identity must be preserved.'
);

assert(
  ranked.intelligence,
  'Opportunity intelligence must be attached.'
);

assert(
  ranked.scoring,
  'Opportunity scoring must be attached.'
);

assert(
  typeof ranked.scoring.score === 'number',
  'Score must be numeric.'
);

assert(
  ranked.scoring.score >= 0 &&
  ranked.scoring.score <= 100,
  'Score must be between 0 and 100.'
);

assert(
  ['S', 'A', 'B', 'C', 'D']
    .includes(ranked.scoring.rank),
  'Rank must be valid.'
);

assert(
  ranked.scoring.score_version ===
    scoringConfig.version,
  'Scoring version must be preserved.'
);

assert(
  result.intelligence_scoring,
  'Pipeline metadata must be present.'
);

assert(
  result.intelligence_scoring
    .intelligence_version === '1.0.0',
  'Intelligence version must be preserved.'
);

assert(
  result.intelligence_scoring
    .scoring_version === scoringConfig.version,
  'Pipeline scoring version must be preserved.'
);

assert(
  result.intelligence_scoring.record_count === 1,
  'Pipeline record count must be correct.'
);

console.log(
  'DISCOVERY RESULT CONSUMPTION: PASSED'
);

console.log(
  'INTELLIGENCE ENRICHMENT: PASSED'
);

console.log(
  'SCORING ENRICHMENT: PASSED'
);

console.log(
  'ORIGINAL RECORD PRESERVATION: PASSED'
);

console.log(
  'RANKED RECORD GENERATION: PASSED'
);

console.log(
  'SCORE/RANK VALIDATION: PASSED'
);

console.log(
  'VERSION PRESERVATION: PASSED'
);

console.log(
  'PIPELINE METADATA: PASSED'
);

console.log(
  'STEP 7.7.9 TEST: PASSED'
);

console.log(
  'LOCAL OPPORTUNITY INTELLIGENCE + SCORING PIPELINE TEST: PASSED'
);
