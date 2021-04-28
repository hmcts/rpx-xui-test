import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-text-field',
  template: `
    <div class="form-group" [ngClass]="{'form-group-error': !textControl.valid && textControl.touched}">

      <label [for]="id()">
        <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
        <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
        <span class="error-message" *ngIf="textControl.errors && textControl.touched">{{textControl.errors | ccdFirstError}}</span>
      </label>
      <input class="form-control bottom-30" [id]="id()" type="text" [formControl]="textControl">

    </div>
  `
})
export class WriteTextFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  textControl: FormControl;

  ngOnInit() {
    this.textControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
  }
}
