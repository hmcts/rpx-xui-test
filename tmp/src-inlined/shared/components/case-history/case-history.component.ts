import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseHistory } from './domain';
import { catchError, map } from 'rxjs/operators';
import { throwError, Subscription } from 'rxjs';
import { CaseView, CaseTab, HttpError } from '../../domain';
import { AlertService, OrderService } from '../../services';
import { CaseHistoryService } from './services/case-history.service';
import { CaseNotifier } from '../case-editor';
import { ShowCondition } from '../../directives';

@Component({
  selector: 'ccd-case-history',
  template: `
    <div *ngIf="isDataLoaded()">
      <div class="grid-row">
        <div class="column-full">
          <ccd-case-header [caseDetails]="caseDetails"></ccd-case-header>
        </div>
      </div>
      <div class="grid-row">
        <div class="column-full">
          <div>
            <h2 class="heading-h2">Event Details</h2>
            <table class="EventDetails">
              <tbody>
              <tr>
                <th>Date</th>
                <td>{{caseHistory.event.timestamp | ccdDate}}</td>
              </tr>
              <tr>
                <th>Author</th>
                <td>{{caseHistory.event.user_first_name | titlecase}} {{caseHistory.event.user_last_name | uppercase}}</td>
              </tr>
              <tr>
                <th>End state</th>
                <td>{{caseHistory.event.state_name}}</td>
              </tr>
              <tr>
                <th>Event</th>
                <td>{{caseHistory.event.event_name}}</td>
              </tr>
              <tr>
                <th>Summary</th>
                <td>{{caseHistory.event.summary | ccdDash}}</td>
              </tr>
              <tr>
                <th>Comment</th>
                <td>{{caseHistory.event.comment | ccdDash}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 class="heading-h2">Case Details</h2>
            <ng-container *ngFor="let tab of tabs">
              <div class="caseHistorySection">
                <h3 class="heading-h3">{{tab.label}}</h3>
                <table class="CaseHistory" id="{{tab.id}}">
                  <ng-container *ngFor="let field of tab | ccdTabFields | ccdReadFieldsFilter:false :undefined :true">
                    <div ccdLabelSubstitutor [caseField]="field" [contextFields]="tab.fields" [hidden]="field.hidden">
                      <ng-container [ngSwitch]="!(field | ccdIsCompound)">
                        <tr *ngSwitchCase="true">
                          <th>
                            <div class="case-viewer-label">{{field.label}}</div>
                          </th>
                          <td>
                            <ccd-field-read [caseField]="field" [caseReference]="caseHistory.case_id"></ccd-field-read>
                          </td>
                        </tr>
                        <tr *ngSwitchCase="false" class="compound-field">
                          <td colspan="2">
                            <ccd-field-read [caseField]="field" [caseReference]="caseHistory.case_id"></ccd-field-read>
                          </td>
                        </tr>
                      </ng-container>
                    </div>
                  </ng-container>
                </table>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .CaseHistory th,.CaseHistory td{border-bottom:none}.caseHistorySection{margin-top:40px}.EventDetails th,.EventDetails td{border-bottom:none}th{width:1%;white-space:nowrap;vertical-align:top}.compound-field td{padding:0}.case-viewer-controls{margin-top:47px;margin-bottom:20px}ccd-case-header{float:left;margin-right:10px}ccd-event-trigger{float:right}.case-viewer-label{min-width:300px;white-space:normal}
  `]
})
export class CaseHistoryComponent implements OnInit, OnDestroy {

  private static readonly ERROR_MESSAGE = 'No case history to show';
  public static readonly PARAM_EVENT_ID = 'eid';

  @Input()
  event: string;

  caseHistory: CaseHistory;
  caseDetails: CaseView;
  tabs: CaseTab[];
  caseSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private orderService: OrderService,
    private caseNotifier: CaseNotifier,
    private caseHistoryService: CaseHistoryService) { }

  ngOnInit() {
    this.caseSubscription = this.caseNotifier.caseView.subscribe(caseDetails => {
      this.caseDetails = caseDetails;
      let eventId = this.route.snapshot.paramMap.get(CaseHistoryComponent.PARAM_EVENT_ID) || this.event;
      this.caseHistoryService
        .get(this.caseDetails.case_id, eventId)
        .pipe(
          map(caseHistory => {
            if (!caseHistory) {
              let error = new HttpError();
              error.message = CaseHistoryComponent.ERROR_MESSAGE;
              throw error;
            }

            this.caseHistory = caseHistory;
            this.tabs = this.orderService.sort(this.caseHistory.tabs);
            this.tabs = this.sortTabFieldsAndFilterTabs(this.tabs);
          }),
          catchError(error => {
            console.error(error);
            if (error.status !== 401 && error.status !== 403) {
              this.alertService.error(error.message);
            }
            return throwError(error);
            })
        ).toPromise();
    });
  }

  ngOnDestroy() {
    this.caseSubscription.unsubscribe();
  }

  isDataLoaded() {
    return !!(this.caseDetails && this.caseHistory);
  }

  private sortTabFieldsAndFilterTabs(tabs: CaseTab[]): CaseTab[] {
    return tabs
      .map(tab => Object.assign({}, tab, { fields: this.orderService.sort(tab.fields) }))
      .filter(tab => ShowCondition.getInstance(tab.show_condition).matchByContextFields(tab.fields));
  }
}
