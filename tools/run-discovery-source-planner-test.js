const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,
  Utilities: {
    getUuid: () => 'test-' + Math.random().toString(36).substring(2, 14)
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/SourceHealthPolicy.gs',
  'apps-script/src/SourceRegistryHealthGate.gs',
  'apps-script/src/SourceSelector.gs',
  'apps-script/src/DiscoverySourcePlanner.gs',
  'apps-script/src/DiscoverySourcePlannerTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (typeof context.runDiscoverySourcePlannerTest !== 'function') {
  throw new Error(
    'runDiscoverySourcePlannerTest was not loaded.'
  );
}

context.runDiscoverySourcePlannerTest();

console.log('LOCAL DISCOVERY SOURCE PLANNER TEST: PASSED');
