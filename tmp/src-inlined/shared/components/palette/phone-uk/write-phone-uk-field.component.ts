import { Component, OnInit } from '@angular/core';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ccd-write-phone-uk-field',
  template: `
    <div class="form-group" [ngClass]="{'form-group-error': !phoneUkControl.valid && phoneUkControl.touched}">

      <label [for]="id()">
        <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
        <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
        <span class="error-message" *ngIf="phoneUkControl.errors && phoneUkControl.touched">{{phoneUkControl.errors | ccdFirstError}}</span>
      </label>
      <input class="form-control bottom-30" [id]="id()" type="tel" [formControl]="phoneUkControl">

    </div>
  `
})
export class WritePhoneUKFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  phoneUkControl: FormControl;

  ngOnInit() {
    this.phoneUkControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
  }

}
