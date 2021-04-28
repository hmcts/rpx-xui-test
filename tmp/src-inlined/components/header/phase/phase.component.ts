import { Component, Input } from '@angular/core';

@Component({
    selector: 'cut-phase-bar',
    template: `
      <div [class.full-screen]="!isSolicitor" class="phase-banner">
        <p>
          <strong class="phase-tag">{{phaseLabel}}</strong>
          <span class="text-16">This is a new service – your <a href="{{phaseLink}}" target="_blank">feedback</a> will help us to improve it.</span>
        </p>
      </div>
    `,
    styles: [`
      .phase-banner{padding-top:10px;padding-left:15px;border-bottom:1px solid #bfc1c3;max-width:1005px;margin:0 auto}@media (min-width: 641px){.phase-banner{padding-bottom:10px}}.phase-banner p{display:table;margin:0;color:#000;font-family:"nta",Arial,sans-serif;font-weight:400;text-transform:none;font-size:11pt;line-height:1.27273}@media (min-width: 641px){.phase-banner p{font-size:12pt;line-height:1.33333}}.phase-banner .phase-tag{display:-moz-inline-stack;display:inline-block;margin:0 8px 0 0;padding:2px 5px 0;font-family:"nta",Arial,sans-serif;font-weight:700;text-transform:none;font-size:11pt;line-height:1.27273;text-transform:uppercase;letter-spacing:1px;text-decoration:none;color:#fff;background-color:#005ea5}@media (min-width: 641px){.phase-banner .phase-tag{font-size:12pt;line-height:1.25}}.phase-banner span{display:table-cell;vertical-align:baseline}.full-screen{max-width:100%}
    `]
})
export class PhaseComponent {

  @Input()
  public phaseLabel: string;

  @Input()
  public phaseLink: string;

  @Input()
  public isSolicitor: boolean;

}
