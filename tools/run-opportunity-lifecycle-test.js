const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root =
  path.resolve(__dirname, '..');

const context = {
  console: console
};

vm.createContext(context);

const lifecyclePath =
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityLifecycle.gs'
  );

const testPath =
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityLifecycleTest.gs'
  );

vm.runInContext(
  fs.readFileSync(
    lifecyclePath,
    'utf8'
  ),
  context,
  {
    filename:
      'OpportunityLifecycle.gs'
  }
);

vm.runInContext(
  fs.readFileSync(
    testPath,
    'utf8'
  ),
  context,
  {
    filename:
      'OpportunityLifecycleTest.gs'
  }
);

if (
  typeof context.runOpportunityLifecycleTest !==
  'function'
) {
  throw new Error(
    'Opportunity lifecycle test was not loaded.'
  );
}

context.runOpportunityLifecycleTest();

console.log(
  'LOCAL OPPORTUNITY LIFECYCLE TEST: PASSED'
);
