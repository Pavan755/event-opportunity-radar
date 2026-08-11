const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/DiscoveryPlanDeduplicator.gs',
  'apps-script/src/DiscoveryPlanDeduplicatorTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (typeof context.runDiscoveryPlanDeduplicatorTest !== 'function') {
  throw new Error(
    'runDiscoveryPlanDeduplicatorTest was not loaded.'
  );
}

context.runDiscoveryPlanDeduplicatorTest();

console.log('LOCAL DISCOVERY PLAN DEDUPLICATOR TEST: PASSED');
