const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,
  Utilities: {
    getUuid: () => 'test-' + Math.random().toString(36).substring(2, 12)
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/QueryGenerator.gs',
  'apps-script/src/DiscoveryModels.gs',
  'apps-script/src/Deduplicator.gs',
  'apps-script/src/DiscoveryTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  vm.runInContext(source, context, { filename: file });
}

if (typeof context.runDiscoveryEngineTest !== 'function') {
  throw new Error('runDiscoveryEngineTest was not loaded.');
}

context.runDiscoveryEngineTest();

console.log('LOCAL INTEGRATION TEST: PASSED');
