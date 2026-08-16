# Event Opportunity Radar

A practical opportunity engine for finding valuable events, prioritizing contribution, and turning event discovery into career, networking, and learning value.

<p align="center">
  <a href="dashboard/index.html">
    <img src="https://img.shields.io/badge/Public%20Dashboard-Open-brightgreen?style=for-the-badge" alt="Public dashboard" />
  </a>
  <a href="https://github.com/Pavan755/event-opportunity-radar">
    <img src="https://img.shields.io/badge/Repo-GitHub-181717?style=for-the-badge" alt="GitHub repository" />
  </a>
</p>

## Public overview

This repo is built around one simple idea: discover opportunities early, filter them for real value, and act on them with a clear strategy.

The public project shows the system, the dashboard, and the overall contribution-first model. The personal workflow remains private and separate.

## What this project does

- finds local and virtual events with potential value
- ranks them by learning, networking, contribution, and career upside
- separates public discovery from private personal tracking
- supports event follow-up, reminders, and action planning
- keeps the system useful for contributors and for personal strategy

## Public dashboard

The public dashboard is the first thing people should see in this repo.

- Open the dashboard: [dashboard/index.html](dashboard/index.html)
- Dashboard docs: [dashboard/README.md](dashboard/README.md)

This gives a quick product preview with filters, category-based event grouping, and a simple event-risk/value view.

## Why this project matters

Most people do not need more event lists. They need a system that answers:

- which events are worth attending?
- which ones are worth volunteering for?
- which ones actually help my learning and portfolio?
- which ones should I track, attend, or skip?

This project helps answer those questions using a structured pipeline instead of random discovery.

## Public vs private workflow

### Public layer

The public repository is designed for:

- contributors
- source adapters and discovery logic
- scoring, ranking, and intelligence models
- repo documentation and project visibility

### Private layer

The private layer is intentionally separate and not part of the public repo. It is meant for:

- personal location filters
- your skill inventory
- reminder and follow-up tracking
- application and attendance history
- personal notes and networking workflow

This keeps the project public and clean, while still serving your real workflow.

## Architecture snapshot

The repo is organized around a production-style pipeline:

1. discovery and source intake
2. validation and normalization
3. skill intelligence
4. opportunity intelligence
5. scoring and ranking
6. canonical identity tracking
7. lifecycle handling and persistence

Key implementation files:

- [apps-script/src/OpportunityRadarPipeline.gs](apps-script/src/OpportunityRadarPipeline.gs)
- [apps-script/src/SkillIntelligence.gs](apps-script/src/SkillIntelligence.gs)
- [apps-script/src/OpportunityIntelligence.gs](apps-script/src/OpportunityIntelligence.gs)
- [apps-script/src/OpportunityScoring.gs](apps-script/src/OpportunityScoring.gs)
- [apps-script/src/OpportunityIdentity.gs](apps-script/src/OpportunityIdentity.gs)
- [apps-script/src/OpportunityLifecycle.gs](apps-script/src/OpportunityLifecycle.gs)
- [apps-script/src/OpportunityLifecycleSheetStore.gs](apps-script/src/OpportunityLifecycleSheetStore.gs)

## Verified status

This project has been validated with local regression checks, including the main opportunity intelligence and lifecycle flows.

Commands run successfully:

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
node tools/run-opportunity-lifecycle-action-service-test.js
```

Observed pass results included:

- OPPORTUNITY INTELLIGENCE: PASSED
- OPPORTUNITY RADAR PIPELINE: PASSED
- LIFECYCLE ACTION SERVICE: PASSED
- LIFECYCLE SHEET STORE: PASSED

## Project structure

```text
apps-script/        Google Apps Script logic and pipeline
config/             source, scoring, and region settings
dashboard/          public dashboard preview and docs
data/              sample event data
docs/               architecture and workflow notes
tools/              local validation and regression scripts
README.md           repo landing page
CONTRIBUTING.md     contributor guidance
SECURITY.md         security policy
LICENSE             MIT license
```

## Local validation

From the repo root:

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
node tools/run-opportunity-lifecycle-action-service-test.js
```

## Repository

- GitHub: https://github.com/Pavan755/event-opportunity-radar

## Final note

This is a real, working opportunity intelligence system with a public-facing demo and a private personal workflow layer. The goal is simple: make event discovery more strategic, more useful, and more actionable.
