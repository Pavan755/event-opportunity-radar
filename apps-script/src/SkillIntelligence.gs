/**
 * Adaptive Skill Intelligence
 *
 * Converts explicit skills + evidence + related capabilities
 * into an adaptive capability model.
 *
 * IMPORTANT:
 * This is NOT reinforcement learning.
 * It is an evidence-weighted capability inference layer.
 *
 * Design principles:
 * 1. Explicit evidence outranks inference.
 * 2. Inferred capabilities never become verified automatically.
 * 3. Learning skills remain distinguishable from demonstrated skills.
 * 4. Related skills may improve opportunity matching.
 * 5. Compound capabilities may emerge from multiple skills.
 * 6. New skills can be discovered without editing the matcher.
 */

function createSkillIntelligenceModel(skillProfile) {
  if (!skillProfile || !Array.isArray(skillProfile.skills)) {
    throw new Error('A valid skill profile is required.');
  }

  const model = {
    version: '1.0.0',
    skill_profile_version: skillProfile.version || null,
    capabilities: [],
    relationships: [],
    inference_policy: {
      explicit_evidence_weight: 1.0,
      demonstrated_transfer_weight: 0.75,
      strong_related_skill_weight: 0.60,
      learning_related_skill_weight: 0.35,
      inferred_only_weight: 0.25,
      never_upgrade_without_evidence: true
    }
  };

  skillProfile.skills.forEach(function(skill) {
    model.capabilities.push(
      createExplicitCapability(skill)
    );
  });

  buildKnownSkillRelationships(
    skillProfile,
    model
  );

  return model;
}


function createExplicitCapability(skill) {
  const levelScores = {
    strong: 1.0,
    working: 0.8,
    basic: 0.55,
    learning: 0.35,
    planned: 0.15
  };

  const evidenceStrength =
    levelScores[skill.level] !== undefined
      ? levelScores[skill.level]
      : 0.15;

  return {
    id: skill.id,
    name: skill.name,
    source: 'explicit_profile',
    category: skill.category || 'general',
    level: skill.level || 'planned',
    confidence: evidenceStrength,
    verified: skill.level === 'strong' ||
              skill.level === 'working' ||
              skill.level === 'basic',
    learning: skill.level === 'learning',
    planned: skill.level === 'planned',
    aliases: Array.isArray(skill.aliases)
      ? skill.aliases.slice()
      : [],
    evidence: Array.isArray(skill.evidence)
      ? skill.evidence.slice()
      : [],
    contribution_types: Array.isArray(skill.contribution_types)
      ? skill.contribution_types.slice()
      : []
  };
}


function buildKnownSkillRelationships(
  skillProfile,
  model
) {
  const skills = skillProfile.skills;

  skills.forEach(function(source) {
    skills.forEach(function(target) {
      if (source.id === target.id) {
        return;
      }

      const relation = inferRelationship(
        source,
        target
      );

      if (relation) {
        model.relationships.push(relation);
      }
    });
  });
}


function inferRelationship(source, target) {
  const sourceTerms = collectSkillTerms(source);
  const targetTerms = collectSkillTerms(target);

  const sharedTerms = sourceTerms.filter(function(term) {
    return targetTerms.indexOf(term) !== -1;
  });

  const sameCategory =
    source.category &&
    target.category &&
    source.category === target.category;

  const sharedContributionTypes =
    intersectArrays(
      source.contribution_types || [],
      target.contribution_types || []
    );

  if (
    sharedTerms.length === 0 &&
    !sameCategory &&
    sharedContributionTypes.length === 0
  ) {
    return null;
  }

  let relationshipType = 'related';

  if (sharedTerms.length > 0) {
    relationshipType = 'semantic_related';
  } else if (sharedContributionTypes.length > 0) {
    relationshipType = 'transferable';
  } else if (sameCategory) {
    relationshipType = 'category_related';
  }

  let strength = 0.35;

  if (sharedTerms.length > 0) {
    strength += 0.25;
  }

  if (sameCategory) {
    strength += 0.15;
  }

  if (sharedContributionTypes.length > 0) {
    strength += 0.20;
  }

  return {
    from: source.id,
    to: target.id,
    type: relationshipType,
    strength: Math.min(strength, 0.95),
    shared_terms: sharedTerms,
    shared_contribution_types: sharedContributionTypes
  };
}


