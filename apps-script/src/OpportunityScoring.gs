/**
 * Opportunity Scoring Engine
 *
 * Pure evaluation layer.
 *
 * Responsibilities:
 * - Score an already-discovered opportunity.
 * - Consume existing scoring configuration.
 * - Use Opportunity Intelligence / Skill Intelligence outputs.
 * - Produce transparent score components and explanations.
 *
 * Non-responsibilities:
 * - No web requests.
 * - No discovery.
 * - No verification.
 * - No automatic publishing.
 * - No modification of the source opportunity.
 */

function createOpportunityScoringModel(scoringConfig) {
  if (!scoringConfig || !scoringConfig.ranking) {
    throw new Error('Valid scoring configuration is required.');
  }

  return {
    version: scoringConfig.version || 'unknown',
    ranking: scoringConfig.ranking,
    penalties: scoringConfig.penalties || {},
    rank_thresholds: scoringConfig.rank_thresholds || {},
    special_rules: scoringConfig.special_rules || {}
  };
}


function scoreOpportunity(opportunity, intelligence, skillResult, scoringModel) {
  if (!opportunity) {
    throw new Error('Opportunity is required.');
  }

  const model = scoringModel || createOpportunityScoringModel({
    version: '1.0.0',
    ranking: {},
    penalties: {},
    rank_thresholds: { S: 85, A: 70, B: 55, C: 40, D: 0 },
    special_rules: {}
  });

  const safeIntelligence = intelligence || {};
  const safeSkillResult = skillResult || {};

  const components = {
    learning_value: calculateLearningValue(
      safeIntelligence,
      model
    ),

    contribution_value: calculateContributionValue(
      safeIntelligence,
      safeSkillResult,
      model
    ),

    networking_value: calculateNetworkingValue(
      safeIntelligence,
      model
    ),

    career_value: calculateCareerValue(
      opportunity,
      safeIntelligence,
      safeSkillResult,
      model
    ),

    portfolio_value: calculatePortfolioValue(
      safeIntelligence,
      safeSkillResult,
      model
    ),

    access_value: calculateAccessValue(
      opportunity,
      safeIntelligence,
      model
    ),

    financial_value: calculateFinancialValue(
      opportunity,
      safeIntelligence,
      model
    )
  };

  const weightedBaseScore = calculateWeightedBaseScore(
    components,
    model.ranking
  );

  const penalties = calculatePenalties(
    opportunity,
    safeIntelligence,
    model
  );

  const bonuses = calculateBonuses(
    opportunity,
    safeIntelligence,
    safeSkillResult,
    model
  );

  const finalScore = clampScore(
    weightedBaseScore -
    penalties.total +
    bonuses.total
  );

  return {
    score_version: model.version,

    score: finalScore,

    rank: determineOpportunityRank(
      finalScore,
      model.rank_thresholds
    ),

    base_score: roundScore(weightedBaseScore),

    components: components,

    penalties: penalties,

    bonuses: bonuses,

    explanation: buildScoreExplanation(
      components,
      penalties,
      bonuses,
      finalScore
    )
  };
}


function calculateLearningValue(intelligence, model) {
  let score = 0;

  const learningSignals =
    Array.isArray(intelligence.learning_signals)
      ? intelligence.learning_signals
      : [];

  const learningMatches =
    intelligence.skill_matches &&
    Array.isArray(intelligence.skill_matches.learning)
      ? intelligence.skill_matches.learning
      : [];

  if (learningSignals.length > 0) {
    score += 0.45;
  }

  if (learningMatches.length > 0) {
    score += 0.30;
  }

  if (
    intelligence.opportunity_types &&
    Array.isArray(intelligence.opportunity_types) &&
    intelligence.opportunity_types.length > 0
  ) {
    score += 0.10;
  }

  if (
    intelligence.research_signals &&
    Array.isArray(intelligence.research_signals) &&
    intelligence.research_signals.length > 0
  ) {
    score += 0.15;
  }

  return clampUnit(score);
}


function calculateContributionValue(
  intelligence,
  skillResult,
  model
) {
  let score = 0;

  const contributionTypes =
    Array.isArray(intelligence.contribution_types)
      ? intelligence.contribution_types
      : [];

  const directMatches =
    Array.isArray(skillResult.direct_matches)
      ? skillResult.direct_matches
      : [];

  const inferredMatches =
    Array.isArray(skillResult.inferred_matches)
      ? skillResult.inferred_matches
      : [];

  if (contributionTypes.length > 0) {
    score += 0.50;
  }

  if (directMatches.length > 0) {
    score += 0.35;
  }

  if (inferredMatches.length > 0) {
    score += 0.15;
  }

  return clampUnit(score);
}


