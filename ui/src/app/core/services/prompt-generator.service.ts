import { Injectable } from '@angular/core';
import { OpportunityRecord } from '../models/opportunity.model';

export interface GuidedPrompt {
  label: string;
  purpose: string;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class PromptGeneratorService {
  generate(opportunity: OpportunityRecord): GuidedPrompt[] {
    const facts = [
      `Opportunity: ${opportunity.title}`,
      `Organizer: ${opportunity.organizer}`,
      `Location: ${opportunity.location}`,
      `Event window: ${opportunity.event_start_date || 'unknown'} to ${opportunity.event_end_date || 'unknown'}`,
      `Evidence status: ${opportunity.verification_status}`,
      `Source: ${opportunity.url || 'not available'}`
    ].join('\n');

    return [
      this.prompt('Apply clearly', 'Build a concise application from verified facts only', `Help me prepare a concise application for this opportunity. Do not invent dates, roles, experience, benefits, or requirements. Separate verified facts from questions I should confirm.\n\n${facts}`),
      this.prompt('Contact the organizer', 'Write a respectful first message', `Write a short organizer message asking whether volunteer or contributor positions are available. Offer one realistic contribution, avoid overclaiming, and include 2 specific questions about the role and deadline.\n\n${facts}`),
      this.prompt('Choose a role', 'Compare realistic ways to contribute', `Based only on the facts below, suggest 3 possible contribution roles. Label each as verified, inferred, or unknown, explain the evidence, and give one small proof-of-readiness task for each.\n\n${facts}`),
      this.prompt('Prepare for the event', 'Create a practical preparation plan', `Create a preparation plan for this opportunity with tasks for 7 days before, 48 hours before, the event day, and the follow-up. Mark every assumption as a prediction and keep the plan beginner-friendly.\n\n${facts}`),
      this.prompt('Verify before acting', 'Find gaps and prevent false claims', `Audit this opportunity information before I apply. List missing dates, unclear role details, contact gaps, and claims that need confirmation. Give me a safe verification checklist using the source link.\n\n${facts}`),
      this.prompt('Follow up well', 'Turn participation into evidence', `Help me write a follow-up plan after this opportunity. Include a thank-you message, one contribution record, one learning note, and one next relationship step. Never claim attendance or contribution unless I confirm it.\n\n${facts}`)
    ];
  }

  private prompt(label: string, purpose: string, text: string): GuidedPrompt {
    return { label, purpose, text };
  }
}