import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CaseViewEvent } from '../../../../domain';

@Component({
  selector: 'ccd-event-log-table',
  template: `
    <table class="EventLogTable">
      <caption><h2 class="heading-h2">History</h2></caption>
      <thead>
      <tr>
        <th><span class="text-16">Event</span></th>
        <th><span class="text-16">Date</span></th>
        <th><span class="text-16">Author</span></th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let event of events" (click)="select(event)" [ngClass]="{'EventLogTable-Selected': selected === event}">
        <td>
          <ng-container [ngSwitch]="isPartOfCaseTimeline">
            <div id="case-timeline" *ngSwitchCase="true">
              <a (click)="caseHistoryClicked(event.id)"
                *ngIf="event.state_id !== 'Draft'" class="text-16 event-link">{{event.event_name}}</a>
            </div>
            <div *ngSwitchCase="false">
              <a [routerLink]="['./', 'event', event.id, 'history']"
                  [target]="'_blank'"
                  *ngIf="event.state_id !== 'Draft'" class="text-16 event-link">{{event.event_name}}</a>
            </div>
          </ng-container>
          <span *ngIf="event.state_id === 'Draft'">{{event.event_name}}</span>
          <div class="tooltip" *ngIf="significantItemExist(event)">
            <a href="{{getSignificantItemUrl(event)}}" target="_blank">
              <img class="doc-img" src="data:image/png;base64,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"/>
            </a>
            <span class="tooltiptext doc-tooltip">{{getSignificantItemDesc(event)}}</span>
          </div>
        </td>
        <td><div class="tooltip text-16">{{event.timestamp | ccdDate : 'utc'}}
          <span class="tooltiptext">Local: {{event.timestamp | ccdDate : 'local'}}</span>
        </div></td>
        <td><span class="text-16">{{event.user_first_name | titlecase}} {{event.user_last_name | uppercase}}</span></td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [`
    #case-timeline a{cursor:pointer;text-decoration:underline;color:#005ea5}#case-timeline a:hover{color:#2b8cc4}#case-timeline a:visited{color:#4c2c92}.EventLogTable tbody>tr td:first-child{padding-left:10px}.EventLogTable tbody>tr.EventLogTable-Selected{border-left:8px solid #005ea5;background-color:#f8f8f8}.EventLogTable tbody>tr.EventLogTable-Selected td:first-child{padding-left:6px}.EventLogTable tbody>tr:not(.EventLogTable-Selected):hover{border-left:8px solid #2b8cc4;background-color:#f8f8f8;cursor:pointer;cursor:hand}.EventLogTable tbody>tr:not(.EventLogTable-Selected):hover td:first-child{padding-left:6px}.EventLogTable tbody>tr .event-link{float:left;padding-right:8px}.EventLogTable tbody>tr .doc-img{width:16px;float:left}.EventLogTable tbody>tr .doc-tooltip{left:35%;bottom:7px}.EventLogTable tbody>tr .doc-tooltip::after{border-color:transparent}
  `]
})
export class EventLogTableComponent implements OnInit {

  @Input()
  events: CaseViewEvent[];

  @Input()
  selected: CaseViewEvent;

  @Output()
  onSelect = new EventEmitter<CaseViewEvent>();

  @Output()
  onCaseHistory = new EventEmitter<string>();

  isPartOfCaseTimeline = false;

  ngOnInit() {
    this.isPartOfCaseTimeline = this.onCaseHistory.observers.length > 0;
  }

  select(event: CaseViewEvent): void {
    this.selected = event;
    this.onSelect.emit(event);
  }

  significantItemExist(event: CaseViewEvent): boolean {
    return (event.significant_item &&
        event.significant_item.type === 'DOCUMENT' &&
        event.significant_item.url !== undefined &&
        event.significant_item.description !== undefined);
  }

  getSignificantItemUrl(event: CaseViewEvent): string {
    if (event.significant_item) {
      return event.significant_item.url;
    }
  }

  getSignificantItemDesc(event: CaseViewEvent): string {
    if (event.significant_item) {
      return event.significant_item.description;
    }
  }

  caseHistoryClicked(eventId: string) {
    this.onCaseHistory.emit(eventId);
  }
}
