/**
 * Durable Google Sheets storage for opportunity lifecycles.
 *
 * The discovery pipeline stays stateless. This store owns only the
 * user-managed lifecycle that is keyed by discovery_id.
 */

const OPPORTUNITY_LIFECYCLE_SHEET_NAME =
  'Opportunity Lifecycles';

const OPPORTUNITY_LIFECYCLE_SHEET_HEADERS = [
  'discovery_id',
  'state',
  'updated_at',
  'history_json'
];

function createOpportunityLifecycleSheetStore(spreadsheet) {
  if (!spreadsheet ||
      typeof spreadsheet.getSheetByName !== 'function' ||
      typeof spreadsheet.insertSheet !== 'function') {
    throw new Error('A spreadsheet adapter is required.');
  }

  return {
    load: function(discoveryId) {
      return loadOpportunityLifecycleFromSheet(
        spreadsheet,
        discoveryId
      );
    },

    save: function(lifecycle) {
      return saveOpportunityLifecycleToSheet(
        spreadsheet,
        lifecycle
      );
    }
  };
}

function getOrCreateOpportunityLifecycleSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(
    OPPORTUNITY_LIFECYCLE_SHEET_NAME
  );

  if (!sheet) {
    sheet = spreadsheet.insertSheet(
      OPPORTUNITY_LIFECYCLE_SHEET_NAME
    );
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(
      OPPORTUNITY_LIFECYCLE_SHEET_HEADERS
    );
  }

  return sheet;
}

function lifecycleSheetRow_(lifecycle) {
  if (!lifecycle || !lifecycle.discovery_id ||
      !isValidOpportunityLifecycleState(lifecycle.state)) {
    throw new Error('A valid lifecycle is required for storage.');
  }

  return [
    lifecycle.discovery_id,
    lifecycle.state,
    lifecycle.updated_at || new Date().toISOString(),
    JSON.stringify(lifecycle.history || [])
  ];
}

function loadOpportunityLifecycleFromSheet(spreadsheet, discoveryId) {
  if (!discoveryId || String(discoveryId).trim() === '') {
    throw new Error('discoveryId is required.');
  }

  const sheet = getOrCreateOpportunityLifecycleSheet_(spreadsheet);
  const rows = sheet.getDataRange().getValues();

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];
    if (row[0] === String(discoveryId)) {
      return {
        discovery_id: row[0],
        state: row[1],
        updated_at: row[2],
        history: JSON.parse(row[3] || '[]')
      };
    }
  }

  return null;
}

function saveOpportunityLifecycleToSheet(spreadsheet, lifecycle) {
  const row = lifecycleSheetRow_(lifecycle);
  const sheet = getOrCreateOpportunityLifecycleSheet_(spreadsheet);
  const rows = sheet.getDataRange().getValues();

  for (let index = 1; index < rows.length; index += 1) {
    if (rows[index][0] === lifecycle.discovery_id) {
      sheet.getRange(
        index + 1,
        1,
        1,
        OPPORTUNITY_LIFECYCLE_SHEET_HEADERS.length
      ).setValues([row]);
      return lifecycle;
    }
  }

  sheet.appendRow(row);
  return lifecycle;
}

function createOpportunityLifecycleActionService(spreadsheet) {
  if (!spreadsheet ||
      typeof spreadsheet.getSheetByName !== 'function' ||
      typeof spreadsheet.insertSheet !== 'function') {
    throw new Error('A spreadsheet adapter is required.');
  }

  const store = createOpportunityLifecycleSheetStore(spreadsheet);

  return {
    get: function(discoveryId) {
      return store.load(discoveryId) || null;
    },

    save: function(lifecycle) {
      return store.save(lifecycle);
    },

    apply: function(discoveryId, toState, reason) {
      const current = store.load(discoveryId) ||
        createOpportunityLifecycle(discoveryId);

      const next = transitionOpportunityLifecycle(
        current,
        toState,
        reason || 'user_transition'
      );

      return store.save(next);
    },

    applyToRecord: function(record, toState, reason) {
      if (!record || typeof record !== 'object') {
        throw new Error('Record is required.');
      }

      const discoveryId = record.discovery_id;
      const current = store.load(discoveryId) ||
        createOpportunityLifecycle(discoveryId);

      const next = transitionOpportunityLifecycle(
        current,
        toState,
        reason || 'user_transition'
      );

      const persisted = store.save(next);

      return {
        ...record,
        lifecycle: persisted
      };
    }
  };
}
