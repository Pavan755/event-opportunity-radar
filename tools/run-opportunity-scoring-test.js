/**
 * Local regression test for Opportunity Scoring.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const scoringPath =
  path.join(root, 'config', 'scoring.json');

const scoringEnginePath =
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityScoring.gs'
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
  '=== STEP 7.7.3 OPPORTUNITY SCORING TEST ==='
);

const model =
  context.createOpportunityScoringModel(
    scoringConfig
  );

const opportunity = {
  discovery_id: 'score-test-government',
  title: 'Government Technology Research Conference',
  description:
    'Free government conference with research presentations, ' +
    'networking, technical documentation, photography, ' +
    'video coverage and video editing opportunities.',
  organizer:
    'Department of Public Technology',
  location:
    'Hyderabad',
  raw_text:
    'Government technology research conference with ' +
    'industry experts, networking, documentation, ' +
    'videography and video editing volunteers.'
};

const intelligence = {
  opportunity_types: [
    'conference',
    'government',
    'research'
  ],

  contribution_types: [
    'documentation',
    'videography',
    'video_editing'
  ],

  learning_signals: [
    'research_exposure'
  ],

  networking_signals: [
    'networking',
    'industry_exposure'
  ],

  career_signals: [
    'professional_exposure'
  ],

  research_signals: [
    'research_exposure'
  ]
};

const skillResult = {
  direct_matches: [
    {
      id: 'technical_documentation'
    },
    {
      id: 'videography'
    }
  ],

  learning_matches: [
    {
      id: 'advanced_video_editing'
    }
  ],

  inferred_matches: []
};

const result =
  context.scoreOpportunity(
    opportunity,
    intelligence,
    skillResult,
    model
  );

assert(
  result,
  'Scoring result must exist.'
);

assert(
  typeof result.score === 'number',
  'Final score must be numeric.'
);

assert(
  result.score >= 0 &&
  result.score <= 100,
  'Final score must remain between 0 and 100.'
);

assert(
  ['S', 'A', 'B', 'C', 'D']
    .includes(result.rank),
  'Rank must be valid.'
);

assert(
  result.components.learning_value > 0,
  'Learning value should be detected.'
);

assert(
  result.components.contribution_value > 0,
  'Contribution value should be detected.'
);

assert(
  result.components.networking_value > 0,
  'Networking value should be detected.'
);

assert(
  result.components.portfolio_value > 0,
  'Portfolio value should be detected.'
);

assert(
  result.bonuses &&
  typeof result.bonuses.total === 'number',
  'Bonus calculation must be present.'
);

assert(
  result.penalties &&
  typeof result.penalties.total === 'number',
  'Penalty calculation must be present.'
);

assert(
  result.explanation &&
  Array.isArray(
    result.explanation.strongest_factors
  ),
  'Score explanation must be present.'
);

console.log(
  'SCORING MODEL CREATION: PASSED'
);

console.log(
  'BASE SCORE CALCULATION: PASSED'
);

console.log(
  'LEARNING VALUE: PASSED'
);

console.log(
  'CONTRIBUTION VALUE: PASSED'
);

console.log(
  'NETWORKING VALUE: PASSED'
);

console.log(
  'PORTFOLIO VALUE: PASSED'
);

console.log(
  'BONUS CALCULATION: PASSED'
);

console.log(
  'PENALTY CALCULATION: PASSED'
);

console.log(
  'RANK CALCULATION: PASSED'
);

console.log(
  'EXPLANATION GENERATION: PASSED'
);

console.log(
  'STEP 7.7.3 TEST: PASSED'
);

console.log(
  'LOCAL OPPORTUNITY SCORING TEST: PASSED'
);
