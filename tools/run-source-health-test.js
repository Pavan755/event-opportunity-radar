const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/SourceHealth.gs',
  'apps-script/src/SourceHealthTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  vm.runInContext(source, context, { filename: file });
}

if (typeof context.runSourceHealthTest !== 'function') {
  throw new Error('runSourceHealthTest was not loaded.');
}

context.runSourceHealthTest();

console.log('LOCAL SOURCE HEALTH INTEGRATION TEST: PASSED');
