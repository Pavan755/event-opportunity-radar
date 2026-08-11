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
  'apps-script/src/SourceHealthPolicy.gs',
  'apps-script/src/SourceRegistryHealthGate.gs',
  'apps-script/src/SourceSelector.gs',
  'apps-script/src/DiscoverySourcePlanner.gs',
  'apps-script/src/DiscoveryPlanDeduplicator.gs',
  'apps-script/src/DiscoveryPlanValidator.gs',
  'apps-script/src/DiscoveryPlanExecutor.gs',
  'apps-script/src/DiscoveryResultValidator.gs',
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/ControlledSourceAdapter.gs',
  'apps-script/src/DiscoveryRecordNormalizer.gs',
  'apps-script/src/DiscoveryPipeline.gs',
  'apps-script/src/DiscoveryPipelineTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runDiscoveryPipelineTest !==
  'function'
) {
  throw new Error(
    'runDiscoveryPipelineTest was not loaded.'
  );
}

context.runDiscoveryPipelineTest();

console.log(
  'LOCAL DISCOVERY PIPELINE ORCHESTRATOR TEST: PASSED'
);
