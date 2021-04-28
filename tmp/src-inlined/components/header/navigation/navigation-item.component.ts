import { Component, Input } from '@angular/core';

@Component({
    selector: 'cut-nav-item',
    template: `
      <div>
        <a [routerLinkActive]="'item-bold'" [routerLink]="link">{{label}}</a>
        <input type="image" alt="{{label}} button" *ngIf="imageLink" src="{{imageLink}}"/>
      </div>
    `,
    styles: [`
      a{color:#fff;text-decoration:none;padding-right:10px;font-size:18px}a.active{color:#fff}a:focus{background-color:#005ea5;color:#fff}input{float:right;background-color:#00823b;margin-top:-3px}.item-bold{font-size:18px;font-weight:bold}
    `]
})
export class NavigationItemComponent {

  @Input()
  public label: string;

  @Input()
  public link: string;

  @Input()
  public imageLink: string;

}
