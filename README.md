# Event Opportunity Radar

A product-first event intelligence system that helps you discover, rank, and act on the best opportunities around learning, contribution, networking, and career growth.

<p align="center">
  <a href="dashboard/index.html">
    <img src="https://img.shields.io/badge/Public%20Dashboard-Open-brightgreen?style=for-the-badge" alt="Public dashboard" />
  </a>
  <a href="https://github.com/Pavan755/event-opportunity-radar">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge" alt="GitHub repository" />
  </a>
  <a href="https://github.com/Pavan755/event-opportunity-radar/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/Contribute-Open-yellow?style=for-the-badge" alt="Contribute" />
  </a>
</p>

## The product in one line

We do not just collect events. We filter the noise, rank the best opportunities, and turn discovery into action.

## Why this project exists

Most people miss valuable opportunities because they are scattered across communities, meetups, GitHub pages, newsletters, and local groups.

This project helps by turning that chaos into a simple system:

- discover relevant opportunities early
- evaluate them by real value
- rank them by fit, contribution, and learning potential
- keep a personal workflow separate from the public project

## Public opportunity showcase

This repo is designed to show the product clearly and neatly, not just code internals.

| Opportunity | Location | Type | Why it matters | Priority |
| --- | --- | --- | --- | --- |
| Hyderabad AI Meetup | Telangana | Technical volunteer | Strong learning and networking path | A |
| Bengaluru Tech Week | Bengaluru | Volunteer / operations | High exposure and strong local network | S |
| Vizag AI Community Session | Andhra Pradesh | Community support | Great local ecosystem fit | A |
| Hackathon Volunteer Program | Virtual | Hackathon support | Good for portfolio and build experience | A |
| Open Source Contribution Sprint | Virtual | Open source contribution | High learning + contributor value | S |
| Student Research Workshop | Andhra Pradesh | Event support | Learning + visibility with low friction | B |

This is the same pattern the public product should follow: small, clean, useful, and easy to scan.

## The workflow

### 1. Discover
Find the right local and virtual opportunities without drowning in noise.

### 2. Evaluate
Score opportunities by contribution value, learning value, networking value, and fit.

### 3. Prioritize
Focus on the events that provide the highest return for your time.

### 4. Track
Keep personal actions, reminders, and follow-up separate from the public project.

## Project value

This repo is built for:

- personal opportunity planning
- local region-friendly discovery
- contribution-first strategy
- event follow-up and momentum building
- a public repo that can be understood by contributors quickly

## Public vs personal split

### Public layer

The public repo is meant to show:

- the core product concept
- the intelligence and ranking pipeline
- the dashboard and contribution story
- open-source verification and project architecture

### Private layer

The personal workflow is intentionally separate and private for:

- specific city filters
- your own skill inventory
- application and attendance tracking
- reminders and networking notes
- private follow-up flow after events

## Architecture

The project is organized around a clean pipeline:

1. discovery and source selection
2. validation and normalization
3. skill and opportunity intelligence
4. scoring and ranking
5. identity and lifecycle tracking
6. private workflow tracking on top of the public engine

Core files:

- [apps-script/src/OpportunityRadarPipeline.gs](apps-script/src/OpportunityRadarPipeline.gs)
- [apps-script/src/SkillIntelligence.gs](apps-script/src/SkillIntelligence.gs)
- [apps-script/src/OpportunityIntelligence.gs](apps-script/src/OpportunityIntelligence.gs)
- [apps-script/src/OpportunityScoring.gs](apps-script/src/OpportunityScoring.gs)
- [apps-script/src/OpportunityIdentity.gs](apps-script/src/OpportunityIdentity.gs)
- [apps-script/src/OpportunityLifecycle.gs](apps-script/src/OpportunityLifecycle.gs)
- [apps-script/src/OpportunityLifecycleSheetStore.gs](apps-script/src/OpportunityLifecycleSheetStore.gs)

## Dashboard

The public dashboard is available here:

- [dashboard/index.html](dashboard/index.html)
- [dashboard/README.md](dashboard/README.md)

This is the clean public front-end preview for the project.

## Verified status

The core system has been validated locally with regression coverage for the opportunity intelligence and lifecycle flows.

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
node tools/run-opportunity-lifecycle-action-service-test.js
```

Key validation outcomes:

- OPPORTUNITY INTELLIGENCE: PASSED
- OPPORTUNITY RADAR PIPELINE: PASSED
- LIFECYCLE ACTION SERVICE: PASSED
- LIFECYCLE SHEET STORE: PASSED

## Project structure

```text
apps-script/      backend pipeline and Apps Script orchestration
config/           source, scoring, and region configuration
dashboard/        public showcase and UI preview
data/             sample opportunity data
docs/             architecture and workflow notes
tools/            regression and validation scripts
CONTRIBUTING.md   contributor guidance
SECURITY.md       public-safe security policy
LICENSE           MIT license
```

## Repository

- GitHub: https://github.com/Pavan755/event-opportunity-radar

## Final note

This project is designed to look clean, read clearly, and communicate value immediately. The backend is the foundation, while the public-facing README and dashboard make the product story easy to understand for anyone visiting the repo.
