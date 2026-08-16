const OPPORTUNITY_PERSONAL_TRACKER_SHEET_NAME = 'Opportunity Personal Tracker';

const OPPORTUNITY_PERSONAL_TRACKER_SHEET_HEADERS = [
  'discovery_id',
  'title',
  'region',
  'type',
  'priority',
  'status',
  'notes',
  'updated_at'
];

function createOpportunityPersonalTrackerSheetStore(spreadsheet) {
  if (!spreadsheet ||
      typeof spreadsheet.getSheetByName !== 'function' ||
      typeof spreadsheet.insertSheet !== 'function') {
    throw new Error('A spreadsheet adapter is required.');
  }

  return {
    list: function() {
      return loadAllOpportunityPersonalEntriesFromSheet(spreadsheet);
    },

    get: function(discoveryId) {
      return loadOpportunityPersonalEntryFromSheet(spreadsheet, discoveryId);
    },

    save: function(entry) {
      return saveOpportunityPersonalEntryToSheet(spreadsheet, entry);
    },

    remove: function(discoveryId) {
      return removeOpportunityPersonalEntryFromSheet(spreadsheet, discoveryId);
    }
  };
}

function getOrCreateOpportunityPersonalTrackerSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(OPPORTUNITY_PERSONAL_TRACKER_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(OPPORTUNITY_PERSONAL_TRACKER_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(OPPORTUNITY_PERSONAL_TRACKER_SHEET_HEADERS);
  }

  return sheet;
}

function opportunityPersonalTrackerRow_(entry) {
  if (!entry || typeof entry !== 'object' || !entry.discovery_id) {
    throw new Error('A valid personal tracker entry is required.');
  }

  return [
    String(entry.discovery_id),
    entry.title || 'Untitled opportunity',
    entry.region || 'Unspecified',
    entry.type || 'General',
    entry.priority || 'B',
    entry.status || 'shortlisted',
    entry.notes || '',
    entry.updated_at || new Date().toISOString()
  ];
}

function loadAllOpportunityPersonalEntriesFromSheet(spreadsheet) {
  const sheet = getOrCreateOpportunityPersonalTrackerSheet_(spreadsheet);
  const rows = sheet.getDataRange().getValues();

  const entries = [];

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];
    if (!row || row.length === 0 || !row[0]) {
      continue;
    }

    entries.push({
      discovery_id: row[0],
      title: row[1],
      region: row[2],
      type: row[3],
      priority: row[4],
      status: row[5],
      notes: row[6],
      updated_at: row[7]
    });
  }

  return entries;
}

function loadOpportunityPersonalEntryFromSheet(spreadsheet, discoveryId) {
  if (!discoveryId || String(discoveryId).trim() === '') {
    throw new Error('discoveryId is required.');
  }

  const rows = loadAllOpportunityPersonalEntriesFromSheet(spreadsheet);
  return rows.find(function(entry) {
    return String(entry.discovery_id) === String(discoveryId);
  }) || null;
}

function saveOpportunityPersonalEntryToSheet(spreadsheet, entry) {
  const row = opportunityPersonalTrackerRow_(entry);
  const sheet = getOrCreateOpportunityPersonalTrackerSheet_(spreadsheet);
  const rows = sheet.getDataRange().getValues();

  for (let index = 1; index < rows.length; index += 1) {
    if (String(rows[index][0]) === String(entry.discovery_id)) {
      sheet.getRange(index + 1, 1, 1, OPPORTUNITY_PERSONAL_TRACKER_SHEET_HEADERS.length).setValues([row]);
      return {
        discovery_id: row[0],
        title: row[1],
        region: row[2],
        type: row[3],
        priority: row[4],
        status: row[5],
        notes: row[6],
        updated_at: row[7]
      };
    }
  }

  sheet.appendRow(row);
  return {
    discovery_id: row[0],
    title: row[1],
    region: row[2],
    type: row[3],
    priority: row[4],
    status: row[5],
    notes: row[6],
    updated_at: row[7]
  };
}

function removeOpportunityPersonalEntryFromSheet(spreadsheet, discoveryId) {
  const sheet = getOrCreateOpportunityPersonalTrackerSheet_(spreadsheet);
  const rows = sheet.getDataRange().getValues();

  for (let index = 1; index < rows.length; index += 1) {
    if (String(rows[index][0]) === String(discoveryId)) {
      sheet.deleteRow(index + 1);
      return true;
    }
  }

  return false;
}

function createOpportunityPersonalTrackerActionService(spreadsheet) {
  if (!spreadsheet ||
      typeof spreadsheet.getSheetByName !== 'function' ||
      typeof spreadsheet.insertSheet !== 'function') {
    throw new Error('A spreadsheet adapter is required.');
  }

  const store = createOpportunityPersonalTrackerSheetStore(spreadsheet);

  return {
    list: function() {
      return store.list();
    },

    get: function(discoveryId) {
      return store.get(discoveryId) || null;
    },

    add: function(entry) {
      const current = store.get(entry && entry.discovery_id);
      if (current) {
        return null;
      }

      return store.save(entry);
    },

    update: function(discoveryId, patch) {
      const current = store.get(discoveryId) || {};
      const next = {
        ...current,
        ...patch,
        discovery_id: String(discoveryId),
        updated_at: new Date().toISOString()
      };

      return store.save(next);
    },

    remove: function(discoveryId) {
      return store.remove(discoveryId);
    }
  };
}
