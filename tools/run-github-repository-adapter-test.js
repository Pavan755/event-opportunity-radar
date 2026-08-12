const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,
  Utilities: {
    getUuid: () =>
      'test-' +
      Math.random()
        .toString(36)
        .substring(2, 14)
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/GitHubRepositoryAdapter.gs',
  'apps-script/src/GitHubRepositoryAdapterTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runGitHubRepositoryAdapterTest !==
  'function'
) {
  throw new Error(
    'runGitHubRepositoryAdapterTest was not loaded.'
  );
}

context.runGitHubRepositoryAdapterTest();

console.log(
  'LOCAL GITHUB REPOSITORY ADAPTER TEST: PASSED'
);
