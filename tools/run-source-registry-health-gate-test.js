const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/SourceHealthPolicy.gs',
  'apps-script/src/SourceRegistryHealthGate.gs',
  'apps-script/src/SourceRegistryHealthGateTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  vm.runInContext(source, context, { filename: file });
}

if (typeof context.runSourceRegistryHealthGateTest !== 'function') {
  throw new Error('runSourceRegistryHealthGateTest was not loaded.');
}

context.runSourceRegistryHealthGateTest();

console.log('LOCAL SOURCE REGISTRY HEALTH GATE TEST: PASSED');
