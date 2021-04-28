import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-money-gbp-field',
  template: `
    <div class="form-group bottom-30" [ngClass]="{'form-group-error': !moneyGbpControl.valid && moneyGbpControl.touched}">

      <label [for]="id()">
        <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
        <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
        <span class="error-message" *ngIf="moneyGbpControl.errors && moneyGbpControl.touched">{{moneyGbpControl.errors | ccdFirstError}}</span>
      </label>

      <div class="form-money">
        <span class="form-currency">&#163;</span>
        <ccd-money-gbp-input [id]="id()"
                             [name]="id()"
                             [mandatory]="caseField | ccdIsMandatory"
                             [formControl]="moneyGbpControl"></ccd-money-gbp-input>
      </div>

    </div>
  `
})
export class WriteMoneyGbpFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  moneyGbpControl: FormControl;

  ngOnInit() {
    this.moneyGbpControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
  }
}
