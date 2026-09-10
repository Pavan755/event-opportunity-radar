export type VerificationState =
  | 'verified_candidate'
  | 'needs_manual_verification'
  | 'needs_corroboration'
  | 'unknown';

export type LifecycleState =
  | 'new'
  | 'considering'
  | 'planned'
  | 'accepted'
  | 'attended'
  | 'follow_up'
  | 'contribution'
  | 'documented'
  | 'dismissed'
  | 'cancelled'
  | 'withdrawn';

export interface OpportunityRecord {
  discovery_id: string;
  opportunity_id: string;
  title: string;
  organizer: string;
  location: string;
  date_text: string;
  url: string | null;
  source_id: string;
  source_class: string;
  source_type: string;
  verification_status: VerificationState;
  summary: string;
  evidence_note: string;
  lifecycle_state: LifecycleState;
  categories: string[];
  discovered_at: string | null;
  event_start_date: string | null;
  event_end_date: string | null;
  application_deadline: string | null;
  date_status: 'verified' | 'predicted' | 'unknown';
  roles: OpportunityRole[];
  application_options: ApplicationOption[];
  contacts: OpportunityContacts;
  strategy: string[];
  prompts: string[];
  predictions: OpportunityPrediction;
}

export interface OpportunityRole { role: string; basis: string; confidence: 'high' | 'medium' | 'low'; }
export interface ApplicationOption { kind: string; label: string; url: string | null; email?: string | null; status: 'verified' | 'predicted'; }
export interface OpportunityContacts { organizer: string | null; email: string | null; url: string | null; links: string[]; }
export interface OpportunityPrediction { likely_next_step: string; confidence: 'high' | 'medium' | 'low'; basis: string; }

export interface OpportunityFilters {
  query: string;
  location: string;
  lifecycle: LifecycleState | 'all';
  sourceClass: string | 'all';
  verification: VerificationState | 'all';
}

export interface SourceRecord {
  id: string;
  type: string;
  class: string;
  enabled: boolean;
  discovery_only: boolean;
  can_verify: boolean;
  health: 'healthy' | 'warning' | 'unavailable' | 'unknown';
}
