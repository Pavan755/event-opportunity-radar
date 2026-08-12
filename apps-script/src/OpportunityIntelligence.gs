/**
 * Opportunity Intelligence
 *
 * Enriches normalized discovery records with:
 * - broad opportunity classification
 * - skill intelligence
 * - learning signals
 * - contribution signals
 * - networking/career signals
 *
 * This layer does NOT verify factual claims.
 * Verification remains the responsibility of the evidence/verification layer.
 */

function createOpportunityIntelligenceModel(skillProfile, skillModel) {
  if (!skillProfile || !Array.isArray(skillProfile.skills)) {
    throw new Error('Skill profile must contain a skills array.');
  }

  if (!skillModel) {
    throw new Error('Skill intelligence model is required.');
  }

  return {
    version: '1.0.0',

    opportunity_types: [
      'conference',
      'workshop',
      'symposium',
      'seminar',
      'hackathon',
      'competition',
      'meetup',
      'career_fair',
      'research_event',
      'government_event',
      'government_program',
      'university_event',
      'cultural_event',
      'ngo_event',
      'volunteer_opportunity',
      'open_source_event',
      'community_event',
      'training',
      'fellowship',
      'other'
    ],

    skill_intelligence_enabled: true,
    learning_detection_enabled: true,
    contribution_detection_enabled: true,
    multi_category_detection_enabled: true
  };
}


function enrichDiscoveryRecordWithOpportunityIntelligence(
  record,
  skillProfile,
  skillModel
) {
  if (!record || typeof record !== 'object') {
    throw new Error('Discovery record must be an object.');
  }

  const model =
    createOpportunityIntelligenceModel(
      skillProfile,
      skillModel
    );

  const text = buildOpportunityIntelligenceText(record);

  const opportunity = {
    title: record.title || '',
    description: record.description || '',
    raw_text: record.raw_text || '',
    organizer: record.organizer || '',
    role: record.role || '',
    requirements: record.requirements || '',
    tags: record.tags || [],
    categories: record.categories || [],
    opportunity_type: record.opportunity_type || ''
  };

  const skillResult =
    inferOpportunityCapabilities(
      opportunity,
      skillProfile,
      skillModel
    );

  const classification =
    classifyOpportunityTypes(text);

  const contributionTypes =
    detectContributionTypes(text);

  const learningSignals =
    detectLearningSignals(text);

  const networkingSignals =
    detectNetworkingSignals(text);

  const careerSignals =
    detectCareerSignals(text);

  const openSourceSignals =
    detectOpenSourceSignals(text);

  return {
    ...record,

    intelligence: {
      version: model.version,

      opportunity_types:
        classification.types,

      classification_confidence:
        classification.confidence,

      direct_skill_matches:
        skillResult.direct_matches || [],

      learning_skill_matches:
        skillResult.learning_matches || [],

      inferred_skill_matches:
        skillResult.inferred_matches || [],

      contribution_types:
        contributionTypes,

      learning_signals:
        learningSignals,

      networking_signals:
        networkingSignals,

      career_signals:
        careerSignals,

      open_source_signals:
        openSourceSignals,

      skill_intelligence_evidence_policy:
        'inference_never_upgrades_verified_expertise'
    }
  };
}


function buildOpportunityIntelligenceText(record) {
  const values = [
    record.title,
    record.description,
    record.raw_text,
    record.organizer,
    record.role,
    record.requirements,
    record.location,
    record.opportunity_type
  ];

  if (Array.isArray(record.tags)) {
    values.push(record.tags.join(' '));
  }

  if (Array.isArray(record.categories)) {
    values.push(record.categories.join(' '));
  }

  return values
    .filter(function(value) {
      return value !== null &&
        value !== undefined &&
        String(value).trim() !== '';
    })
    .join(' ')
    .toLowerCase();
}


function classifyOpportunityTypes(text) {
  const rules = {
    conference: [
      'conference',
      'summit',
      'conclave',
      'convention'
    ],

    workshop: [
      'workshop',
      'hands-on workshop',
      'training workshop'
    ],

    symposium: [
      'symposium',
      'research symposium'
    ],

    seminar: [
      'seminar',
      'lecture',
      'talk'
    ],

    hackathon: [
      'hackathon',
      'hack day',
      'coding challenge'
    ],

    competition: [
      'competition',
      'contest',
      'challenge',
      'olympiad'
    ],

    meetup: [
      'meetup',
      'user group',
      'community meetup'
    ],

    career_fair: [
      'career fair',
      'job fair',
      'employment fair',
      'recruitment fair'
    ],

    research_event: [
      'research',
      'research symposium',
      'research conference',
      'scientific conference',
      'science symposium'
    ],

    government_event: [
      'government',
      'ministry',
      'department of',
      'public sector',
      'government conference',
      'government summit',
      'govt'
    ],

    government_program: [
      'government program',
      'government programme',
      'public program',
      'public programme',
      'national initiative',
      'government initiative'
    ],

    university_event: [
      'university',
      'college',
      'campus',
      'student conference',
      'student symposium'
    ],

    cultural_event: [
      'cultural festival',
      'cultural event',
      'arts festival',
      'heritage',
      'literary festival',
      'film festival'
    ],

    ngo_event: [
      'ngo',
      'non-governmental organization',
      'nonprofit',
      'non-profit',
      'social impact'
    ],

    volunteer_opportunity: [
      'volunteer',
      'volunteering',
      'volunteer opportunity',
      'event volunteer'
    ],

    open_source_event: [
      'open source',
      'opensource',
      'maintainer',
      'contributor',
      'good first issue',
      'help wanted'
    ],

    community_event: [
      'community event',
      'community program',
      'developer community',
      'tech community'
    ],

    training: [
      'training',
      'bootcamp',
      'course',
      'skill development'
    ],

    fellowship: [
      'fellowship',
      'fellows',
      'fellowship program'
    ]
  };

  const matches = [];

  Object.keys(rules).forEach(function(type) {
    if (containsAnyOpportunityTerm(text, rules[type])) {
      matches.push(type);
    }
  });

  if (matches.length === 0) {
    matches.push('other');
  }

  const confidence =
    matches.length === 1 && matches[0] === 'other'
      ? 0.2
      : Math.min(
          1,
          0.45 + (matches.length * 0.1)
        );

  return {
    types: matches,
    confidence: confidence
  };
}


