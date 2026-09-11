# API and Data Contracts

The project has two related runtime surfaces: the public Node.js discovery artifact and the Apps Script production pipeline.

## Public Discovery Artifact

Path: `data/event-agent-lite.json`

```json
{
  "generated_at": "ISO-8601 timestamp",
  "agent": "event-agent-lite",
  "version": "string",
  "total_sources": 0,
  "total_records": 0,
  "opportunities": []
}
```

Each opportunity can contain:

| Field | Meaning |
| --- | --- |
| `id` | Source-level record identifier |
| `source_id` | Source identity |
| `title` / `name` | Public event title |
| `official_url` / `url` | Source page |
| `apply_url` | Application or registration route when found |
| `contact_url` | Organizer contact route when found |
| `contact_email` | Email extracted from public source content |
| `event_start_date` | Date extracted from public content, or `null` |
| `event_end_date` | End date extracted from public content, or `null` |
| `application_deadline` | Deadline only when captured from source content |
| `date_status` | `verified`, `predicted`, or `unknown` |
| `verification_status` | Source-policy result |
| `evidence_note` | Human-readable evidence explanation |

## Apps Script Entry Point

`runProductionOpportunityRadarJob(config)` is the production boundary exposed by `apps-script/src/Code.gs`.

Required configuration:

```javascript
{
  queries: [],
  sources: [],
  healthRecords: [],
  adapters: [],
  policy: {},
  publisher: optionalPublisher
}
```

The publisher must provide:

```javascript
{
  replace(rows) { /* persist the current public projection */ }
}
```

## Action Intelligence

`OpportunityActionIntelligence.gs` attaches:

```json
{
  "event_window": {
    "start_date": null,
    "end_date": null,
    "application_deadline": null,
    "status": "unknown",
    "confidence": "none",
    "basis": "string"
  },
  "roles": [],
  "application_options": [],
  "contacts": {},
  "strategy": [],
  "prompts": [],
  "predictions": {
    "likely_next_step": "string",
    "confidence": "low",
    "basis": "string"
  }
}
```

The action layer is deliberately score-free. Predictions do not replace organizer confirmation.

## Frontend Contract

The Angular service loads `data/event-agent-lite.json`, maps it to `OpportunityRecord`, and generates prompts locally through `PromptGeneratorService`.

Browser-only state:

- `opportunity-lifecycle-v1`: lifecycle state by opportunity ID
- `opportunity-bookmarks-v1`: bookmarked opportunity IDs

These keys are local workflow state and are not part of the public discovery artifact.
