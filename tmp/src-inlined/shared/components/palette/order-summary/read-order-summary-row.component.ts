import { Component, Input, OnInit } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { FeeValue } from './fee-value.model';

@Component({
  // tslint:disable-next-line
  selector: '[ccdReadOrderSummaryRow]',
  template: `
    <td>{{feeValue.value.FeeCode}}</td>
    <td>{{feeValue.value.FeeDescription}}</td>
    <td><ccd-read-money-gbp-field [amount]="getFeeAmount()"></ccd-read-money-gbp-field></td>
  `,
  styles: [`
    td{padding-top:12px;padding-bottom:12px;margin:0;border-bottom:1px solid #0b0c0c;font-family:"nta",Arial,sans-serif;font-weight:400;text-transform:none;font-size:14px;line-height:1.14286}@media (min-width: 641px){td{font-size:16px;line-height:1.25}}td:nth-child(1){width:20px}td:nth-child(2){width:70%}td:nth-child(3){text-align:right;width:10%}
  `],
})
export class ReadOrderSummaryRowComponent extends AbstractFieldReadComponent implements OnInit {

  @Input()
  feeValue: FeeValue;

  ngOnInit() {
    // We don't want to register this if we don't have a caseField
    if (this.caseField) {
      super.ngOnInit();
    }
  }

  getFeeAmount(): string {
    return this.feeValue.value ? this.feeValue.value.FeeAmount : '';
  }
}
