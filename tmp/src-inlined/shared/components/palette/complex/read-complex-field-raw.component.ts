import { Component } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';

/**
 * Display a complex type fields as a list of values without labels.
 * This is intended for rendering of Check Your Answer page.
 */
@Component({
  selector: 'ccd-read-complex-field-raw',
  template: `
    <dl class="complex-raw">
      <ng-container *ngFor="let field of caseField | ccdReadFieldsFilter:false :undefined :true :topLevelFormGroup :id()">
        <dt [hidden]="field.hidden || field.field_type.type === 'Label'"><span class="text-16">{{field.label}}</span></dt>
        <dd [hidden]="field.hidden">
          <ccd-field-read [caseField]="field" [context]="context" [topLevelFormGroup]="topLevelFormGroup" [idPrefix]="idPrefix"></ccd-field-read>
        </dd>
      </ng-container>
    </dl>
  `,
  styles: [`
    dl.complex-raw{list-style-type:none;margin:5px 0 10px 0}dl.complex-raw dl.complex-raw{padding-left:2ch}dl.complex-raw dt{font-weight:bold}
  `],
})
export class ReadComplexFieldRawComponent extends AbstractFieldReadComponent {}
