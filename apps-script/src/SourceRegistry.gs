function createSourceRegistry() {
  return [
    {
      id: 'github',
      name: 'GitHub',
      type: 'github_repository',
      class: 'github',
      priority: 95,
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'official_web',
      name: 'Official Event Websites',
      type: 'official_event_website',
      class: 'official',
      priority: 100,
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'organizer_web',
      name: 'Organizer Websites',
      type: 'official_organizer_website',
      class: 'official',
      priority: 100,
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'event_platform',
      name: 'Event Platforms',
      type: 'event_platform',
      class: 'event_platform',
      priority: 70,
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'community',
      name: 'Community Sources',
      type: 'official_community_page',
      class: 'community',
      priority: 90,
      enabled: true,
      discovery_only: false,
      can_verify: true
    },
    {
      id: 'social',
      name: 'Social Media',
      type: 'organizer_social_post',
      class: 'social',
      priority: 60,
      enabled: true,
      discovery_only: true,
      can_verify: false
    },
    {
      id: 'aggregator',
      name: 'Aggregators',
      type: 'secondary_listing',
      class: 'aggregator',
      priority: 40,
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
        source.class
      )
    );

    if (!source.class || String(source.class).trim() === '') {
      throw new Error(
        'Source class is required: ' + source.id
      );
    }

    if (
      source.priority === undefined ||
      source.priority === null
    ) {
      throw new Error(
        'Source priority is required: ' + source.id
      );
    }

    if (source.discovery_only === true &&
        source.can_verify === true) {
      throw new Error(
        'Discovery-only source cannot have verification authority: ' +
        source.id
      );
    }
  });

  return true;
}
