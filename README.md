# Event Opportunity Radar

An open-source event discovery and contribution radar for finding verified learning, volunteering, hackathon, networking, open-source, and career opportunities.

## Public dashboard preview

The project includes a lightweight public dashboard in [dashboard/index.html](dashboard/index.html) that demonstrates the event radar concept in a browser without needing a separate app.

This gives contributors and visitors a quick visual summary of:

- local and virtual opportunity filters
- rank-based event filtering
- contribution-first opportunity strategy
- skill-fit and benefit summary

## Why this project matters

This project is designed for a simple idea:

- find useful events before they are missed
- prioritize learning and contribution over paying to attend
- match opportunities to your skills and gaps
- turn events into networking, portfolio, and career opportunities
- support both public discovery and personal opportunity tracking

## Public vs personal workflow

### Public open-source layer

The public repository is designed for contributors, source adapters, intelligence logic, scoring, and community improvements.

### Private personal layer

The personal workflow is intentionally separate and kept private for:

- your city/location filters
- your skill inventory
- personal application history
- follow-up and reminder flow
- event attendance tracking
- private notes, LinkedIn drafts, and achievement tracking

This split keeps the project useful to the public while still serving your real personal use case.

## Project goal

This project ingests event discovery data, normalizes it, validates sources, enriches each opportunity with intelligence, scores opportunities for fit, and preserves lifecycle state across the user journey.

The system is designed to answer questions like:

- Which events are most relevant to my skills and interests?
- Which opportunities provide learning, networking, contribution, or career value?
- Which opportunities should be tracked as planned, registered, attended, or documented?
- Which opportunities are likely to be worth investing time in?

## Architecture overview

The repository is structured around a production-style pipeline:

1. Discovery and source selection
2. Validation and normalization
3. Canonical record creation
4. Skill intelligence modeling
5. Opportunity intelligence enrichment
6. Opportunity scoring and ranking
7. Canonical opportunity identity
8. Opportunity lifecycle tracking and persistence

Key implementation files:

- `apps-script/src/OpportunityRadarPipeline.gs` — end-to-end radar composition
- `apps-script/src/SkillIntelligence.gs` — evidence-aware skill model
- `apps-script/src/OpportunityIntelligence.gs` — event classification and signals
- `apps-script/src/OpportunityScoring.gs` — ranking logic and score generation
- `apps-script/src/OpportunityIdentity.gs` — canonical IDs for underlying opportunities
- `apps-script/src/OpportunityLifecycle.gs` — lifecycle state model
- `apps-script/src/OpportunityLifecycleSheetStore.gs` — durable lifecycle persistence

## Project strategy

The project was built in verified milestones instead of guessing at the end state:

- Discovery foundation
- Source health and validation
- Normalization and canonical records
- Skill intelligence and inference
- Opportunity intelligence and classification
- Scoring and ranking
- Canonical opportunity identity integration
- Lifecycle model and lifecycle persistence
- Regression validation and repo synchronization

This keeps the architecture stable and makes it easier to extend without breaking working behavior.

## Current project status

The repository is in a verified working state and has been pushed to GitHub.

Current branch and commit status:

- Branch: `main`
- Latest commit: `37c29c9`
- Commit message: `7.18: add lifecycle sheet store regression coverage`

## Verified outputs

The following commands were run successfully in the local project and passed:

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
node tools/run-opportunity-lifecycle-action-service-test.js
```

Observed pass output:

```text
=== STEP 7.6.6 OPPORTUNITY INTELLIGENCE TEST ===
RECORD IDENTITY PRESERVATION: PASSED
MULTI-TYPE CLASSIFICATION: PASSED
GOVERNMENT EVENT DETECTION: PASSED
RESEARCH EVENT DETECTION: PASSED
SKILL INTELLIGENCE INTEGRATION: PASSED
CONTRIBUTION DETECTION: PASSED
LEARNING SIGNAL DETECTION: PASSED
NETWORKING SIGNAL DETECTION: PASSED
STEP 7.6.6 TEST: PASSED
LOCAL OPPORTUNITY INTELLIGENCE TEST: PASSED
```

```text
=== STEP 7.8.5 OPPORTUNITY RADAR COMPOSITION TEST ===
PRODUCTION MODELS: PASSED
CONTROLLED DISCOVERY FIXTURE: PASSED
OPPORTUNITY IDENTITY ATTACHMENT: PASSED
OPPORTUNITY IDENTITY RANKING PRESERVATION: PASSED
DISCOVERY ID + OPPORTUNITY ID LINKAGE: PASSED
INTEGRATION OPPORTUNITY IDENTITY: PASSED
INTEGRATION OPPORTUNITY LIFECYCLE: PASSED
FULL DISCOVERY EXECUTION: PASSED
ORIGINAL RECORD PRESERVATION: PASSED
INTELLIGENCE ENRICHMENT: PASSED
SCORING ENRICHMENT: PASSED
RANKED RECORD VALIDATION: PASSED
SCORE ORDERING: PASSED
VERSION + PIPELINE METADATA: PASSED
STEP 7.8.5 TEST: PASSED
LOCAL PRODUCTION OPPORTUNITY RADAR PIPELINE TEST: PASSED
```

```text
LIFECYCLE ACTION SERVICE: PASSED
LIFECYCLE PERSISTENCE FLOW: PASSED
LOCAL LIFECYCLE ACTION SERVICE TEST: PASSED
```

```text
LIFECYCLE SHEET CREATE: PASSED
LIFECYCLE SHEET LOAD: PASSED
LIFECYCLE SHEET UPDATE: PASSED
LOCAL LIFECYCLE SHEET STORE TEST: PASSED
```

## Key milestone summary

| Milestone | Status |
| --- | --- |
| Discovery foundation | Complete |
| Source validation and health logic | Complete |
| Normalization and canonical records | Complete |
| Skill intelligence model | Complete |
| Opportunity intelligence | Complete |
| Scoring and ranking | Complete |
| Canonical opportunity identity | Complete |
| Lifecycle model | Complete |
| Lifecycle persistence and action flow | Complete |
| Repository sync to GitHub | Complete |

## What is still optional

The core project is already functioning. Optional future improvements are:

- richer dashboard UI
- production persistence polish
- user-facing workflow screens
- broader reporting and exports
- deployment automation

These are enhancements, not missing core architecture.

## How to run the local regressions

From the project root:

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
node tools/run-opportunity-lifecycle-action-service-test.js
```

## Repository link

- GitHub: https://github.com/Pavan755/event-opportunity-radar

## Final note

This project now demonstrates a complete end-to-end event opportunity engine with discovery, intelligence, scoring, identity, and durable lifecycle tracking in a clean GitHub-backed repository.
