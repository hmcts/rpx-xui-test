import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-fixed-radio-list-field',
  template: `

    <div class="form-group bottom-30" [ngClass]="{'form-group-error': !fixedRadioListControl.valid && fixedRadioListControl.touched}" [id]="id()">
      <fieldset>
        <legend>
          <label [for]="id()">
            <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
            <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
            <span class="error-message" *ngIf="fixedRadioListControl.errors && fixedRadioListControl.touched">{{fixedRadioListControl.errors | ccdFirstError}}</span>
          </label>
        </legend>
        <ng-container>
          <div class="multiple-choice" *ngFor="let radioButton of caseField.field_type.fixed_list_items" [ngClass]="{selected: fixedRadioListControl.value === radioButton.code}">
              <input class="form-control" [id]="id()+'-'+radioButton.code" [name]="id()" type="radio" [formControl]="fixedRadioListControl" [value]="radioButton.code">
              <label class="form-label" [for]="id()+'-'+radioButton.code">{{radioButton.label}}</label>
          </div>
        </ng-container>
      </fieldset>
    </div>
  `
})
export class WriteFixedRadioListFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  fixedRadioListControl: FormControl;

  ngOnInit() {
    let notEmpty = this.caseField.value !== null && this.caseField.value !== undefined;
    this.fixedRadioListControl = this.registerControl(new FormControl(notEmpty ? this.caseField.value : null)) as FormControl;
  }
}
