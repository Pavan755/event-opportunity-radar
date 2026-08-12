function runOpportunityLifecycleTest() {
  const discoveryId =
    'd-lifecycle-test-001';

  const lifecycle =
    createOpportunityLifecycle(
      discoveryId
    );

  if (
    lifecycle.discovery_id !==
    discoveryId
  ) {
    throw new Error(
      'Discovery ID was not preserved.'
    );
  }

  if (
    lifecycle.state !== 'new'
  ) {
    throw new Error(
      'New lifecycle must start in new state.'
    );
  }

  if (
    !Array.isArray(lifecycle.history) ||
    lifecycle.history.length !== 1
  ) {
    throw new Error(
      'Lifecycle must start with one history entry.'
    );
  }

  if (
    !isValidOpportunityLifecycleState(
      'attended'
    )
  ) {
    throw new Error(
      'Attended must be a valid lifecycle state.'
    );
  }

  if (
    !isValidOpportunityLifecycleState(
      'contribution'
    )
  ) {
    throw new Error(
      'Contribution must be a valid lifecycle state.'
    );
  }

  if (
    !isValidOpportunityLifecycleState(
      'documented'
    )
  ) {
    throw new Error(
      'Documented must be a valid lifecycle state.'
    );
  }

  if (
    isValidOpportunityLifecycleState(
      'applied'
    )
  ) {
    throw new Error(
      'Applied must not be accepted as an implicit lifecycle state.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'new',
      'considering'
    )
  ) {
    throw new Error(
      'new -> considering must be valid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'considering',
      'planned'
    )
  ) {
    throw new Error(
      'considering -> planned must be valid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'planned',
      'registered'
    )
  ) {
    throw new Error(
      'planned -> registered must be valid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'registered',
      'accepted'
    )
  ) {
    throw new Error(
      'registered -> accepted must be valid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'accepted',
      'attended'
    )
  ) {
    throw new Error(
      'accepted -> attended must be valid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'attended',
      'follow_up'
    )
  ) {
    throw new Error(
      'attended -> follow_up must be valid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'follow_up',
      'contribution'
    )
  ) {
    throw new Error(
      'follow_up -> contribution must be valid.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'contribution',
      'documented'
    )
  ) {
    throw new Error(
      'contribution -> documented must be valid.'
    );
  }

  if (
    canTransitionOpportunityLifecycle(
      'new',
      'attended'
    )
  ) {
    throw new Error(
      'new -> attended must not be valid.'
    );
  }

  if (
    canTransitionOpportunityLifecycle(
      'documented',
      'new'
    )
  ) {
    throw new Error(
      'documented -> new must not be valid.'
    );
  }

  let current =
    lifecycle;

  current =
    transitionOpportunityLifecycle(
      current,
      'considering',
      'user_reviewed'
    );

  if (
    current.state !== 'considering'
  ) {
    throw new Error(
      'Lifecycle transition to considering failed.'
    );
  }

  current =
    transitionOpportunityLifecycle(
      current,
      'planned',
      'user_planned'
    );

  current =
    transitionOpportunityLifecycle(
      current,
      'registered',
      'registration_completed'
    );

  current =
    transitionOpportunityLifecycle(
      current,
      'accepted',
      'accepted_by_organizer'
    );

  current =
    transitionOpportunityLifecycle(
      current,
      'attended',
      'user_confirmed_attendance'
    );

  current =
    transitionOpportunityLifecycle(
      current,
      'follow_up',
      'post_event_follow_up'
    );

  current =
    transitionOpportunityLifecycle(
      current,
      'contribution',
      'contribution_completed'
    );

  current =
    transitionOpportunityLifecycle(
      current,
      'documented',
      'evidence_documented'
    );

  if (
    current.state !== 'documented'
  ) {
    throw new Error(
      'Final lifecycle state must be documented.'
    );
  }

  if (
    current.history.length !== 9
  ) {
    throw new Error(
      'Lifecycle history must contain creation + eight transitions.'
    );
  }

  if (
    !isTerminalOpportunityLifecycleState(
      'documented'
    )
  ) {
    throw new Error(
      'Documented must be terminal.'
    );
  }

  console.log(
    'LIFECYCLE MODEL: PASSED'
  );

  console.log(
    'STATE VALIDATION: PASSED'
  );

  console.log(
    'TRANSITION VALIDATION: PASSED'
  );

  console.log(
    'HISTORY TRACKING: PASSED'
  );

  console.log(
    'TERMINAL STATE VALIDATION: PASSED'
  );

  /*
   * STEP 7.12 - lifecycle edge cases
   */

  if (
    canTransitionOpportunityLifecycle(
      'dismissed',
      'new'
    )
  ) {
    throw new Error(
      'dismissed must not transition back to new.'
    );
  }

  if (
    canTransitionOpportunityLifecycle(
      'cancelled',
      'attended'
    )
  ) {
    throw new Error(
      'cancelled must not transition to attended.'
    );
  }

  if (
    canTransitionOpportunityLifecycle(
      'withdrawn',
      'planned'
    )
  ) {
    throw new Error(
      'withdrawn must not transition to planned.'
    );
  }

  if (
    canTransitionOpportunityLifecycle(
      'documented',
      'follow_up'
    )
  ) {
    throw new Error(
      'documented must not transition to follow_up.'
    );
  }

  if (
    canTransitionOpportunityLifecycle(
      'new',
      'invalid_state'
    )
  ) {
    throw new Error(
      'Invalid lifecycle states must never be transition targets.'
    );
  }

  if (
    !canTransitionOpportunityLifecycle(
      'new',
      'new'
    )
  ) {
    throw new Error(
      'Same-state validation must remain idempotent.'
    );
  }

  let edgeLifecycle =
    createOpportunityLifecycle(
      'd-lifecycle-edge-001'
    );

  edgeLifecycle =
    transitionOpportunityLifecycle(
      edgeLifecycle,
      'dismissed',
      'user_dismissed'
    );

  if (
    edgeLifecycle.state !== 'dismissed'
  ) {
    throw new Error(
      'Dismissed transition failed.'
    );
  }

  if (
    edgeLifecycle.history.length !== 2
  ) {
    throw new Error(
      'Dismissed transition must append exactly one history entry.'
    );
  }

  let cancelledLifecycle =
    createOpportunityLifecycle(
      'd-lifecycle-edge-002'
    );

  cancelledLifecycle =
    transitionOpportunityLifecycle(
      cancelledLifecycle,
      'considering',
      'user_reviewed'
    );

  cancelledLifecycle =
    transitionOpportunityLifecycle(
      cancelledLifecycle,
      'planned',
      'user_planned'
    );

  cancelledLifecycle =
    transitionOpportunityLifecycle(
      cancelledLifecycle,
      'cancelled',
      'event_cancelled'
    );

  if (
    cancelledLifecycle.state !== 'cancelled'
  ) {
    throw new Error(
      'Cancelled transition failed.'
    );
  }

  if (
    !isTerminalOpportunityLifecycleState(
      cancelledLifecycle.state
    )
  ) {
    throw new Error(
      'Cancelled must be terminal.'
    );
  }

  console.log(
    'EDGE TRANSITION VALIDATION: PASSED'
  );

  console.log(
    'TERMINAL IMMUTABILITY: PASSED'
  );

  console.log(
    'SAME-STATE VALIDATION: PASSED'
  );

  console.log(
    'STEP 7.12 EDGE CASES: PASSED'
  );
  console.log(
    'STEP 7.11 TEST: PASSED'
  );
}
