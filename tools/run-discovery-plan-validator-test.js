const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/DiscoveryPlanValidator.gs',
  'apps-script/src/DiscoveryPlanValidatorTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (typeof context.runDiscoveryPlanValidatorTest !== 'function') {
  throw new Error(
    'runDiscoveryPlanValidatorTest was not loaded.'
  );
}

context.runDiscoveryPlanValidatorTest();

console.log('LOCAL DISCOVERY PLAN VALIDATOR TEST: PASSED');
