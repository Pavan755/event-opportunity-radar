# Event Opportunity Radar

A practical opportunity intelligence system for discovering the right events, local communities, and contribution-led growth paths before time gets wasted.

<p align="center">
  <a href="https://pavan755.github.io/event-opportunity-radar/">
    <img src="https://img.shields.io/badge/Live%20Site-Open-brightgreen?style=for-the-badge" alt="Live site" />
  </a>
  <a href="dashboard/index.html">
    <img src="https://img.shields.io/badge/Dashboard-View-brightgreen?style=for-the-badge" alt="Dashboard" />
  </a>
  <a href="https://github.com/Pavan755/event-opportunity-radar">
    <img src="https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge" alt="GitHub repo" />
  </a>
</p>

## About this project

I built this because I was tired of seeing good opportunities disappear in the noise.

The problem was not that there were no events. The problem was that the best ones were scattered across multiple channels:

- meetup pages
- local community groups
- technical newsletters
- hackathon announcements
- GitHub posts
- volunteer calls
- social media updates

Most people do not have a system to filter signal from noise. They either miss the valuable events entirely or spend too much time checking weak leads. I wanted something that helps a person decide quickly: which opportunities are worth my time, what fits my skills, and which ones actually create learning and network value.

This project is my answer to that problem.

It helps people move from random discovery to structured decision-making:

- discover opportunities early
- check whether they are real and relevant
- understand what kind of value they create
- decide where contribution and networking matter most
- track what should be pursued next

This is not just a list of events. It is a decision layer for opportunity discovery.

---

## Why I built it this way

The idea came from a simple reality: people do not fail because they lack opportunity; they fail because opportunity is hard to find, hard to rank, and hard to act on in time.

I wanted a system that would help with the actual problem in practice:

- find opportunities around South India and relevant virtual spaces
- rank them by learning, contribution, visibility, and network potential
- separate weak signals from verified opportunities
- make the process simple enough for a person to use without needing a complex workflow

That is why the project is designed around a lightweight stack:

- public landing page and dashboard for exploration
- lightweight source discovery and normalizer layer
- verification-aware ranking logic
- structured follow-up workflow
- open-source architecture that can be improved by contributors

It is intentionally not a huge custom agent or a heavy enterprise system.
It is a clean, controllable, practical product.

---

## How it works

The system follows a simple flow:

1. sources are discovered from official and community pages
2. opportunity records are normalized and cleaned
3. links, source signals, and context are validated
4. value is scored based on learning, contribution, networking, and career upside
5. the strongest opportunities are surfaced first
6. users can act on them, follow up, and track progress

This gives a practical edge: it reduces wasted effort and helps the person spend time on what is actually valuable.

---

## Unique value: how this helps people in a real way

A lot of project ideas say “discover events faster.” That is generic and shallow.

This project is different because it helps people answer real questions like:

- Which event has the highest learning value for me?
- Which one gives me a better contribution or networking path?
- Which opportunities are worth attending locally in Hyderabad/Bengaluru/AP/Telangana?
- Which ones are just noisy social posts and which ones are actually real?
- What should I focus on before spending time and energy?

That is the real product value.

The project turns scattered opportunity data into action-ready direction.
It helps people become more intentional, more strategic, and more efficient with their time.

---

## Project pages and links

### Public site
- [index.html](index.html)
- [dashboard/index.html](dashboard/index.html)
- [dashboard/README.md](dashboard/README.md)

### Product and architecture docs
- [docs/architecture.md](docs/architecture.md)
- [docs/scoring.md](docs/scoring.md)
- [docs/verification.md](docs/verification.md)
- [docs/workflows.md](docs/workflows.md)

### Core implementation
- [apps-script/src/OpportunityRadarPipeline.gs](apps-script/src/OpportunityRadarPipeline.gs)
- [apps-script/src/OpportunityScoring.gs](apps-script/src/OpportunityScoring.gs)
- [apps-script/src/OpportunityLifecycle.gs](apps-script/src/OpportunityLifecycle.gs)
- [apps-script/src/OpportunityPersonalTracker.gs](apps-script/src/OpportunityPersonalTracker.gs)
- [apps-script/src/SourceRegistry.gs](apps-script/src/SourceRegistry.gs)
- [apps-script/src/SourceNormalizer.gs](apps-script/src/SourceNormalizer.gs)
- [apps-script/src/VerificationEvidence.gs](apps-script/src/VerificationEvidence.gs)

### Configuration and data
- [config/queries.json](config/queries.json)
- [config/sources.json](config/sources.json)
- [config/scoring.json](config/scoring.json)
- [data/sample-events.json](data/sample-events.json)
- [data/event-agent-lite.json](data/event-agent-lite.json)

---

## How I built it

This project was built in layers so the idea could evolve from concept to a usable product without becoming fragile.

### Phase 1: define the problem clearly
The first step was understanding the actual pain:

- too much scattered information
- weak signal-to-noise ratio
- no simple way to rank value
- no structured follow-up after discovering opportunities

### Phase 2: decide the product shape
I kept the product focused on a real user need instead of building a generic tool. The emphasis is on:

- local relevance
- contribution-led growth
- network value
- clear opportunity ranking

### Phase 3: build the discovery and validation pipeline
The core work was around gathering sources, validating them, and converting raw data into structured records with intelligence and scoring.

### Phase 4: build a public-facing product
After the backend logic matured, I shaped a public presentation that is simple, clean, and easy to understand for contributors and visitors.

### Phase 5: keep it open and extensible
The project is intentionally structured so contributors can help improve:

- source coverage
- scoring rules
- event categories
- verification logic
- dashboard UX
- follow-up tracking

---

## Open for contribution

This project is open to contributors who want to help improve the opportunity radar.

You can contribute in many ways:

- improve source discovery and validation logic
- add better event scoring rules
- suggest new communities and sources
- improve dashboard UX and data presentation
- strengthen verification quality
- add follow-up tracking and priority workflows
- help document the product better

### Contribution flow

1. Fork the repository
2. Create a feature branch
3. Improve a source, workflow, scoring model, or dashboard component
4. Validate locally
5. Open a clean pull request with context and reasoning

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor guide.

---

## Source credits and acknowledgements

This project is built on a set of public sources and community ecosystems that make the opportunity radar possible. Credits go to the communities and organizations that publish opportunities and maintain visibility into local and digital events.

### Source categories used
- official event websites
- community meetup pages
- regional developer groups
- open-source project repositories
- volunteer and contribution pages
- public event and community announcements

### Important note
This project is built to respect the source ecosystem and surface the opportunities responsibly. It is designed to prioritize reliable, visible, and useful signals instead of generic social noise.

The sources used here are not meant to be treated as a full database of all opportunities. They are a curated starting point for the product’s discovery layer and the public dashboard.

Examples of source types included in the discovery model:
- Meetup
- GitHub repositories
- open-source project pages
- official community event pages
- regional tech event websites
- volunteer and contribution portals

---

## Why this matters beyond the code

This is more than a project for me. It is a way to reduce wasted effort and improve visibility for people who want to learn, contribute, and grow in the right communities.

The value is not just “finding more events.”
The value is helping people find the right events at the right time and with the right intent.

That is why I built it.
That is why it is structured the way it is.
And that is why it is useful in a real, practical sense.

---

## Repository

- GitHub: https://github.com/Pavan755/event-opportunity-radar
- Live site: https://pavan755.github.io/event-opportunity-radar/

## License

This project is licensed under the MIT license. See [LICENSE](LICENSE) for details.
