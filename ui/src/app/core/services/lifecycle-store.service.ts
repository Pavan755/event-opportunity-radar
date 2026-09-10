import { Injectable } from '@angular/core';
import { LifecycleState } from '../models/opportunity.model';

@Injectable({ providedIn: 'root' })
export class LifecycleStoreService {
  private readonly storageKey = 'opportunity-lifecycle-v1';

  private readonly transitionMap: Record<LifecycleState, LifecycleState[]> = {
    new: ['considering', 'dismissed'],
    considering: ['new', 'planned', 'accepted', 'dismissed', 'withdrawn'],
    planned: ['new', 'considering', 'accepted', 'attended', 'withdrawn', 'cancelled'],
    accepted: ['considering', 'planned', 'attended', 'withdrawn', 'cancelled'],
    attended: ['accepted', 'planned', 'follow_up', 'documented'],
    follow_up: ['attended', 'contribution', 'documented'],
    contribution: ['attended', 'follow_up', 'documented'],
    documented: [],
    dismissed: [],
    cancelled: [],
    withdrawn: []
  };

  getState(opportunityId: string): LifecycleState {
    const store = this.readStore();
    return store[opportunityId] ?? 'new';
  }

  setState(opportunityId: string, nextState: LifecycleState): boolean {
    const currentState = this.getState(opportunityId);
    if (!this.isValidTransition(currentState, nextState)) {
      return false;
    }

    const store = this.readStore();
    store[opportunityId] = nextState;
    localStorage.setItem(this.storageKey, JSON.stringify(store));
    return true;
  }

  getAllowedTransitions(state: LifecycleState): LifecycleState[] {
    return this.transitionMap[state];
  }

  isValidTransition(current: LifecycleState, next: LifecycleState): boolean {
    if (current === next) {
      return true;
    }
    return this.transitionMap[current].includes(next);
  }

  private readStore(): Record<string, LifecycleState> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw) as Record<string, LifecycleState>;
      return parsed ?? {};
    } catch {
      return {};
    }
  }
}
