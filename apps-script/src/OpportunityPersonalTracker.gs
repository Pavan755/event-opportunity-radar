const OPPORTUNITY_PERSONAL_TRACKER_STORAGE_KEY = 'opportunity_personal_tracker';

function createOpportunityPersonalTracker(initialItems) {
  const items = Array.isArray(initialItems) ? initialItems.slice() : [];

  const ensureUniqueDiscoveryId = function(entry) {
    if (!entry || !entry.discovery_id) {
      throw new Error('A personal tracker entry requires discovery_id.');
    }

    const exists = items.some(function(item) {
      return item.discovery_id === entry.discovery_id;
    });

    if (exists) {
      return false;
    }

    return true;
  };

  const normalizeEntry = function(entry) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('A personal tracker entry must be an object.');
    }

    return {
      discovery_id: String(entry.discovery_id),
      title: entry.title || 'Untitled opportunity',
      region: entry.region || 'Unspecified',
      type: entry.type || 'General',
      priority: entry.priority || 'B',
      status: entry.status || 'shortlisted',
      notes: entry.notes || '',
      updated_at: entry.updated_at || new Date().toISOString()
    };
  };

  return {
    list: function() {
      return items.slice();
    },

    add: function(entry) {
      const nextEntry = normalizeEntry(entry);
      if (!ensureUniqueDiscoveryId(nextEntry)) {
        return null;
      }

      items.push(nextEntry);
      return nextEntry;
    },

    update: function(discoveryId, patch) {
      const index = items.findIndex(function(item) {
        return item.discovery_id === String(discoveryId);
      });

      if (index === -1) {
        return null;
      }

      const nextEntry = {
        ...items[index],
        ...patch,
        discovery_id: String(discoveryId),
        updated_at: new Date().toISOString()
      };

      items[index] = nextEntry;
      return nextEntry;
    },

    remove: function(discoveryId) {
      const index = items.findIndex(function(item) {
        return item.discovery_id === String(discoveryId);
      });

      if (index === -1) {
        return false;
      }

      items.splice(index, 1);
      return true;
    },

    byRegion: function(region) {
      return items.filter(function(item) {
        return item.region === region;
      });
    },

    byStatus: function(status) {
      return items.filter(function(item) {
        return item.status === status;
      });
    },

    summaryByRegion: function() {
      return items.reduce(function(summary, item) {
        if (!summary[item.region]) {
          summary[item.region] = 0;
        }
        summary[item.region] += 1;
        return summary;
      }, {});
    },

    persistsToStorage: function(storage) {
      if (!storage || typeof storage.setItem !== 'function') {
        throw new Error('Storage adapter is required.');
      }

      storage.setItem(OPPORTUNITY_PERSONAL_TRACKER_STORAGE_KEY, JSON.stringify(items));
      return items.slice();
    },

    restoreFromStorage: function(storage) {
      if (!storage || typeof storage.getItem !== 'function') {
        throw new Error('Storage adapter is required.');
      }

      const raw = storage.getItem(OPPORTUNITY_PERSONAL_TRACKER_STORAGE_KEY);
      if (!raw) {
        return items.slice();
      }

      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          return items.slice();
        }

        items.length = 0;
        parsed.forEach(function(entry) {
          items.push(normalizeEntry(entry));
        });
        return items.slice();
      } catch (error) {
        return items.slice();
      }
    }
  };
}
