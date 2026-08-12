/**
 * Local regression test for Opportunity Intelligence -> Opportunity Scoring.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const skillsPath =
  path.join(root, 'config', 'skills.json');

const scoringPath =
  path.join(root, 'config', 'scoring.json');

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

const scoringEnginePath =
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityScoring.gs'
  );

const skillProfile =
  JSON.parse(
    fs.readFileSync(
      skillsPath,
      'utf8'
    )
  );

const scoringConfig =
  JSON.parse(
    fs.readFileSync(
      scoringPath,
      'utf8'
    )
  );

const context = {
  console: console
};

vm.createContext(context);

vm.runInContext(
  fs.readFileSync(
    skillEnginePath,
    'utf8'
  ),
  context
);

vm.runInContext(
  fs.readFileSync(
    intelligencePath,
    'utf8'
  ),
  context
);

vm.runInContext(
  fs.readFileSync(
    scoringEnginePath,
    'utf8'
  ),
  context
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(
      'ASSERTION FAILED: ' + message
    );
  }
}

console.log(
  '=== STEP 7.7.6 OPPORTUNITY INTELLIGENCE -> SCORING INTEGRATION TEST ==='
);

const skillModel =
  context.createSkillIntelligenceModel(
    skillProfile
  );

const scoringModel =
  context.createOpportunityScoringModel(
    scoringConfig
  );

const opportunity = {
  discovery_id: 'd-test-scoring-integration',

  title:
    'National Government Technology Conference',

  description:
    'Government technology conference with research presentations, ' +
    'industry experts, networking, technical documentation, ' +
    'video coverage and video editing volunteers.',

  organizer:
    'Department of Public Technology',

  location:
    'Hyderabad',

  raw_text:
    'Government technology conference with research presentations, ' +
    'industry experts, networking, technical documentation, ' +
    'video coverage and video editing volunteers.',

  role:
    'Volunteer contributor',

  requirements:
    'Students and early-career participants welcome.',

  tags: [
    'government',
    'technology',
    'research',
    'networking'
  ],

  categories: [
    'conference',
    'government_event',
    'research_event'
  ]
};

const enriched =
  context.enrichDiscoveryRecordWithOpportunityIntelligence(
    opportunity,
    skillProfile,
    skillModel
  );

assert(
  enriched.discovery_id ===
    'd-test-scoring-integration',
  'Discovery identity must be preserved.'
);

assert(
  enriched.intelligence,
  'Opportunity intelligence must be attached.'
);

assert(
  Array.isArray(
    enriched.intelligence.opportunity_types
  ),
  'Opportunity types must be available.'
);

assert(
  Array.isArray(
    enriched.intelligence.learning_signals
  ),
  'Learning signals must be available.'
);

assert(
  Array.isArray(
    enriched.intelligence.contribution_types
  ),
  'Contribution types must be available.'
);

assert(
  Array.isArray(
    enriched.intelligence.networking_signals
  ),
  'Networking signals must be available.'
);

/*
 * Opportunity Intelligence stores the skill results
 * in separated intelligence fields. Reconstruct the
 * scoring-layer skill result without inventing evidence.
 */
const skillResult = {
  direct_matches:
    enriched.intelligence.direct_skill_matches || [],

  learning_matches:
    enriched.intelligence.learning_skill_matches || [],

  inferred_matches:
    enriched.intelligence.inferred_skill_matches || []
};

const scored =
  context.scoreOpportunity(
    enriched,
    enriched.intelligence,
    skillResult,
    scoringModel
  );

assert(
  scored,
  'Scoring result must be returned.'
);

assert(
  typeof scored.score === 'number',
  'Final score must be numeric.'
);

assert(
  scored.score >= 0 &&
  scored.score <= 100,
  'Final score must be between 0 and 100.'
);

assert(
  ['S', 'A', 'B', 'C', 'D']
    .includes(scored.rank),
  'Rank must be S/A/B/C/D.'
);

assert(
  typeof scored.base_score === 'number',
  'Base score must be numeric.'
);

assert(
  scored.components &&
  typeof scored.components === 'object',
  'Score components must be present.'
);

assert(
  scored.penalties &&
  typeof scored.penalties === 'object',
  'Penalty result must be present.'
);

assert(
  scored.bonuses &&
  typeof scored.bonuses === 'object',
  'Bonus result must be present.'
);

assert(
  typeof scored.explanation === 'object',
  'Score explanation must be present.'
);

assert(
  scored.score_version ===
    scoringConfig.version,
  'Scoring version must be preserved.'
);

console.log(
  'INTELLIGENCE ENRICHMENT: PASSED'
);

console.log(
  'SKILL RESULT BRIDGE: PASSED'
);

console.log(
  'SCORING MODEL INTEGRATION: PASSED'
);

console.log(
  'FINAL SCORE GENERATION: PASSED'
);

console.log(
  'RANK GENERATION: PASSED'
);

console.log(
  'COMPONENT BREAKDOWN: PASSED'
);

console.log(
  'BONUS/PENALTY INTEGRATION: PASSED'
);

console.log(
  'EXPLANATION GENERATION: PASSED'
);

console.log(
  'SCORE VERSION PRESERVATION: PASSED'
);

console.log(
  'STEP 7.7.6 TEST: PASSED'
);

console.log(
  'LOCAL OPPORTUNITY INTELLIGENCE -> SCORING INTEGRATION TEST: PASSED'
);
