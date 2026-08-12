const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/VerificationAuthorityPolicy.gs',
  'apps-script/src/VerificationAuthorityPolicyTest.gs'
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
  typeof context.runVerificationAuthorityPolicyTest !==
  'function'
) {
  throw new Error(
    'runVerificationAuthorityPolicyTest was not loaded.'
  );
}

context.runVerificationAuthorityPolicyTest();

console.log(
  'LOCAL VERIFICATION AUTHORITY POLICY TEST: PASSED'
);
