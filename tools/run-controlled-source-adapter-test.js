const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/ControlledSourceAdapter.gs',
  'apps-script/src/ControlledSourceAdapterTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (typeof context.runControlledSourceAdapterTest !== 'function') {
  throw new Error(
    'runControlledSourceAdapterTest was not loaded.'
  );
}

context.runControlledSourceAdapterTest();

console.log(
  'LOCAL CONTROLLED SOURCE ADAPTER TEST: PASSED'
);
