/**
 * Event Opportunity Radar - Opportunity Lifecycle Model
 *
 * Owns the user-facing lifecycle of an opportunity.
 *
 * This is intentionally separate from discovery.status.
 *
 * discovery.status:
 *   discovery/pipeline state
 *
 * lifecycle.state:
 *   user's progression with the opportunity
 */

const OPPORTUNITY_LIFECYCLE_STATES = [
  'new',
  'considering',
  'planned',
  'registered',
  'accepted',
  'attended',
  'follow_up',
  'contribution',
  'documented',
  'dismissed',
  'cancelled',
  'withdrawn'
];

const OPPORTUNITY_LIFECYCLE_TERMINAL_STATES = [
  'dismissed',
  'cancelled',
  'withdrawn',
  'documented'
];

const OPPORTUNITY_LIFECYCLE_TRANSITIONS = {
  new: [
    'considering',
    'planned',
    'dismissed'
  ],

  considering: [
    'planned',
    'dismissed'
  ],

  planned: [
    'registered',
    'accepted',
    'attended',
    'contribution',
    'dismissed',
    'cancelled',
    'withdrawn'
  ],

  registered: [
    'accepted',
    'attended',
    'cancelled',
    'withdrawn'
  ],

  accepted: [
    'attended',
    'cancelled',
    'withdrawn'
  ],

  attended: [
    'follow_up',
    'contribution',
    'documented'
  ],

  follow_up: [
    'contribution',
    'documented'
  ],

  contribution: [
    'follow_up',
    'documented'
  ],

  documented: [],

  dismissed: [],

  cancelled: [],

  withdrawn: []
};

function isValidOpportunityLifecycleState(state) {
  return (
    typeof state === 'string' &&
    OPPORTUNITY_LIFECYCLE_STATES.indexOf(state) !== -1
  );
}

function isTerminalOpportunityLifecycleState(state) {
  return (
    OPPORTUNITY_LIFECYCLE_TERMINAL_STATES.indexOf(state) !== -1
  );
}

function canTransitionOpportunityLifecycle(fromState, toState) {
  if (
    !isValidOpportunityLifecycleState(fromState) ||
    !isValidOpportunityLifecycleState(toState)
  ) {
    return false;
  }

  if (fromState === toState) {
    return true;
  }

  const allowed =
    OPPORTUNITY_LIFECYCLE_TRANSITIONS[fromState] || [];

  return allowed.indexOf(toState) !== -1;
}

function createOpportunityLifecycle(discoveryId) {
  if (
    !discoveryId ||
    String(discoveryId).trim() === ''
  ) {
    throw new Error(
      'discoveryId is required.'
    );
  }

  const now =
    new Date().toISOString();

  return {
    discovery_id: String(discoveryId),
    state: 'new',
    updated_at: now,
    history: [
      {
        from: null,
        to: 'new',
        changed_at: now,
        reason: 'lifecycle_created'
      }
    ]
  };
}

function transitionOpportunityLifecycle(
  lifecycle,
  toState,
  reason
) {
  if (
    !lifecycle ||
    typeof lifecycle !== 'object'
  ) {
    throw new Error(
      'Lifecycle object is required.'
    );
  }

  if (
    !lifecycle.discovery_id
  ) {
    throw new Error(
      'Lifecycle must contain discovery_id.'
    );
  }

  if (
    !isValidOpportunityLifecycleState(
      lifecycle.state
    )
  ) {
    throw new Error(
      'Lifecycle contains an invalid current state.'
    );
  }

  if (
    !isValidOpportunityLifecycleState(
      toState
    )
  ) {
    throw new Error(
      'Target lifecycle state is invalid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      lifecycle.state,
      toState
    )
  ) {
    throw new Error(
      'Invalid lifecycle transition: ' +
      lifecycle.state +
      ' -> ' +
      toState
    );
  }

  const now =
    new Date().toISOString();

  const updated = {
    discovery_id: lifecycle.discovery_id,
    state: toState,
    updated_at: now,
    history: Array.isArray(lifecycle.history)
      ? lifecycle.history.slice()
      : []
  };

  if (lifecycle.state !== toState) {
    updated.history.push({
      from: lifecycle.state,
      to: toState,
      changed_at: now,
      reason: reason || null
    });
  }

  return updated;
}
