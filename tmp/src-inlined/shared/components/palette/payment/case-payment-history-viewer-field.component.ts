import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { Component } from '@angular/core';
import { AbstractAppConfig } from '../../../../app.config';

@Component({
  selector: 'ccd-case-payment-history-viewer-field',
  template: `
    <ccpay-payment-lib [API_ROOT]="getBaseURL()" [CCD_CASE_NUMBER]="caseReference" [BULKSCAN_API_ROOT]="getPayBulkScanBaseURL()" [SELECTED_OPTION]="'CCDorException'" [ISBSENABLE]="'true'"></ccpay-payment-lib>
  `,
})
export class CasePaymentHistoryViewerFieldComponent extends AbstractFieldReadComponent {

  constructor(
    private appConfig: AbstractAppConfig
  ) {
    super();
  }

  getBaseURL() {
    return this.appConfig.getPaymentsUrl();
  }

  getPayBulkScanBaseURL() {
    return this.appConfig.getPayBulkScanBaseUrl();
  }

}
