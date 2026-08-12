/**
 * Opportunity Intelligence + Scoring Pipeline
 *
 * Production orchestration layer.
 *
 * Responsibilities:
 * - Consume completed discovery records.
 * - Enrich records with Opportunity Intelligence.
 * - Convert intelligence skill fields into the scoring skill interface.
 * - Score each enriched opportunity.
 * - Preserve the original discovery record.
 *
 * Non-responsibilities:
 * - No discovery.
 * - No web requests.
 * - No verification.
 * - No source mutation.
 */

/**
 * Create the intelligence + scoring pipeline model.
 */
function createOpportunityIntelligenceScoringPipelineModel(
  skillProfile,
  skillModel,
  scoringConfig
) {
  if (!skillProfile || !Array.isArray(skillProfile.skills)) {
    throw new Error(
      'Skill profile must contain a skills array.'
    );
  }

  if (!skillModel) {
    throw new Error(
      'Skill intelligence model is required.'
    );
  }

  if (!scoringConfig || !scoringConfig.ranking) {
    throw new Error(
      'Valid scoring configuration is required.'
    );
  }

  return {
    intelligence_model:
      createOpportunityIntelligenceModel(
        skillProfile,
        skillModel
      ),

    scoring_model:
      createOpportunityScoringModel(
        scoringConfig
      )
  };
}

/**
 * Enrich and score a single discovery record.
 */
function enrichAndScoreOpportunityRecord(
  record,
  skillProfile,
  skillModel,
  scoringModel
) {
  if (!record || typeof record !== 'object') {
    throw new Error(
      'Discovery record must be an object.'
    );
  }

  const enriched =
    enrichDiscoveryRecordWithOpportunityIntelligence(
      record,
      skillProfile,
      skillModel
    );

  const intelligence =
    enriched.intelligence || {};

  /*
   * Opportunity Intelligence stores skill results
   * in separate intelligence fields.
   *
   * Reconstruct only the fields required by
   * Opportunity Scoring. No evidence is invented.
   */
  const skillResult = {
    direct_matches:
      intelligence.direct_skill_matches || [],

    learning_matches:
      intelligence.learning_skill_matches || [],

    inferred_matches:
      intelligence.inferred_skill_matches || []
  };

  const scoring =
    scoreOpportunity(
      enriched,
      intelligence,
      skillResult,
      scoringModel
    );

  return {
    ...enriched,

    scoring: scoring
  };
}

/**
 * Enrich and score all completed discovery records.
 *
 * The original discovery records are preserved.
 */
function runOpportunityIntelligenceScoringPipeline(
  discoveryResult,
  skillProfile,
  skillModel,
  scoringConfig
) {
  if (!discoveryResult || typeof discoveryResult !== 'object') {
    throw new Error(
      'Discovery result is required.'
    );
  }

  if (!Array.isArray(discoveryResult.records)) {
    throw new Error(
      'Discovery result must contain a records array.'
    );
  }

  const model =
    createOpportunityIntelligenceScoringPipelineModel(
      skillProfile,
      skillModel,
      scoringConfig
    );

  const rankedRecords =
    discoveryResult.records.map(
      function(record) {
        return enrichAndScoreOpportunityRecord(
          record,
          skillProfile,
          skillModel,
          model.scoring_model
        );
      }
    );

  /*
   * Highest score first.
   *
   * Preserve stable ordering when scores are equal
   * by relying on the original array index.
   */
  rankedRecords.sort(
    function(a, b) {
      const scoreA =
        a &&
        a.scoring &&
        typeof a.scoring.score === 'number'
          ? a.scoring.score
          : 0;

      const scoreB =
        b &&
        b.scoring &&
        typeof b.scoring.score === 'number'
          ? b.scoring.score
          : 0;

      return scoreB - scoreA;
    }
  );

  return {
    selected_sources:
      discoveryResult.selected_sources || [],

    plans:
      discoveryResult.plans || [],

    records:
      discoveryResult.records,

    ranked_records:
      rankedRecords,

    intelligence_scoring: {
      intelligence_version:
        model.intelligence_model.version,

      scoring_version:
        model.scoring_model.version,

      record_count:
        rankedRecords.length,

      status: 'completed'
    },

    status:
      discoveryResult.status || 'completed'
  };
}
