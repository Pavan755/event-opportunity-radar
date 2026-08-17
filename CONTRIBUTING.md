# Contributing to Event Opportunity Radar

Thank you for contributing.

This project values correctness, clear architecture boundaries, and deterministic validation.

## Contribution principles

1. Verify before trust.
2. Keep evidence and policy context attached to records.
3. Preserve discovery and identity semantics.
4. Keep scoring deterministic and testable.
5. Prefer small, focused, reviewable changes.

## Repository map

- [apps-script/src](apps-script/src): Core pipeline and model logic.
- [config](config): Runtime configuration for sources, scoring, skills, and queries.
- [tools](tools): Local regression and integration runners.
- [docs](docs): Technical architecture and workflow documentation.
- [dashboard](dashboard): UI assets and dashboard documentation.

## Recommended workflow

1. Pick one focused behavior or module.
2. Run the closest existing local test in [tools](tools).
3. Implement the smallest safe change.
4. Re-run affected local tests.
5. Run the consolidated quality gate.
6. Open a PR with verification notes.

## Local verification

Run the full deterministic gate:

```bash
node tools/run-ci-quality-gate.js
```

Run focused examples:

```bash
node tools/run-opportunity-radar-pipeline-test.js
node tools/run-opportunity-scoring-integration-test.js
node tools/run-opportunity-lifecycle-test.js
```

## Pull request checklist

- Problem statement is clear.
- Scope is focused and intentional.
- Affected modules are listed.
- Verification commands are included.
- No secrets or private personal data are introduced.
- Documentation is updated when behavior changes.

## Areas requiring extra caution

- Canonical identity semantics and mapping rules.
- Evidence authority and policy-aware verification logic.
- Scoring model behavior and weighted breakdowns.
- Lifecycle transitions and terminal-state handling.

## Security and privacy

Follow [SECURITY.md](SECURITY.md) when reporting vulnerabilities or handling sensitive data.

Do not commit credentials, private contact data, or confidential artifacts.

## Questions and proposals

For larger architecture changes, open an issue or discussion first to align on design direction.
