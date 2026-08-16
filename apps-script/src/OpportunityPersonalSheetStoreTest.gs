function runOpportunityPersonalSheetStoreTest() {
  const createdRows = [];

  const sheet = {
    getLastRow: function() {
      return createdRows.length;
    },
    appendRow: function(row) {
      createdRows.push(row.slice());
    },
    getDataRange: function() {
      return {
        getValues: function() {
          return createdRows.slice();
        }
      };
    },
    getRange: function(row, col, rowCount, colCount) {
      return {
        setValues: function(values) {
          createdRows[row - 1] = values[0].slice();
        }
      };
    },
    deleteRow: function(rowIndex) {
      createdRows.splice(rowIndex - 1, 1);
    }
  };

  const spreadsheet = {
    getSheetByName: function() {
      return createdRows.length ? sheet : null;
    },
    insertSheet: function() {
      return sheet;
    }
  };

  const store = createOpportunityPersonalTrackerSheetStore(spreadsheet);
  const created = store.save({
    discovery_id: 'sheet-001',
    title: 'Hyderabad AI Meetup',
    region: 'Hyderabad',
    type: 'Technical Volunteer',
    priority: 'A',
    status: 'shortlisted',
    notes: 'Review volunteer role.'
  });

  if (!created || created.title !== 'Hyderabad AI Meetup') {
    throw new Error('Sheet store save failed.');
  }

  const loaded = store.get('sheet-001');
  if (!loaded || loaded.region !== 'Hyderabad') {
    throw new Error('Sheet store load failed.');
  }

  const updated = store.save({
    discovery_id: 'sheet-001',
    title: 'Hyderabad AI Meetup',
    region: 'Hyderabad',
    type: 'Technical Volunteer',
    priority: 'A',
    status: 'attended',
    notes: 'Good event, strong follow-up note.'
  });

  if (updated.status !== 'attended') {
    throw new Error('Sheet store update failed.');
  }

  const allRows = store.list();
  if (!Array.isArray(allRows) || allRows.length !== 1) {
    throw new Error('List retrieval failed.');
  }

  const removed = store.remove('sheet-001');
  if (!removed) {
    throw new Error('Remove operation failed.');
  }

  console.log('PERSONAL SHEET CREATE: PASSED');
  console.log('PERSONAL SHEET LOAD: PASSED');
  console.log('PERSONAL SHEET UPDATE: PASSED');
  console.log('PERSONAL SHEET DELETE: PASSED');
}
