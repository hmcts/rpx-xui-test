import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Jurisdiction } from '../../domain/definition/jurisdiction.model';
import { CaseTypeLite } from '../../domain/definition/case-type-lite.model';
import { CaseEvent } from '../../domain/definition/case-event.model';
import { CreateCaseFiltersSelection } from './create-case-filters-selection.model';
import { CREATE_ACCESS } from '../../domain/case-view/access-types.model';
import { DefinitionsService, OrderService } from '../../services';

@Component({
  selector: 'ccd-create-case-filters',
  template: `
    <form  (ngSubmit)="apply()">
      <div class="form-group">
        <label class="form-label" for="cc-jurisdiction">Jurisdiction</label>
        <select class="form-control ccd-dropdown" id="cc-jurisdiction" name="jurisdiction" [formControl]="filterJurisdictionControl" (change)="onJurisdictionIdChange()">
          <option value="">--Select a value--</option>
          <option *ngFor="let j of jurisdictions" [value]="j.id">{{j.name}}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="cc-case-type">Case type</label>
        <select class="form-control ccd-dropdown" id="cc-case-type" name="case-type" [formControl]="filterCaseTypeControl" (change)="onCaseTypeIdChange()">
          <option value="">--Select a value--</option>
          <option *ngFor="let ct of selectedJurisdictionCaseTypes" [value]="ct.id">{{ct.name}}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="cc-event">Event</label>
        <select class="form-control ccd-dropdown" id="cc-event" name="event" [formControl]="filterEventControl" (change)="onEventIdChange()">
          <option value="">--Select a value--</option>
          <option *ngFor="let e of selectedCaseTypeEvents" [value]="e.id">{{e.name}}</option>
        </select>
      </div>

      <button type="submit" class="button" [disabled]="!isCreatable()">{{startButtonText}}</button>
    </form>
  `
})
export class CreateCaseFiltersComponent implements OnInit {

  @Input()
  isDisabled: boolean;
  @Input()
  startButtonText: string;
  @Output()
  selectionSubmitted: EventEmitter<CreateCaseFiltersSelection> = new EventEmitter();
  @Output()
  selectionChanged: EventEmitter<any> = new EventEmitter();

  formGroup: FormGroup = new FormGroup({});

  selected: {
    jurisdiction?: Jurisdiction,
    caseType?: CaseTypeLite,
    event?: CaseEvent,
    formGroup?: FormGroup
  };

  jurisdictions: Jurisdiction[];
  selectedJurisdictionCaseTypes?: CaseTypeLite[];
  selectedCaseTypeEvents?: CaseEvent[];

  filterJurisdictionControl: FormControl;
  filterCaseTypeControl: FormControl;
  filterEventControl: FormControl;

  constructor(
    private orderService: OrderService,
    private definitionsService: DefinitionsService,
  ) { }

  ngOnInit() {
    this.selected = {};
    this.initControls();
    this.definitionsService.getJurisdictions(CREATE_ACCESS)
      .subscribe(jurisdictions => {
        this.jurisdictions = jurisdictions;
        this.selectJurisdiction(this.jurisdictions, this.filterJurisdictionControl);
      });
    if (document.getElementById('cc-jurisdiction')) {
      document.getElementById('cc-jurisdiction').focus();
    }
  }

  onJurisdictionIdChange(): void {
    this.resetCaseType();
    this.resetEvent();
    if (this.filterJurisdictionControl.value !== '') {
      this.formGroup.controls['caseType'].enable();
      this.selected.jurisdiction = this.findJurisdiction(this.jurisdictions, this.filterJurisdictionControl.value);
      this.selectedJurisdictionCaseTypes = this.selected.jurisdiction.caseTypes;
      this.selectCaseType(this.selectedJurisdictionCaseTypes, this.filterCaseTypeControl);
    }
  }

