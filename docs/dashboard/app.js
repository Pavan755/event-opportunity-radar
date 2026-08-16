const opportunities = [
  {
    name: 'Hyderabad AI Meetup',
    region: 'Hyderabad',
    role: 'Technical Volunteer',
    skillFit: 'AI, Python, community support',
    benefit: 'Strong learning + networking value',
    rank: 'A'
  },
  {
    name: 'Bengaluru Tech Week',
    region: 'Bengaluru',
    role: 'Volunteer',
    skillFit: 'Event ops, docs, community support',
    benefit: 'Best local visibility and network access',
    rank: 'S'
  },
  {
    name: 'Vizag AI Community Session',
    region: 'Andhra Pradesh',
    role: 'Community',
    skillFit: 'Docs, community engagement, presentations',
    benefit: 'Good local ecosystem exposure',
    rank: 'A'
  },
  {
    name: 'Hackathon Volunteer Program',
    region: 'Virtual',
    role: 'Hackathon',
    skillFit: 'GitHub, event support, technical help',
    benefit: 'Strong build + portfolio path',
    rank: 'A'
  },
  {
    name: 'Open Source Contribution Sprint',
    region: 'Virtual',
    role: 'Open Source',
    skillFit: 'GitHub, PRs, docs, testing',
    benefit: 'High learning value with public visibility',
    rank: 'S'
  },
  {
    name: 'Student Research Workshop',
    region: 'Andhra Pradesh',
    role: 'Event Support',
    skillFit: 'Research writing, communication, support',
    benefit: 'Low-friction learning and visibility',
    rank: 'B'
  },
  {
    name: 'Data & AI Community Meet',
    region: 'Telangana',
    role: 'Community',
    skillFit: 'AI literacy, networking, presentations',
    benefit: 'Direct peer learning and practical exposure',
    rank: 'A'
  },
  {
    name: 'Local Developer Build Day',
    region: 'Bengaluru',
    role: 'Event Support',
    skillFit: 'Ops, logistics, community help',
    benefit: 'Useful for visibility and follow-up paths',
    rank: 'B'
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

  cardsGrid.innerHTML = filtered.map((event) => `
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
    </article>
  `).join('');

  const highPriority = opportunities.filter((event) => ['S', 'A'].includes(event.rank)).length;
  const volunteer = opportunities.filter((event) => event.role.toLowerCase().includes('volunteer') || event.role.toLowerCase().includes('support')).length;
  const virtual = opportunities.filter((event) => event.region === 'Virtual').length;

  totalEventsEl.textContent = String(opportunities.length);
  priorityCountEl.textContent = String(highPriority);
  volunteerCountEl.textContent = String(volunteer);
  virtualCountEl.textContent = String(virtual);
}

[regionFilter, rankFilter, typeFilter, searchInput].forEach((element) => {
  element.addEventListener('input', renderCards);
  element.addEventListener('change', renderCards);
});

renderCards();
