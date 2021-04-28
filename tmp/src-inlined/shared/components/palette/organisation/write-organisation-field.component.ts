import { Component, OnInit } from '@angular/core';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { OrganisationConverter, SimpleOrganisationModel } from '../../../domain/organisation';
import { CaseField } from '../../../domain/definition';
import { Observable, of } from 'rxjs';
import { OrganisationService, OrganisationVm } from '../../../services/organisation';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'ccd-write-organisation-field',
  template: `
    <div class="form-group" [formGroup]="organisationFormGroup">
      <fieldset *ngIf="(organisations$ | async)?.length === 0" class="govuk-fieldset">
        <div class="hmcts-banner">
          <svg class="hmcts-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
            <path d="M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v4.8
      C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z" /></svg>
          <div class="hmcts-banner__message">
            <span class="hmcts-banner__assistive">information</span>
              <p class="warning-message">Organisation search is currently unavailable.</p>
          </div>
        </div>
        <div class="warning-panel">
          <div class="warning-message">
            We are working to fix the issue. You can try again later.
          </div>
        </div>
      </fieldset>
      <fieldset *ngIf="(organisations$ | async)?.length > 0" class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h2 class="heading-h2">
            Search for an organisation
          </h2>
        </legend>
        <div class="govuk-form-group">
          <label class="govuk-label" for="search-org-text">
            <span id="search-org-hint" class="govuk-hint">
              You can only search for organisations already registered with MyHMCTS. For example, you can search by organisation name or address.
            </span>
          </label>
          <input id="search-org-text" class="form-control" type="text" [formControl]="searchOrgTextFormControl" />
        </div>
        <div class="govuk-form-group">
          <label class="govuk-label" for="organisation-table">
            <h2 class="heading-h2">Organisation name and address</h2>
          </label>
          <hr class="govuk-section-break govuk-section-break--visible">
          <div *ngIf="(selectedOrg$ | async).organisationIdentifier ===''" [ngClass]="{'scroll-container ': (simpleOrganisations$ | async)?.length > 10}">
            <table id="organisation-table" *ngFor="let organisation of (simpleOrganisations$ | async)">
              <caption><h3 class="name-header">{{organisation.name}}</h3></caption>
              <tbody>
              <tr>
                <td class="td-address">
                  <ccd-markdown [content]="organisation.address"></ccd-markdown>
                </td>
                <td class="td-select">
                  <a *ngIf="(selectedOrg$ | async).organisationIdentifier === ''" href="javascript:void(0);" (click)="selectOrg(organisation)" title="Select the organisation {{organisation.name}}">Select</a>
                </td>
              </tr>
              </tbody>
            </table>
            <div *ngIf="(simpleOrganisations$ | async)?.length === 0 && (searchOrgValue$ | async)?.length > 2">
              <div class="no-result-message">
                No results found.
              </div>
            </div>
          </div>
          <div *ngIf="(selectedOrg$ | async).organisationIdentifier">
            <table id="organisation-selected-table" *ngIf="(selectedOrg$ | async) as selectedOrg">
              <caption><h3 class="name-header">{{selectedOrg.name}}</h3></caption>
              <tbody>
              <tr>
                <td class="td-address">
                  <ccd-markdown [content]="selectedOrg.address"></ccd-markdown>
                </td>
                <td class="td-select">
                  <a href="javascript:void(0);" (click)="deSelectOrg(selectedOrg)" title="Clear organisation selection for {{selectedOrg.name}}">Clear</a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <ccd-write-organisation-complex-field [caseField]="caseField"
                                              [formGroup]="formGroup"
                                              [selectedOrg$]="selectedOrg$">
        </ccd-write-organisation-complex-field>
        <details id="find-organisation-help" class="govuk-details" data-module="govuk-details">
          <summary class="govuk-details__summary">
          <span id="content-why-can-not-find-organisation" class="govuk-details__summary-text">
            Can’t find the organisation you are looking for?
          </span>
          </summary>
          <div id="content-reason-can-not-find-organisation" class="govuk-details__text">
            If you know that the solicitor is already registered with MyHMCTS, check that you have entered their details correctly.
            Remember that organisations can only register one office address. This means that the details could be slightly different from what you're expecting. Contact the solicitor directly if you have any concerns.
          </div>
        </details>
      </fieldset>
    </div>
  `,
  styles: [`
    .hmcts-banner{border:0 solid;margin-bottom:10px;color:#000000}.hmcts-banner .warning-message{font-weight:bold}.govuk-hint{font-size:1.1rem}.name-header{font-weight:bold;margin-top:10px;font-size:18px}.td-address{width:90%;padding-top:2px}.td-select{width:10%}.warning-panel{background-color:#e7ebef;height:40px;margin-bottom:0;align-items:center;display:flex}.warning-panel .warning-message{padding-left:15px}.complex-field-table>tbody>tr>th{border:none}.complex-field-table>tbody>tr:last-child>th,.complex-field-table>tbody>tr:last-child>td{border-bottom:none}.complex-field-title{width:300px}.label-width-small{width:100px}.label-width-medium{width:150px}.scroll-container{height:600px;overflow-y:scroll}.no-result-message{margin-top:15px}
  `]
})
export class WriteOrganisationFieldComponent extends AbstractFieldWriteComponent implements OnInit {

