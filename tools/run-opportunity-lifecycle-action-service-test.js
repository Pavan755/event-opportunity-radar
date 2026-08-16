const fs = require('fs');
const vm = require('vm');

const context = { console: console };
vm.createContext(context);

[
  'apps-script/src/OpportunityLifecycle.gs',
  'apps-script/src/OpportunityLifecycleSheetStore.gs'
].forEach(function(file) {
  vm.runInContext(
    fs.readFileSync(file, 'utf8'),
    context,
    { filename: file }
  );
});

function assert(condition, message) {
  if (!condition) {
    throw new Error('ASSERTION FAILED: ' + message);
  }
}

const values = [];
const sheet = {
  getLastRow: function() { return values.length; },
  appendRow: function(row) { values.push(row.slice()); },
  getDataRange: function() {
    return {
      getValues: function() {
        return values.map(function(row) {
          return row.slice();
        });
      }
    };
  },
  getRange: function(rowIndex) {
    return {
      setValues: function(rows) {
        values[rowIndex - 1] = rows[0].slice();
      }
    };
  }
};

const spreadsheet = {
  getSheetByName: function() { return values.length ? sheet : null; },
  insertSheet: function() { return sheet; }
};

const service = context.createOpportunityLifecycleActionService(spreadsheet);
const record = {
  discovery_id: 'd-action-001',
  title: 'Demo track',
  lifecycle: context.createOpportunityLifecycle('d-action-001')
};

const updated = service.applyToRecord(record, 'planned', 'user_planned');
assert(
  updated.lifecycle.state === 'planned',
  'Lifecycle action service must transition to planned.'
);

const persisted = service.get('d-action-001');
assert(
  persisted.state === 'planned',
  'Lifecycle action service must persist updated lifecycle state.'
);

const reloaded = service.applyToRecord(
  { discovery_id: 'd-action-001', title: 'Demo track' },
  'registered',
  'user_registered'
);
assert(
  reloaded.lifecycle.state === 'registered',
  'Lifecycle action service must allow valid next-state transitions.'
);

console.log('LIFECYCLE ACTION SERVICE: PASSED');
console.log('LIFECYCLE PERSISTENCE FLOW: PASSED');
console.log('LOCAL LIFECYCLE ACTION SERVICE TEST: PASSED');
