const fallbackOpportunities = [
  {
    name: 'Hyderabad AI Meetup',
    region: 'Hyderabad',
    role: 'Technical Volunteer',
    skillFit: 'AI, Python, community support',
    benefit: 'Strong learning + networking value',
    rank: 'A',
    applyUrl: 'https://www.meetup.com/',
    officialUrl: 'https://www.meetup.com/',
    outreachStrategy: 'Reach out with a short contribution note to the organizer or volunteer lead and ask how to help with event support or community tasks.',
    contactProfiles: {
      email: null,
      linkedin: null,
      social: []
    }
  },
  {
    name: 'Bengaluru Tech Week',
    region: 'Bengaluru',
    role: 'Volunteer',
    skillFit: 'Event ops, docs, community support',
    benefit: 'Best local visibility and network access',
    rank: 'S',
    applyUrl: 'https://bengalurutechweek.com/',
    officialUrl: 'https://bengalurutechweek.com/',
    outreachStrategy: 'Contact the organizing team with a clear offer: event support, documentation, logistics, or community help.',
    contactProfiles: {
      email: null,
      linkedin: null,
      social: []
    }
  },
  {
    name: 'Open Source India',
    region: 'Bengaluru',
    role: 'Community',
    skillFit: 'Open source, AI, developer community',
    benefit: 'Major developer conference with strong open-source visibility',
    rank: 'S',
    applyUrl: 'https://register.opensourceindia.in/',
    officialUrl: 'https://www.opensourceindia.in/',
    outreachStrategy: 'Use the official registration/contact page and ask how contributors, volunteers, or community partners can support the event.',
    contactProfiles: {
      email: 'info@opensourceindia.in',
      linkedin: null,
      social: []
    }
  },
  {
    name: 'Swecha DevDays Volunteers',
    region: 'Hyderabad',
    role: 'Volunteer',
    skillFit: 'Community support, volunteer ops, local outreach',
    benefit: 'Hands-on local contribution with direct community impact',
    rank: 'A',
    applyUrl: 'https://events.swecha.org/DevDays/2026-volunteers-1/',
    officialUrl: 'https://events.swecha.org/DevDays/2026-volunteers-1/',
    outreachStrategy: 'Approach the volunteer coordinator with a practical offer and ask for local contribution roles, field support, or logistics help.',
    contactProfiles: {
      email: null,
      linkedin: null,
      social: []
    }
  }
];

const cardsGrid = document.getElementById('eventCardsGrid');
const totalEventsEl = document.getElementById('totalEvents');
const priorityCountEl = document.getElementById('priorityCount');
const volunteerCountEl = document.getElementById('volunteerCount');
const virtualCountEl = document.getElementById('virtualCount');

const regionFilter = document.getElementById('regionFilter');
const rankFilter = document.getElementById('rankFilter');
const typeFilter = document.getElementById('typeFilter');
const searchInput = document.getElementById('searchInput');
const trackerForm = document.getElementById('trackerForm');
const trackerRowsEl = document.getElementById('trackerRows');
const trackerStorageKey = 'event-opportunity-radar-tracker';

let opportunities = [...fallbackOpportunities];

function getDefaultTrackerEntries() {
  return [
    {
      opportunity: 'Open Source India',
      contact: 'community team',
      status: 'follow_up',
      notes: 'Ask for volunteer or contributor role and share relevant GitHub profile.'
    },
    {
      opportunity: 'Hyderabad AI Meetup',
      contact: 'organizer',
      status: 'not_contacted',
      notes: 'Reach out with a short AI/ML contribution note.'
    }
  ];
}

function readTrackerEntries() {
  try {
    const raw = localStorage.getItem(trackerStorageKey);
    if (!raw) return getDefaultTrackerEntries();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : getDefaultTrackerEntries();
  } catch (error) {
    console.warn('Tracker fallback restored:', error.message);
    return getDefaultTrackerEntries();
  }
}

function writeTrackerEntries(entries) {
  localStorage.setItem(trackerStorageKey, JSON.stringify(entries));
}

function formatTrackerStatus(value) {
  const labels = {
    not_contacted: 'Not contacted',
    contacted: 'Contacted',
    follow_up: 'Follow up',
    accepted: 'Accepted',
    declined: 'Declined'
  };
  return labels[value] || 'Not contacted';
}

