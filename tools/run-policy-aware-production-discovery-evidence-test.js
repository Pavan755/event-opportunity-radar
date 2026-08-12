const fs = require('fs');
const vm = require('vm');

const context = {
  console: console,
  Utilities: {
    getUuid: function() {
      return 'test-' +
        Math.random()
          .toString(36)
          .substring(2, 14);
    }
  }
};

vm.createContext(context);

const files = [
  'apps-script/src/VerificationEvidence.gs',
  'apps-script/src/VerificationAuthorityPolicy.gs',
  'apps-script/src/PolicyAwareVerificationEvidence.gs',
  'apps-script/src/PolicyAwareEvidenceRecordIntegration.gs',
  'apps-script/src/PolicyAwareDiscoveryEvidenceIntegration.gs',
  'apps-script/src/DiscoveryPipeline.gs',
  'apps-script/src/PolicyAwareProductionDiscoveryEvidenceTest.gs'
];

context.selectUsableSources = function(
  sources
) {
  return sources.slice();
};

context.planDiscoverySources = function(
  queries,
  sources
) {
  const plans = [];

  queries.forEach(function(query) {
    sources.forEach(function(source) {
      plans.push({
        plan_id:
          'plan-' +
          context.Utilities.getUuid(),

        query_id:
          query.query_id,

        source_id:
          source.id,

        source_type:
          source.type,

        source_class:
          source.class,

        source_priority:
          Number(source.priority || 0),

        query_text:
          query.text,

        status:
          'planned',

        created_at:
          new Date().toISOString()
      });
    });
  });

  return plans;
};

context.deduplicateDiscoveryPlans =
  function(plans) {
    return plans;
  };

context.isValidDiscoveryPlan =
  function(plan) {
    return !!(
      plan &&
      plan.plan_id &&
      plan.query_id &&
      plan.source_id
    );
  };

context.executeDiscoveryPlan =
  function(plan) {
    return {
      status: 'executed',
      records: [
        {
          discovery_id:
            'd-' +
            plan.source_id,

          query_id:
            plan.query_id,

          source_id:
            plan.source_id,

          title:
            'AI Hackathon Repository',

          organizer:
            'example-org',

          url:
            'https://example.com/' +
            plan.source_id,

          event_date:
            '2026-09-01',

          raw_text:
            'AI hackathon discovery record.'
        }
      ]
    };
  };

context.validateDiscoveryExecutionResult =
  function() {
    return {
      valid: true,
      errors: []
    };
  };

context.normalizeDiscoveryRecords =
  function(records, metadata) {
    return records.map(function(record) {
      return {
        discovery_id:
          record.discovery_id,

        query_id:
          metadata.query_id,

        source_id:
          metadata.source_id,

        title:
          record.title,

        organizer:
          record.organizer,

        url:
          record.url,

        event_date:
          record.event_date,

        raw_text:
          record.raw_text,

        verification: {
          status: 'unverified',
          confidence: 0,
          sources: []
        },

        status:
          'discovered'
      };
    });
  };

for (const file of files) {
  const source =
    fs.readFileSync(file, 'utf8');

  vm.runInContext(
    source,
    context,
    {
      filename: file
    }
  );
}

if (
  typeof context.runPolicyAwareProductionDiscoveryEvidenceTest !==
  'function'
) {
  throw new Error(
    'runPolicyAwareProductionDiscoveryEvidenceTest was not loaded.'
  );
}

context.runPolicyAwareProductionDiscoveryEvidenceTest();

console.log(
  'LOCAL POLICY-AWARE PRODUCTION DISCOVERY EVIDENCE TEST: PASSED'
);
