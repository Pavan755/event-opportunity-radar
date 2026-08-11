function createSourceRegistry() {
  return [
    {
      id: 'github',
      name: 'GitHub',
      type: 'github_repository',
      source_class: 'github',
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'official_web',
      name: 'Official Event Websites',
      type: 'official_event_website',
      source_class: 'official',
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'organizer_web',
      name: 'Organizer Websites',
      type: 'official_organizer_website',
      source_class: 'official',
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'event_platform',
      name: 'Event Platforms',
      type: 'event_platform',
      source_class: 'event_platform',
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'community',
      name: 'Community Sources',
      type: 'official_community_page',
      source_class: 'community',
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'social',
      name: 'Social Media',
      type: 'organizer_social_post',
      source_class: 'social',
      enabled: true,
      discovery_only: true,
      can_verify: false
    },
    {
      id: 'aggregator',
      name: 'Aggregators',
      type: 'secondary_listing',
      source_class: 'aggregator',
      enabled: true,
      discovery_only: true,
      can_verify: false
    }
  ];
}

function validateSourceRegistry(registry) {
  if (!Array.isArray(registry)) {
    throw new Error('Source registry must be an array.');
  }

  if (registry.length === 0) {
    throw new Error('Source registry cannot be empty.');
  }

  registry.forEach(function(source) {
    validateSourceAdapter(
      createSourceAdapter(
        source.id,
        source.name,
        source.type,
        source.source_class
      )
    );

    if (source.discovery_only === true && source.can_verify === true) {
      throw new Error(
        'Discovery-only source cannot have verification authority: ' +
        source.id
      );
    }
  });

  return true;
}
