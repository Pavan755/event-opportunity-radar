# Security Policy

## Supported version

The actively maintained main branch is the supported version.

Security fixes are applied to current pipeline modules, workflow definitions, and documented local tooling.

## Reporting a vulnerability

Do not open a public issue for sensitive security details.

Report privately to repository maintainers through GitHub contact channels.

Include:

- Clear vulnerability description.
- Affected modules or files.
- Potential impact and exploitability.
- Suggested remediation, if available.

## Response targets

- Acknowledgement target: within 72 hours.
- Triage target: severity and affected-surface assessment.
- Remediation target: patch or mitigation guidance based on risk.
- Disclosure target: coordinated public disclosure after fix availability.

## Data and secrets policy

Repository content may include:

- Public source URLs.
- Event metadata.
- Public discovery and scoring logic.
- Test fixtures and examples.

Repository content must not include:

- API tokens or credentials.
- Private personal contact data.
- Confidential notes or private communications.
- Secrets embedded in code, configs, or workflow logs.

## Hardening checklist

### Secrets and credentials

- Keep secrets out of tracked files.
- Use Apps Script PropertiesService and GitHub Secrets for sensitive runtime values.

### Workflow security

- Apply least-privilege permissions in each workflow.
- Avoid executing untrusted workflow inputs in shell commands.
- Pin third-party actions to trusted versions when possible.

### External content safety

- Validate and normalize external URLs before requests.
- Do not execute untrusted remote content as code.
- Keep verification evidence provenance attached to records.

### Output and rendering safety

- Avoid unsafe HTML rendering paths in dashboard and docs content.
- Do not log tokens, credentials, or sensitive identifiers.

### Maintenance hygiene

- Review dependency and workflow updates regularly.
- Run repository and dependency scans periodically.

## Public-safe contribution rule

All contributions must be safe for public repository visibility.

If a change depends on private credentials, private links, or personal sensitive data, keep that workflow outside the public repository.
