import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import 'rxjs/add/operator/do';
import { Jurisdiction, CaseState, CaseTypeLite, WorkbasketInputModel } from '../../domain';
import { JurisdictionService, AlertService, WindowService, OrderService, WorkbasketInputFilterService } from '../../services';

const FORM_GROUP_VAL_LOC_STORAGE = 'workbasket-filter-form-group-value';
const SAVED_QUERY_PARAM_LOC_STORAGE = 'savedQueryParams';
@Component({
  selector: 'ccd-workbasket-filters',
  template: `

    <h2 class="heading-h2" aria-label="Filters">Filters</h2>
    <form class="global-display">
      <div class="form-group">
        <label class="form-label" for="wb-jurisdiction">Jurisdiction</label>
        <select class="form-control form-control-3-4 ccd-dropdown" id="wb-jurisdiction"
                name="jurisdiction" [(ngModel)]="selected.jurisdiction" aria-controls="search-result"
                (change)="onJurisdictionIdChange()">
          <option *ngIf="!workbasketDefaults" [ngValue]="null">Select a value</option>
          <option *ngFor="let j of jurisdictions" [ngValue]="j">{{j.name}}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="wb-case-type">Case type</label>
        <select class="form-control form-control-3-4 ccd-dropdown" id="wb-case-type"
                name="case-type" [(ngModel)]="selected.caseType" [disabled]="isCaseTypesDropdownDisabled()"
                (change)="onCaseTypeIdChange()" aria-controls="search-result">
          <option *ngIf="!workbasketDefaults" [ngValue]="null">Select a value</option>
          <option *ngFor="let ct of selectedJurisdictionCaseTypes" [ngValue]="ct">{{ct.name}}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="wb-case-state">State</label>
        <select class="form-control form-control-3-4 ccd-dropdown" id="wb-case-state"
                name="state" [(ngModel)]="selected.caseState" [disabled]="isCaseStatesDropdownDisabled()"
                aria-controls="search-result">
          <option [ngValue]="null">Any</option>
          <option *ngFor="let cs of selectedCaseTypeStates" [ngValue]="cs">{{cs.name}}</option>
        </select>
      </div>

      <div id="dynamicFilters" *ngIf="isSearchableAndWorkbasketInputsReady()">
        <div class="form-group" *ngFor="let workbasketInput of workbasketInputs">
          <ccd-field-write [caseField]="workbasketInput.field" [formGroup]="formGroup" [isExpanded]="true" (keyup.enter)="apply(null)"></ccd-field-write>
        </div>
      </div>

      <button type="button" class="button" (click)="apply(true)" [disabled]="isApplyButtonDisabled()" >Apply</button> &nbsp;&nbsp;&nbsp;
      <button type="button" (click)="reset()" class="button button-secondary">Reset</button>
    </form>
  `,
  styles: [`
    div select{font-family:"nta",Arial,sans-serif;font-weight:400;text-transform:none;font-size:11pt;line-height:1.27273}@media (min-width: 641px){div select{font-size:12pt;line-height:1.33333}}.form-group{margin-bottom:7px}.ccd-dropdown{width:100%}span.heading-medium{margin-top:0}
  `]
})
export class WorkbasketFiltersComponent implements OnInit {

  public static readonly PARAM_JURISDICTION = 'jurisdiction';
  public static readonly PARAM_CASE_TYPE = 'case-type';
  public static readonly PARAM_CASE_STATE = 'case-state';

  @Input()
  jurisdictions: Jurisdiction[];

  @Input()
  defaults;

  @Output()
  onApply: EventEmitter<any> = new EventEmitter();

  @Output()
  onReset: EventEmitter<any> = new EventEmitter();

  workbasketInputs: WorkbasketInputModel[];
  workbasketInputsReady: boolean;

  workbasketDefaults: boolean;

  selected: {
    init?: boolean,
    jurisdiction?: Jurisdiction,
    caseType?: CaseTypeLite,
    caseState?: CaseState,
    formGroup?: FormGroup,
    page?: number,
    metadataFields?: string[]
  };

  formGroup: FormGroup = new FormGroup({});

  selectedJurisdictionCaseTypes?: CaseTypeLite[];
  selectedCaseTypeStates?: CaseState[];

  initialised = false;

  constructor(
    private route: ActivatedRoute,
    private workbasketInputFilterService: WorkbasketInputFilterService,
    private orderService: OrderService,
    private jurisdictionService: JurisdictionService,
    private alertService: AlertService,
    private windowService: WindowService) {
  }

