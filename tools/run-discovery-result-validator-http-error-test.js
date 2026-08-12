const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/DiscoveryResultValidator.gs',
  'apps-script/src/DiscoveryResultValidatorHttpErrorTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runDiscoveryResultValidatorHttpErrorTest !==
  'function'
) {
  throw new Error(
    'runDiscoveryResultValidatorHttpErrorTest was not loaded.'
  );
}

context.runDiscoveryResultValidatorHttpErrorTest();

console.log(
  'LOCAL DISCOVERY RESULT HTTP ERROR TEST: PASSED'
);
