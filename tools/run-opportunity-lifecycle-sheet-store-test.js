const fs = require('fs');
const vm = require('vm');

const context = { console: console };
vm.createContext(context);

[
  'apps-script/src/OpportunityLifecycle.gs',
  'apps-script/src/OpportunityLifecycleSheetStore.gs',
  'apps-script/src/OpportunityLifecycleSheetStoreTest.gs'
].forEach(function(file) {
  vm.runInContext(
    fs.readFileSync(file, 'utf8'),
    context,
    { filename: file }
  );
});

context.runOpportunityLifecycleSheetStoreTest();
console.log('LOCAL LIFECYCLE SHEET STORE TEST: PASSED');
