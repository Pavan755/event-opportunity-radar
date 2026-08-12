const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,

  Utilities: {
    getUuid: function() {
      return 'test-' +
        Math.random()
          .toString(36)
          .substring(2, 14);
    }
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/VerificationEvidence.gs',
  'apps-script/src/VerificationAuthorityPolicy.gs',
  'apps-script/src/PolicyAwareVerificationEvidence.gs',
  'apps-script/src/PolicyAwareEvidenceRecordIntegration.gs',
  'apps-script/src/PolicyAwareEvidenceRecordIntegrationTest.gs'
];

for (const file of files) {
  const source =
    fs.readFileSync(file, 'utf8');

  vm.runInContext(
    source,
    context,
    {
      filename: file
    }
  );
}

if (
  typeof context
    .runPolicyAwareEvidenceRecordIntegrationTest !==
  'function'
) {
  throw new Error(
    'runPolicyAwareEvidenceRecordIntegrationTest was not loaded.'
  );
}

context.runPolicyAwareEvidenceRecordIntegrationTest();

console.log(
  'LOCAL POLICY-AWARE EVIDENCE RECORD INTEGRATION TEST: PASSED'
);
