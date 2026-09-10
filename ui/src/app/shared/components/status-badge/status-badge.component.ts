import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  template: `<span class="status-badge" [ngClass]="tone">{{ label }}</span>`,
  styleUrl: './status-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  @Input({ required: true }) label = '';
  @Input() tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' = 'neutral';
}
