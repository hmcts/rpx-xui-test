import { Component, Input } from '@angular/core';
import { CaseField } from '../../../domain/definition/case-field.model';

@Component({
  selector: 'ccd-label-field',
  template: `
    <dl [hidden]="caseField.hidden" class="case-field" ccdLabelSubstitutor [caseField]="caseField" [contextFields]="caseFields" [id]="caseField.id">
      <dt>
        <ccd-markdown [content]="caseField.value || caseField.label"></ccd-markdown>
      </dt>
      <dd></dd>
    </dl>
  `
})
export class LabelFieldComponent {
  @Input()
  caseField: CaseField;

  @Input()
  caseFields: CaseField[] = [];
}