function detectContributionTypes(text) {
  const rules = {
    technical_support: [
      'technical support',
      'developer support',
      'technical volunteer'
    ],

    software_development: [
      'developer',
      'software development',
      'coding',
      'frontend',
      'backend',
      'full stack'
    ],

    data_work: [
      'data analysis',
      'data science',
      'analytics',
      'dataset'
    ],

    documentation: [
      'documentation',
      'technical writing',
      'write documentation',
      'docs'
    ],

    event_planning: [
      'event planning',
      'planning committee',
      'event organization',
      'organizing team'
    ],

    event_coordination: [
      'event coordination',
      'coordinator',
      'coordination'
    ],

    videography: [
      'videography',
      'video coverage',
      'event video',
      'videographer'
    ],

    video_editing: [
      'video editing',
      'video editor',
      'editing videos',
      'post production'
    ],

    photography: [
      'photography',
      'event photography',
      'photographer'
    ],

    poster_design: [
      'poster design',
      'poster',
      'graphic design',
      'event creatives'
    ],

    social_media: [
      'social media',
      'social media content',
      'instagram',
      'linkedin content',
      'social promotion'
    ],

    outreach: [
      'outreach',
      'promotion',
      'community outreach',
      'participant outreach'
    ],

    registration_support: [
      'registration desk',
      'registration support',
      'check-in',
      'attendee registration'
    ],

    attendee_support: [
      'attendee support',
      'participant support',
      'help desk'
    ],

    public_speaking: [
      'speaker',
      'speaking',
      'presentation',
      'public speaking',
      'emcee',
      'moderator'
    ],

    community_support: [
      'community support',
      'community management',
      'community volunteer'
    ]
  };

  return detectMatchedTerms(text, rules);
}


function detectLearningSignals(text) {
  const rules = {
    hands_on_learning: [
      'hands-on',
      'practical session',
      'build',
      'workshop'
    ],

    technical_learning: [
      'learn',
      'training',
      'tutorial',
      'technical session'
    ],

    research_exposure: [
      'research',
      'research presentation',
      'paper presentation',
      'scientific'
    ],

    industry_exposure: [
      'industry',
      'industry experts',
      'professionals',
      'industry leaders'
    ],

    mentorship: [
      'mentor',
      'mentoring',
      'mentorship'
    ],

    community_learning: [
      'community',
      'knowledge sharing',
      'peer learning'
    ]
  };

  return detectMatchedTerms(text, rules);
}


function detectNetworkingSignals(text) {
  const rules = {
    networking: [
      'networking',
      'network',
      'meet professionals',
      'connect with professionals'
    ],

    speakers: [
      'speakers',
      'industry leaders',
      'experts',
      'guest speakers'
    ],

    community: [
      'community',
      'developer community',
      'student community'
    ],

    recruiters: [
      'recruiters',
      'recruitment',
      'hiring',
      'employers'
    ]
  };

  return detectMatchedTerms(text, rules);
}


function detectCareerSignals(text) {
  const rules = {
    hiring: [
      'hiring',
      'recruitment',
      'recruiter',
      'employer'
    ],

    internship: [
      'internship',
      'interns',
      'intern'
    ],

    jobs: [
      'job',
      'jobs',
      'career opportunity',
      'career'
    ],

    portfolio: [
      'portfolio',
      'project showcase',
      'showcase your work'
    ],

    certificate: [
      'certificate',
      'certification',
      'certificate of participation'
    ]
  };

  return detectMatchedTerms(text, rules);
}


function detectOpenSourceSignals(text) {
  const rules = {
    open_source: [
      'open source',
      'opensource'
    ],

    contribution: [
      'contributor',
      'contribution',
      'first contribution'
    ],

    beginner_issue: [
      'good first issue',
      'beginner friendly',
      'help wanted'
    ],

    documentation: [
      'documentation',
      'docs contribution'
    ],

    maintainership: [
      'maintainer',
      'maintainers'
    ]
  };

  return detectMatchedTerms(text, rules);
}


function detectMatchedTerms(text, rules) {
  const matches = [];

  Object.keys(rules).forEach(function(type) {
    if (containsAnyOpportunityTerm(text, rules[type])) {
      matches.push(type);
    }
  });

  return matches;
}


function containsAnyOpportunityTerm(text, terms) {
  return terms.some(function(term) {
    return text.indexOf(term.toLowerCase()) !== -1;
  });
}