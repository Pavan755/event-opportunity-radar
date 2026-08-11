const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/HttpClient.gs',
  'apps-script/src/HttpResponseNormalizer.gs',
  'apps-script/src/HttpClientContractTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runHttpClientContractTest !==
  'function'
) {
  throw new Error(
    'runHttpClientContractTest was not loaded.'
  );
}

context.runHttpClientContractTest();

console.log(
  'LOCAL HTTP CLIENT CONTRACT TEST: PASSED'
);
