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
  'apps-script/src/DiscoveryNormalizationPipelineTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runDiscoveryNormalizationPipelineTest !==
  'function'
) {
  throw new Error(
    'runDiscoveryNormalizationPipelineTest was not loaded.'
  );
}

context.runDiscoveryNormalizationPipelineTest();

console.log(
  'LOCAL DISCOVERY NORMALIZATION PIPELINE TEST: PASSED'
);
