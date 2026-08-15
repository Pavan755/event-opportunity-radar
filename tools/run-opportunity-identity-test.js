const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

const context = {
  console: console
};

vm.createContext(context);

const identitySource = fs.readFileSync(
  path.join(
    root,
    'apps-script',
    'src',
    'OpportunityIdentity.gs'
  ),
  'utf8'
);

vm.runInContext(
  identitySource,
  context,
  {
    filename: 'OpportunityIdentity.gs'
  }
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const baseRecord = {
  discovery_id: 'd-identity-001',
  title: 'AI Hackathon Visakhapatnam',
  organizer: 'Test Technology Community',
  location: 'Visakhapatnam',
  url: 'https://example.com/ai-hackathon/'
};

const equivalentRecord = {
  discovery_id: 'd-identity-002',
  title: '  AI Hackathon Visakhapatnam  ',
  organizer: '  TEST TECHNOLOGY COMMUNITY ',
  location: ' VISAKHAPATNAM ',
  url: 'HTTPS://WWW.EXAMPLE.COM/ai-hackathon/'
};

const differentRecord = {
  discovery_id: 'd-identity-003',
  title: 'Open Source Virtual Meetup',
  organizer: 'Test Open Source Group',
  location: 'Virtual',
  url: 'https://example.com/open-source'
};

const originalBase = JSON.parse(
  JSON.stringify(baseRecord)
);

const baseId =
  context.createOpportunityId(baseRecord);

const equivalentId =
  context.createOpportunityId(
    equivalentRecord
  );

const differentId =
  context.createOpportunityId(
    differentRecord
  );

assert(
  typeof baseId === 'string',
  'Opportunity ID must be a string.'
);

assert(
  /^o-[0-9a-f]{8}$/.test(baseId),
  'Opportunity ID must use the expected o-xxxxxxxx format.'
);

assert(
  baseId === equivalentId,
  'Equivalent normalized opportunities must receive the same opportunity_id.'
);

console.log(
  'DETERMINISTIC IDENTITY: PASSED'
);

assert(
  baseId !== differentId,
  'Different opportunities must not receive the same opportunity_id.'
);

console.log(
  'DISTINCT OPPORTUNITY IDENTITY: PASSED'
);

const attached =
  context.attachOpportunityIdentity(
    baseRecord
  );

assert(
  attached.opportunity_id === baseId,
  'Attached opportunity_id must match createOpportunityId().'
);

assert(
  attached.discovery_id ===
    baseRecord.discovery_id,
  'discovery_id must be preserved.'
);

assert(
  !Object.prototype.hasOwnProperty.call(
    baseRecord,
    'opportunity_id'
  ),
  'attachOpportunityIdentity must not mutate the input record.'
);

assert(
  JSON.stringify(baseRecord) ===
    JSON.stringify(originalBase),
  'Input record must remain unchanged.'
);

console.log(
  'DISCOVERY ID PRESERVATION: PASSED'
);

console.log(
  'INPUT IMMUTABILITY: PASSED'
);

let rejected = false;

try {
  context.createOpportunityId({});
} catch (error) {
  rejected = true;
}

assert(
  rejected,
  'Completely empty identity records must be rejected.'
);

console.log(
  'EMPTY IDENTITY REJECTION: PASSED'
);

const batch = [
  baseRecord,
  equivalentRecord,
  differentRecord
];

const attachedBatch =
  context.attachOpportunityIdentities(
    batch
  );

assert(
  Array.isArray(attachedBatch),
  'Batch identity attachment must return an array.'
);

assert(
  attachedBatch.length === batch.length,
  'Batch identity attachment must preserve record count.'
);

assert(
  attachedBatch[0].opportunity_id ===
    attachedBatch[1].opportunity_id,
  'Equivalent records in a batch must share opportunity_id.'
);

assert(
  attachedBatch[0].opportunity_id !==
    attachedBatch[2].opportunity_id,
  'Different records in a batch must receive different opportunity_id values.'
);

console.log(
  'BATCH IDENTITY ATTACHMENT: PASSED'
);

console.log(
  'STEP 7.15B TEST: PASSED'
);

console.log(
  'LOCAL OPPORTUNITY IDENTITY TEST: PASSED'
);
