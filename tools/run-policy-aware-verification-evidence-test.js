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
  'apps-script/src/PolicyAwareVerificationEvidenceTest.gs'
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
  typeof context.runPolicyAwareVerificationEvidenceTest !==
  'function'
) {
  throw new Error(
    'runPolicyAwareVerificationEvidenceTest was not loaded.'
  );
}

context.runPolicyAwareVerificationEvidenceTest();

console.log(
  'LOCAL POLICY-AWARE VERIFICATION EVIDENCE TEST: PASSED'
);
