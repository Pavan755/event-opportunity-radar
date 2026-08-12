/**
 * Local regression tests for Skill Intelligence.
 */

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const skillsPath =
  path.join(root, 'config', 'skills.json');

const enginePath =
  path.join(
    root,
    'apps-script',
    'src',
    'SkillIntelligence.gs'
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
    enginePath,
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
  '=== STEP 7.3 SKILL INTELLIGENCE TEST ==='
);

const model =
  context.createSkillIntelligenceModel(
    skillProfile
  );

assert(
  model.capabilities.length ===
    skillProfile.skills.length,
  'Every configured skill should become a capability.'
);

assert(
  model.inference_policy
    .never_upgrade_without_evidence === true,
  'Inference must never silently become verified expertise.'
);

assert(
  model.relationships.length > 0,
  'Skill relationships should be generated.'
);

const opportunity = {
  title: 'AI Community Event Technical Content Volunteer',
  description:
    'Help with Python, data analysis, event documentation, ' +
    'video editing, social media content and GitHub support.'
};

const result =
  context.inferOpportunityCapabilities(
    opportunity,
    skillProfile,
    model
  );

assert(
  result.direct_matches.length > 0,
  'Direct skill matching should find relevant capabilities.'
);

assert(
  Array.isArray(result.learning_matches),
  'Learning matches must be represented separately.'
);

assert(
  Array.isArray(result.inferred_matches),
  'Inferred capabilities must be represented separately.'
);

console.log(
  'CAPABILITY MODEL CREATION: PASSED'
);

console.log(
  'SKILL RELATIONSHIP GENERATION: PASSED'
);

console.log(
  'DIRECT SKILL MATCHING: PASSED'
);

console.log(
  'LEARNING SKILL SEPARATION: PASSED'
);

console.log(
  'INFERRED SKILL SEPARATION: PASSED'
);

console.log(
  'EVIDENCE BOUNDARY: PASSED'
);

console.log(
  'STEP 7.3 TEST: PASSED'
);

console.log(
  'LOCAL SKILL INTELLIGENCE TEST: PASSED'
);