  onCaseTypeIdChange(): void {
    this.resetEvent();
    if (this.filterCaseTypeControl.value !== '') {
      this.selected.caseType = this.findCaseType(this.selectedJurisdictionCaseTypes, this.filterCaseTypeControl.value);
      this.formGroup.controls['event'].enable();
      this.selectedCaseTypeEvents = this.sortEvents(this.selected.caseType.events);
      this.selectEvent(this.selectedCaseTypeEvents, this.filterEventControl);
    }
  }

  onEventIdChange(): void {
    this.emitChange();
    if (this.filterEventControl.value !== '') {
      this.selected.event = this.findEvent(this.selectedCaseTypeEvents, this.filterEventControl.value);
    } else {
      this.selected.event = null;
    }
  }

  isCreatable(): boolean {
    return !this.isEmpty(this.selected) &&
      !this.isEmpty(this.selected.jurisdiction) &&
      !this.isEmpty(this.selected.caseType) &&
      !this.isEmpty(this.selected.event) &&
      !this.isDisabled;
  }

  apply() {
    this.selectionSubmitted.emit({
      jurisdictionId: this.selected.jurisdiction.id,
      caseTypeId: this.selected.caseType.id,
      eventId: this.selected.event.id
    });
  }

  private sortEvents(events: CaseEvent[]) {
    return this.orderService.sort(this.retainEventsWithNoPreStates(events));
  }

  private retainEventsWithNoPreStates(events: CaseEvent[]) {
    return events.filter(event => event.pre_states.length === 0);
  }

  private selectJurisdiction(jurisdictions: Jurisdiction[], filterJurisdictionControl: FormControl) {
    if (jurisdictions.length === 1) {
      filterJurisdictionControl.setValue(jurisdictions[0].id);
      this.onJurisdictionIdChange();
    }
  }

  private selectCaseType(caseTypes: CaseTypeLite[], filterCaseTypeControl: FormControl) {
    if (caseTypes.length === 1) {
      filterCaseTypeControl.setValue(caseTypes[0].id);
      this.onCaseTypeIdChange();
    }
  }

  private selectEvent(events: CaseEvent[], filterEventControl: FormControl) {
    if (events.length === 1) {
      filterEventControl.setValue(events[0].id);
      this.onEventIdChange();
    }
  }

  private findJurisdiction(jurisdictions: Jurisdiction[], id: string): Jurisdiction {
    return jurisdictions.find(j => j.id === id);
  }

  private findCaseType(caseTypes: CaseTypeLite[], id: string): CaseTypeLite {
    return caseTypes.find(caseType => caseType.id === id);
  }

  private findEvent(events: CaseEvent[], id: string): CaseEvent {
    return events.find(event => event.id === id);
  }

  initControls(): void {
    this.filterJurisdictionControl = new FormControl('');
    this.formGroup.addControl('jurisdiction', this.filterJurisdictionControl);
    this.filterCaseTypeControl = new FormControl({ value: '', disabled: true });
    this.formGroup.addControl('caseType', this.filterCaseTypeControl);
    this.filterEventControl = new FormControl({ value: '', disabled: true });
    this.formGroup.addControl('event', this.filterEventControl);
  }

  private resetCaseType(): void {
    this.emitChange();
    this.filterCaseTypeControl.setValue('');
    this.selected.caseType = null;
    this.selectedJurisdictionCaseTypes = [];
    this.formGroup.controls['caseType'].disable();
  }

  private resetEvent(): void {
    this.emitChange();
    this.filterEventControl.setValue('');
    this.selected.event = null;
    this.selectedCaseTypeEvents = [];
    this.formGroup.controls['event'].disable();
  }

  emitChange(): void {
    setTimeout(() => { // workaround to prevent 'ExpressionChangedAfterItHasBeenCheckedError'
      if (this.selectionChanged) {
        this.selectionChanged.emit();
      }
    }, 0);
  }

  private isEmpty(value: any): boolean {
    return value === null || value === undefined;
  }
}
