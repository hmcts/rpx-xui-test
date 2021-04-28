import { Component, OnInit } from '@angular/core';

import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';

@Component({
  selector: 'ccd-read-collection-field',
  template: `
    <table *ngIf="caseField.value && caseField.value.length " class="collection-field-table">
      <ng-container [ngSwitch]="isDisplayContextParameterAvailable">
        <tbody *ngSwitchCase="true">
        <tr>
          <td>
            <ccd-field-read
              [caseField]="{
                id: caseField.label,
                label: caseField.label,
                field_type: caseField.field_type.collection_field_type,
                display_context_parameter: caseField.display_context_parameter,
                value: caseField.value,
                hidden: caseField.hidden
              }"
              [context]="context"
              [topLevelFormGroup]="topLevelFormGroup">
            </ccd-field-read>
          </td>
        </tr>
        </tbody>
        <tbody *ngSwitchCase="false">
        <tr *ngFor="let item of caseField.value; let i = index">
          <td>
            <ccd-field-read
              [caseField]="{
                id: i,
                label: caseField.label + ' ' + (i + 1),
                field_type: caseField.field_type.collection_field_type,
                value: item.value,
                hidden: caseField.hidden
              }"
              [context]="context"
              [topLevelFormGroup]="topLevelFormGroup"
              [idPrefix]="buildIdPrefix(i)">
            </ccd-field-read>
          </td>
        </tr>
        </tbody>
      </ng-container>
    </table>
  `,
  styles: [`
    .collection-field-table tr:first-child>td{padding-top:0}.collection-field-table tr:last-child>td{border-bottom:none}.collection-field-table td.collection-actions{width:1px;white-space:nowrap}.error-spacing{margin-top:10px}.collection-title{height:51px}.float-left{float:left;padding-top:8px}.float-right{float:right}.complex-panel{margin:13px 0px;border:1px solid #bfc1c3}.complex-panel .complex-panel-title{background-color:#dee0e2;padding:5px;border-bottom:1px solid #bfc1c3;font-weight:bold;display:block;color:#0b0c0c;padding-bottom:2px;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:16px;line-height:1.25}@media (min-width: 641px){.complex-panel .complex-panel-title{font-size:19px;line-height:1.31579}}.complex-panel .complex-panel-table>tbody>tr>th{vertical-align:top}.complex-panel .complex-panel-table>tbody>tr:last-child>th,.complex-panel .complex-panel-table>tbody>tr:last-child>td{border-bottom:none}.complex-panel .complex-panel-simple-field th{padding-left:5px;width:295px}.complex-panel .complex-panel-compound-field td{padding:5px}.collection-indicator{border-left:solid 5px #b1b4b6}
  `]
})
export class ReadCollectionFieldComponent extends AbstractFieldReadComponent implements OnInit {

  public isDisplayContextParameterAvailable = false;

  ngOnInit(): void {
    if (this.caseField.display_context_parameter && this.caseField.display_context_parameter.trim().startsWith('#TABLE(')) {
      this.isDisplayContextParameterAvailable = true;
    }
  }

  buildIdPrefix(index: number): string {
    const prefix = `${this.idPrefix}${this.caseField.id}_`;
    if (this.caseField.field_type.collection_field_type.type === 'Complex') {
      return `${prefix}${index}_`;
    }
    return prefix;
  }
}
