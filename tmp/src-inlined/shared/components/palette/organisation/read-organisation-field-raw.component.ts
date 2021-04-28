import { Component, Input, OnInit } from '@angular/core';
import { AbstractFieldReadComponent } from '../base-field/abstract-field-read.component';
import { CaseField } from '../../../domain/definition';
import { OrganisationService, OrganisationVm } from '../../../services/organisation';
import { OrganisationConverter, SimpleOrganisationModel } from '../../../domain/organisation';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ccd-read-organisation-field-raw',
  template: `
    <div class="complex-panel">
      <table class="complex-field-table">
        <tbody>
          <tr>
            <td>
              <table class="complex-field-table" *ngIf="(selectedOrg$ | async) as selectedOrg">
                <tr class="complex-panel-compound-field">
                  <td class="label-width-small"><span class="text-16">Name:</span></td>
                  <td><span class="text-16">{{selectedOrg.name}}</span></td>
                </tr>
                <tr class="complex-panel-compound-field">
                  <td class="label-width-small"><span class="text-16">Address:</span></td>
                  <td>
                    <ccd-markdown [content]="selectedOrg.address"></ccd-markdown>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .hmcts-banner{border:0 solid;margin-bottom:10px;color:#000000}.hmcts-banner .warning-message{font-weight:bold}.govuk-hint{font-size:1.1rem}.name-header{font-weight:bold;margin-top:10px;font-size:18px}.td-address{width:90%;padding-top:2px}.td-select{width:10%}.warning-panel{background-color:#e7ebef;height:40px;margin-bottom:0;align-items:center;display:flex}.warning-panel .warning-message{padding-left:15px}.complex-field-table>tbody>tr>th{border:none}.complex-field-table>tbody>tr:last-child>th,.complex-field-table>tbody>tr:last-child>td{border-bottom:none}.complex-field-title{width:300px}.label-width-small{width:100px}.label-width-medium{width:150px}.scroll-container{height:600px;overflow-y:scroll}.no-result-message{margin-top:15px}
  `]
})
export class ReadOrganisationFieldRawComponent extends AbstractFieldReadComponent implements OnInit {

  @Input()
  caseFields: CaseField[] = [];

  public organisations$: Observable<OrganisationVm[]>;
  public selectedOrg$: Observable<SimpleOrganisationModel>;

  constructor(private organisationService: OrganisationService, private organisationConverter: OrganisationConverter) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.caseField.value && this.caseField.value.OrganisationID) {
      this.organisations$ = this.organisationService.getActiveOrganisations();
      this.selectedOrg$ = this.organisations$.pipe(
        switchMap((organisations: OrganisationVm[]) => of(
            this.organisationConverter.toSimpleOrganisationModel(
              organisations.find(findOrg => findOrg.organisationIdentifier === this.caseField.value.OrganisationID)
            )
          )
        )
      );
    }
  }
}
