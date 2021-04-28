import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ccd-activity-banner',
  template: `
    <div [ngClass]="{caseLocked: bannerType === 'editor', someoneViewing: bannerType === 'viewer'}">
      <div class="bannerIcon"><img alt="{{description}}" class="img-responsive" src="{{imageLink}}" /></div>
      <div class="bannerText">{{description}}</div>
    </div>
  `,
  styles: [`
    .caseLocked{margin-top:4px;height:40px;-webkit-filter:blur(0);filter:blur(0);background-color:#e72626}.someoneViewing{margin-top:4px;height:40px;-webkit-filter:blur(0);filter:blur(0);background-color:#912b88}.bannerIcon{float:left;color:#FFFFFF;padding-left:9px;position:relative;top:50%;transform:translateY(-40%)}.bannerText{padding-left:40px;position:relative;top:50%;transform:translateY(-50%);height:20px;-webkit-filter:blur(0);filter:blur(0);font-family:"nta", Arial, sans-serif;font-size:16px;font-weight:bold;line-height:1.25;text-align:left;color:#ffffff}
  `]
})
export class ActivityBannerComponent implements OnInit {
  @Input()
  public bannerType: string;

  @Input()
  public description: string;

  @Input()
  public imageLink: string;

  constructor() { }

  ngOnInit() {
  }
}
