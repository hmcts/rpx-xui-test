import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'ccd-remove-dialog',
  template: `

    <div>
      <div class="dialog-header">
        <h2 (click)="cancel()" class="heading-h2 x">X</h2>
      </div>
      <div>
        <h2 class="heading-h2 dialog-title">Are you sure you want to remove the item</h2>
      </div>
      <div class="dialog-info">
        <span class="text-info">You are about to permanently remove an item, are you sure you want to
        remove this item?</span>
      </div>
      <div>
        <button type="button" title="Remove" class="button action-button" (click)="remove()">Remove</button>
        <button type="button" title="Cancel" class="button button-secondary" (click)="cancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .x{margin:0;padding:9px 9px 0px 0px;font-size:24px;font-weight:bold;font-style:normal;font-stretch:normal;cursor:pointer;color:#6e7071}.dialog-header{text-align:right}.dialog-title{margin:0px 0px 21px 25px}.dialog-info{margin:0px 0px 21px 25px}.action-button{margin:0px 15px 0px 25px}
  `]
})
export class RemoveDialogComponent {

  result: string;

  constructor(private matDialogRef: MatDialogRef<RemoveDialogComponent>) {}

  remove() {
    this.result = 'Remove';
    this.matDialogRef.close(this.result);
  }
  cancel() {
    this.result = 'Cancel';
    this.matDialogRef.close(this.result);
  }
}
