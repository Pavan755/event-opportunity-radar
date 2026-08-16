function runOpportunityLifecycleSheetStoreTest() {
  const values = [];

  const sheet = {
    getLastRow: function() { return values.length; },
    appendRow: function(row) { values.push(row.slice()); },
    getDataRange: function() {
      return { getValues: function() { return values.map(function(row) {
        return row.slice();
      }); } };
    },
    getRange: function(rowIndex) {
      return { setValues: function(rows) {
        values[rowIndex - 1] = rows[0].slice();
      } };
    }
  };

  const spreadsheet = {
    getSheetByName: function() { return values.length ? sheet : null; },
    insertSheet: function() { return sheet; }
  };

  const store = createOpportunityLifecycleSheetStore(spreadsheet);
  const lifecycle = createOpportunityLifecycle('d-sheet-store-001');

  store.save(lifecycle);
  const loaded = store.load('d-sheet-store-001');

  if (!loaded || loaded.state !== 'new' ||
      loaded.history.length !== 1) {
    throw new Error('Stored lifecycle could not be loaded.');
  }

  const planned = transitionOpportunityLifecycle(
    transitionOpportunityLifecycle(loaded, 'considering', 'reviewed'),
    'planned',
    'planned'
  );

  store.save(planned);
  const updated = store.load('d-sheet-store-001');

  if (updated.state !== 'planned' ||
      updated.history.length !== 3 ||
      values.length !== 2) {
    throw new Error('Lifecycle storage must update one existing row.');
  }

  console.log('LIFECYCLE SHEET CREATE: PASSED');
  console.log('LIFECYCLE SHEET LOAD: PASSED');
  console.log('LIFECYCLE SHEET UPDATE: PASSED');
}
