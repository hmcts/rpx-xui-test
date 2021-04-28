import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { plainToClassFromExist } from 'class-transformer';

import { CaseField } from '../../../domain/definition/case-field.model';
import { AbstractFormFieldComponent } from './abstract-form-field.component';
import { AbstractFieldReadComponent } from './abstract-field-read.component';

@Component({
  selector: 'ccd-field-read-label',
  template: `
    <div [hidden]="caseField.hidden" [class.grey-bar]="canHaveGreyBar && !caseField.hiddenCannotChange">
      <dl class="case-field" *ngIf="withLabel && !isLabel() && (!isComplex() || isCaseLink()); else caseFieldValue">
        <dt class="case-field__label">{{caseField.label}}</dt>
        <dd class="case-field__value">
          <ng-container *ngTemplateOutlet="caseFieldValue"></ng-container>
        </dd>
      </dl>
      <ng-template #caseFieldValue>
        <ng-content></ng-content>
      </ng-template>
    </div>
  `,
  styles: [`
    .case-field:after{content:"";display:block;clear:both}.case-field{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;margin-bottom:15px}@media (min-width: 641px){.case-field{margin-bottom:30px}}.case-field .case-field__label{display:block;color:#0b0c0c;padding-bottom:2px;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:16px;line-height:1.25}@media (min-width: 641px){.case-field .case-field__label{font-size:19px;line-height:1.31579}}.case-field .case-field__value{font-family:"nta",Arial,sans-serif;font-weight:400;text-transform:none;font-size:16px;line-height:1.25}@media (min-width: 641px){.case-field .case-field__value{font-size:19px;line-height:1.31579}}.form :host::ng-deep .grey-bar>*>.form-group,.form :host::ng-deep .grey-bar>*>dl.case-field{margin-left:15px;padding-left:15px}.form :host::ng-deep .grey-bar>*>.form-group:not(.form-group-error),.form :host::ng-deep .grey-bar>*>dl.case-field:not(.form-group-error){border-left:solid 5px #b1b4b6}.form :host::ng-deep .grey-bar>*>.form-group input:not(.inline-block),.form :host::ng-deep .grey-bar>*>.form-group select:not(.inline-block),.form :host::ng-deep .grey-bar>*>.form-group textarea:not(.inline-block),.form :host::ng-deep .grey-bar>*>dl.case-field input:not(.inline-block),.form :host::ng-deep .grey-bar>*>dl.case-field select:not(.inline-block),.form :host::ng-deep .grey-bar>*>dl.case-field textarea:not(.inline-block){display:block}
  `]
})
export class FieldReadLabelComponent extends AbstractFieldReadComponent implements OnChanges {

  // EUI-3267. Flag for whether or not this can have a grey bar.
  public canHaveGreyBar = false;

  @Input()
  withLabel: boolean;

  public isLabel(): boolean {
    return this.caseField.field_type && this.caseField.field_type.type === 'Label';
  }

  public isComplex(): boolean {
    return this.caseField.isComplex();
  }

  public isCaseLink(): boolean {
    return this.caseField.isCaseLink();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let change = changes['caseField'];
    if (change) {
      let cfNew = change.currentValue;
      if (!(cfNew instanceof CaseField)) {
        this.fixCaseField();
      }

      // EUI-3267.
      // Set up the flag for whether this can have a grey bar.
      this.canHaveGreyBar = !!this.caseField.show_condition;
    }
  }

  private fixCaseField() {
    if (this.caseField && !(this.caseField instanceof CaseField)) {
      this.caseField = plainToClassFromExist(new CaseField(), this.caseField);
    }
  }
}