  ngOnInit(): void {
    this.selected = {};
    this.route.queryParams.subscribe(params => {
      if (!this.initialised || !params || !Object.keys(params).length) {
        this.initFilters(false);
        this.initialised = true;
      }
    });
  }

  apply(init): void {
    // Save filters as query parameters for current route
    let queryParams = {};
    if (this.selected.jurisdiction) {
      queryParams[WorkbasketFiltersComponent.PARAM_JURISDICTION] = this.selected.jurisdiction.id;
    }
    if (this.selected.caseType) {
      queryParams[WorkbasketFiltersComponent.PARAM_CASE_TYPE] = this.selected.caseType.id;
    }
    if (this.selected.caseState) {
      queryParams[WorkbasketFiltersComponent.PARAM_CASE_STATE] = this.selected.caseState.id;
    }
    // without explicitly preserving alerts any message on the page
    // would be cleared out because of this initial navigation.
    // The above is only true if no alerts were set prior to loading case list page.
    if (!this.alertService.isPreserveAlerts()) {
      this.alertService.setPreserveAlerts(!this.initialised);
    }
    if (Object.keys(this.formGroup.controls).length === 0) {
      this.selected.formGroup = JSON.parse(localStorage.getItem(FORM_GROUP_VAL_LOC_STORAGE));
    } else {
      this.selected.formGroup = this.formGroup;
    }
    this.selected.init = init;
    this.selected.page = 1;
    this.selected.metadataFields = this.getMetadataFields();
    if (init) {
      this.windowService.setLocalStorage(SAVED_QUERY_PARAM_LOC_STORAGE, JSON.stringify(queryParams));
      if (Object.keys(this.formGroup.controls).length > 0) {
        this.windowService.setLocalStorage(FORM_GROUP_VAL_LOC_STORAGE, JSON.stringify(this.formGroup.value));
      }
    }
    // Apply filters
    this.onApply.emit({selected: this.selected, queryParams: queryParams});
  }

  reset(): void {
    this.windowService.removeLocalStorage(FORM_GROUP_VAL_LOC_STORAGE);
    this.windowService.removeLocalStorage(SAVED_QUERY_PARAM_LOC_STORAGE);
    setTimeout (() => {
      this.resetFieldsWhenNoDefaults();
      this.onReset.emit(true);
    }, 500);
  }

  getMetadataFields(): string[] {
    if (this.workbasketInputs) {
      return this.workbasketInputs
        .filter(workbasketInput => workbasketInput.field.metadata === true)
        .map(workbasketInput => workbasketInput.field.id);
    }
  }

  onJurisdictionIdChange() {
    if (this.selected.jurisdiction) {
      this.jurisdictionService.announceSelectedJurisdiction(this.selected.jurisdiction);
      this.selectedJurisdictionCaseTypes = this.selected.jurisdiction.caseTypes.length > 0 ? this.selected.jurisdiction.caseTypes : null;
      // Line was too long for linting so refactored it.
      if (this.workbasketDefaults && this.selectedJurisdictionCaseTypes) {
        this.selected.caseType = this.selectedJurisdictionCaseTypes[0];
      } else {
        this.selected.caseType = null;
      }
      this.selected.caseState = null;
      this.clearWorkbasketInputs();
      if (!this.isApplyButtonDisabled()) {
        this.onCaseTypeIdChange();
      }
    } else {
      this.resetCaseType();
      this.resetCaseState();
    }
  }

  onCaseTypeIdChange(): void {
    if (this.selected.caseType) {
      this.selectedCaseTypeStates = this.sortStates(this.selected.caseType.states);
      this.selected.caseState = null;
      this.formGroup = new FormGroup({});
      this.clearWorkbasketInputs();
      if (!this.isApplyButtonDisabled()) {
        this.workbasketInputFilterService.getWorkbasketInputs(this.selected.jurisdiction.id, this.selected.caseType.id)
          .subscribe(workbasketInputs => {
            this.workbasketInputsReady = true;
            this.workbasketInputs = workbasketInputs
              .sort(this.orderService.sortAsc);
            const formValue = this.windowService.getLocalStorage(FORM_GROUP_VAL_LOC_STORAGE);

            workbasketInputs.forEach(item => {
              if (item.field.elementPath) {
                item.field.id = item.field.id + '.' + item.field.elementPath;
              }
              item.field.label = item.label;
              if (formValue) {
                const searchFormValueObject = JSON.parse(formValue);
                item.field.value = searchFormValueObject[item.field.id];
              }
            });

          }, error => {
            console.log('Workbasket input fields request will be discarded reason: ', error.message);
          });
      }
    } else {
      this.resetCaseState();
    }
  }

