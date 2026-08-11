function runSourceHealthTest() {
  const source = {
    id: 'test-source-health-002',
    name: 'Test Source 2'
  };

  const health = createSourceHealthRecord(source);

  if (health.source_id !== source.id) {
    throw new Error('Source ID mismatch.');
  }

  if (health.status !== 'unknown') {
    throw new Error('Initial status must be unknown.');
  }

  markSourceSuccess(health, 5, 5);

  if (health.status !== 'healthy') {
    throw new Error('Expected healthy status after success.');
  }

  if (health.consecutive_failures !== 0) {
    throw new Error('Failure counter did not reset.');
  }

  markSourceFailure(health, 'Temporary test failure');

  if (health.status !== 'unhealthy') {
    throw new Error('Expected unhealthy status after failure.');
  }

  if (health.consecutive_failures !== 1) {
    throw new Error('Expected one consecutive failure.');
  }

  markSourceFailure(health, 'Second test failure');

  if (health.consecutive_failures !== 2) {
    throw new Error('Expected two consecutive failures.');
  }

  if (health.error_message !== 'Second test failure') {
    throw new Error('Latest error message was not recorded.');
  }

  console.log('INITIAL STATUS: unknown');
  console.log('SUCCESS STATUS: healthy');
  console.log('FAILURE STATUS: unhealthy');
  console.log('CONSECUTIVE FAILURES: ' + health.consecutive_failures);
  console.log('HEALTH TEST: PASSED');
  console.log('STEP 6B.2 TEST: PASSED');
}
