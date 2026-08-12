const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,

  Utilities: {
    getUuid: () =>
      'test-' +
      Math.random()
        .toString(36)
        .substring(2, 14)
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/SourceAdapter.gs',
  'apps-script/src/SourceHealthPolicy.gs',
  'apps-script/src/SourceRegistryHealthGate.gs',
  'apps-script/src/SourceSelector.gs',
  'apps-script/src/DiscoverySourcePlanner.gs',
  'apps-script/src/DiscoveryPlanDeduplicator.gs',
  'apps-script/src/DiscoveryPlanValidator.gs',
  'apps-script/src/ExecutionAdapter.gs',
  'apps-script/src/GitHubRepositoryAdapter.gs',
  'apps-script/src/ProductionAdapterFactory.gs',
  'apps-script/src/DiscoveryPlanExecutor.gs',
  'apps-script/src/DiscoveryResultValidator.gs',
  'apps-script/src/DiscoveryRecordNormalizer.gs',
  'apps-script/src/VerificationEvidence.gs',
  'apps-script/src/VerificationAuthorityPolicy.gs',
  'apps-script/src/PolicyAwareVerificationEvidence.gs',
  'apps-script/src/PolicyAwareEvidenceRecordIntegration.gs',
  'apps-script/src/PolicyAwareDiscoveryEvidenceIntegration.gs',
  'apps-script/src/DiscoveryPipeline.gs',
  'apps-script/src/FullProductionDiscoveryPipelineTest.gs'
];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  vm.runInContext(source, context, {
    filename: file
  });
}

if (
  typeof context.runFullProductionDiscoveryPipelineTest !==
  'function'
) {
  throw new Error(
    'runFullProductionDiscoveryPipelineTest was not loaded.'
  );
}

context.runFullProductionDiscoveryPipelineTest();

console.log(
  'LOCAL FULL PRODUCTION DISCOVERY PIPELINE TEST: PASSED'
);
