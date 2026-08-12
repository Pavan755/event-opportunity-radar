function runSourceRegistryContractTest() {
  const registry = createSourceRegistry();

  if (!Array.isArray(registry)) {
    throw new Error(
      'Source registry must return an array.'
    );
  }

  if (registry.length !== 7) {
    throw new Error(
      'Expected 7 registered source classes.'
    );
  }

  const github = registry.find(function(source) {
    return source.id === 'github';
  });

  if (!github) {
    throw new Error(
      'GitHub source was not registered.'
    );
  }

  if (github.type !== 'github_repository') {
    throw new Error(
      'GitHub source type is incorrect.'
    );
  }

  if (github.class !== 'github') {
    throw new Error(
      'GitHub source class is incorrect.'
    );
  }

  if (github.priority !== 95) {
    throw new Error(
      'GitHub source priority must be 95.'
    );
  }

  if (github.source_class !== undefined) {
    throw new Error(
      'Legacy source_class field must not be used.'
    );
  }

  if (github.enabled !== true) {
    throw new Error(
      'GitHub source must be enabled.'
    );
  }

  if (github.discovery_only !== false) {
    throw new Error(
      'GitHub must not be discovery-only.'
    );
  }

  if (github.can_verify !== true) {
    throw new Error(
      'GitHub must have verification authority.'
    );
  }

  const social = registry.find(function(source) {
    return source.id === 'social';
  });

  if (!social) {
    throw new Error(
      'Social source was not registered.'
    );
  }

  if (social.class !== 'social') {
    throw new Error(
      'Social source class is incorrect.'
    );
  }

  if (social.priority !== 60) {
    throw new Error(
      'Social source priority is incorrect.'
    );
  }

  if (social.discovery_only !== true) {
    throw new Error(
      'Social source must remain discovery-only.'
    );
  }

  if (social.can_verify !== false) {
    throw new Error(
      'Social source must not have verification authority.'
    );
  }

  if (!validateSourceRegistry(registry)) {
    throw new Error(
      'Source registry validation failed.'
    );
  }

  console.log('REGISTRY CREATION: PASSED');
  console.log('GITHUB CLASS: PASSED');
  console.log('GITHUB PRIORITY: PASSED');
  console.log('GITHUB VERIFICATION AUTHORITY: PASSED');
  console.log('LEGACY FIELD REMOVED: PASSED');
  console.log('SOCIAL DISCOVERY-ONLY POLICY: PASSED');
  console.log('REGISTRY VALIDATION: PASSED');
  console.log('STEP 6B.22 TEST: PASSED');
}
