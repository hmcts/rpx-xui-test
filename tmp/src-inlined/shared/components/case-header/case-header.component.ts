import { Component, Input, OnInit } from '@angular/core';
import { CaseView, CaseField, Draft } from '../../domain';

@Component({
  selector: 'ccd-case-header',
  template: `
    <h1 *ngIf="!caseTitle.label" class="heading-h1">#{{ caseDetails.case_id | ccdCaseReference}}</h1>

    <div *ngIf="caseTitle.label" class="case-title">
      <ccd-label-field [caseField]="caseTitle" [caseFields]="caseFields"></ccd-label-field>
    </div>
  `,
  styles: [`
    .case-title{margin-top:47px;margin-bottom:10px}.heading-h1{margin-top:40px}
  `]
})

export class CaseHeaderComponent implements OnInit {

  @Input()
  caseDetails: CaseView;
  caseTitle: CaseField;
  caseFields: CaseField[];

  ngOnInit(): void {
    this.caseTitle = new CaseField();
    if (!this.isDraft() && this.caseDetails.state.title_display) {
      this.caseTitle.label = this.caseDetails.state.title_display;
      this.caseFields = this.getCaseFields();
    }
  }

  isDraft(): boolean {
    return Draft.isDraft(this.caseDetails.case_id);
  }

  private getCaseFields(): CaseField[] {
    const caseDataFields = this.caseDetails.tabs.reduce((acc, tab) => {
      return acc.concat(tab.fields);
    }, []);

    return caseDataFields.concat(this.caseDetails.metadataFields);
  }
}
