import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ccd-activity-icon',
  template: `
    <div class="tooltip">
      <img alt="{{description}}" class="img-responsive" src="{{imageLink}}" />
      <span class="tooltiptext">{{description}}</span>
    </div>
  `,
  styles: [`
    .tooltip{position:relative;display:inline-block}.tooltip .tooltiptext{visibility:hidden;width:140px;background-color:#1175B2;color:#fff;text-align:center;border-radius:6px;padding:5px 0px;position:absolute;z-index:1;margin-left:-50px;opacity:0;transition:opacity 1s}.tooltip:hover .tooltiptext{visibility:visible;opacity:1}
  `]
})
export class ActivityIconComponent implements OnInit {
  @Input()
  public description: string;

  @Input()
  public imageLink: string;

  constructor() { }

  ngOnInit() {
  }
}
