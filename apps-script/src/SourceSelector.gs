function selectUsableSources(sources, healthRecords, policy) {
  if (!Array.isArray(sources)) {
    throw new Error('Sources must be an array.');
  }

  const selected = [];

  sources.forEach(function(source) {
    if (!source || !source.id) {
      return;
    }

    if (isRegisteredSourceUsable(source, healthRecords, policy)) {
      selected.push(source);
    }
  });

  selected.sort(function(a, b) {
    const priorityA = Number(a.priority || 0);
    const priorityB = Number(b.priority || 0);

    return priorityB - priorityA;
  });

  return selected;
}

function selectSourcesByClass(sources, healthRecords, policy, sourceClass) {
  const selected = selectUsableSources(
    sources,
    healthRecords,
    policy
  );

  if (!sourceClass) {
    return selected;
  }

  return selected.filter(function(source) {
    return source.class === sourceClass;
  });
}
