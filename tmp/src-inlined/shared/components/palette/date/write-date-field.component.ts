import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { Component, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';

@Component({
  selector: 'ccd-write-date-field',
  template: `
    <div class="form-group bottom-30" [id]="id()" [ngClass]="{'form-group-error': dateControl && !dateControl.valid && dateControl.touched}">

      <fieldset>
        <legend>
          <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel }}</span>
          <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
          <span class="error-message" *ngIf="dateControl && dateControl.errors && dateControl.touched">{{dateControl.errors | ccdFirstError}}</span>
        </legend>

        <cut-date-input [id]="id()"
                        [isDateTime]="isDateTime()"
                        [mandatory]="caseField | ccdIsMandatory"
                        [formControl]="dateControl"></cut-date-input>

      </fieldset>
    </div>
  `
})
export class WriteDateFieldComponent extends AbstractFieldWriteComponent implements OnInit {
  dateControl: FormControl;

  ngOnInit() {
    this.dateControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
  }

  isDateTime(): boolean {
    return this.caseField.field_type.id === 'DateTime';
  }

}
