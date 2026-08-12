const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/HttpClient.gs',
  'apps-script/src/GitHubRepositoryAdapter.gs',
  'apps-script/src/ProductionAdapterFactory.gs',
  'apps-script/src/ProductionAdapterFactoryTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runProductionAdapterFactoryTest !==
  'function'
) {
  throw new Error(
    'runProductionAdapterFactoryTest was not loaded.'
  );
}

context.runProductionAdapterFactoryTest();

console.log(
  'LOCAL PRODUCTION ADAPTER FACTORY TEST: PASSED'
);
