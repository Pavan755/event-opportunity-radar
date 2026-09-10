import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityRecord, VerificationState } from './core/models/opportunity.model';
import { OpportunityService } from './core/services/opportunity.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit, OnDestroy {
  private readonly opportunityService = inject(OpportunityService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  opportunities: OpportunityRecord[] = [];
  selected: OpportunityRecord | undefined;
  query = '';
  location = 'all';
  verification: VerificationState | 'all' = 'all';
  selectedPromptIndex = 0;
  contactSent = false;
  currentTime = '';
  private clockTimer?: ReturnType<typeof setInterval>;
  readonly locations = ['Hyderabad', 'Bengaluru', 'Virtual', 'Regional / Mixed'];

  ngOnInit(): void {
    this.updateClock();
    this.clockTimer = setInterval(() => this.updateClock(), 1000);
    this.opportunityService.getOpportunities().subscribe((records) => {
      this.opportunities = records;
      this.selected = records[0];
      this.changeDetector.markForCheck();
    });
  }

  ngOnDestroy(): void { if (this.clockTimer) clearInterval(this.clockTimer); }

  get filteredOpportunities(): OpportunityRecord[] {
    const normalizedQuery = this.query.trim().toLowerCase();
    return this.opportunities.filter((item) => {
      const searchable = `${item.title} ${item.organizer} ${item.summary} ${item.categories.join(' ')}`.toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesLocation = this.location === 'all' || item.location === this.location;
      const matchesVerification = this.verification === 'all' || item.verification_status === this.verification;
      return matchesQuery && matchesLocation && matchesVerification;
    });
  }

  get totalEvents(): number { return this.opportunities.length; }
  get actionReadyCount(): number { return this.opportunities.filter((item) => item.application_options.some((option) => option.status === 'verified')).length; }
  get verifiedCount(): number { return this.opportunities.filter((item) => item.verification_status === 'verified_candidate').length; }
  get virtualCount(): number { return this.opportunities.filter((item) => item.location === 'Virtual').length; }

  setQuery(event: Event): void { this.query = (event.target as HTMLInputElement).value; }
  setLocation(event: Event): void { this.location = (event.target as HTMLSelectElement).value; }
  setVerification(event: Event): void { this.verification = (event.target as HTMLSelectElement).value as VerificationState | 'all'; }
  clearFilters(): void { this.query = ''; this.location = 'all'; this.verification = 'all'; }
  selectOpportunity(opportunity: OpportunityRecord): void { this.selected = opportunity; }

  focusOpportunities(): void { document.getElementById('opportunity-heading')?.scrollIntoView({ behavior: 'smooth' }); }

  nextLifecycleLabel(item: OpportunityRecord): string {
    return this.opportunityService.getAllowedTransitions(item.lifecycle_state).length
      ? 'Change lifecycle'
      : 'Lifecycle complete';
  }

  changeLifecycle(item: OpportunityRecord, event: Event): void {
    const next = (event.target as HTMLSelectElement).value as OpportunityRecord['lifecycle_state'];
    if (!next || !this.opportunityService.setLifecycleState(item.opportunity_id, next)) return;
    item.lifecycle_state = next;
    this.selected = { ...item };
  }

  lifecycleOptions(item: OpportunityRecord): OpportunityRecord['lifecycle_state'][] {
    return [item.lifecycle_state, ...this.opportunityService.getAllowedTransitions(item.lifecycle_state)];
  }

  choosePrompt(index: number): void { this.selectedPromptIndex = index; }

  copyPrompt(prompt: string): void {
    void navigator.clipboard?.writeText(prompt);
  }

  submitContact(): void { this.contactSent = true; }

  private updateClock(): void { this.currentTime = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()); this.changeDetector.markForCheck(); }
}
