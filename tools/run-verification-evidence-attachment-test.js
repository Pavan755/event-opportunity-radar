const fs = require('fs');
const vm = require('vm');

const context = {
  console: console
};

vm.createContext(context);

const files = [
  'apps-script/src/VerificationEvidenceAttachment.gs',
  'apps-script/src/VerificationEvidenceAttachmentTest.gs'
];

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
  typeof context.runVerificationEvidenceAttachmentTest !==
  'function'
) {
  throw new Error(
    'runVerificationEvidenceAttachmentTest was not loaded.'
  );
}

context.runVerificationEvidenceAttachmentTest();

console.log(
  'LOCAL VERIFICATION EVIDENCE ATTACHMENT TEST: PASSED'
);
