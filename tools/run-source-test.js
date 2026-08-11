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
  'apps-script/src/SourceAdapter.gs',
  'apps-script/src/SourceRegistry.gs',
  'apps-script/src/SourceNormalizer.gs',
  'apps-script/src/SourceTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  vm.runInContext(source, context, { filename: file });
}

if (typeof context.runSourceTest !== 'function') {
  throw new Error('runSourceTest was not loaded.');
}

context.runSourceTest();

console.log('LOCAL SOURCE INTEGRATION TEST: PASSED');
