import { Component, Input } from '@angular/core';

enum AlertMessageType {
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error'
}

@Component({
  selector: 'cut-alert',
  template: `
    <div [ngClass]="{'hmcts-banner hmcts-banner--warning':type === alertMessageType.WARNING || type === alertMessageType.ERROR}">
      <div [ngClass]="{'hmcts-banner hmcts-banner--success':type === alertMessageType.SUCCESS}">
        <ng-container [ngSwitch]="type">
          <ng-container *ngSwitchCase="alertMessageType.WARNING">
            <svg class="hmcts-banner__icon" fill="currentColor" role="presentation" focusable="false"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
              <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"></path>
            </svg>
          </ng-container>
          <ng-container *ngSwitchCase="alertMessageType.ERROR">
            <svg class="hmcts-banner__icon" fill="currentColor" role="presentation" focusable="false"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
              <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"></path>
            </svg>
          </ng-container>
          <ng-container *ngSwitchCase="alertMessageType.SUCCESS">
            <svg class="hmcts-banner__icon" fill="currentColor" role="presentation" focusable="false"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
              <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"></path>
            </svg>
          </ng-container>
        </ng-container>
        <div class="hmcts-banner__message">
          <span class="hmcts-banner__assistive">{{type}}</span>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert:after{content:'';display:table;clear:both}.alert{color:#fff;padding:10px;font-size:16px;line-height:1.25}.alert-error{background-color:#df3034}.alert-warning{background-color:#912b88}.alert-success,.alert-confirmation{background-color:#006435}.alert-success .icon-tick,.alert-confirmation .icon-tick{height:20px;width:20px;background-size:cover}.alert-message{color:#fff;display:table-cell;font-weight:bold}.alert-message a,.alert-message a:visited{color:#fff;text-decoration:underline}.alert .icon{display:table-cell;vertical-align:top}.alert .icon+.alert-message{padding-left:10px}
  `]
})
export class AlertComponent {

  // confirmation type has been removed as per EUI-3232
  public static readonly TYPE_WARNING = 'warning';
  public static readonly TYPE_SUCCESS = 'success';
  public static readonly TYPE_ERROR = 'error';

  @Input()
  public type: AlertMessageType;
  alertMessageType = AlertMessageType;

  @Input()
  public showIcon = true;

}
