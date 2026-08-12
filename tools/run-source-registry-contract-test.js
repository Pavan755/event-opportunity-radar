const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/SourceAdapter.gs',
  'apps-script/src/SourceRegistry.gs',
  'apps-script/src/SourceRegistryContractTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runSourceRegistryContractTest !==
  'function'
) {
  throw new Error(
    'runSourceRegistryContractTest was not loaded.'
  );
}

context.runSourceRegistryContractTest();

console.log(
  'LOCAL SOURCE REGISTRY CONTRACT TEST: PASSED'
);
