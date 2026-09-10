const OPPORTUNITY_RADAR_SHEET_NAME = 'Opportunity Radar';

const OPPORTUNITY_RADAR_SHEET_HEADERS = [
  'discovery_id',
  'opportunity_id',
  'title',
  'organizer',
  'location',
  'event_start_date',
  'event_end_date',
  'application_deadline',
  'url',
  'verification_status',
  'lifecycle_state',
  'evidence_json',
  'action_intelligence_json',
  'lifecycle_json',
  'published_at'
];

function createOpportunityRadarSheetPublisher(spreadsheet) {
  if (!spreadsheet ||
      typeof spreadsheet.getSheetByName !== 'function' ||
      typeof spreadsheet.insertSheet !== 'function') {
    throw new Error('A spreadsheet adapter is required.');
  }

  return {
    replace: function(rows) {
      if (!Array.isArray(rows)) {
        throw new Error('Dashboard rows must be an array.');
      }

      let sheet = spreadsheet.getSheetByName(
        OPPORTUNITY_RADAR_SHEET_NAME
      );

      if (!sheet) {
        sheet = spreadsheet.insertSheet(
          OPPORTUNITY_RADAR_SHEET_NAME
        );
      }

      const existingRows = sheet.getLastRow();
      if (existingRows > 0) {
        sheet.deleteRows(1, existingRows);
      }

      sheet.getRange(
        1,
        1,
        1,
        OPPORTUNITY_RADAR_SHEET_HEADERS.length
      ).setValues([OPPORTUNITY_RADAR_SHEET_HEADERS]);

      if (rows.length > 0) {
        sheet.getRange(
          2,
          1,
          rows.length,
          OPPORTUNITY_RADAR_SHEET_HEADERS.length
        ).setValues(
          rows.map(function(row) {
            return OPPORTUNITY_RADAR_SHEET_HEADERS.map(function(header) {
              return row[header] == null ? '' : row[header];
            });
          })
        );
      }

      return rows.length;
    }
  };
}