  private static readonly EMPTY_SIMPLE_ORG: SimpleOrganisationModel = {'organisationIdentifier': '', 'name': '', 'address': ''};
  private static readonly MAX_RESULT_COUNT: number = 100;
  private static readonly ORGANISATION_ID: string = 'OrganisationID';
  private static readonly ORGANISATION_NAME: string = 'OrganisationName';

  public organisationFormGroup: FormGroup;
  public searchOrgTextFormControl: FormControl;
  public organisationIDFormControl: FormControl;
  public organisationNameFormControl: FormControl;

  public organisations$: Observable<OrganisationVm[]>;
  public searchOrgValue$: Observable<string>;
  public simpleOrganisations$: Observable<SimpleOrganisationModel[]>;
  public selectedOrg$: Observable<SimpleOrganisationModel>;

  constructor(private organisationService: OrganisationService, private organisationConverter: OrganisationConverter) {
    super();
  }

  public ngOnInit() {
    this.organisations$ = this.organisationService.getActiveOrganisations();

    this.searchOrgTextFormControl = new FormControl('');
    this.searchOrgValue$ = this.searchOrgTextFormControl.valueChanges;
    this.searchOrgValue$.subscribe(value => this.onSearchOrg(value));

    this.organisationFormGroup = this.registerControl(new FormGroup({}), true) as FormGroup;
    if (this.caseField && this.caseField.value && this.caseField.value.OrganisationID) {
      this.instantiateOrganisationFormGroup(this.caseField.value.OrganisationID, this.caseField.value.OrganisationName);
      this.selectedOrg$ = this.organisations$.pipe(
        map(organisations =>
          organisations.filter(findOrg => findOrg.organisationIdentifier === this.caseField.value.OrganisationID)
                       .map(organisation => this.organisationConverter.toSimpleOrganisationModel(organisation))[0]),
      );
      this.searchOrgTextFormControl.disable();
    } else {
      this.instantiateOrganisationFormGroup(null, null);
      this.selectedOrg$ = of(WriteOrganisationFieldComponent.EMPTY_SIMPLE_ORG);
    }
  }

  private instantiateOrganisationFormGroup(orgIDState: any, orgNameState: any): void {
    this.organisationIDFormControl = new FormControl(orgIDState);
    this.addOrganisationValidators(this.caseField, this.organisationIDFormControl);
    this.organisationFormGroup.addControl(WriteOrganisationFieldComponent.ORGANISATION_ID, this.organisationIDFormControl);
    this.organisationNameFormControl = new FormControl(orgNameState);
    this.organisationFormGroup.addControl(WriteOrganisationFieldComponent.ORGANISATION_NAME, this.organisationNameFormControl);
  }