function renderTrackerEntries() {
  if (!trackerRowsEl) return;

  const entries = readTrackerEntries();
  if (!entries.length) {
    trackerRowsEl.innerHTML = '<tr><td colspan="5" class="tracker-empty">No outreach tracked yet.</td></tr>';
    return;
  }

  trackerRowsEl.innerHTML = entries
    .map((entry, index) => `
      <tr>
        <td>${entry.opportunity || 'Opportunity'}</td>
        <td>${entry.contact || 'Organizer'}</td>
        <td><span class="tracker-status ${entry.status || 'not_contacted'}">${formatTrackerStatus(entry.status)}</span></td>
        <td>${entry.notes ? entry.notes : '—'}</td>
        <td><button type="button" class="tracker-delete" data-index="${index}">Remove</button></td>
      </tr>
    `)
    .join('');
}

function handleTrackerSubmit(event) {
  event.preventDefault();
  if (!trackerForm) return;

  const formData = new FormData(trackerForm);
  const entry = {
    opportunity: String(formData.get('opportunity') || '').trim(),
    contact: String(formData.get('contact') || '').trim(),
    status: String(formData.get('status') || 'not_contacted'),
    notes: String(formData.get('notes') || '').trim()
  };

  if (!entry.opportunity || !entry.contact) return;

  const entries = [entry, ...readTrackerEntries()].slice(0, 8);
  writeTrackerEntries(entries);
  renderTrackerEntries();
  trackerForm.reset();
}

function handleTrackerDelete(event) {
  const button = event.target.closest('.tracker-delete');
  if (!button) return;

  const index = Number(button.dataset.index);
  if (Number.isNaN(index)) return;

  const entries = readTrackerEntries();
  entries.splice(index, 1);
  writeTrackerEntries(entries);
  renderTrackerEntries();
}

function deriveRegion(name, fallback = 'Virtual') {
  const normalized = String(name || '').toLowerCase();
  if (normalized.includes('bengaluru')) return 'Bengaluru';
  if (normalized.includes('hyderabad')) return 'Hyderabad';
  if (normalized.includes('telangana')) return 'Telangana';
  if (normalized.includes('andhra')) return 'Andhra Pradesh';
  if (normalized.includes('virtual') || normalized.includes('online')) return 'Virtual';
  return fallback;
}

function deriveRank(valueScore) {
  if (valueScore >= 90) return 'S';
  if (valueScore >= 75) return 'A';
  if (valueScore >= 60) return 'B';
  return 'C';
}

function deriveRole(record) {
  const text = `${record.name || ''} ${record.summary || ''} ${record.categories || ''}`.toLowerCase();
  if (text.includes('volunteer') || text.includes('support')) return 'Volunteer';
  if (text.includes('hackathon')) return 'Hackathon';
  if (text.includes('open source')) return 'Open Source';
  if (text.includes('conference') || text.includes('meetup')) return 'Community';
  return 'Community';
}

function deriveSkillFit(record) {
  const categorySet = Array.isArray(record.categories) ? record.categories : [];
  const sourceType = record.source_type ? String(record.source_type).replace(/_/g, ' ') : '';
  const terms = [...categorySet, sourceType].filter(Boolean).slice(0, 3);
  return terms.length ? terms.join(', ') : 'Community engagement';
}

