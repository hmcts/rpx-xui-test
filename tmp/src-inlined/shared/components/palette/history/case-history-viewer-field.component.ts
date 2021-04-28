import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ccd-case-history-viewer-field',
  template: `
    <ccd-event-log [events]="caseField.value"></ccd-event-log>
  `,
})
export class CaseHistoryViewerFieldComponent extends AbstractFieldReadComponent {}
