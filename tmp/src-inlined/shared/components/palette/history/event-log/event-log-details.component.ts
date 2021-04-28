import { Component, Input } from '@angular/core';
import { CaseViewEvent } from '../../../../domain';

@Component({
  selector: 'ccd-event-log-details',
  template: `
    <table class="EventLogDetails">
      <caption><h2 class="heading-h2">Details</h2></caption>
      <tbody>
        <tr>
          <th><span class="text-16">Date</span></th>
          <td>
            <div class="tooltip text-16">{{event.timestamp | ccdDate : 'utc'}}
              <span class="tooltiptext text-16">Local: {{event.timestamp | ccdDate : 'local'}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <th><span class="text-16">Author</span></th>
          <td><span class="text-16">{{event.user_first_name | titlecase}} {{event.user_last_name | uppercase}}</span></td>
        </tr>
        <tr>
          <th><span class="text-16">End state</span></th>
          <td><span class="text-16">{{event.state_name}}</span></td>
        </tr>
        <tr>
          <th><span class="text-16">Event</span></th>
          <td><span class="text-16">{{event.event_name}}</span></td>
        </tr>
        <tr>
          <th><span class="text-16">Summary</span></th>
          <td><span class="text-16">{{event.summary | ccdDash}}</span></td>
        </tr>
        <tr>
          <th><span class="text-16">Comment</span></th>
          <td><span class="text-16">{{event.comment | ccdDash}}</span></td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .EventLogDetails th,.EventLogDetails td{border-bottom:none}
  `]
})
export class EventLogDetailsComponent {
  @Input()
  event: CaseViewEvent;
}
