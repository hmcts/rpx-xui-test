import { Component } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';

@Component({
  selector: 'ccd-read-multi-select-list-field',
  template: `
    <table *ngIf="caseField.value && caseField.value.length" class="multi-select-list-field-table">
      <tbody>
        <tr *ngFor="let value of caseField.value">
          <td><span class="text-16">{{ value | ccdFixedList:caseField.field_type.fixed_list_items }}</span></td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .multi-select-list-field-table tr>td{padding:5px 0 5px 0}.multi-select-list-field-table tr:last-child>td{border-bottom:none}.multi-select-list-field-table td.collection-actions{width:1px;white-space:nowrap}
  `]
})
export class ReadMultiSelectListFieldComponent extends AbstractFieldReadComponent {}
