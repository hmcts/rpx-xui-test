import { Component, Input, OnInit } from '@angular/core';
import { CaseViewEvent, HttpError } from '../../domain';
import { CasesService, CaseNotifier } from '../case-editor';
import { AlertService } from '../../services';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'ccd-case-timeline',
  template: `
    <div *ngIf="isDataLoaded()">
        <ng-container [ngSwitch]="displayMode">
            <ng-container *ngSwitchCase="dspMode.TIMELINE">
                <ccd-event-log [events]="events" (onCaseHistory)="caseHistoryClicked($event)" *ngIf="displayMode === dspMode.TIMELINE"></ccd-event-log>
            </ng-container>
            <ng-container *ngSwitchCase="dspMode.DETAILS">
                <div class="govuk-breadcrumbs">
                    <ol class="govuk-breadcrumbs__list">
                        <li class="govuk-breadcrumbs__list-item">
                            <a href="javascript:void(0)" (click)="goToCaseTimeline()" class="govuk-back-link">Back to case timeline</a>
                        </li>
                    </ol>
                </div>
                <ccd-case-history [event]="selectedEventId"></ccd-case-history>
            </ng-container>
        </ng-container>
    </div>
  `
})
export class CaseTimelineComponent implements OnInit {

  @Input()
  case: string;

  events: CaseViewEvent[];
  selectedEventId: string;
  dspMode = CaseTimelineDisplayMode;
  displayMode: CaseTimelineDisplayMode = CaseTimelineDisplayMode.TIMELINE;

  constructor(
    private caseNotifier: CaseNotifier,
    private casesService: CasesService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.casesService
      .getCaseViewV2(this.case)
      .pipe(
        map(caseView => {
          this.events = caseView.events;
          this.caseNotifier.announceCase(caseView);
        })
      )
      .toPromise()
      .catch((error: HttpError) => {
        this.alertService.error(error.message);
        return throwError(error);
      });
  }

  isDataLoaded(): boolean {
    return this.events ? true : false;
  }

  caseHistoryClicked(eventId: string) {
    this.displayMode = CaseTimelineDisplayMode.DETAILS;
    this.selectedEventId = eventId;
  }

  public goToCaseTimeline(): void {
    this.displayMode = CaseTimelineDisplayMode.TIMELINE;
  }
}

export enum CaseTimelineDisplayMode {
  TIMELINE,
  DETAILS
}
