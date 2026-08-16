# Event Opportunity Radar

High-value events and build opportunities for Hyderabad, Bengaluru, Andhra Pradesh, Telangana, and relevant virtual programs.

<p align="center">
  <a href="dashboard/index.html">
    <img src="https://img.shields.io/badge/Live%20Dashboard-Open-brightgreen?style=for-the-badge" alt="Live dashboard" />
  </a>
  <a href="https://github.com/Pavan755/event-opportunity-radar">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge" alt="GitHub repo" />
  </a>
</p>

## Why this project matters

Finding valuable events is hard when they are scattered across communities, meetups, newsletters, hackathons, and local groups. This project helps turn that clutter into a simple opportunity radar.

The goal is straightforward:

- find the best opportunities early
- focus on events with real learning and career value
- prioritize contribution, networking, and growth
- give people a better way to decide what is worth their time

## Target focus areas

The current product strategy is focused on the most relevant regions and communities:

- Hyderabad
- Bengaluru
- Andhra Pradesh
- Telangana
- virtual and hybrid opportunities

These are the high-priority filters for the first phase because they match the strongest local opportunity paths.

## Opportunity snapshot

### Top opportunities to track

#### Hyderabad AI Meetup
- Region: Telangana
- Type: Technical volunteer
- Why it matters: strong learning path and networking with engaged builders
- Priority: A

#### Bengaluru Tech Week
- Region: Bengaluru
- Type: Volunteer / operations
- Why it matters: excellent visibility, strong local ecosystem, and networking value
- Priority: S

#### Vizag AI Community Session
- Region: Andhra Pradesh
- Type: Community support
- Why it matters: a local community fit with practical exposure and networking
- Priority: A

#### Hackathon Volunteer Program
- Region: Virtual
- Type: Hackathon support
- Why it matters: useful for portfolio, project momentum, and collaboration
- Priority: A

#### Open Source Contribution Sprint
- Region: Virtual
- Type: Open source contribution
- Why it matters: direct learning, contribution, and visible project growth
- Priority: S

#### Student Research Workshop
- Region: Andhra Pradesh
- Type: Event support
- Why it matters: good low-friction learning and local visibility opportunity
- Priority: B

## What this product does

This project helps users decide:

- which events are worth attending
- which opportunities match their skills and interests
- which ones provide real networking or learning value
- which ones should be tracked for follow-up and action

It is built to make event discovery more strategic, not just more crowded.

## How it works

1. Discover opportunities from sources and candidate feeds.
2. Normalize and validate the records.
3. Score them based on contribution, learning, network, and career value.
4. Rank the strongest events and show the best matches first.
5. Track them through completion and follow-up workflows.

## Why this is a product

This is a practical opportunity intelligence system, not just a code repo.

It combines:

- real event discovery logic
- ranking and intelligence
- region-specific prioritization
- workflow tracking for follow-up and action
- a clean frontend layer that makes the opportunity story easy to understand

## Backend-first structure

The backend is the foundation of the system and is built around a production-style pipeline:

- discovery and source intake
- validation and normalization
- skill and opportunity intelligence
- scoring and ranking
- lifecycle tracking and persistence

Key implementation files:

- [apps-script/src/OpportunityRadarPipeline.gs](apps-script/src/OpportunityRadarPipeline.gs)
- [apps-script/src/SkillIntelligence.gs](apps-script/src/SkillIntelligence.gs)
- [apps-script/src/OpportunityIntelligence.gs](apps-script/src/OpportunityIntelligence.gs)
- [apps-script/src/OpportunityScoring.gs](apps-script/src/OpportunityScoring.gs)
- [apps-script/src/OpportunityIdentity.gs](apps-script/src/OpportunityIdentity.gs)
- [apps-script/src/OpportunityLifecycle.gs](apps-script/src/OpportunityLifecycle.gs)
- [apps-script/src/OpportunityLifecycleSheetStore.gs](apps-script/src/OpportunityLifecycleSheetStore.gs)

## Dashboard preview

The public dashboard is available here:

- [dashboard/index.html](dashboard/index.html)
- [dashboard/README.md](dashboard/README.md)

This gives a clear visual entry point for the project and makes the opportunity flow visible immediately.

## Verified status

The core engine has been validated locally with the project regression checks.

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
node tools/run-opportunity-lifecycle-action-service-test.js
```

Verified results include:

- OPPORTUNITY INTELLIGENCE: PASSED
- OPPORTUNITY RADAR PIPELINE: PASSED
- LIFECYCLE ACTION SERVICE: PASSED
- LIFECYCLE SHEET STORE: PASSED

## Repo structure

```text
apps-script/      core backend logic and pipeline
config/           scoring and source config
dashboard/        public landing-page dashboard
data/             sample opportunity data
docs/             architecture and workflow notes
tools/            validation and regression scripts
CONTRIBUTING.md   contributor guide
SECURITY.md       security policy
LICENSE           open-source license
```

## Repository

- GitHub: https://github.com/Pavan755/event-opportunity-radar

## Final note

This project is designed to feel like a real opportunity product: targeted to the right locations, built around value-first decision making, and structured to show the strongest opportunities clearly and immediately.
