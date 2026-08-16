const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config', 'event-agent-sources.json');
const outputPath = path.join(__dirname, '..', 'data', 'event-agent-lite.json');

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function sanitizeText(value) {
  return decodeHtmlEntities(value)
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMeta(html, name) {
  const pattern = new RegExp(`(?:name|property)=['\"]${name}['\"][^>]*content=['\"]([^'\"]+)['\"]`, 'i');
  const match = html.match(pattern);
  return match ? sanitizeText(match[1]) : '';
}

function extractTitle(html) {
  const htmlTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const metaTitle = extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title');
  if (metaTitle) return sanitizeText(metaTitle);
  if (htmlTitle) return sanitizeText(htmlTitle[1]);
  return '';
}

function extractDescription(html) {
  const metaDescription = extractMeta(html, 'og:description') || extractMeta(html, 'description');
  if (metaDescription) return sanitizeText(metaDescription);

  const paragraphMatch = html.match(/<p[^>]*>([^<]{80,220})<\/p>/i);
  if (paragraphMatch) return sanitizeText(paragraphMatch[1]);

  return 'Public opportunity source discovered by Event Agent Lite.';
}

function extractOrganizerName(html, fallbackName) {
  const metaAuthor = extractMeta(html, 'author') || extractMeta(html, 'og:site_name');
  if (metaAuthor) return sanitizeText(metaAuthor);

  const nameTag = html.match(/<meta[^>]+name=['\"]author['\"][^>]+content=['\"]([^'\"]+)['\"]/i);
  if (nameTag) return sanitizeText(nameTag[1]);

  return fallbackName || 'Unknown organizer';
}

function normalizeAbsoluteUrl(baseUrl, candidate) {
  if (!candidate) return null;
  const trimmed = candidate.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;
  if (trimmed.startsWith('mailto:')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('//')) return 'https:' + trimmed;
  try {
    return new URL(trimmed, baseUrl).toString();
  } catch (error) {
    return trimmed;
  }
}

function looksLikeAssetUrl(url) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|pdf)(\?|#|$)/i.test(url);
}

function scoreLink(linkText, href, context) {
  const text = sanitizeText(linkText || '');
  const url = sanitizeText(href || '');
  const haystack = `${text} ${url}`.toLowerCase();
  let score = 0;

  if (/apply|register|volunteer|join|submit|signup|become|participate/i.test(haystack)) score += 25;
  if (/contact|support|team|organizer|about|reach|hello|mail|community/i.test(haystack)) score += 18;
  if (/deadline|last date|apply before|registration closes|submit before/i.test(haystack)) score += 12;
  if (/(apply|register)/i.test(url) && !/login|signin|account/i.test(url)) score += 20;
  if (/(contact|team|support|organizer|community)/i.test(url)) score += 12;
  if (/mailto:/i.test(url)) score += 30;
  if (/login|signin|account/i.test(url)) score -= 20;
  if (looksLikeAssetUrl(url)) score -= 100;
  if (context && context.toLowerCase().includes('volunteer') && /volunteer/i.test(haystack)) score += 10;

  return score;
}

function extractCandidateLinks(html, baseUrl) {
  const matches = [...html.matchAll(/<a\b[^>]*href=['\"]([^'\"]+)['\"][^>]*>(.*?)<\/a>/gi)];
  const result = {
    apply_links: [],
    contact_links: [],
    contact_email: null,
    deadline_text: null,
    best_apply_url: null,
    best_contact_url: null
  };

  const seen = new Set();

  for (const match of matches) {
    const href = match[1];
    const linkText = match[2] || '';
    const normalized = normalizeAbsoluteUrl(baseUrl, href);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);

    const score = scoreLink(linkText, normalized, html);
    if (score <= -80) continue;

    const lower = normalized.toLowerCase();
    if (lower.startsWith('mailto:')) {
      const email = normalized.replace(/^mailto:/i, '').trim();
      if (email && !result.contact_email) {
        result.contact_email = email;
      }
      continue;
    }

    if (looksLikeAssetUrl(normalized)) continue;

    if (score > 25 && /(apply|register|volunteer|join|submit|signup|become|participate)/i.test(`${linkText} ${normalized}`)) {
      result.apply_links.push({ url: normalized, score, text: sanitizeText(linkText) });
    }

    if (score > 18 && /(contact|support|team|about|hello|reach|mail|community|organizer)/i.test(`${linkText} ${normalized}`)) {
      result.contact_links.push({ url: normalized, score, text: sanitizeText(linkText) });
    }

    if (/(deadline|last date|apply before|registration closes|submit before|registrations close)/i.test(`${linkText} ${normalized}`)) {
      result.deadline_text = sanitizeText(linkText || normalized) || result.deadline_text;
    }
  }

  if (result.apply_links.length > 0) {
    result.apply_links.sort((a, b) => b.score - a.score);
    result.best_apply_url = result.apply_links[0].url;
  }

  if (result.contact_links.length > 0) {
    result.contact_links.sort((a, b) => b.score - a.score);
    result.best_contact_url = result.contact_links[0].url;
  }

  return result;
}

async function fetchSource(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'EventAgentLite/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

async function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const discovered = [];

  for (const source of config.sources) {
    try {
      const html = await fetchSource(source.url);
      const title = extractTitle(html) || source.name;
      const description = extractDescription(html);
      const links = extractCandidateLinks(html, source.url);
      const organizerName = extractOrganizerName(html, source.name);
      const officialCandidate = links.best_apply_url || null;
      const contactCandidate = links.best_contact_url || null;

      const verificationStatus = source.verify
        ? (officialCandidate || links.contact_email || contactCandidate ? 'verified_candidate' : 'needs_manual_verification')
        : 'needs_corroboration';

      discovered.push({
        id: source.id,
        source_id: source.id,
        name: source.name,
        title,
        official_url: source.url,
        apply_url: officialCandidate,
        contact_url: contactCandidate,
        contact_email: links.contact_email || null,
        organizer_name: organizerName,
        contact_links: links.contact_links.slice(0, 5).map((item) => item.url),
        deadline_text: links.deadline_text || null,
        url: source.url,
        source_class: source.class,
        source_type: source.type,
        priority: source.priority,
        verification_status: verificationStatus,
        value_score: Math.min(99, source.priority + (officialCandidate ? 10 : 0) + (links.contact_email ? 4 : 0) + (source.verify ? 8 : 2)),
        summary: description,
        categories: source.category || [],
        discovered_at: new Date().toISOString(),
        status: verificationStatus,
        evidence_note: source.verify
          ? (officialCandidate
            ? 'Verified candidate: an official apply/register link and/or valid contact path were detected on the source page.'
            : 'Official source found; action links were not confirmed enough for a real application path yet.')
          : 'Social or community source detected; action links require manual verification before use.'
      });
    } catch (error) {
      discovered.push({
        id: source.id,
        source_id: source.id,
        name: source.name,
        official_url: source.url,
        apply_url: null,
        contact_url: null,
        contact_email: null,
        organizer_name: source.name,
        contact_links: [],
        deadline_text: null,
        url: source.url,
        source_class: source.class,
        source_type: source.type,
        priority: source.priority,
        verification_status: 'error',
        value_score: 0,
        summary: `Fetch failed: ${error.message}`,
        categories: source.category || [],
        discovered_at: new Date().toISOString(),
        status: 'error',
        evidence_note: 'Could not retrieve source page; no verified application or contact link available yet.'
      });
    }
  }

  const output = {
    generated_at: new Date().toISOString(),
    agent: config.agent,
    version: config.version,
    total_sources: config.sources.length,
    total_records: discovered.length,
    opportunities: discovered
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log('EVENT AGENT LITE: DISCOVERY RUN COMPLETE');
  console.log(`Processed ${discovered.length} sources.`);
  discovered.forEach((entry) => {
    console.log(`${entry.name} | ${entry.status} | ${entry.priority}`);
  });
}

main().catch((error) => {
  console.error('EVENT AGENT LITE FAILED');
  console.error(error);
  process.exit(1);
});
