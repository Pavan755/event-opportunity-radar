function createGitHubRepositoryAdapter(sourceId, httpClient) {
  if (!sourceId || String(sourceId).trim() === '') {
    throw new Error('sourceId is required.');
  }

  if (!httpClient || typeof httpClient.fetch !== 'function') {
    throw new Error(
      'A valid HTTP client with fetch() is required.'
    );
  }

  return createExecutionAdapter(
    sourceId,
    function(plan) {
      if (!plan || !plan.query_text) {
        return {
          status: 'execution_invalid',
          records: [],
          error: 'Discovery plan is missing query_text.'
        };
      }

      const query = encodeURIComponent(
        String(plan.query_text).trim()
      );

      const url =
        'https://api.github.com/search/repositories' +
        '?q=' + query +
        '&per_page=10';

      const response = httpClient.fetch(
        url,
        {
          method: 'get',
          headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'event-opportunity-radar'
          },
          muteHttpExceptions: true
        }
      );

      if (!response || typeof response !== 'object') {
        return {
          status: 'execution_invalid',
          records: [],
          error: 'HTTP client returned an invalid response.'
        };
      }

      if (Number(response.status_code) < 200 ||
          Number(response.status_code) >= 300) {
        return {
          status: 'http_error',
          records: [],
          error:
            'GitHub API returned HTTP ' +
            response.status_code +
            '.'
        };
      }

      let payload;

      try {
        payload = JSON.parse(response.body || '{}');
      } catch (error) {
        return {
          status: 'execution_invalid',
          records: [],
          error: 'GitHub API returned invalid JSON.'
        };
      }

      if (!payload || !Array.isArray(payload.items)) {
        return {
          status: 'execution_invalid',
          records: [],
          error: 'GitHub API response does not contain items[].'
        };
      }

      const records = payload.items.map(function(item) {
        return {
          title: item.full_name || item.name || null,
          organizer: item.owner && item.owner.login
            ? item.owner.login
            : null,
          url: item.html_url || null,
          location: null,
          source_id: sourceId,
          query_id: plan.query_id,
          source_type: 'github_repository',
          raw_text: item.description || null,
          verification_status: 'unverified',
          status: 'discovered'
        };
      });

      return {
        status: 'executed',
        records: records,
        error: null
      };
    }
  );
}
