/**
 * Local regression test for Opportunity Intelligence.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const skillsPath =
  path.join(root, 'config', 'skills.json');

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

const skillProfile =
  JSON.parse(
    fs.readFileSync(
      skillsPath,
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(
      'ASSERTION FAILED: ' + message
    );
  }
}

console.log(
  '=== STEP 7.6.6 OPPORTUNITY INTELLIGENCE TEST ==='
);

const skillModel =
  context.createSkillIntelligenceModel(
    skillProfile
  );

const governmentConference = {
  discovery_id: 'd-test-government',
  title: 'National Government Technology Conference',
  organizer: 'Department of Public Technology',
  location: 'Hyderabad',
  raw_text:
    'Government technology conference with research presentations, ' +
    'industry experts, networking, technical documentation, ' +
    'event photography, video coverage and video editing volunteers.'
};

const result =
  context.enrichDiscoveryRecordWithOpportunityIntelligence(
    governmentConference,
    skillProfile,
    skillModel
  );

assert(
  result.discovery_id === 'd-test-government',
  'Discovery identity must be preserved.'
);

assert(
  result.intelligence,
  'Intelligence object must be attached.'
);

assert(
  Array.isArray(
    result.intelligence.opportunity_types
  ),
  'Opportunity types must be an array.'
);

assert(
  result.intelligence.opportunity_types
    .includes('conference'),
  'Conference classification should be detected.'
);

assert(
  result.intelligence.opportunity_types
    .includes('government_event'),
  'Government event classification should be detected.'
);

assert(
  result.intelligence.opportunity_types
    .includes('research_event'),
  'Research classification should be detected.'
);

assert(
  Array.isArray(
    result.intelligence.direct_skill_matches
  ),
  'Direct skill matches must be preserved.'
);

assert(
  Array.isArray(
    result.intelligence.learning_skill_matches
  ),
  'Learning skill matches must be separated.'
);

assert(
  Array.isArray(
    result.intelligence.inferred_skill_matches
  ),
  'Inferred skill matches must be separated.'
);

assert(
  result.intelligence.contribution_types
    .includes('documentation'),
  'Documentation contribution should be detected.'
);

assert(
  result.intelligence.contribution_types
    .includes('videography'),
  'Videography contribution should be detected.'
);

assert(
  result.intelligence.contribution_types
    .includes('video_editing'),
  'Video editing contribution should be detected.'
);

assert(
  result.intelligence.learning_signals
    .includes('research_exposure'),
  'Research learning signal should be detected.'
);

assert(
  result.intelligence.networking_signals
    .includes('networking'),
  'Networking signal should be detected.'
);

console.log(
  'RECORD IDENTITY PRESERVATION: PASSED'
);

console.log(
  'MULTI-TYPE CLASSIFICATION: PASSED'
);

console.log(
  'GOVERNMENT EVENT DETECTION: PASSED'
);

console.log(
  'RESEARCH EVENT DETECTION: PASSED'
);

console.log(
  'SKILL INTELLIGENCE INTEGRATION: PASSED'
);

console.log(
  'CONTRIBUTION DETECTION: PASSED'
);

console.log(
  'LEARNING SIGNAL DETECTION: PASSED'
);

console.log(
  'NETWORKING SIGNAL DETECTION: PASSED'
);

console.log(
  'STEP 7.6.6 TEST: PASSED'
);

console.log(
  'LOCAL OPPORTUNITY INTELLIGENCE TEST: PASSED'
);
