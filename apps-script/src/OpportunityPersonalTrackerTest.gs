function runOpportunityPersonalTrackerTest() {
  const tracker = createOpportunityPersonalTracker();

  tracker.add({
    discovery_id: 'personal-001',
    title: 'Hyderabad AI Meetup',
    region: 'Hyderabad',
    type: 'Technical Volunteer',
    priority: 'A',
    status: 'shortlisted',
    notes: 'Check organizer profile and volunteer role.'
  });

  tracker.add({
    discovery_id: 'personal-002',
    title: 'Bengaluru Tech Week',
    region: 'Bengaluru',
    type: 'Volunteer',
    priority: 'S',
    status: 'registered',
    notes: 'Follow up with event team.'
  });

  tracker.add({
    discovery_id: 'personal-003',
    title: 'Vizag AI Community Session',
    region: 'Andhra Pradesh',
    type: 'Community',
    priority: 'A',
    status: 'follow_up',
    notes: 'Send thank-you note after event.'
  });

  if (tracker.list().length !== 3) {
    throw new Error('Tracker should store three items.');
  }

  const hyderabad = tracker.byRegion('Hyderabad');
  if (hyderabad.length !== 1 || hyderabad[0].title !== 'Hyderabad AI Meetup') {
    throw new Error('Regional filtering failed.');
  }

  const followUps = tracker.byStatus('follow_up');
  if (followUps.length !== 1 || followUps[0].title !== 'Vizag AI Community Session') {
    throw new Error('Status filtering failed.');
  }

  const updated = tracker.update('personal-001', {
    status: 'attended',
    notes: 'Great session, connected with two builders.'
  });

  if (updated.status !== 'attended') {
    throw new Error('Status update failed.');
  }

  if (!updated.notes.includes('connected')) {
    throw new Error('Notes update failed.');
  }

  const duplicate = tracker.add({
    discovery_id: 'personal-001',
    title: 'Hyderabad AI Meetup',
    region: 'Hyderabad',
    type: 'Technical Volunteer',
    priority: 'A',
    status: 'shortlisted'
  });

  if (duplicate !== null) {
    throw new Error('Duplicate discovery IDs must be prevented.');
  }

  const regionSummary = tracker.summaryByRegion();
  if (!regionSummary.Hyderabad || !regionSummary.Bengaluru || !regionSummary['Andhra Pradesh']) {
    throw new Error('Region summary failed.');
  }

  console.log('PERSONAL TRACKER: PASSED');
  console.log('REGION FILTERING: PASSED');
  console.log('STATUS FILTERING: PASSED');
  console.log('UPDATE FLOW: PASSED');
  console.log('DUPLICATE PREVENTION: PASSED');
  console.log('REGION SUMMARY: PASSED');
}
