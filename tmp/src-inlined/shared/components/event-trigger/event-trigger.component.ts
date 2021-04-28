import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseViewTrigger } from '../../domain';
import { OrderService } from '../../services';

@Component({
  selector: 'ccd-event-trigger',
  template: `
    <form *ngIf="triggers && triggers.length" class="event-trigger" (ngSubmit)="triggerSubmit()" [formGroup]="triggerForm">
      <div class="form-group">
        <label class="form-label" for="next-step">Next step</label>
        <select class="form-control ccd-dropdown" id="next-step" (change)="triggerChange()" formControlName="trigger" [ngClass]="{
              'EventTrigger-empty': !triggerForm.value['trigger']
            }">
          <option *ngIf="1 !== triggers.length" value="" data-default>Select action</option>
          <option *ngFor="let trigger of triggers" [ngValue]="trigger" [title]="trigger.description">{{trigger.name}}</option>
        </select>
      </div>
      <button [disabled]="isButtonDisabled()" type="submit" class="button">{{triggerText}}</button>
    </form>
  `,
  styles: [`
    .event-trigger{width:auto;margin-top:40px;margin-bottom:20px}.event-trigger .form-group{margin-top:3px;margin-right:10px;margin-bottom:0;float:left;text-align:right;width:325px}.event-trigger .form-group .form-label{float:left;margin-top:5px}.event-trigger select{width:250px}.event-trigger select.EventTrigger-empty,.event-trigger select [data-default]{color:#6f777b}
  `]
})
export class EventTriggerComponent implements OnChanges {

  @Input()
  triggers: CaseViewTrigger[];

  @Input()
  triggerText: string;

  @Input()
  isDisabled: boolean;

  @Output()
  onTriggerSubmit: EventEmitter<CaseViewTrigger> = new EventEmitter();

  @Output()
  onTriggerChange: EventEmitter<any> = new EventEmitter();

  triggerForm: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService) {}

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes.triggers && changes.triggers.currentValue) {
      this.triggers = this.orderService.sort(this.triggers);

      this.triggerForm = this.fb.group({
        'trigger': [this.getDefault(), Validators.required]
      });
    }
  }

  isButtonDisabled(): boolean {
    return !this.triggerForm.valid || this.isDisabled;
  }

  private getDefault(): any {
    return this.triggers.length === 1 ? this.triggers[0] : '';
  }

  triggerSubmit() {
    this.onTriggerSubmit.emit(this.triggerForm.value['trigger']);
  }

  triggerChange() {
    this.onTriggerChange.emit(null);
  }

}
