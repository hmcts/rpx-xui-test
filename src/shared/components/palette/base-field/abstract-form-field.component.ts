import { Input } from '@angular/core';
import { CaseField } from '../../../domain/definition';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FieldsUtils } from '../../../services';

export abstract class AbstractFormFieldComponent {

  @Input()
  caseField: CaseField;

  @Input()
  formGroup?: FormGroup;

  @Input()
  registerControl?: <T extends AbstractControl> (control: T) => T;

  protected defaultControlRegister(): (control: FormControl) => AbstractControl {
    return control => {
      if (!this.formGroup) {
        return null;
      }
      if (this.formGroup.controls[this.caseField.id]) {
        return this.formGroup.get(this.caseField.id);
      }
      this.addValidators(this.caseField, control);
      this.formGroup.addControl(this.caseField.id, control);
      // make sure we can get hold of the CaseField for this control when we are evaluating show conditions
      FieldsUtils.addCaseFieldAndComponentReferences(control, this.caseField, this)
      return control;
    };
  }

  protected addValidators(caseField: CaseField, control: FormControl): void {
    // No validators by default, override this method to add validators to the form control
  }

}