function calculateNetworkingValue(
  intelligence,
  model
) {
  const signals =
    Array.isArray(intelligence.networking_signals)
      ? intelligence.networking_signals
      : [];

  if (signals.length >= 3) {
    return 1.0;
  }

  if (signals.length === 2) {
    return 0.85;
  }

  if (signals.length === 1) {
    return 0.65;
  }

  return 0.20;
}


function calculateCareerValue(
  opportunity,
  intelligence,
  skillResult,
  model
) {
  let score = 0;

  const types =
    Array.isArray(intelligence.opportunity_types)
      ? intelligence.opportunity_types
      : [];

  const directMatches =
    Array.isArray(skillResult.direct_matches)
      ? skillResult.direct_matches
      : [];

  if (directMatches.length > 0) {
    score += 0.40;
  }

  if (types.some(function(type) {
    return [
      'conference',
      'research',
      'hackathon',
      'open_source',
      'workshop',
      'competition',
      'professional'
    ].indexOf(type) !== -1;
  })) {
    score += 0.30;
  }

  if (
    intelligence.career_signals &&
    Array.isArray(intelligence.career_signals) &&
    intelligence.career_signals.length > 0
  ) {
    score += 0.30;
  }

  return clampUnit(score);
}


function calculatePortfolioValue(
  intelligence,
  skillResult,
  model
) {
  let score = 0;

  const contributions =
    Array.isArray(intelligence.contribution_types)
      ? intelligence.contribution_types
      : [];

  const directMatches =
    Array.isArray(skillResult.direct_matches)
      ? skillResult.direct_matches
      : [];

  if (contributions.length > 0) {
    score += 0.45;
  }

  if (directMatches.length > 0) {
    score += 0.30;
  }

  if (
    contributions.indexOf('documentation') !== -1 ||
    contributions.indexOf('software_development') !== -1 ||
    contributions.indexOf('video_editing') !== -1 ||
    contributions.indexOf('videography') !== -1 ||
    contributions.indexOf('poster_design') !== -1
  ) {
    score += 0.25;
  }

  return clampUnit(score);
}


function calculateAccessValue(
  opportunity,
  intelligence,
  model
) {
  const text =
    normalizeScoreText(
      [
        opportunity.title,
        opportunity.description,
        opportunity.raw_text,
        opportunity.access,
        opportunity.registration
      ].join(' ')
    );

  if (
    containsScoreTerm(text, [
      'free',
      'free registration',
      'free entry',
      'no fee',
      'no registration fee'
    ])
  ) {
    return 1.0;
  }

  if (
    containsScoreTerm(text, [
      'student pass',
      'student access',
      'subsidized',
      'subsidised'
    ])
  ) {
    return 0.75;
  }

  if (
    containsScoreTerm(text, [
      'paid',
      'ticket',
      'registration fee',
      'entry fee'
    ])
  ) {
    return 0.35;
  }

  return 0.50;
}


function calculateFinancialValue(
  opportunity,
  intelligence,
  model
) {
  const text =
    normalizeScoreText(
      [
        opportunity.title,
        opportunity.description,
        opportunity.raw_text,
        opportunity.stipend,
        opportunity.benefits
      ].join(' ')
    );

  if (
    containsScoreTerm(text, [
      'stipend',
      'paid volunteer',
      'honorarium',
      'travel reimbursement',
      'travel support',
      'accommodation provided'
    ])
  ) {
    return 1.0;
  }

  if (
    containsScoreTerm(text, [
      'free',
      'certificate',
      'networking'
    ])
  ) {
    return 0.50;
  }

  return 0.25;
}


function calculateWeightedBaseScore(
  components,
  ranking
) {
  let total = 0;

  Object.keys(ranking).forEach(function(key) {
    const weight = Number(ranking[key]) || 0;
    const value =
      components[key] !== undefined
        ? components[key]
        : 0;

    total += value * weight;
  });

  return total;
}


