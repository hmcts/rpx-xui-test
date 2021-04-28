import { Component, Input } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { CaseField } from '../../../domain/definition';

@Component({
  selector: 'ccd-read-complex-field-table',
  template: `
    <div class="complex-panel">
      <dl class="complex-panel-title"><dt><span class="text-16">{{caseField.label}}</span></dt><dd></dd></dl>
      <table class="complex-panel-table">
        <tbody>
          <ng-container *ngFor="let field of caseField | ccdReadFieldsFilter:false :undefined :true">
            <ng-container *ngIf="(field | ccdIsCompound); else SimpleRow">
              <tr class="complex-panel-compound-field" [hidden]="field.hidden">
                <td colspan="2">
                  <span class="text-16"><ccd-field-read [caseField]="field" [context]="context"></ccd-field-read></span>
                </td>
              </tr>
            </ng-container>
            <ng-template #SimpleRow>
              <tr class="complex-panel-simple-field" [hidden]="field.hidden">
                <th><span class="text-16">{{field.label}}</span></th>
                <td>
                    <span class="text-16"><ccd-field-read [caseField]="field" [context]="context"></ccd-field-read></span>
                </td>
              </tr>
            </ng-template>
          </ng-container>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .complex-panel{margin:13px 0px;border:1px solid #bfc1c3}.complex-panel .complex-panel-title{background-color:#dee0e2;padding:5px;border-bottom:1px solid #bfc1c3;font-weight:bold;display:block;color:#0b0c0c;padding-bottom:2px;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:16px;line-height:1.25}@media (min-width: 641px){.complex-panel .complex-panel-title{font-size:19px;line-height:1.31579}}.complex-panel .complex-panel-table>tbody>tr>th{vertical-align:top}.complex-panel .complex-panel-table>tbody>tr:last-child>th,.complex-panel .complex-panel-table>tbody>tr:last-child>td{border-bottom:none}.complex-panel .complex-panel-simple-field th{padding-left:5px;width:295px}.complex-panel .complex-panel-compound-field td{padding:5px}
  `]
})
export class ReadComplexFieldTableComponent extends AbstractFieldReadComponent {
  @Input()
  caseFields: CaseField[] = [];
}
