const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/DiscoveryResultValidator.gs',
  'apps-script/src/DiscoveryResultValidatorTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runDiscoveryResultValidatorTest !== 'function'
) {
  throw new Error(
    'runDiscoveryResultValidatorTest was not loaded.'
  );
}

context.runDiscoveryResultValidatorTest();

console.log(
  'LOCAL DISCOVERY RESULT VALIDATOR TEST: PASSED'
);
