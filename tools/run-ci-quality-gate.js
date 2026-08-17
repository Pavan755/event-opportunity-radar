const { spawnSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const node = process.execPath;

const suites = [
  {
    name: 'Source health policy',
    script: 'tools/run-source-health-policy-test.js'
  },
  {
    name: 'Discovery plan validator',
    script: 'tools/run-discovery-plan-validator-test.js'
  },
  {
    name: 'Discovery pipeline',
    script: 'tools/run-discovery-pipeline-test.js'
  },
  {
    name: 'Discovery normalization pipeline',
    script: 'tools/run-discovery-normalization-pipeline-test.js'
  },
  {
    name: 'Policy-aware verification evidence',
    script: 'tools/run-policy-aware-verification-evidence-test.js'
  },
  {
    name: 'Opportunity identity',
    script: 'tools/run-opportunity-identity-test.js'
  },
  {
    name: 'Skill intelligence',
    script: 'tools/run-skill-intelligence-test.js'
  },
  {
    name: 'Opportunity scoring integration',
    script: 'tools/run-opportunity-scoring-integration-test.js'
  },
  {
    name: 'Opportunity lifecycle',
    script: 'tools/run-opportunity-lifecycle-test.js'
  },
  {
    name: 'Opportunity radar pipeline',
    script: 'tools/run-opportunity-radar-pipeline-test.js'
  }
];

const failures = [];

for (const suite of suites) {
  console.log('');
  console.log('============================================================');
  console.log('RUNNING:', suite.name);
  console.log('SCRIPT :', suite.script);
  console.log('============================================================');

  const scriptPath = path.join(root, suite.script);

  const result = spawnSync(node, [scriptPath], {
    cwd: root,
    stdio: 'inherit'
  });

  if (result.error) {
    failures.push({ suite: suite.name, reason: result.error.message });
    continue;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    failures.push({
      suite: suite.name,
      reason: `exit code ${result.status}`
    });
  }
}

console.log('');
if (failures.length > 0) {
  console.error('QUALITY GATE FAILED');
  for (const failure of failures) {
    console.error(`- ${failure.suite}: ${failure.reason}`);
  }
  process.exit(1);
}

console.log('QUALITY GATE PASSED');
