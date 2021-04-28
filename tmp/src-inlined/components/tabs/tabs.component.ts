import { Component, QueryList, ContentChildren, ElementRef, ViewChildren, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cut-tabs',
  template: `
    <div class="tabs">

      <ul class="tabs-list" role="list">
        <li class="tabs-list-item" *ngFor="let panel of panels">
          <a
            class="tabs-toggle"
            [routerLink]="['.']"
            [fragment]="panel.id"
            role="tab"
            (click)="show(panel.id)"
            [attr.aria-controls]="panel.id"
            [attr.aria-selected]="panel.selected"
            tabindex="0"
            [ngClass]="{
              'tabs-toggle-selected': panel.selected
            }"
            #tab
          >{{panel.title}}</a>
        </li>
      </ul>

      <div class="tabs-content">
        <ng-content></ng-content>
      </div>

    </div>
  `,
  styles: [`
    .tabs-toggle{display:block;padding-right:15px;padding-left:15px;padding-top:10px;padding-bottom:3px;margin-bottom:8px}.tabs-toggle[aria-selected=true]{color:#0b0c0c;text-decoration:none;border-bottom:none}.tabs-toggle a{color:#005ea5}@media (max-width: 640px){.tabs-list{border-bottom:1px solid #bfc1c3;margin-left:-15px;margin-right:-15px}.tabs-toggle{border-top:1px solid #bfc1c3}.tabs-toggle:focus{color:#0b0c0c;outline:none}}@media (min-width: 641px){.tabs-panel{border-top:1px solid #bfc1c3;clear:both;overflow:hidden}.tabs-list{float:left}.tabs-list-item{float:left;position:relative;bottom:-1px;padding-top:10px}.tabs-toggle{background-color:#dee0e2;border:1px solid transparent;float:left;margin-top:0px;margin-bottom:0px;margin-right:6px;margin-left:0px;text-decoration:none}.tabs-toggle:visited{color:#005ea5}.tabs-toggle-selected,.tabs-toggle[aria-selected=true]{background-color:#fff;border-bottom:0px;border-color:#bfc1c3;padding-bottom:11px;margin-bottom:0px;color:#0b0c0c}}
  `],
})
export class TabsComponent implements AfterContentInit {

  @ViewChildren('tab')
  public tabs: QueryList<ElementRef>;

  @ContentChildren(TabComponent)
  public panels: QueryList<TabComponent>;

  private panelIds: string[] = [];

  constructor(private route: ActivatedRoute) {}

  public ngAfterContentInit(): void {
    this.panels.forEach((panel) => this.panelIds.push(panel.id));

    this.show(this.route.snapshot.fragment);
  }

  public show(id: string) {
    const panels: TabComponent[] = this.panels.toArray();

    id = id || panels[0].id;

    if (0 > this.panelIds.indexOf(id)) {
      id = panels[0].id;
    }

    panels.forEach((panel) => panel.selected = id === panel.id);
  }
}
