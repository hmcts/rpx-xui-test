import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CaseViewEvent } from '../../../../domain';

@Component({
  selector: 'ccd-event-log',
  template: `
    <div class="grid-row">
      <div class="column-one-half">
        <ng-container [ngSwitch]="isPartOfCaseTimeline">
          <ccd-event-log-table *ngSwitchCase="true" [events]="events" [selected]="selected" (onSelect)="select($event)" (onCaseHistory)="caseHistoryClicked($event)"></ccd-event-log-table>
          <ccd-event-log-table *ngSwitchCase="false" [events]="events" [selected]="selected" (onSelect)="select($event)"></ccd-event-log-table>
        </ng-container>
      </div>
      <div class="column-one-half">
        <div class="EventLog-DetailsPanel">
          <ccd-event-log-details *ngIf="selected" [event]="selected"></ccd-event-log-details>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 991px){[class*="col-md"]{margin-bottom:30px}}.EventLog-DetailsPanel{border:1px solid #bfc1c3;padding:0px 10px 10px 10px;margin-top:20px}
  `]
})
export class EventLogComponent implements OnInit {

  @Input()
  events: CaseViewEvent[];

  @Output()
  onCaseHistory = new EventEmitter<String>();

  selected: CaseViewEvent;

  isPartOfCaseTimeline = false;

  ngOnInit(): void {
    this.selected = this.events[0];
    this.isPartOfCaseTimeline = this.onCaseHistory.observers.length > 0;
  }

  select(event: CaseViewEvent): void {
    this.selected = event;
  }

  caseHistoryClicked(eventId: string) {
    this.onCaseHistory.emit(eventId);
  }

}
