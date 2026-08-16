const opportunities = [
  {
    name: 'Hyderabad AI Meetup',
    region: 'Telangana',
    role: 'Technical Volunteer',
    skillFit: 'Python, AI/ML, community support',
    benefit: 'Strong networking and technical learning',
    rank: 'A'
  },
  {
    name: 'Bengaluru Tech Week',
    region: 'Bengaluru',
    role: 'Volunteer',
    skillFit: 'Event support, documentation, operations',
    benefit: 'High networking and volunteer access',
    rank: 'S'
  },
  {
    name: 'Vizag AI Community Session',
    region: 'Andhra Pradesh',
    role: 'Community Support',
    skillFit: 'Documentation, social media, event support',
    benefit: 'Local network and learning exposure',
    rank: 'A'
  },
  {
    name: 'Hackathon Volunteer Program',
    region: 'Virtual',
    role: 'Hackathon',
    skillFit: 'GitHub, docs, technical support',
    benefit: 'Good for build + network path',
    rank: 'A'
  },
  {
    name: 'Open Source Contribution Sprint',
    region: 'Virtual',
    role: 'Open Source',
    skillFit: 'GitHub, documentation, testing',
    benefit: 'Great portfolio and community path',
    rank: 'S'
  },
  {
    name: 'Student Research Workshop',
    region: 'Andhra Pradesh',
    role: 'Event Support',
    skillFit: 'Research docs, communication, support',
    benefit: 'Learning and exposure with low friction',
    rank: 'B'
  }
];

const tbody = document.getElementById('eventTableBody');
const totalEventsEl = document.getElementById('totalEvents');
const priorityCountEl = document.getElementById('priorityCount');
const volunteerCountEl = document.getElementById('volunteerCount');
const virtualCountEl = document.getElementById('virtualCount');

const regionFilter = document.getElementById('regionFilter');
const rankFilter = document.getElementById('rankFilter');
const typeFilter = document.getElementById('typeFilter');
const searchInput = document.getElementById('searchInput');

function renderTable() {
  const regionValue = regionFilter.value;
  const rankValue = rankFilter.value;
  const typeValue = typeFilter.value;
  const searchValue = searchInput.value.trim().toLowerCase();

  const filtered = opportunities.filter((event) => {
    const matchesRegion = regionValue === 'all' || event.region === regionValue;
    const matchesRank = rankValue === 'all' || event.rank === rankValue;
    const matchesType = typeValue === 'all' || event.role === typeValue;
    const searchText = [event.name, event.skillFit, event.benefit].join(' ').toLowerCase();
    const matchesSearch = !searchValue || searchText.includes(searchValue);

    return matchesRegion && matchesRank && matchesType && matchesSearch;
  });

  tbody.innerHTML = filtered
    .map((event) => {
      return `
        <tr>
          <td>${event.name}</td>
          <td>${event.region}</td>
          <td>${event.role}</td>
          <td>${event.skillFit}</td>
          <td>${event.benefit}</td>
          <td><span class="rank-badge rank-${event.rank}">${event.rank}</span></td>
        </tr>
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

[regionFilter, rankFilter, typeFilter, searchInput].forEach((element) => {
  element.addEventListener('input', renderTable);
  element.addEventListener('change', renderTable);
});

renderTable();
