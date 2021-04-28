import { Component, Input, OnInit } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { PaletteContext } from '../base-field/palette-context.enum';
import { CaseField } from '../../../domain/definition';

@Component({
  selector: 'ccd-read-organisation-field',
  template: `
    <ng-container [ngSwitch]="context">
      <ccd-read-organisation-field-raw
        *ngSwitchCase="paletteContext.CHECK_YOUR_ANSWER"
        [caseField]="caseField"
        [context]="context"
      ></ccd-read-organisation-field-raw>
      <ccd-read-organisation-field-table
        *ngSwitchCase="paletteContext.TABLE_VIEW"
        [caseField]="caseField"
        [caseFields]="caseFields"
        [context]="context"
      ></ccd-read-organisation-field-table>
      <ccd-read-organisation-field-table
        *ngSwitchDefault
        [caseField]="caseField"
        [caseFields]="caseFields"
        [context]="context"
      ></ccd-read-organisation-field-table>
    </ng-container>
  `,
})
export class ReadOrganisationFieldComponent extends AbstractFieldReadComponent implements OnInit {
  @Input()
  caseFields: CaseField[] = [];

  public paletteContext = PaletteContext;

  ngOnInit(): void {
    super.ngOnInit();
    if (this.caseField.display_context_parameter) {
      this.context = PaletteContext.TABLE_VIEW;
    }
  }

}
