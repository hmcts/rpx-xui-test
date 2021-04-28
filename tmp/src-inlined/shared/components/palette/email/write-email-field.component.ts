import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-email-field',
  template: `
    <div class="form-group bottom-30" [ngClass]="{'form-group-error': !emailControl.valid && emailControl.touched}">

      <label [for]="id()">
        <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
        <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
        <span class="error-message" *ngIf="emailControl.errors && emailControl.touched">{{emailControl.errors | ccdFirstError}}</span>
      </label>

      <input class="form-control" [id]="id()" type="email" [formControl]="emailControl">

    </div>
  `
})
export class WriteEmailFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  emailControl: FormControl;

  ngOnInit() {
    this.emailControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
  }
}
