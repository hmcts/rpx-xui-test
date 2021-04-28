import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BrowserService } from '../../../services/browser/browser.service';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';

@Component({
  selector: 'ccd-write-text-area-field',
  template: `

    <div class="form-group" [ngClass]="{'form-group-error': !textareaControl.valid && textareaControl.touched}">

      <label [for]="id()">
        <span class="form-label" *ngIf="caseField.label">{{caseField | ccdFieldLabel}}</span>
        <span class="form-hint" *ngIf="caseField.hint_text">{{caseField.hint_text}}</span>
        <span class="error-message" *ngIf="textareaControl.errors && textareaControl.touched">{{textareaControl.errors | ccdFirstError}}</span>
      </label>

      <textarea (input)="autoGrow($event)" class="form-control bottom-30" [id]="id()" rows="3" [formControl]="textareaControl"></textarea>

    </div>
  `,
  providers: [BrowserService]
})
export class WriteTextAreaFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  textareaControl: FormControl;
  constructor(private readonly browserService: BrowserService) {
    super();
  }

  ngOnInit() {
    this.textareaControl = this.registerControl(new FormControl(this.caseField.value)) as FormControl;
  }

  autoGrow(event) {
    if (this.browserService.isIEOrEdge()) {
      event.target.style.height = 'auto';
      event.target.style.height = event.target.scrollHeight + 'px';
      event.target.scrollTop = event.target.scrollHeight;
    }
  }

}
