import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn } from '@angular/forms';

import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { WriteComplexFieldComponent } from '../complex/write-complex-field.component';

@Component({
  selector: 'ccd-write-case-link-field',
  template: `
    <div class="form-group" [ngClass]="{'form-group-error': !caseReferenceControl.valid && caseReferenceControl.touched}">
      <label [for]="id()">
       <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
       <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
       <span class="error-message" *ngIf="caseReferenceControl.errors && caseReferenceControl.touched">{{caseReferenceControl.errors | ccdFirstError}}</span>
     </label>
     <input class="form-control bottom-30" [id]="id()" type="text" [formControl]="caseReferenceControl">
    </div>
  `
})
export class WriteCaseLinkFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  caseReferenceControl: AbstractControl;
  caseLinkGroup: FormGroup;

  @ViewChild('writeComplexFieldComponent')
  writeComplexFieldComponent: WriteComplexFieldComponent;

  ngOnInit() {
    if (this.caseField.value) {
      this.caseLinkGroup = this.registerControl(new FormGroup({
        'CaseReference': new FormControl(this.caseField.value.CaseReference),
      }), true) as FormGroup;
    } else {
      this.caseLinkGroup = this.registerControl(new FormGroup({
        'CaseReference': new FormControl(),
      }), true) as FormGroup;
    }
    this.caseReferenceControl = this.caseLinkGroup.controls['CaseReference'];
    this.caseReferenceControl.setValidators(this.caseReferenceValidator());
  }

  private caseReferenceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value) {
        if ( this.validCaseReference(control.value) ) {
          return null;
        }
        return {'error': 'Please use a valid 16 Digit Case Reference'};
      }
      return null;
    };
  }

  validCaseReference(valueString: string): boolean {
    if (!valueString )  {
      return false;
    }
    return new RegExp('^\\b\\d{4}[ -]?\\d{4}[ -]?\\d{4}[ -]?\\d{4}\\b$').test(valueString.trim());
  }
}
