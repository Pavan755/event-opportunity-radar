function normalizeHttpResponse(response) {
  if (!response || typeof response !== 'object') {
    throw new Error(
      'HTTP response must be an object.'
    );
  }

  const statusCode =
    Number(response.status_code);

  if (!Number.isFinite(statusCode)) {
    throw new Error(
      'HTTP response must contain a numeric status_code.'
    );
  }

  return {
    status_code: statusCode,

    content_type:
      response.content_type == null
        ? null
        : String(response.content_type),

    body:
      response.body == null
        ? ''
        : String(response.body),

    url:
      response.url == null
        ? null
        : String(response.url),

    fetched_at:
      response.fetched_at ||
      new Date().toISOString()
  };
}
