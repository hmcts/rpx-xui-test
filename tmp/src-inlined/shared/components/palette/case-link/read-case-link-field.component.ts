import { Component } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';

@Component({
  selector: 'ccd-read-case-link-field',
  template: `
    <a *ngIf="hasReference()" href="/v2/case/{{caseField.value.CaseReference}}" target="_blank">
      <span class="text-16">{{caseField.value.CaseReference ? (caseField.value.CaseReference | ccdCaseReference) : ''}}</span>
    </a>
  `
})
export class ReadCaseLinkFieldComponent extends AbstractFieldReadComponent {

  public hasReference(): boolean {
    return this.caseField.value && this.caseField.value.CaseReference;
  }
}
