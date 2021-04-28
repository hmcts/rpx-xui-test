import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'ccd-save-or-discard-dialog',
  template: `

    <div>
      <div class="dialog-header">
        <h2 (click)="cancel()" class="heading-h2 x">X</h2>
      </div>
      <div>
        <h2 class="heading-h2 dialog-title">Would you like to save changes to this page?</h2>
      </div>
      <div class="dialog-info">
        <span class="text-info">You will be taken back to your case list.</span>
      </div>
      <div>
        <button type="button" title="Save" class="button action-button" (click)="save()">Save</button>
        <button type="button" title="Discard" class="button button-secondary" (click)="discard()">Discard</button>
      </div>
    </div>
  `,
  styles: [`
    .x{margin:0;padding:9px 9px 0px 0px;font-size:24px;font-weight:bold;font-style:normal;font-stretch:normal;cursor:pointer;color:#6e7071}.dialog-header{text-align:right}.dialog-title{margin:0px 0px 21px 25px}.dialog-info{margin:0px 0px 21px 25px}.action-button{margin:0px 15px 0px 25px}
  `]
})
export class SaveOrDiscardDialogComponent {

  result: string;

  constructor(private matDialogRef: MatDialogRef<SaveOrDiscardDialogComponent>) {}

  cancel() {
    this.result = 'Cancel';
    this.matDialogRef.close(this.result);
  }
  save() {
    this.result = 'Save';
    this.matDialogRef.close(this.result);
  }
  discard() {
    this.result = 'Discard';
    this.matDialogRef.close(this.result);
  }
}
