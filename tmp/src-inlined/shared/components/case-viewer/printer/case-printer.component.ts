import { Component, OnInit, OnDestroy } from '@angular/core';
import { CaseView, CasePrintDocument, HttpError } from '../../../domain';
import { CaseNotifier, CasesService } from '../../case-editor';
import { catchError, map } from 'rxjs/operators';
import { throwError, Subscription } from 'rxjs';
import { AlertService } from '../../../services';

@Component({
  template: `
    <div *ngIf="isDataLoaded()">
      <ccd-case-header [caseDetails]="caseDetails"></ccd-case-header>
      <h2 class="heading-h2">Print</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let document of documents">
            <td class="document-name"><a [href]="document.url | ccdPrintUrl" target="_blank" rel="external">{{document.name}}</a></td>
            <td class="document-type">{{document.type}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class CasePrinterComponent implements OnInit, OnDestroy {

  private static readonly ERROR_MESSAGE = 'No documents to print';

  caseDetails: CaseView;
  documents: CasePrintDocument[];
  caseSubscription: Subscription;

  constructor(
    private caseNotifier: CaseNotifier,
    private casesService: CasesService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.caseSubscription = this.caseNotifier.caseView.subscribe(caseDetails => {
      this.caseDetails = caseDetails;
      this.casesService
        .getPrintDocuments(this.caseDetails.case_id)
        .pipe(
          map(documents => {

            if (!documents || !documents.length) {
              let error = new HttpError();
              error.message = CasePrinterComponent.ERROR_MESSAGE;
              throw error;
            }

            this.documents = documents;
          }),
          catchError(error => {
            this.alertService.error(error.message);
            return throwError(error);
          })
        ).toPromise();
    });
  }

  ngOnDestroy() {
    this.caseSubscription.unsubscribe();
  }

  isDataLoaded() {
    return this.caseDetails && this.documents ? true : false;
  }

}
