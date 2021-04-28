import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CaseEditComponent } from '../case-edit/case-edit.component';
import { Router } from '@angular/router';
import { CaseEventTrigger } from '../../../domain/case-view/case-event-trigger.model';
import { Confirmation } from '../domain/confirmation.model';

@Component({
  template: `
    <!-- Current Page && Event trigger name -->
    <h1 class="heading-h1">{{ eventTrigger.name}}</h1>

    <!-- Case ID -->
    <h2 *ngIf="getCaseId()" class="heading-h2">
      #{{ getCaseId() | ccdCaseReference}}
    </h2>

    <form [formGroup]="formGroup" (submit)="submit()">
      <div id="confirmation-header" *ngIf="confirmation.getHeader()">
        <ccd-markdown [content]="confirmation.getHeader()"></ccd-markdown>
      </div>
      <div id="confirmation-body" *ngIf="confirmation.getBody()">
        <ccd-markdown [content]="confirmation.getBody()"></ccd-markdown>
      </div>
      <button type="submit" class="button" data-ng-click="submit()">{{this.triggerText}}</button>
    </form>
  `,
  styles: [`
    #fieldset-case-data{margin-bottom:30px}#fieldset-case-data th{width:1%;white-space:nowrap;vertical-align:top}.compound-field td{padding:0}#confirmation-header{width:630px;background-color:#17958b;border:solid 1px #979797;color:#ffffff;text-align:center}#confirmation-body{width:630px;background-color:#ffffff}.valign-top{vertical-align:top}.summary-fields{margin-bottom:30px}.summary-fields tbody tr th,.summary-fields tbody tr td{border-bottom:0px}a.disabled{pointer-events:none;cursor:default}.case-field-label{width:45%}.case-field-content{width:50%}.case-field-change{width:5%}
  `]
})
export class CaseEditConfirmComponent {

  private caseId: string;
  eventTrigger: CaseEventTrigger;
  triggerText = 'Close and Return to case details';
  formGroup = new FormControl();
  confirmation: Confirmation;

  constructor(private caseEdit: CaseEditComponent, private router: Router) {
    this.eventTrigger = this.caseEdit.eventTrigger;
    if (this.caseEdit.confirmation) {
      this.confirmation = this.caseEdit.confirmation;
      this.caseId = this.caseEdit.confirmation.getCaseId();
    } else {
      this.router.navigate(['/']);
    }
  }

  submit(): void {
    this.caseEdit.submitted.emit({caseId: this.confirmation.getCaseId(), status: this.confirmation.getStatus()});
  }

  getCaseId(): String {
    return (this.caseEdit.caseDetails ? this.caseEdit.caseDetails.case_id : '');
  }
}
