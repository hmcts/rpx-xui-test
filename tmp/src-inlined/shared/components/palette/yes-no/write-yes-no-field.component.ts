import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { YesNoService } from './yes-no.service';

@Component({
  selector: 'ccd-write-yes-no-field',
  template: `
    <div [id]="id()" class="form-group bottom-30" [ngClass]="{'form-group-error': !yesNoControl.valid && yesNoControl.touched}">

    	<fieldset class="inline">

        <legend>
          <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
          <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
          <span class="error-message" *ngIf="yesNoControl.errors && yesNoControl.touched">{{yesNoControl.errors | ccdFirstError}}</span>
        </legend>

        <div [id]="id()">

      	  <div class="multiple-choice" *ngFor="let value of yesNoValues" [ngClass]="{selected: yesNoControl.value === value}">
      	    <input class="form-control" [id]="id()+'-'+value" [attr.name]="id()" [name]="id()" type="radio" [formControl]="yesNoControl" [value]="value">
      	    <label class="form-label" [for]="id()+'-'+value">{{value}}</label>
      	  </div>

        </div>

    	</fieldset>

    </div>
  `
})
export class WriteYesNoFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  yesNoValues = [ 'Yes', 'No' ];
  yesNoControl: FormControl;

  constructor(private yesNoService: YesNoService) {
    super();
  }

  ngOnInit() {
    this.yesNoControl = this.registerControl(new FormControl(this.yesNoService.format(this.caseField.value))) as FormControl;
  }

}
