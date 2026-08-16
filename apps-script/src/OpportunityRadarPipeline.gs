/**
 * Event Opportunity Radar - Production Opportunity Pipeline
 *
 * Composition layer between:
 *
 *   Discovery Pipeline
 *        ->
 *   Opportunity Intelligence + Scoring Pipeline
 *
 * Responsibilities:
 * - Execute the existing discovery pipeline.
 * - Pass its completed result into intelligence + scoring.
 * - Preserve the discovery result.
 * - Return ranked opportunities.
 *
 * Non-responsibilities:
 * - No discovery implementation.
 * - No web requests.
 * - No verification.
 * - No source mutation.
 * - No scoring logic.
 * - No intelligence logic.
 */

/**
 * Run the complete opportunity radar pipeline.
 *
 * @param {Array} queries
 * @param {Array} sources
 * @param {Array} healthRecords
 * @param {Array} adapters
 * @param {Object} policy
 * @param {Object} skillProfile
 * @param {Object} skillModel
 * @param {Object} scoringConfig
 *
 * @return {Object} completed discovery + intelligence + scoring result
 */
function runOpportunityRadarPipeline(
  queries,
  sources,
  healthRecords,
  adapters,
  policy,
  skillProfile,
  skillModel,
  scoringConfig
) {
  const discoveryResult =
    runDiscoveryPipeline(
      queries,
      sources,
      healthRecords,
      adapters,
      policy
    );

  if (
    !discoveryResult ||
    typeof discoveryResult !== 'object'
  ) {
    throw new Error(
      'Discovery pipeline returned an invalid result.'
    );
  }

  if (
    !Array.isArray(discoveryResult.records)
  ) {
    throw new Error(
      'Discovery pipeline result must contain records.'
    );
  }

  const identityRecords =
    attachOpportunityIdentities(
      discoveryResult.records
    );

  const lifecycleAwareRecords =
    attachOpportunityLifecycles(
      identityRecords
    );


  const lifecycleAwareDiscoveryResult = {
    ...discoveryResult,
    records: lifecycleAwareRecords
  };

  const rankedResult =
    runOpportunityIntelligenceScoringPipeline(
      lifecycleAwareDiscoveryResult,
      skillProfile,
      skillModel,
      scoringConfig
    );

  if (
    !rankedResult ||
    typeof rankedResult !== 'object'
  ) {
    throw new Error(
      'Opportunity intelligence + scoring pipeline returned an invalid result.'
    );
  }

  if (
    !Array.isArray(rankedResult.records)
  ) {
    throw new Error(
      'Ranked pipeline result must preserve discovery records.'
    );
  }

  if (
    !Array.isArray(rankedResult.ranked_records)
  ) {
    throw new Error(
      'Ranked pipeline result must contain ranked_records.'
    );
  }

  return rankedResult;
}
