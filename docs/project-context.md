# Event Opportunity Radar — Project Context

## Mission

Build a practical opportunity radar for event discovery, contribution, networking, and learning. The system priorities:

- local and regional events in Andhra Pradesh, Telangana, and Bengaluru
- relevant virtual and hybrid opportunities
- learning-first contribution paths
- volunteer, hackathon, community, and open-source opportunities
- verification before acting on any opportunity
- public-facing product story without exposing private personal data

## Core product idea

The project is not just a list of events. It is a decision system to answer:

- Which opportunities are worth my time?
- Which ones match my current skills?
- What do I need to learn before I apply?
- Which opportunities offer the best learning, contribution, networking, and portfolio value?
- Which opportunities are credible, and which are low-signal or risky?

## Lifecycle and strategy

The long-term workflow is:

1. Discover opportunity candidates from official and community sources
2. Normalize and validate them
3. Confirm whether evidence is solid
4. Match against personal skill inventory
5. Determine realistic contribution and learning gap
6. Rank by value and fit
7. Apply, volunteer, or contact organizer
8. Attend and contribute
9. Network and document results
10. Track follow-up, certificates, GitHub evidence, and LinkedIn updates

## Important project rule

The system should optimize for:

Learn → Contribute → Network → Build evidence → Follow up

not for:

Pay → attend → collect a certificate → leave

## Public vs personal split

The public repository is meant to show the product, architecture, and open-source engine.
The personal workflow remains private and separate:

- personal event tracking
- custom contact notes
- private application messages
- personal sheet data
- personal certificates and follow-up tasks

## Verified architecture already present

The repository includes the major building blocks for a working pipeline:

- source registry and source type definitions
- source adapters
- source normalization
- verification evidence and policy checks
- lifecycle state management
- personal tracker and sheet persistence
- pipeline scoring and discovery logic

These modules are present under:

- apps-script/src/SourceAdapter.gs
- apps-script/src/SourceRegistry.gs
- apps-script/src/SourceNormalizer.gs
- apps-script/src/VerificationEvidence.gs
- apps-script/src/OpportunityLifecycle.gs
- apps-script/src/OpportunityPersonalTracker.gs
- apps-script/src/OpportunityPersonalSheetStore.gs
- apps-script/src/OpportunityRadarPipeline.gs

## Real current gap

The project is not yet fully integrated as a single production flow that turns discovered events into a complete ranked, evidence-backed dashboard with a real personal workflow.

The codebase has the architecture pieces, but the final wiring layer is still missing or incomplete:

- discovery source execution is not yet connected to a clean production schedule
- source selection and verification are not yet exposed as a single master pipeline
- the public dashboard is present, but it still needs a consistent data source and evidence model
- a complete event application and follow-up workflow is not yet fully automated

## Region priorities

The priority order is:

1. Andhra Pradesh
   - Visakhapatnam
   - Vizianagaram
   - Srikakulam
   - Kakinada
   - Vijayawada
   - Tirupati
2. Telangana
   - Hyderabad
3. Karnataka
   - Bengaluru
4. India (non-local)
5. International virtual/hybrid, only when feasible

## Skill inventory and strategy

The system should explicitly evaluate:

- Python
- AI/ML
- Data analysis
- HTML/CSS
- JavaScript
- Git/GitHub
- technical documentation
- editing and videography support
- event ops and community support

The learning-first rule is key:

- do not claim a skill if it is only planned or partially known
- learn the minimum needed before applying
- present a realistic contribution offer
- match opportunities to evidence and readiness

## Ranking model

- S: exceptional fit with strong learning, contribution, networking, and career upside
- A: strong fit
- B: useful but lower ROI
- C: learning or networking only
- D: not worth the effort

## Discovery sources to prioritize

- official event websites
- organizer websites and volunteer pages
- community pages
- GitHub repositories and issues
- event platforms such as Eventbrite, Devfolio, Meetup
- social posts when corroborated by trustworthy evidence
- open-source and community contribution opportunities

## Critical rule for verification

Social posts and community mentions should never be treated as full verification on their own.
They should be considered discovery leads requiring corroboration.

## Phase plan

### Phase 0

- public dashboard
- public repo structure
- basic opportunity story
- initial filters and ranking concept
- initial local verification and project structure

### Phase 1

- connect all ready source discovery modules into a coherent flow
- finish a clean source registry and verification policy
- make the discovery pipeline produce actual records
- ensure evidence logic is consistent with the event model
- integrate lifecycle and tracking into a coherent action flow

### Phase 2

- add event reminder and follow-up workflow
- track personal application lifecycle
- prepare LinkedIn and GitHub drafts only after real attendance or verified action
- create a certificate and proof tracker

### Phase 3

- open-source contribution tracking
- public dashboard improvement with stronger filters and event proof fields
- richer skill matching and application notes

## Current execution recommendation

Do not build a large custom autonomous agent yet. The current sensible approach is:

- keep the public dashboard and repo clean
- keep the source registry + verification model stronger
- use lightweight scheduled discovery with structured evidence
- keep the personal workflow private
- only automate posting drafts after human approval

## Final objective

The goal is to build a system that helps Pavan find events where he can:

- learn efficiently
- contribute usefully
- network intentionally
- gain recognition
- build a portfolio and professional relationships
- gradually move from attendee to contributor to community member

This is the real product.
