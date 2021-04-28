import { Component, Input } from '@angular/core';
import { AbstractFormFieldComponent } from '../base-field/abstract-form-field.component';
import { SimpleOrganisationModel } from '../../../domain/organisation';
import { Observable } from 'rxjs';

@Component({
  selector: 'ccd-write-organisation-complex-field',
  template: `
    <div>
      <input type="hidden" name="organisationID" [value]="(selectedOrg$ | async).organisationIdentifier">
      <input type="hidden" name="organisationName" [value]="(selectedOrg$ | async).name">
    </div>
  `,
  styles: [`
    .hmcts-banner{border:0 solid;margin-bottom:10px;color:#000000}.hmcts-banner .warning-message{font-weight:bold}.govuk-hint{font-size:1.1rem}.name-header{font-weight:bold;margin-top:10px;font-size:18px}.td-address{width:90%;padding-top:2px}.td-select{width:10%}.warning-panel{background-color:#e7ebef;height:40px;margin-bottom:0;align-items:center;display:flex}.warning-panel .warning-message{padding-left:15px}.complex-field-table>tbody>tr>th{border:none}.complex-field-table>tbody>tr:last-child>th,.complex-field-table>tbody>tr:last-child>td{border-bottom:none}.complex-field-title{width:300px}.label-width-small{width:100px}.label-width-medium{width:150px}.scroll-container{height:600px;overflow-y:scroll}.no-result-message{margin-top:15px}
  `]
})
export class WriteOrganisationComplexFieldComponent extends AbstractFormFieldComponent {

  @Input()
  public selectedOrg$: Observable<SimpleOrganisationModel>;

  constructor() {
    super();
  }

}
