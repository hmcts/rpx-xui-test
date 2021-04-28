import { Component, Input } from '@angular/core';

@Component({
    selector: 'cut-nav-bar',
    template: `
      <div>
        <nav [class.full-screen]="!isSolicitor" class="cut-nav-bar">
            <ng-content select="[leftNavLinks]"></ng-content>
            <ng-content select="[rightNavLinks]"></ng-content>
        </nav>
      </div>
    `,
    styles: [`
      .cut-nav-bar:after{content:"";display:block;clear:both}.cut-nav-bar{background-color:#005ea5;max-width:990px;margin:0 auto;height:55px;padding:0 15px 0 15px}.full-screen{max-width:100%}
    `]
})
export class NavigationComponent {

  @Input()
  public isSolicitor: boolean;

}
