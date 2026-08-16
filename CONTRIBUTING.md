# Contributing to Event Opportunity Radar

Thanks for your interest in contributing to the project.

## Project vision

This project helps people discover useful events, volunteer opportunities, hackathons, open-source pathways, learning opportunities, and networking opportunities that align with their skills and goals.

The project is intentionally designed to be:

- evidence-based
- skill-aware
- contribution-first
- learning-oriented
- transparent about verification limits

## Core principles

1. Verify before trusting.
2. Keep the discovery pipeline evidence-driven.
3. Preserve original discovery records while enriching them.
4. Treat skill inference as helpful context, not proof.
5. Keep lifecycle and identity logic explicit and testable.
6. Prefer clear, modular logic over hidden magic.

## Repo structure

- `apps-script/src/` — main business logic and pipeline modules
- `config/` — project configuration files
- `tools/` — local validation and regression scripts
- `data/` — sample data fixtures
- `docs/` — architecture and verification notes
- `dashboard/` — dashboard-facing documentation and future UI expansion

## How to contribute

### 1. Identify the area

Choose a contribution area such as:

- discovery source adapters
- verification rules
- scoring adjustments
- lifecycle behavior
- dashboard improvements
- contributor documentation
- event filters and ranking heuristics

### 2. Start with a focused test

Most logic in this repo is validated through Node-based regression runners under `tools/`.

For example:

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
```

### 3. Keep the change small

Prefer a minimal patch that improves one behavior or adds one missing capability.

### 4. Preserve the architecture

The project is structured as a pipeline. In general:

- discovery belongs earlier in the pipeline
- intelligence belongs in enrichment stages
- scoring belongs later
- lifecycle and identity should not be rewritten or duplicated

### 5. Add or update test coverage

If you change logic, add or update the matching local regression test in `tools/`.

## Good contribution ideas

- add a new event source adapter
- improve verification and source trust rules
- expand skill matching
- refine rank heuristics
- improve event classification
- improve lifecycle transitions
- improve documentation for contributors
- create a better dashboard view

## Areas to avoid without coordination

- changing canonical identity semantics without tests
- rewriting the ranking model without regression proof
- making unverifiable claims about event legitimacy
- uploading private personal data or tokens to the repo
- bypassing validation and claiming the pipeline is complete without running the existing tests

## Pull request expectations

A good PR should include:

- a clear problem statement
- the affected area of the project
- the change made
- the verification command(s) run
- any notes about assumptions or limits

## Local validation

Before submitting a PR, run the relevant checks:

```bash
node tools/run-opportunity-intelligence-test.js
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-lifecycle-test.js
node tools/run-opportunity-lifecycle-sheet-store-test.js
```

## Contact

Open an issue or start a discussion to propose larger changes before implementing them.

This keeps the project coherent as the architecture evolves.
