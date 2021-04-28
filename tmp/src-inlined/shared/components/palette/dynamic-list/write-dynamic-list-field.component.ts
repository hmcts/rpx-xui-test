import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-dynamic-list-field',
  template: `
    <div class="form-group"
        [ngClass]="{'form-group-error': !dynamicListFormControl.valid && dynamicListFormControl.touched}">

        <label [for]="id()">
            <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
            <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
            <span class="form-label" *ngIf="!caseField.label && !caseField.hint_text">Select an option from the
                dropdown</span>
            <span class="error-message"
                *ngIf="dynamicListFormControl.errors && dynamicListFormControl.touched">{{dynamicListFormControl.errors |
                ccdFirstError}}</span>
        </label>

        <select class="form-control ccd-dropdown bottom-30" [id]="id()"
            [formControl]="dynamicListFormControl">
            <option [ngValue]=null>--Select a value--</option>
            <option [ngValue]="type.code" *ngFor="let type of caseField.list_items" role="option">{{type.label}}</option>
        </select>

    </div>
  `
})
export class WriteDynamicListFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  dynamicListFormControl: FormControl;

  ngOnInit() {
    /**
     *
     * Reassigning list_items from formatted_value when list_items is empty
     */
    if (!this.caseField.list_items && this.caseField.formatted_value && this.caseField.formatted_value.list_items) {
      this.caseField.list_items = this.caseField.formatted_value.list_items;
    }

    /**
     * Reassigning value from formatted_value when value is empty
     */
    if (!this.caseField.value) {
      if (this.caseField.formatted_value && this.caseField.formatted_value.value && this.caseField.formatted_value.value.code) {
        this.caseField.value = this.caseField.formatted_value.value.code;
      }
    }

    const isNull = this.caseField.value === undefined || this.caseField.value === '';
    if (isNull || typeof this.caseField.value === 'object') {
      this.caseField.value = null;
    }

    this.dynamicListFormControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
    this.dynamicListFormControl.setValue(this.caseField.value);
  }
}
