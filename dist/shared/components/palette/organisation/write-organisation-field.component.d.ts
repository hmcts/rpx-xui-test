import { OnInit } from '@angular/core';
import { AbstractFieldWriteComponent } from '../base-field/abstract-field-write.component';
import { FormControl, FormGroup } from '@angular/forms';
import { OrganisationConverter, SimpleOrganisationModel } from '../../../domain/organisation';
import { Observable } from 'rxjs';
import { OrganisationService, OrganisationVm } from '../../../services/organisation';
export declare class WriteOrganisationFieldComponent extends AbstractFieldWriteComponent implements OnInit {
    private organisationService;
    private organisationConverter;
    private static readonly EMPTY_SIMPLE_ORG;
    private static readonly MAX_RESULT_COUNT;
    private static readonly ORGANISATION_ID;
    private static readonly ORGANISATION_NAME;
    organisationFormGroup: FormGroup;
    searchOrgTextFormControl: FormControl;
    organisationIDFormControl: FormControl;
    organisationNameFormControl: FormControl;
    organisations$: Observable<OrganisationVm[]>;
    searchOrgValue$: Observable<string>;
    simpleOrganisations$: Observable<SimpleOrganisationModel[]>;
    selectedOrg$: Observable<SimpleOrganisationModel>;
    constructor(organisationService: OrganisationService, organisationConverter: OrganisationConverter);
    ngOnInit(): void;
    private instantiateOrganisationFormGroup;
    private addOrganisationValidators;
    onSearchOrg(orgSearchText: string): void;
    searchOrg(organisations: OrganisationVm[], lowerOrgSearchText: string): SimpleOrganisationModel[];
    private searchCriteria;
    private searchWithSpace;
    trimAll(oldText: string): string;
    selectOrg(selectedOrg: SimpleOrganisationModel): void;
    deSelectOrg(selectedOrg: any): void;
}
