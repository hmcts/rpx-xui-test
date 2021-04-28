import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-fixed-list-field',
  template: `
    <div class="form-group" [ngClass]="{'form-group-error': !fixedListFormControl.valid && fixedListFormControl.touched}">

      <label [for]="id()">
        <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
        <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
        <span class="error-message" *ngIf="fixedListFormControl.errors && fixedListFormControl.touched">{{fixedListFormControl.errors | ccdFirstError}}</span>
      </label>

      <select class="form-control ccd-dropdown bottom-30" [id]="id()" [formControl]="fixedListFormControl">
        <option [ngValue]=null>--Select a value--</option>
        <option [ngValue]="type.code" *ngFor="let type of listItems">{{type.label}}</option>
      </select>

    </div>
  `
})
export class WriteFixedListFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  fixedListFormControl: FormControl;

  public get listItems(): any[] {
    if (this.caseField) {
      if (this.caseField.list_items) {
        return this.caseField.list_items;
      }
      if (this.caseField.formatted_value && this.caseField.formatted_value.list_items) {
        return this.caseField.formatted_value.list_items;
      }
    }
    return [];
  }

  ngOnInit() {
    let isNull = this.caseField.value === undefined || this.caseField.value === '';

    if (isNull) {
      this.caseField.value = null;
    }

    this.fixedListFormControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
    this.fixedListFormControl.setValue(this.caseField.value);
  }
}
