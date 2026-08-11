const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/HttpClient.gs',
  'apps-script/src/HttpResponseNormalizer.gs',
  'apps-script/src/AppsScriptHttpClient.gs',
  'apps-script/src/AppsScriptHttpClientTest.gs'
];

for (const file of files) {
  const source =
    fs.readFileSync(file, 'utf8');

  vm.runInContext(
    source,
    context,
    {
      filename: file
    }
  );
}

if (
  typeof context.runAppsScriptHttpClientTest !==
  'function'
) {
  throw new Error(
    'runAppsScriptHttpClientTest was not loaded.'
  );
}

context.runAppsScriptHttpClientTest();

console.log(
  'LOCAL APPS SCRIPT HTTP CLIENT TEST: PASSED'
);
