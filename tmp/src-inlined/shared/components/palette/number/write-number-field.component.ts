import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-number-field',
  template: `
    <div class="form-group" [ngClass]="{'form-group-error': !numberControl.valid && numberControl.touched}">

      <label [for]="id()">
        <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
        <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
        <span class="error-message" *ngIf="numberControl.errors && numberControl.touched">{{numberControl.errors | ccdFirstError}}</span>
      </label>

      <input class="form-control bottom-30" [id]="id()" type="number" [formControl]="numberControl">

    </div>
  `
})
export class WriteNumberFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  numberControl: FormControl;

  ngOnInit() {
    this.numberControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
  }
}
