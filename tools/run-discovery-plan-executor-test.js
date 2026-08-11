const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/DiscoveryPlanValidator.gs',
  'apps-script/src/DiscoveryPlanExecutor.gs',
  'apps-script/src/DiscoveryPlanExecutorTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (typeof context.runDiscoveryPlanExecutorTest !== 'function') {
  throw new Error(
    'runDiscoveryPlanExecutorTest was not loaded.'
  );
}

context.runDiscoveryPlanExecutorTest();

console.log(
  'LOCAL DISCOVERY PLAN EXECUTOR TEST: PASSED'
);