function inferOpportunityCapabilities(
  opportunity,
  skillProfile,
  intelligenceModel
) {
  if (!opportunity) {
    throw new Error('Opportunity is required.');
  }

  const text = normalizeSkillText(
    [
      opportunity.title,
      opportunity.description,
      opportunity.role,
      opportunity.requirements,
      opportunity.tags,
      opportunity.categories
    ]
      .filter(function(value) {
        return value !== undefined &&
               value !== null;
      })
      .join(' ')
  );

  const explicitMatches = [];
  const relatedMatches = [];
  const learningMatches = [];

  skillProfile.skills.forEach(function(skill) {
    const terms = collectSkillTerms(skill);

    const matched = terms.some(function(term) {
      return text.indexOf(
        normalizeSkillText(term)
      ) !== -1;
    });

    if (!matched) {
      return;
    }

    const capability = {
      skill_id: skill.id,
      skill_name: skill.name,
      level: skill.level,
      confidence: skillConfidence(skill),
      match_source: 'direct_text_match'
    };

    if (
      skill.level === 'strong' ||
      skill.level === 'working' ||
      skill.level === 'basic'
    ) {
      explicitMatches.push(capability);
    } else if (skill.level === 'learning') {
      learningMatches.push(capability);
    }
  });

  /*
   * Transfer inference:
   *
   * A demonstrated capability can make a related capability
   * relevant to an opportunity even when the related skill is
   * not explicitly named in the opportunity text.
   *
   * IMPORTANT:
   * Learning capabilities remain learning capabilities.
   * They are never promoted to verified expertise.
   */
  intelligenceModel.relationships.forEach(
    function(relation) {
      const sourceCapability =
        findCapability(
          intelligenceModel,
          relation.from
        );

      const targetCapability =
        findCapability(
          intelligenceModel,
          relation.to
        );

      if (!sourceCapability ||
          !targetCapability) {
        return;
      }

      if (
        sourceCapability.confidence < 0.55
      ) {
        return;
      }

      const targetSkill =
        skillProfile.skills.find(
          function(skill) {
            return skill.id === targetCapability.id;
          }
        );

      if (!targetSkill) {
        return;
      }

      /*
       * First determine whether the target capability is
       * explicitly mentioned.
       */
      const targetTerms =
        collectSkillTerms(targetSkill);

      const targetExplicitlyMentioned =
        targetTerms.some(
          function(term) {
            return text.indexOf(
              normalizeSkillText(term)
            ) !== -1;
          }
        );

      /*
       * Existing behavior:
       * explicitly requested related capabilities become
       * inferred matches unless they are learning skills.
       */
      if (targetExplicitlyMentioned) {
        const capability = {
          skill_id: targetCapability.id,
          skill_name: targetCapability.name,
          inherited_from: sourceCapability.id,
          level: targetSkill.level,
          confidence:
            sourceCapability.confidence *
            relation.strength *
            0.75,
          match_source: 'transfer_inference',
          relationship: relation.type
        };

        if (targetSkill.level === 'learning') {
          learningMatches.push(capability);
        } else if (
          targetSkill.level !== 'strong' &&
          targetSkill.level !== 'working' &&
          targetSkill.level !== 'basic'
        ) {
          relatedMatches.push(capability);
        }

        return;
      }

      /*
       * Learning-aware opportunity inference:
       *
       * If the target capability is something the user is
       * actively learning, a sufficiently strong relationship
       * from a demonstrated capability can identify it as a
       * learning opportunity.
       *
       * This is deliberately conservative:
       * - source must be demonstrated
       * - relationship must be meaningful
       * - target must explicitly be a learning skill
       */
      /*
       * Learning inference requires BOTH:
       *
       * 1. A meaningful relationship to a demonstrated skill.
       * 2. Target-specific evidence in the opportunity.
       *
       * Relationship strength alone is NOT sufficient.
       * This prevents every learning skill from being attached
       * to every opportunity.
       */
      if (
        targetSkill.level === 'learning' &&
        relation.strength >= 0.50 &&
        opportunityProvidesLearningEvidence(
          text,
          targetSkill
        )
      ) {
        learningMatches.push({
          skill_id: targetCapability.id,
          skill_name: targetCapability.name,
          inherited_from: sourceCapability.id,
          level: 'learning',
          confidence:
            sourceCapability.confidence *
            relation.strength *
            0.60,
          match_source: 'learning_transfer_inference',
          relationship: relation.type
        });
      }
    }
  );

  return {
    direct_matches: deduplicateCapabilities(
      explicitMatches
    ),
    learning_matches: deduplicateCapabilities(
      learningMatches
    ),
    inferred_matches: deduplicateCapabilities(
      relatedMatches
    ),
    total_direct_matches:
      explicitMatches.length,
    total_learning_matches:
      learningMatches.length,
    total_inferred_matches:
      relatedMatches.length
  };
}


