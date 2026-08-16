# Event Opportunity Radar

A backend-first opportunity intelligence system for discovering, ranking, and acting on the best local and virtual events.

<p align="center">
  <a href="dashboard/index.html">
    <img src="https://img.shields.io/badge/Public%20Dashboard-Open-brightgreen?style=for-the-badge" alt="Public dashboard" />
  </a>
  <a href="https://github.com/Pavan755/event-opportunity-radar">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge" alt="GitHub repo" />
  </a>
  <a href="CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/Contribute-Open-yellow?style=for-the-badge" alt="Contribute" />
  </a>
</p>

## The story

Most people do not need another event list. They need a system that filters the signal, shows what is worth their time, and helps them decide what to do next.

This project turns scattered opportunities into a clear, ranked pipeline:

- discover events from local and online sources
- normalize and validate them
- score them based on learning, contribution, networking, and career value
- surface the strongest opportunities first
- keep personal follow-up workflows separate from the public project

## What is visible on the repo

| Opportunity | Region | Type | Why it matters | Priority |
| --- | --- | --- | --- | --- |
| Hyderabad AI Meetup | Telangana | Technical volunteer | Strong learning and networking path | A |
| Bengaluru Tech Week | Bengaluru | Volunteer / ops | Big visibility and local ecosystem access | S |
| Vizag AI Community Session | Andhra Pradesh | Community support | Strong local fit and community exposure | A |
| Hackathon Volunteer Program | Virtual | Hackathon support | Useful for portfolio and build experience | A |
| Open Source Contribution Sprint | Virtual | Open source | High learning, contribution, and community value | S |
| Student Research Workshop | Andhra Pradesh | Event support | Low-friction learning and visibility | B |

This is the same design principle used across the project: minimal, readable, and opportunity-first.

## How it works

### 1. Discover
Collect opportunities from sources and candidate event feeds.

### 2. Normalize
Standardize the records so they can be compared fairly.

### 3. Score
Rank them by contribution, learning, networking, and personal fit.

### 4. Track
Move opportunities through planned, registered, attended, and follow-up states.

## Why this is a product

This is not just a script dump. It is a usable system for:

- local opportunity discovery
- event prioritization
- volunteer and networking strategy
- personal growth tracking
- public repo visibility with a private workflow layer

## Public vs personal

### Public layer

The public layer is designed for:

- project visibility
- contributor onboarding
- architecture explanation
- public dashboard and product showcase

### Personal layer

The private layer is intentionally separate for:

- city-specific filters
- personal interest and skill tracking
- personal reminders and follow-ups
- application and attendance history

## Backend-first architecture

The core system is built around production-style backend logic:

- discovery and source selection
- validation and normalization
- skill intelligence and opportunity enrichment
- scoring and ranking
- identity and lifecycle tracking

Key implementation files:

- [apps-script/src/OpportunityRadarPipeline.gs](apps-script/src/OpportunityRadarPipeline.gs)
- [apps-script/src/SkillIntelligence.gs](apps-script/src/SkillIntelligence.gs)
- [apps-script/src/OpportunityIntelligence.gs](apps-script/src/OpportunityIntelligence.gs)
- [apps-script/src/OpportunityScoring.gs](apps-script/src/OpportunityScoring.gs)
- [apps-script/src/OpportunityIdentity.gs](apps-script/src/OpportunityIdentity.gs)
- [apps-script/src/OpportunityLifecycle.gs](apps-script/src/OpportunityLifecycle.gs)
- [apps-script/src/OpportunityLifecycleSheetStore.gs](apps-script/src/OpportunityLifecycleSheetStore.gs)

## Public dashboard

The repo includes a lightweight public dashboard preview:

- [dashboard/index.html](dashboard/index.html)
- [dashboard/README.md](dashboard/README.md)

This keeps the project easy to understand even before someone dives into the backend.

## Verified status

The system has been validated with local regression tests for the intelligence and lifecycle flows.

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
node tools/run-opportunity-lifecycle-action-service-test.js
```

Passing results include:

- OPPORTUNITY INTELLIGENCE: PASSED
- OPPORTUNITY RADAR PIPELINE: PASSED
- LIFECYCLE ACTION SERVICE: PASSED
- LIFECYCLE SHEET STORE: PASSED

## Project structure

```text
apps-script/     core backend pipeline and logic
config/          settings and scoring sources
dashboard/       public showcase and UI preview
data/            sample opportunity data
docs/            architecture and workflow notes
tools/           validation and regression runners
CONTRIBUTING.md  contributor guide
SECURITY.md      public-safe project security policy
LICENSE          MIT license
```

## Repository

- GitHub: https://github.com/Pavan755/event-opportunity-radar

## Final note

This project is intentionally built to look clean, read simply, and communicate real product value quickly. The backend is strong first; the public repo and dashboard make the story readable and presentable for others.
