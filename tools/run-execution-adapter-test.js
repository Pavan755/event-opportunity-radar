const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/ExecutionAdapterTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (typeof context.runExecutionAdapterTest !== 'function') {
  throw new Error(
    'runExecutionAdapterTest was not loaded.'
  );
}

context.runExecutionAdapterTest();

console.log(
  'LOCAL EXECUTION ADAPTER TEST: PASSED'
);
