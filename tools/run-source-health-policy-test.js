const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const source = fs.readFileSync(
  'apps-script/src/SourceHealthPolicy.gs',
  'utf8'
);

vm.runInContext(source, context, {
  filename: 'SourceHealthPolicy.gs'
});

const policy = {
  max_consecutive_failures: 3,
  min_success_records: 1
};

const healthy = {
  status: 'healthy',
  consecutive_failures: 0
};

const degraded = {
  status: 'unhealthy',
  consecutive_failures: 1
};

const disabled = {
  status: 'unhealthy',
  consecutive_failures: 3
};

const unknown = {
  status: 'unknown',
  consecutive_failures: 0
};

if (context.evaluateSourceHealth(healthy, policy) !== 'healthy') {
  throw new Error('Healthy source was not classified as healthy.');
}

if (context.evaluateSourceHealth(degraded, policy) !== 'degraded') {
  throw new Error('Degraded source was not classified as degraded.');
}

if (context.evaluateSourceHealth(disabled, policy) !== 'disabled') {
  throw new Error('Disabled source was not classified as disabled.');
}

if (context.evaluateSourceHealth(unknown, policy) !== 'unknown') {
  throw new Error('Unknown source was not classified as unknown.');
}

if (!context.isSourceUsable(healthy, policy)) {
  throw new Error('Healthy source should be usable.');
}

if (!context.isSourceUsable(degraded, policy)) {
  throw new Error('Degraded source should remain usable.');
}

if (context.isSourceUsable(disabled, policy)) {
  throw new Error('Disabled source must not be usable.');
}

if (context.isSourceUsable(unknown, policy)) {
  throw new Error('Unknown source must not be usable.');
}

console.log('HEALTHY STATE: PASSED');
console.log('DEGRADED STATE: PASSED');
console.log('DISABLED STATE: PASSED');
console.log('UNKNOWN STATE: PASSED');
console.log('USABILITY POLICY: PASSED');
console.log('STEP 6B.3 TEST: PASSED');