function normalizeOpportunity(record) {
  const summaryText = record.summary || 'High-value opportunity worth learning from and contributing to.';
  const applyUrl = record.apply_url || record.official_url || record.url || null;
  const region = deriveRegion(record.name || record.title || summaryText);
  const valueScore = Number(record.value_score) || 75;
  const contactEmail = record.contact_email || null;
  const contactUrl = record.contact_url || record.contact_links?.[0] || null;
  const linkedinUrl = record.linkedin_url || (Array.isArray(record.social_links) ? record.social_links.find((item) => /linkedin\.com\//i.test(item)) || null : null);
  const outreachStrategy = record.outreach_strategy || 'Research the organizer, then contact them with a clear contribution offer and relevant skills.';

  return {
    id: record.id || `${record.name || 'opportunity'}-${Date.now()}`,
    name: record.name || record.title || 'Opportunity',
    region,
    role: deriveRole(record),
    skillFit: deriveSkillFit(record),
    benefit: summaryText,
    rank: deriveRank(valueScore),
    applyUrl,
    officialUrl: record.official_url || record.url || null,
    contactEmail,
    contactUrl,
    linkedinUrl,
    verificationStatus: record.verification_status || 'needs_corroboration',
    sourceType: record.source_type || 'community',
    outreachStrategy
  };
}

function renderCards() {
  const regionValue = regionFilter.value;
  const rankValue = rankFilter.value;
  const typeValue = typeFilter.value;
  const searchValue = searchInput.value.trim().toLowerCase();

  const filtered = opportunities.filter((event) => {
    const matchesRegion = regionValue === 'all' || event.region === regionValue;
    const matchesRank = rankValue === 'all' || event.rank === rankValue;
    const matchesType = typeValue === 'all' || event.role === typeValue;
    const searchText = [event.name, event.skillFit, event.benefit, event.region].join(' ').toLowerCase();
    const matchesSearch = !searchValue || searchText.includes(searchValue);

    return matchesRegion && matchesRank && matchesType && matchesSearch;
  });

  cardsGrid.innerHTML = filtered
    .map((event) => {
      const actionUrl = event.applyUrl || event.officialUrl || '#';
      const actionLabel = event.applyUrl ? 'Apply now' : 'View source';
      const contactChips = [
        event.contactEmail ? `<span class="mini-chip">Email</span>` : '',
        event.linkedinUrl ? `<span class="mini-chip">LinkedIn</span>` : '',
        event.contactUrl ? `<span class="mini-chip">Contact</span>` : ''
      ].filter(Boolean).join('');
      const contactText = event.contactEmail || event.linkedinUrl || event.contactUrl
        ? `Contact: ${event.contactEmail || event.linkedinUrl || event.contactUrl}`
        : 'Contact: research organizer / volunteer lead';

      return `
        <article class="opportunity-card">
          <div class="card-header">
            <div>
              <div class="event-type">${event.role}</div>
              <h3>${event.name}</h3>
            </div>
            <span class="rank-badge rank-${event.rank}">${event.rank}</span>
          </div>

          <div class="meta-row">
            <span>${event.region}</span>
            <span>${event.skillFit}</span>
          </div>

          <p class="event-benefit">${event.benefit}</p>
          <p class="contact-line">${contactText}</p>
          <p class="strategy-line">${event.outreachStrategy}</p>

          <div class="contact-row">${contactChips}</div>

          <div class="card-footer">
            <span class="verification-pill">${event.verificationStatus}</span>
            <a class="action-link" href="${actionUrl}" target="_blank" rel="noreferrer">${actionLabel}</a>
          </div>
        </article>
      `;
    })
    .join('');

  const highPriority = opportunities.filter((event) => ['S', 'A'].includes(event.rank)).length;
  const volunteer = opportunities.filter((event) => event.role.toLowerCase().includes('volunteer') || event.role.toLowerCase().includes('support')).length;
  const virtual = opportunities.filter((event) => event.region === 'Virtual').length;

  totalEventsEl.textContent = String(opportunities.length);
  priorityCountEl.textContent = String(highPriority);
  volunteerCountEl.textContent = String(volunteer);
  virtualCountEl.textContent = String(virtual);
}

async function loadOpportunities() {
  try {
    const response = await fetch('../data/event-agent-lite.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    const discovered = Array.isArray(payload.opportunities) ? payload.opportunities : [];
    if (discovered.length > 0) {
      opportunities = discovered.map(normalizeOpportunity);
      renderCards();
    }
  } catch (error) {
    console.warn('Dashboard data fallback activated:', error.message);
    opportunities = [...fallbackOpportunities];
    renderCards();
  }
}

[regionFilter, rankFilter, typeFilter, searchInput].forEach((element) => {
  element.addEventListener('input', renderCards);
  element.addEventListener('change', renderCards);
});

if (trackerForm) {
  trackerForm.addEventListener('submit', handleTrackerSubmit);
}

if (trackerRowsEl) {
  trackerRowsEl.addEventListener('click', handleTrackerDelete);
}

renderCards();
renderTrackerEntries();
loadOpportunities();