function calculatePenalties(
  opportunity,
  intelligence,
  model
) {
  const penalties = [];
  const text =
    normalizeScoreText(
      [
        opportunity.title,
        opportunity.description,
        opportunity.raw_text,
        opportunity.location,
        opportunity.access
      ].join(' ')
    );

  if (
    containsScoreTerm(text, [
      'unclear role',
      'role not specified',
      'details coming soon'
    ])
  ) {
    addPenalty(
      penalties,
      'unclear_role',
      model.penalties.unclear_role
    );
  }

  if (
    containsScoreTerm(text, [
      'long commute',
      'far from',
      'outstation travel required'
    ])
  ) {
    addPenalty(
      penalties,
      'high_commute_cost',
      model.penalties.high_commute_cost
    );
  }

  if (
    containsScoreTerm(text, [
      'pay to attend',
      'mandatory paid ticket',
      'registration fee'
    ]) &&
    !hasContributionRoute(intelligence)
  ) {
    addPenalty(
      penalties,
      'pay_to_attend_without_contribution_route',
      model.penalties.pay_to_attend_without_contribution_route
    );
  }

  if (
    intelligence.verification &&
    intelligence.verification.verified === false
  ) {
    addPenalty(
      penalties,
      'unverified_benefit',
      model.penalties.unverified_benefit
    );
  }

  if (
    intelligence.authority &&
    intelligence.authority.status === 'suspicious'
  ) {
    addPenalty(
      penalties,
      'suspicious_or_unverified_organizer',
      model.penalties.suspicious_or_unverified_organizer
    );
  }

  return {
    total: penalties.reduce(
      function(sum, item) {
        return sum + item.amount;
      },
      0
    ),
    items: penalties
  };
}


function calculateBonuses(
  opportunity,
  intelligence,
  skillResult,
  model
) {
  const bonuses = [];

  const types =
    Array.isArray(intelligence.opportunity_types)
      ? intelligence.opportunity_types
      : [];

  const contributions =
    Array.isArray(intelligence.contribution_types)
      ? intelligence.contribution_types
      : [];

  if (
    model.special_rules.open_source_pathway_bonus === true &&
    (
      types.indexOf('open_source') !== -1 ||
      contributions.indexOf('open_source') !== -1
    )
  ) {
    bonuses.push({
      rule: 'open_source_pathway_bonus',
      amount: 5
    });
  }

  if (
    model.special_rules.hackathons_get_team_friendly_bonus === true &&
    types.indexOf('hackathon') !== -1 &&
    containsScoreTerm(
      normalizeScoreText(
        [
          opportunity.title,
          opportunity.description,
          opportunity.raw_text
        ].join(' ')
      ),
      [
        'team',
        'teams',
        'team friendly',
        'team-based'
      ]
    )
  ) {
    bonuses.push({
      rule: 'hackathon_team_friendly_bonus',
      amount: 3
    });
  }

  if (
    model.special_rules.solo_participant_friendly_bonus === true &&
    containsScoreTerm(
      normalizeScoreText(
        [
          opportunity.title,
          opportunity.description,
          opportunity.raw_text
        ].join(' ')
      ),
      [
        'solo',
        'individual',
        'individual participant',
        'no team required'
      ]
    )
  ) {
    bonuses.push({
      rule: 'solo_participant_friendly_bonus',
      amount: 3
    });
  }

  return {
    total: bonuses.reduce(
      function(sum, item) {
        return sum + item.amount;
      },
      0
    ),
    items: bonuses
  };
}


function determineOpportunityRank(
  score,
  thresholds
) {
  if (score >= Number(thresholds.S || 85)) {
    return 'S';
  }

  if (score >= Number(thresholds.A || 70)) {
    return 'A';
  }

  if (score >= Number(thresholds.B || 55)) {
    return 'B';
  }

  if (score >= Number(thresholds.C || 40)) {
    return 'C';
  }

  return 'D';
}


function buildScoreExplanation(
  components,
  penalties,
  bonuses,
  finalScore
) {
  const strengths = [];

  Object.keys(components).forEach(function(key) {
    if (components[key] >= 0.70) {
      strengths.push(key);
    }
  });

  return {
    final_score: roundScore(finalScore),
    strongest_factors: strengths,
    penalty_count: penalties.items.length,
    bonus_count: bonuses.items.length
  };
}


function addPenalty(
  penalties,
  rule,
  amount
) {
  const numericAmount = Number(amount) || 0;

  if (numericAmount > 0) {
    penalties.push({
      rule: rule,
      amount: numericAmount
    });
  }
}


function hasContributionRoute(intelligence) {
  return (
    Array.isArray(intelligence.contribution_types) &&
    intelligence.contribution_types.length > 0
  );
}


function containsScoreTerm(text, terms) {
  return terms.some(function(term) {
    return text.indexOf(
      String(term).toLowerCase()
    ) !== -1;
  });
}


function normalizeScoreText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}


function clampUnit(value) {
  return Math.max(
    0,
    Math.min(
      1,
      Number(value) || 0
    )
  );
}


function clampScore(value) {
  return Math.max(
    0,
    Math.min(
      100,
      Number(value) || 0
    )
  );
}


function roundScore(value) {
  return Math.round(
    (Number(value) || 0) * 100
  ) / 100;
}
