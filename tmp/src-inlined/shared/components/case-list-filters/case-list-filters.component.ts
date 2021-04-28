import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { READ_ACCESS } from '../../domain/case-view/access-types.model';
import { DefinitionsService } from '../../services';
import { Jurisdiction } from '../../domain';

@Component({
  selector: 'ccd-case-list-filters',
  template: `
    <ccd-workbasket-filters
      *ngIf="isVisible"
      [jurisdictions]="jurisdictions"
      [defaults]="defaults"
      (onApply)="onWrapperApply($event)"
      (onReset)="onWrapperReset($event)"
    ></ccd-workbasket-filters>
  `
})
export class CaseListFiltersComponent implements OnInit {

  @Input()
  defaults;

  @Output()
  onApply: EventEmitter<any> = new EventEmitter();

  @Output()
  onReset: EventEmitter<any> = new EventEmitter();

  jurisdictions: Jurisdiction[];
  isVisible: boolean;

  constructor(
    private definitionsService: DefinitionsService,
  ) {
  }

  ngOnInit(): void {
    this.isVisible = false;

    this.definitionsService.getJurisdictions(READ_ACCESS)
      .subscribe(jurisdictions => {
        this.isVisible = jurisdictions.length > 0;
        this.jurisdictions = jurisdictions;
      });
  }

  onWrapperApply(value) {
    this.onApply.emit(value);
  }

  onWrapperReset(value) {
    this.onReset.emit(value);
  }

}
