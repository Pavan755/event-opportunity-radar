const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
const context = { console: console };
vm.createContext(context);

const trackerPath = path.join(root, 'apps-script', 'src', 'OpportunityPersonalTracker.gs');
const testPath = path.join(root, 'apps-script', 'src', 'OpportunityPersonalTrackerTest.gs');

vm.runInContext(fs.readFileSync(trackerPath, 'utf8'), context, { filename: 'OpportunityPersonalTracker.gs' });
vm.runInContext(fs.readFileSync(testPath, 'utf8'), context, { filename: 'OpportunityPersonalTrackerTest.gs' });

if (typeof context.runOpportunityPersonalTrackerTest !== 'function') {
  throw new Error('Opportunity personal tracker test was not loaded.');
}

context.runOpportunityPersonalTrackerTest();
console.log('LOCAL OPPORTUNITY PERSONAL TRACKER TEST: PASSED');
