function createAppsScriptHttpClient() {
  return createHttpClient(
    function(url, options) {
      if (!url || String(url).trim() === '') {
        throw new Error('URL is required.');
      }

      const requestOptions = options || {};

      const response =
        UrlFetchApp.fetch(
          String(url),
          requestOptions
        );

      const headers =
        response.getAllHeaders();

      let contentType = null;

      if (headers) {
        contentType =
          headers['Content-Type'] ||
          headers['content-type'] ||
          null;
      }

      return {
        status_code: response.getResponseCode(),

        content_type:
          contentType == null
            ? null
            : String(contentType),

        body: response.getContentText(),

        url: String(url),

        fetched_at:
          new Date().toISOString()
      };
    }
  );
}
