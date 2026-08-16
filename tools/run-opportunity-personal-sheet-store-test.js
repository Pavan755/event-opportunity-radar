const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
const context = { console: console };
vm.createContext(context);

const trackerPath = path.join(root, 'apps-script', 'src', 'OpportunityPersonalTracker.gs');
const sheetStorePath = path.join(root, 'apps-script', 'src', 'OpportunityPersonalSheetStore.gs');
const testPath = path.join(root, 'apps-script', 'src', 'OpportunityPersonalSheetStoreTest.gs');

vm.runInContext(fs.readFileSync(trackerPath, 'utf8'), context, { filename: 'OpportunityPersonalTracker.gs' });
vm.runInContext(fs.readFileSync(sheetStorePath, 'utf8'), context, { filename: 'OpportunityPersonalSheetStore.gs' });
vm.runInContext(fs.readFileSync(testPath, 'utf8'), context, { filename: 'OpportunityPersonalSheetStoreTest.gs' });

if (typeof context.runOpportunityPersonalSheetStoreTest !== 'function') {
  throw new Error('Opportunity personal sheet store test was not loaded.');
}

context.runOpportunityPersonalSheetStoreTest();
console.log('LOCAL OPPORTUNITY PERSONAL SHEET STORE TEST: PASSED');
