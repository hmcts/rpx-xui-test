import { OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CaseField } from '../../domain/definition/case-field.model';
import { FieldsUtils } from '../../services/fields/fields.utils';
import { PlaceholderService } from './services';
export declare class LabelSubstitutorDirective implements OnInit, OnDestroy {
    private fieldsUtils;
    private placeholderService;
    caseField: CaseField;
    contextFields: CaseField[];
    formGroup: FormGroup;
    elementsToSubstitute: string[];
    initialLabel: string;
    initialHintText: string;
    constructor(fieldsUtils: FieldsUtils, placeholderService: PlaceholderService);
    ngOnInit(): void;
    private shouldSubstitute;
    ngOnDestroy(): void;
    private getReadOnlyAndFormFields;
    private removeDuplicates;
    private getFormFieldsValuesIncludingDisabled;
    private resolvePlaceholders;
}
