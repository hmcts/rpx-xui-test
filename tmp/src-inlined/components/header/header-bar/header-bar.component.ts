import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'cut-header-bar',
    template: `
      <header role="banner" id="global-header" class="with-proposition">
        <div [class.full-screen]="!isSolicitor" class="header-wrapper">

          <div class="header-global" [class.header-logo]="isSolicitor">
            <div *ngIf="isSolicitor">
              <a href="https://www.gov.uk" title="Go to the GOV.UK homepage" id="logo" class="content" style="margin-left: 0px;">
                <img src="/img/gov.uk_logotype_crown_invert_trans.png?0.23.0" width="36" height="32" alt=""> GOV.UK
              </a>
            </div>
            <div class="global-header" *ngIf="!isSolicitor">
              <div class="title">
                <span>{{title}}</span>
              </div>
            </div>
          </div>

          <div class="header-proposition">
            <div class="content">
              <a href="#proposition-links" class="js-header-toggle menu">Menu</a>
              <div *ngIf="isSolicitor" id="proposition-menu">
                <div class="title-solicitor">
                  <span id="proposition-name">{{title}}</span>
                  <ng-content select="[headerNavigation]"></ng-content>
                </div>
              </div>

              <div class="proposition-right">
                <span id="user-name">{{username}}</span>
                <a (click)="signOut()" id="sign-out" href="javascript:void(0)">Sign Out</a>
              </div>
            </div>
          </div>

        </div>
      </header>
    `,
    styles: [`
      .global-header:after,.global-header .header-title:after,.global-header .header-username:after,.title:after{content:"";display:block;clear:both}.global-header{background-color:#000;width:100%}.global-header .header-title{font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:16pt;line-height:1.25;float:left;font-weight:bold;color:#fff;position:relative;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}@media (min-width: 641px){.global-header .header-title{font-size:20pt;line-height:1.3}}@media (min-width: 769px){.global-header .header-title{width:50%}}@media screen and (max-width: 379px){.global-header .header-title{width:auto;float:none}}.global-header .header-title .header-title-span{padding-left:22px}.global-header .header-username{font-family:"nta",Arial,sans-serif;font-weight:400;text-transform:none;font-size:12pt;line-height:1.25;float:right;text-align:right;color:#fff;position:relative;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%)}@media (min-width: 641px){.global-header .header-username{font-size:14pt;line-height:1.42857}}@media (min-width: 769px){.global-header .header-username{width:50%}}.global-header .header-username .header-username-span{padding-right:15px}#global-header .full-screen{max-width:100%}.title{font-weight:bold;color:#fff;font-size:24px}.title-solicitor{float:left}.proposition-right{float:right;padding-top:5px}#global-header.with-proposition .header-wrapper .header-logo{width:27%}#global-header.with-proposition .header-wrapper .header-proposition{width:100%;float:none}#global-header.with-proposition .header-wrapper .header-proposition .content{margin:0}#user-name,#sign-out{font-size:16px;font-weight:bold;border:none;color:white;margin:0 0 0 9px;text-decoration:none;background-color:#000}#user-name:focus,#sign-out:focus{color:#fff}#sign-out:hover{text-decoration:underline}
    `]
})
export class HeaderBarComponent {

  @Input()
  public title: string;

  @Input()
  public isSolicitor: boolean;

  @Input()
  public username: string;

  @Output()
  private signOutRequest: EventEmitter<any> = new EventEmitter();

  public signOut() {
    this.signOutRequest.emit();
  }
}
