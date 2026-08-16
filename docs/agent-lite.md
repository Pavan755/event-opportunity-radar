# Event Agent Lite

This is the first lightweight production-ready discovery layer for the project.

## Goal

Keep the system simple, useful, and maintainable:

- public sources only
- no premium API required
- no heavy custom orchestration layer
- automatic source discovery in a cloud environment
- human approval before posting or acting on anything sensitive

## How it works

1. Read curated source URLs from config/event-agent-sources.json.
2. Fetch the public page contents.
3. Extract title and description.
4. Assign priority and verification category.
5. Store the output in data/event-agent-lite.json.
6. Let GitHub Actions run it on a schedule.

## Why this is the right first version

This matches the production principle without creating a large maintenance project. It is intentionally lightweight and extensible.

## Files

- config/event-agent-sources.json
- tools/run-event-agent-lite.js
- .github/workflows/event-agent-lite.yml
- data/event-agent-lite.json

## Next step

After this step, the next real improvement is to add a stronger normalized record model and a follow-up workflow for application reminders and LinkedIn/GitHub drafts.
