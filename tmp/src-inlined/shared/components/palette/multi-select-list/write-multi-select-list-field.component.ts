import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';

import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-multi-select-list-field',
  template: `
    <div class="form-group bottom-30" [ngClass]="{'error': !checkboxes.valid && checkboxes.touched}" [id]="id()">

      <fieldset>

        <legend>
          <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
          <span *ngIf="caseField.hint_text" class="form-hint">{{caseField.hint_text}}</span>
          <span *ngIf="checkboxes.errors && checkboxes.touched" class="error-message">{{checkboxes.errors | ccdFirstError}}</span>
        </legend>

        <ng-container *ngFor="let checkbox of caseField.field_type.fixed_list_items">

          <div class="multiple-choice">
            <input class="form-control" [id]="id()+'-'+checkbox.code" [name]="id()" type="checkbox" [value]="checkbox.code" [checked]="isSelected(checkbox.code)" (change)="onCheckChange($event)">
            <label class="form-label" [for]="id()+'-'+checkbox.code">{{checkbox.label}}</label>
          </div>

        </ng-container>

      </fieldset>

    </div>
  `
})
export class WriteMultiSelectListFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  checkboxes: FormArray;

  ngOnInit(): void {
    this.checkboxes = new FormArray([]);

    // Initialise array with existing values
    if (this.caseField.value && Array.isArray(this.caseField.value)) {
      const values: string[] = this.caseField.value;
      values.forEach(value => {
        this.checkboxes.push(new FormControl(value));
      });
    }
    this.registerControl(this.checkboxes, true);
  }

  onCheckChange(event) {
    if (!this.isSelected(event.target.value)) {
      // Add a new control in the FormArray
      this.checkboxes.push(new FormControl(event.target.value));
    } else {
      // Remove the control form the FormArray
      this.checkboxes.controls.forEach((ctrl: FormControl, i) => {
        if (ctrl.value === event.target.value) {
          this.checkboxes.removeAt(i);
          return;
        }
      });
    }
  }

  isSelected(code): AbstractControl {
    if (this.checkboxes && this.checkboxes.controls) {
      return this.checkboxes.controls.find(control => control.value === code);
    }
  }
}
