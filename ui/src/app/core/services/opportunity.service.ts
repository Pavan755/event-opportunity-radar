import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  LifecycleState,
  OpportunityRecord,
  SourceRecord,
  VerificationState
} from '../models/opportunity.model';
import { LifecycleStoreService } from './lifecycle-store.service';
import { PromptGeneratorService } from './prompt-generator.service';

interface AgentLiteFile {
  opportunities?: AgentLiteOpportunity[];
}

interface AgentLiteOpportunity {
  id?: string;
  source_id?: string;
  title?: string;
  name?: string;
  organizer_name?: string;
  official_url?: string;
  url?: string;
  apply_url?: string | null;
  contact_url?: string | null;
  contact_email?: string | null;
  contact_links?: string[];
  source_class?: string;
  source_type?: string;
  verification_status?: VerificationState;
  summary?: string;
  evidence_note?: string;
  categories?: string[];
  discovered_at?: string;
  event_start_date?: string | null;
  event_end_date?: string | null;
  application_deadline?: string | null;
  date_status?: 'verified' | 'predicted' | 'unknown';
  roles?: OpportunityRecord['roles'];
  application_options?: OpportunityRecord['application_options'];
  contacts?: OpportunityRecord['contacts'];
  strategy?: string[];
  prompts?: string[];
  predictions?: OpportunityRecord['predictions'];
}

interface SourceConfigFile {
  sources?: SourceConfigRecord[];
}

interface SourceConfigRecord {
  id?: string;
  type?: string;
  class?: string;
  enabled?: boolean;
  discovery_only?: boolean;
  can_verify?: boolean;
}

@Injectable({ providedIn: 'root' })
export class OpportunityService {
  private readonly http = inject(HttpClient);
  private readonly lifecycleStore = inject(LifecycleStoreService);
  private readonly promptGenerator = inject(PromptGeneratorService);

  getOpportunities(): Observable<OpportunityRecord[]> {
    return this.http.get<AgentLiteFile>('data/event-agent-lite.json').pipe(
      map((file) => file.opportunities ?? []),
      map((records) => records.map((record) => this.toOpportunityRecord(record))),
    );
  }

  getOpportunity(opportunityId: string): Observable<OpportunityRecord | undefined> {
    return this.getOpportunities().pipe(
      map((records) => records.find((record) => record.opportunity_id === opportunityId))
    );
  }

  setLifecycleState(opportunityId: string, nextState: LifecycleState): boolean {
    return this.lifecycleStore.setState(opportunityId, nextState);
  }

  getAllowedTransitions(currentState: LifecycleState): LifecycleState[] {
    return this.lifecycleStore.getAllowedTransitions(currentState);
  }

  getSources(): Observable<SourceRecord[]> {
    return this.http.get<SourceConfigFile>('config/sources.json').pipe(
      map((file) => file.sources ?? []),
      map((sources) => sources.map((source) => this.toSourceRecord(source)))
    );
  }

  private toOpportunityRecord(raw: AgentLiteOpportunity): OpportunityRecord {
    const title = raw.name ?? raw.title ?? 'Untitled opportunity';
    const sourceClass = raw.source_class ?? 'unknown';
    const opportunityId = String(raw.id ?? title.toLowerCase().replace(/\s+/g, '-'));
    const lifecycle = this.lifecycleStore.getState(opportunityId);

    const mapped: OpportunityRecord = {
      discovery_id: `${raw.source_id ?? 'source'}:${opportunityId}`,
      opportunity_id: opportunityId,
      title,
      organizer: raw.organizer_name ?? 'Unknown organizer',
      location: this.deriveLocation(title),
      date_text: this.deriveDateText(raw.summary, raw.event_start_date, raw.event_end_date),
      url: raw.official_url ?? raw.url ?? null,
      source_id: raw.source_id ?? 'unknown-source',
      source_class: sourceClass,
      source_type: raw.source_type ?? 'unknown',
      verification_status: raw.verification_status ?? 'unknown',
      summary: raw.summary ?? 'No summary available.',
      evidence_note: raw.evidence_note ?? 'No evidence note available.',
      lifecycle_state: lifecycle,
      categories: raw.categories ?? [],
      discovered_at: raw.discovered_at ?? null
      ,event_start_date: raw.event_start_date ?? null
      ,event_end_date: raw.event_end_date ?? null
      ,application_deadline: raw.application_deadline ?? null
      ,date_status: raw.date_status ?? (raw.event_start_date || raw.event_end_date ? 'verified' : 'unknown')
      ,roles: raw.roles ?? [{ role: 'Participant and community contributor', basis: 'Organizer role is not explicit in the captured source.', confidence: 'low' }]
      ,application_options: raw.application_options ?? this.defaultApplicationOptions(raw)
      ,contacts: raw.contacts ?? { organizer: raw.organizer_name ?? null, email: raw.contact_email ?? null, url: raw.contact_url ?? null, links: raw.contact_links ?? [] }
      ,strategy: raw.strategy ?? this.defaultStrategy()
      ,prompts: raw.prompts ?? []
      ,predictions: raw.predictions ?? { likely_next_step: 'Confirm the organizer role before applying.', confidence: 'low', basis: 'Derived from available source metadata; organizer confirmation is required.' }
    };

    mapped.prompts = this.promptGenerator.generate(mapped).map((prompt) => prompt.text);
    return mapped;
  }

  private toSourceRecord(raw: SourceConfigRecord): SourceRecord {
    const sourceClass = raw.class ?? 'unknown';
    const enabled = raw.enabled !== false;
    const canVerify = raw.can_verify === true;

    return {
      id: raw.id ?? 'unknown-source',
      type: raw.type ?? 'unknown',
      class: sourceClass,
      enabled,
      discovery_only: raw.discovery_only === true,
      can_verify: canVerify,
      health: enabled ? (canVerify ? 'healthy' : 'warning') : 'unavailable'
    };
  }

  private deriveLocation(title: string): string {
    const value = title.toLowerCase();
    if (value.includes('hyderabad')) {
      return 'Hyderabad';
    }
    if (value.includes('bengaluru') || value.includes('bangalore')) {
      return 'Bengaluru';
    }
    if (value.includes('virtual') || value.includes('online')) {
      return 'Virtual';
    }
    return 'Regional / Mixed';
  }

  private deriveDateText(summary: string | undefined, start?: string | null, end?: string | null): string {
    if (start || end) return [start, end].filter(Boolean).join(' -> ');
    if (!summary) {
      return 'Date not specified';
    }
    const matched = summary.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b[^.]{0,40}/i);
    return matched ? matched[0].trim() : 'Check source for schedule';
  }

  private defaultApplicationOptions(raw: AgentLiteOpportunity): OpportunityRecord['application_options'] {
    const options: OpportunityRecord['application_options'] = [];
    if (raw.apply_url) options.push({ kind: 'official_application', label: 'Use the official application or registration route', url: raw.apply_url, status: 'verified' });
    if (raw.contact_url || raw.contact_email) options.push({ kind: 'organizer_outreach', label: 'Ask the organizer about volunteer or contributor openings', url: raw.contact_url ?? null, email: raw.contact_email ?? null, status: 'verified' });
    options.push({ kind: 'community_discovery', label: 'Check the source page for a role-specific call before acting', url: raw.url ?? null, status: 'predicted' });
    return options;
  }

  private defaultStrategy(): string[] { return ['Confirm the event window and role requirements from the source.', 'Choose one realistic contribution offer before contacting the organizer.', 'Use the application route first; use organizer outreach when no role form exists.', 'Follow up with evidence of attendance or contribution.']; }
}
