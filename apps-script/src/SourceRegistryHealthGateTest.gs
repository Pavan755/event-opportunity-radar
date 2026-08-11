function runSourceRegistryHealthGateTest() {
  const policy = {
    max_consecutive_failures: 3,
    min_success_records: 1
  };

  const source = {
    id: 'test-source-gate-001',
    name: 'Test Source'
  };

  const healthy = {
    source_id: source.id,
    status: 'healthy',
    consecutive_failures: 0
  };

  const degraded = {
    source_id: source.id,
    status: 'unhealthy',
    consecutive_failures: 1
  };

  const disabled = {
    source_id: source.id,
    status: 'unhealthy',
    consecutive_failures: 3
  };

  const unknownSource = {
    id: 'unknown-source',
    name: 'Unknown Source'
  };

  if (getSourceHealthState(source, [healthy], policy) !== 'healthy') {
    throw new Error('Healthy source was not classified correctly.');
  }

  if (!isRegisteredSourceUsable(source, [healthy], policy)) {
    throw new Error('Healthy source should be usable.');
  }

  if (getSourceHealthState(source, [degraded], policy) !== 'degraded') {
    throw new Error('Degraded source was not classified correctly.');
  }

  if (!isRegisteredSourceUsable(source, [degraded], policy)) {
    throw new Error('Degraded source should remain usable.');
  }

  if (getSourceHealthState(source, [disabled], policy) !== 'disabled') {
    throw new Error('Disabled source was not classified correctly.');
  }

  if (isRegisteredSourceUsable(source, [disabled], policy)) {
    throw new Error('Disabled source must not be usable.');
  }

  if (getSourceHealthState(unknownSource, [healthy], policy) !== 'unknown') {
    throw new Error('Missing health record must produce unknown state.');
  }

  if (isRegisteredSourceUsable(unknownSource, [healthy], policy)) {
    throw new Error('Unknown source must not be treated as usable.');
  }

  console.log('HEALTHY SOURCE: PASSED');
  console.log('DEGRADED SOURCE: PASSED');
  console.log('DISABLED SOURCE: PASSED');
  console.log('UNKNOWN SOURCE: PASSED');
  console.log('USABILITY GATE: PASSED');
  console.log('STEP 6B.4 TEST: PASSED');
}
