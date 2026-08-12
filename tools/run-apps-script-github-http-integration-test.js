const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,
  UrlFetchApp: undefined
};

vm.createContext(context);

const files = [
  'apps-script/src/HttpClient.gs',
  'apps-script/src/AppsScriptHttpClient.gs',
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/GitHubRepositoryAdapter.gs',
  'apps-script/src/AppsScriptGitHubHttpIntegrationTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runAppsScriptGitHubHttpIntegrationTest !==
  'function'
) {
  throw new Error(
    'runAppsScriptGitHubHttpIntegrationTest was not loaded.'
  );
}

context.runAppsScriptGitHubHttpIntegrationTest();

console.log(
  'LOCAL APPS SCRIPT GITHUB HTTP INTEGRATION TEST: PASSED'
);