  private addOrganisationValidators(caseField: CaseField, control: AbstractControl): void {
    if (caseField.field_type && caseField.field_type.complex_fields) {
      const organisationIdField = caseField.field_type.complex_fields
        .find(field => field.id === WriteOrganisationFieldComponent.ORGANISATION_ID);
      this.addValidators(organisationIdField, control);
    }
  }

  public onSearchOrg(orgSearchText: string): void {
    if (orgSearchText && orgSearchText.length >= 2) {
      const lowerOrgSearchText = orgSearchText.toLowerCase();
      this.simpleOrganisations$ = this.organisations$.pipe(
        switchMap(organisations => of(
          this.searchOrg(organisations, lowerOrgSearchText)
          )
        )
      );
    } else {
      this.simpleOrganisations$ = of([]);
    }
  }

  public searchOrg(organisations: OrganisationVm[], lowerOrgSearchText: string): SimpleOrganisationModel[] {
    return organisations.filter(organisation => {
        return this.searchCriteria(organisation, lowerOrgSearchText) || this.searchWithSpace(organisation, lowerOrgSearchText);
      })
      .map(organisation => this.organisationConverter.toSimpleOrganisationModel(organisation))
      .slice(0, WriteOrganisationFieldComponent.MAX_RESULT_COUNT);
  }

  private searchCriteria(organisation: OrganisationVm, lowerOrgSearchText: string): boolean {
    if (organisation.postCode && organisation.postCode.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    if (organisation.postCode && this.trimAll(organisation.postCode).toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    if (organisation.postCode && organisation.postCode.toLowerCase().includes(this.trimAll(lowerOrgSearchText))) {
      return true;
    }
    if (organisation.name && organisation.name.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    if (organisation.addressLine1 && organisation.addressLine1.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    if (organisation.addressLine2 && organisation.addressLine2.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    if (organisation.addressLine3 && organisation.addressLine3.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    if (organisation.townCity && organisation.townCity.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    if (organisation.county && organisation.county.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    // noinspection RedundantIfStatementJS
    if (organisation.country && organisation.country.toLowerCase().includes(lowerOrgSearchText)) {
      return true;
    }
    return false;
  }

  private searchWithSpace(organisation: OrganisationVm, lowerOrgSearchText: string) {
    const searchTextArray: string[] = lowerOrgSearchText.split(/\s+/g);
    for (const singleSearchText of searchTextArray) {
      if (singleSearchText && this.searchCriteria(organisation, singleSearchText)) {
        return true;
      }
    }
  }

  public trimAll(oldText: string): string {
    return oldText.replace(/\s+/g, '');
  }

  public selectOrg(selectedOrg: SimpleOrganisationModel) {
    this.organisationIDFormControl.setValue(selectedOrg.organisationIdentifier);
    this.organisationNameFormControl.setValue(selectedOrg.name);
    this.selectedOrg$ = of(selectedOrg);
    this.simpleOrganisations$ = of([...[], selectedOrg]);
    this.searchOrgTextFormControl.setValue('');
    this.searchOrgTextFormControl.disable();
    this.caseField.value = {'OrganisationID': selectedOrg.organisationIdentifier, 'OrganisationName': selectedOrg.name};
    this.organisationFormGroup.setValue(this.caseField.value);
  }

  public deSelectOrg(selectedOrg) {
    this.organisationIDFormControl.reset();
    this.organisationNameFormControl.reset();
    this.selectedOrg$ = of(WriteOrganisationFieldComponent.EMPTY_SIMPLE_ORG);
    this.simpleOrganisations$ = of([]);
    this.searchOrgTextFormControl.setValue('');
    this.searchOrgTextFormControl.enable();
    this.caseField.value = {'OrganisationID': null, 'OrganisationName': null};
    this.organisationFormGroup.setValue(this.caseField.value);
  }

}
