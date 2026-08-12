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
  'apps-script/src/VerificationEvidenceTest.gs'
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
  typeof context.runVerificationEvidenceTest !==
  'function'
) {
  throw new Error(
    'runVerificationEvidenceTest was not loaded.'
  );
}

context.runVerificationEvidenceTest();

console.log(
  'LOCAL VERIFICATION EVIDENCE TEST: PASSED'
);