  isCaseTypesDropdownDisabled(): boolean {
    return !this.selectedJurisdictionCaseTypes;
  }

  isCaseStatesDropdownDisabled(): boolean {
    return !this.selected.caseType || !(this.selected.caseType.states && this.selected.caseType.states.length > 0);
  }

  isApplyButtonDisabled(): boolean {
    return !(this.selected.jurisdiction && this.selected.caseType);
  }

  private sortStates(states: CaseState[]) {
    return states.sort(this.orderService.sortAsc);
  }

  /**
   * Try to initialise filters based on query parameters or workbasket defaults.
   * Query parameters, when available, take precedence over workbasket defaults.
   */
  private initFilters(init: boolean) {
    const savedQueryParams = this.windowService.getLocalStorage(SAVED_QUERY_PARAM_LOC_STORAGE);
    let routeSnapshot: ActivatedRouteSnapshot = this.route.snapshot;
    if (savedQueryParams) {
      routeSnapshot.queryParams = JSON.parse(savedQueryParams);
    }
    let selectedJurisdictionId = routeSnapshot.queryParams[WorkbasketFiltersComponent.PARAM_JURISDICTION] ||
      (this.defaults && this.defaults.jurisdiction_id);
    if (selectedJurisdictionId) {
      this.selected.jurisdiction = this.jurisdictions.find(j => selectedJurisdictionId === j.id);
      if (this.selected.jurisdiction && this.selected.jurisdiction.caseTypes.length > 0) {
        this.selectedJurisdictionCaseTypes = this.selected.jurisdiction.caseTypes;
        this.selected.caseType = this.selectCaseType(this.selected, this.selectedJurisdictionCaseTypes, routeSnapshot);
        if (this.selected.caseType) {
          this.onCaseTypeIdChange();
          this.selected.caseState = this.selectCaseState(this.selected.caseType, routeSnapshot);
        }
        this.workbasketDefaults = true;
      }
    } else {
      this.selected.jurisdiction = null;
    }
    this.apply(init);
  }

  private selectCaseState(caseType: CaseTypeLite, routeSnapshot: ActivatedRouteSnapshot): CaseState {
    let caseState;
    if (caseType) {
      let selectedCaseStateId = this.selectCaseStateIdFromQueryOrDefaults(routeSnapshot, (this.defaults && this.defaults.state_id));
      caseState = caseType.states.find(ct => selectedCaseStateId === ct.id);
    }
    return caseState ? caseState : null;
  }

  private selectCaseStateIdFromQueryOrDefaults(routeSnapshot: ActivatedRouteSnapshot, defaultCaseStateId: string): string {
    return routeSnapshot.queryParams[WorkbasketFiltersComponent.PARAM_CASE_STATE] || defaultCaseStateId;
  }

  private selectCaseType(selected: any, caseTypes: CaseTypeLite[], routeSnapshot: ActivatedRouteSnapshot): CaseTypeLite {
    let caseType;
    if (selected.jurisdiction) {
      let selectedCaseTypeId = this.selectCaseTypeIdFromQueryOrDefaults(routeSnapshot, (this.defaults && this.defaults.case_type_id));
      caseType = caseTypes.find(ct => selectedCaseTypeId === ct.id);
    }
    return caseType ? caseType : caseTypes[0];
  }

  private selectCaseTypeIdFromQueryOrDefaults(routeSnapshot: ActivatedRouteSnapshot, defaultCaseTypeId: string): string {
    return routeSnapshot.queryParams[WorkbasketFiltersComponent.PARAM_CASE_TYPE] || defaultCaseTypeId;
  }

  isSearchableAndWorkbasketInputsReady(): boolean {
    return this.selected.jurisdiction && this.selected.caseType && this.workbasketInputsReady;
  }

  private resetFieldsWhenNoDefaults() {
    this.resetCaseState();
    this.resetCaseType();
    this.clearWorkbasketInputs();
    this.workbasketDefaults = false;
    this.selected.jurisdiction = null;
    this.initialised = false;
    this.initFilters(true);
  }

  private clearWorkbasketInputs() {
    this.workbasketInputsReady = false;
    this.workbasketInputs = [];
  }

  private resetCaseState() {
    this.defaults.state_id = null;
    this.selected.caseState = null;
    this.selectedCaseTypeStates = null;
  }

  private resetCaseType() {
    this.selected.caseType = undefined; // option should be blank rather than "Select a value" in case of reset.
    this.selectedJurisdictionCaseTypes = null;
  }
}