/*
 * Determines whether an opportunity contains meaningful,
 * target-specific evidence for a learning capability.
 *
 * This deliberately ignores generic relationship strength.
 * A skill must have evidence in the actual opportunity.
 */
function opportunityProvidesLearningEvidence(
  opportunityText,
  skill
) {
  const text =
    normalizeSkillText(
      opportunityText || ''
    );

  const terms =
    collectSkillTerms(skill);

  /*
   * Strongest signal:
   * skill name or configured aliases.
   */
  const directMatch =
    terms.some(function(term) {
      const normalizedTerm =
        normalizeSkillText(term);

      return (
        normalizedTerm.length >= 3 &&
        text.indexOf(normalizedTerm) !== -1
      );
    });

  if (directMatch) {
    return true;
  }

  /*
   * Contribution types provide a secondary signal.
   *
   * Generic contribution labels are deliberately excluded
   * because they occur in too many unrelated opportunities.
   */
  const genericContributionTypes = [
    'development',
    'support',
    'technical_support',
    'community_support',
    'event_support',
    'documentation',
    'communication',
    'content',
    'design',
    'deployment',
    'presentations',
    'event_operations'
  ];

  const contributionTypes =
    Array.isArray(skill.contribution_types)
      ? skill.contribution_types
      : [];

  return contributionTypes.some(
    function(type) {
      const normalizedType =
        normalizeSkillText(type);

      if (
        normalizedType.length < 6 ||
        genericContributionTypes.indexOf(
          type
        ) !== -1
      ) {
        return false;
      }

      const readableType =
        normalizedType
          .replace(/_/g, ' ');

      return (
        text.indexOf(normalizedType) !== -1 ||
        text.indexOf(readableType) !== -1
      );
    }
  );
}


function skillConfidence(skill) {
  const scores = {
    strong: 1.0,
    working: 0.8,
    basic: 0.55,
    learning: 0.35,
    planned: 0.15
  };

  return scores[skill.level] !== undefined
    ? scores[skill.level]
    : 0.15;
}


function findCapability(model, id) {
  return model.capabilities.find(
    function(capability) {
      return capability.id === id;
    }
  ) || null;
}


function collectSkillTerms(skill) {
  const terms = [];

  if (skill.name) {
    terms.push(skill.name);
  }

  if (Array.isArray(skill.aliases)) {
    skill.aliases.forEach(function(alias) {
      terms.push(alias);
    });
  }

  return terms
    .filter(function(term) {
      return term !== undefined &&
             term !== null &&
             String(term).trim() !== '';
    })
    .map(function(term) {
      return String(term).toLowerCase().trim();
    });
}


function normalizeSkillText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-/ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}


function intersectArrays(a, b) {
  return a.filter(function(item) {
    return b.indexOf(item) !== -1;
  });
}


function deduplicateCapabilities(capabilities) {
  const seen = {};

  return capabilities.filter(
    function(capability) {
      const key = capability.skill_id;

      if (seen[key]) {
        return false;
      }

      seen[key] = true;
      return true;
    }
  );
}
