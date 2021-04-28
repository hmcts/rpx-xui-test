import { Component } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { FeeValue } from './fee-value.model';

@Component({
  selector: 'ccd-read-order-summary-field',
  template: `
    <div class="order-summary-title">Order Summary</div>
    <table>
        <thead>
          <tr><td>Code</td><td>Description</td><td>Amount</td></tr>
        </thead>
        <tbody>
            <tr ccdReadOrderSummaryRow *ngFor="let feeValue of getFees()" [feeValue]="feeValue"></tr>
            <tr>
                <td></td>
                <td class="payment-total">Total</td>
                <td><ccd-read-money-gbp-field [amount]="getPaymentTotal()"></ccd-read-money-gbp-field></td>
            </tr>
        </tbody>
    </table>
  `,
  styles: [`
    .order-summary-title{border:0;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:18px;line-height:1.2}@media (min-width: 641px){.order-summary-title{font-size:24px;line-height:1.25}}table{margin-bottom:23px}table thead tr td{margin:0;border-bottom:1px solid #0b0c0c;padding-top:41px;padding-bottom:36px;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:14px;line-height:1.14286}@media (min-width: 641px){table thead tr td{font-size:16px;line-height:1.25}}table thead tr td:nth-child(3){text-align:right}table tbody tr td{padding-top:12px;padding-bottom:12px;margin:0;border-bottom:1px solid #0b0c0c;font-family:"nta",Arial,sans-serif;font-weight:400;text-transform:none;font-size:14px;line-height:1.14286}@media (min-width: 641px){table tbody tr td{font-size:16px;line-height:1.25}}table tbody tr td:nth-child(1){width:20px}table tbody tr td:nth-child(2){width:70%}table tbody tr td:nth-child(3){text-align:right;width:10%}table tbody tr:last-child td:nth-child(1){border-bottom:0px}table tbody tr:last-child td:nth-child(2){font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:14px;line-height:1.14286;text-align:right;border-bottom:0px}@media (min-width: 641px){table tbody tr:last-child td:nth-child(2){font-size:16px;line-height:1.25}}
  `],
})
export class ReadOrderSummaryFieldComponent extends AbstractFieldReadComponent {

  getFees(): FeeValue[] {
    return this.caseField.value ? this.caseField.value.Fees : [];
  }

  getPaymentTotal(): string {
    return this.caseField.value ? this.caseField.value.PaymentTotal : '';
  }
}
