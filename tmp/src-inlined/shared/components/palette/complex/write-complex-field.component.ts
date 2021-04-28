import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { plainToClassFromExist } from 'class-transformer';

import { Constants } from '../../../commons/constants';
import { CaseField, FieldTypeEnum } from '../../../domain/definition';
import { FieldsUtils, FormValidatorsService } from '../../../services';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { AbstractFormFieldComponent } from '../base-field/abstract-form-field.component';
import { IsCompoundPipe } from '../utils/is-compound.pipe';
import { FieldsFilterPipe } from './fields-filter.pipe';

const ADDRESS_FIELD_TYPES = [ 'AddressUK', 'AddressGlobalUK', 'AddressGlobal' ];

@Component({
  selector: 'ccd-write-complex-type-field',
  template: `
    <div class="form-group" [id]="id()">

      <h2 *ngIf="renderLabel" class="heading-h2">{{caseField | ccdFieldLabel}}</h2>
      <ng-container *ngFor="let field of complexFields">
        <ng-container [ngSwitch]="field | ccdIsReadOnlyAndNotCollection">
          <ccd-field-read *ngSwitchCase="true"
                          ccdLabelSubstitutor
                          [caseField]="buildField(field)"
                          [caseFields]="caseFields"
                          [formGroup]="formGroup"
                          [withLabel]="true">
          </ccd-field-read>
          <ccd-field-write *ngSwitchCase="false"
                           ccdLabelSubstitutor
                           [caseField]="field"
                           [caseFields]="caseFields"
                           [formGroup]="formGroup"
                           [parent]="complexGroup"
                           [idPrefix]="buildIdPrefix(field)"
                           [hidden]="field.hidden">
          </ccd-field-write>
        </ng-container>
      </ng-container>
    </div>
  `,
  styles: [`
    .complex-panel{margin:13px 0px;border:1px solid #bfc1c3}.complex-panel .complex-panel-title{background-color:#dee0e2;padding:5px;border-bottom:1px solid #bfc1c3;font-weight:bold;display:block;color:#0b0c0c;padding-bottom:2px;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:16px;line-height:1.25}@media (min-width: 641px){.complex-panel .complex-panel-title{font-size:19px;line-height:1.31579}}.complex-panel .complex-panel-table>tbody>tr>th{vertical-align:top}.complex-panel .complex-panel-table>tbody>tr:last-child>th,.complex-panel .complex-panel-table>tbody>tr:last-child>td{border-bottom:none}.complex-panel .complex-panel-simple-field th{padding-left:5px;width:295px}.complex-panel .complex-panel-compound-field td{padding:5px}
  `]
})
export class WriteComplexFieldComponent extends AbstractFieldWriteComponent implements OnInit {
  @Input()
  caseFields: CaseField[] = [];

  @Input()
  formGroup: FormGroup;

  complexGroup: FormGroup;

  @Input()
  renderLabel = true;

  @Input()
  ignoreMandatory = false;

  public complexFields: CaseField[];

  constructor (private isCompoundPipe: IsCompoundPipe, private formValidatorsService: FormValidatorsService) {
    super();
    this.complexGroup = new FormGroup({});
  }

  ngOnInit(): void {
    // Are we inside of a collection? If so, the parent is the complexGroup we want.
    if (this.isTopLevelWithinCollection()) {
      this.complexGroup = this.parent as FormGroup;
      FieldsUtils.addCaseFieldAndComponentReferences(this.complexGroup, this.caseField, this);
    } else {
      this.complexGroup = this.registerControl(this.complexGroup, true) as FormGroup;
    }
    // Add validators for the complex field.
    this.formValidatorsService.addValidators(this.caseField, this.complexGroup);
    this.setupFields();
    this.complexGroup.updateValueAndValidity({ emitEvent: true });
  }

  buildField(caseField: CaseField): CaseField {
    let control: AbstractControl = this.complexGroup.get(caseField.id);
    if (!control) {
      control = new FormControl(caseField.value);
      this.complexGroup.addControl(caseField.id, control);
    }

    // Add validators for addresses, if appropriate.
    if (this.isAddressUK()) {
      if (this.addressValidatorsRequired(caseField)) {
        this.formValidatorsService.addValidators(caseField, control);
      }
    } else {
      // It's not an address so set it up according to its own display_context.
      this.formValidatorsService.addValidators(caseField, control);
    }
    FieldsUtils.addCaseFieldAndComponentReferences(control, caseField, this);
    return caseField;
  }

  buildIdPrefix(field: CaseField): string {
    return this.isCompoundPipe.transform(field) ? `${this.idPrefix}${field.id}_` : `${this.idPrefix}`;
  }

  private addressValidatorsRequired(caseField: CaseField): boolean {
    return this.isSmallAddressLine1(caseField) && this.isMandatory(caseField);
  }

  private isSmallAddressLine1(caseField: CaseField): boolean {
    return caseField.id === 'AddressLine1' && caseField.field_type.id === 'TextMax150';
  }

  private isMandatory(caseField: CaseField): boolean {
    return (Constants.MANDATORY === caseField.display_context || !this.ignoreMandatory);
  }

  private isAddressUK(): boolean {
    return ADDRESS_FIELD_TYPES.indexOf(this.caseField.field_type.id) > -1;
  }

  private isTopLevelWithinCollection(): boolean {
    if (this.parent) {
      const parentCaseField: CaseField = this.parent['caseField'];
      if (parentCaseField && parentCaseField.id === this.caseField.id) {
        const parentComponent = this.parent['component'] as AbstractFormFieldComponent;
        if (parentComponent) {
          const parentComponentCaseField = parentComponent.caseField;
          if (parentComponentCaseField.field_type) {
            return parentComponentCaseField.field_type.type === 'Collection';
          }
        }
      }
    }
    return false;
  }

  private setupFields(): void {
    const fieldsFilterPipe: FieldsFilterPipe = new FieldsFilterPipe();
    this.complexFields = fieldsFilterPipe.transform(this.caseField, true).map(field => {
      if (field && field.id) {
        const id = field.id;
        if (!(field instanceof CaseField)) {
          return this.buildField(plainToClassFromExist(new CaseField(), field));
        }
      }
      return this.buildField(field);
    });
  }
}
