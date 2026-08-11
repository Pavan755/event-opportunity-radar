const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,
  Utilities: {
    getUuid: () =>
      'test-' + Math.random().toString(36).substring(2, 14)
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/DiscoveryRecordNormalizer.gs',
  'apps-script/src/DiscoveryRecordNormalizerTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runDiscoveryRecordNormalizerTest !==
  'function'
) {
  throw new Error(
    'runDiscoveryRecordNormalizerTest was not loaded.'
  );
}

context.runDiscoveryRecordNormalizerTest();

console.log(
  'LOCAL DISCOVERY RECORD NORMALIZER TEST: PASSED'
);
