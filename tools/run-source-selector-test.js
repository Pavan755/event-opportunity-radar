const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/SourceHealthPolicy.gs',
  'apps-script/src/SourceRegistryHealthGate.gs',
  'apps-script/src/SourceSelector.gs',
  'apps-script/src/SourceSelectorTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  vm.runInContext(source, context, {
    filename: file
  });
}

if (typeof context.runSourceSelectorTest !== 'function') {
  throw new Error('runSourceSelectorTest was not loaded.');
}

context.runSourceSelectorTest();

console.log('LOCAL SOURCE SELECTION TEST: PASSED');
